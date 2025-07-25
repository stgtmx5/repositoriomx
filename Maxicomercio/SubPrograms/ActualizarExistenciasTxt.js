var UIP;

function ActualizarExistencias(){
	var ICardex;
	var IDCardex;
	var IProducto;	
	var FSystem;
	var TextStream;
	var stArray=new Array();
	var stFile;
	var stLine;
	var itLines;
	var itCount=0;
	var itExistencias=0;
	var itLine=0;
	var c=0;
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando existencias"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)|*.txt");

	if (stFile==""){
		return false;
	}

	FSystem=Application.NewObject("Scripting.FileSystemObject");
	TextStream=FSystem.OpenTextFile(stFile);
	IProducto=Application.NewObject("EDOFx.Producto");
	IProducto.ADOCnn=Application.adoCnn;
	
	if (FSystem.FileExists(stFile)==false){
		return false;
	}
	
	itLines=LinesCount(stFile, FSystem);
	UIP.Max=itLines;//no modificar el valor itLines ya que se valida abajo
	UIP.Show();
	
	Application.MouseHourglass();
	
	ICardex=AddCardex();
	itCount=0;
	while (TextStream.AtEndOfStream==false){
		try{
		
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");
			UIP.TopTitle="Actualizando existencias de "+IProducto.Descripcion;
			Application.eDoEvents();
			
			if (IProducto.LoadFromADOCByCodigo(stArray[0],Application.adoCnn,2)==true){
							
				if(IProducto.ReqLote || IProducto.ReqSerie ){			
					Log("Error al procesar fila "+itLine+". Error al actualizar ("+IProducto.Descripcion+") No se especificaron lotes y/o series");
				}else{				
					if(IProducto.IClase==3)
					{
						Log("Error al procesar fila "+itLine+". Error al actualizar ("+IProducto.Descripcion+") no se pueden agregar existencias a un elemento de clase: servicio");
					}
					else
					{
						if(IProducto.ITipo==1)
						{
							Log("Error al procesar fila "+lgItems+". Error al actualizar ("+IProducto.Descripcion+") no se pueden agregar existencias a un elemento de tipo: No Inventariable.");
						}
						else
						{
							
							itExistencias=GetExisteAlmacen(stArray[1]+"",stArray[0]+"");
							
							itExistencias=itExistencias-stArray[2];
							
							if(itExistencias!=0){						
								IDCardex=(ICardex.Movimientos.NewElement());
								IDCardex.ADOCnn=Application.adoCnn;
								IDCardex.AddNew();
											
								if (IDCardex.IAlmacen.LoadFromADOCByCodigo(stArray[1])==true){
									
									IDCardex.IProducto.LoadFromADOCByCodigo(stArray[0]);
									IDCardex.TipoCambio=IProducto.IDivisa.TCambio;
									
									if (itExistencias>0){
										IDCardex.Salidas=itExistencias;					
									}				
									if (itExistencias<0){
										itExistencias=itExistencias*(-1);
										IDCardex.Entradas=itExistencias;
										//c=costo total/cantidad
										c=0;
										c=parseFloat("0"+stArray[3])/stArray[2];
										IDCardex.Cargos=c*itExistencias;  //COSTO DE LA ENTRADA
									}				
									itCount=itCount+1;
								}		
							}
						}
					}
				}
						
			}else{
				Log("Error al procesar fila "+itLine+". No se pudo cargar el producto: "+stArray[0]);
			}
			
			if ((itLine+1)%20==0){
				if(ICardex.Movimientos.Elements.Count()>0){
					if (UpdateCardex(ICardex)==true){						
						ICardex=null;
						ICardex=AddCardex();
					}				
				}
			}
			else{
				
				if (itLine==(itLines-1)){
					if(ICardex.Movimientos.Elements.Count()>0){
						if (UpdateCardex(ICardex)==true){							
							ICardex=null;
						}										
					}
				}
			}
						
			
		}catch(e){
			Log("Error al procesar fila "+itLine);
		}
		
		IProducto.AddNew();
		
		itLine=itLine+1;
		UIP.Value=itLine;		
	}
	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();	
	eBasic.eMsgbox ("Cantidad de registros actualizados: "+itCount,6); 	
	
	TextStream.Close();
	ICardex=null;
	IDCardex=null;
	IProducto=null;
	FSystem=null;
	TextStream=null;
	stArray==null;
	return true;			
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function LinesCount(strFile, FSystemO){
	var StreamO;
	var itCount=0;

	StreamO=FSystemO.OpenTextFile(strFile);
	
	while (StreamO.AtEndOfStream==false){
		itCount=itCount+1;
		StreamO.SkipLine();
	}
	
	StreamO.Close();
	StreamO=null;
	return itCount;
}

function AddCardex(){
	var TICardex;
	var GFunctions;
	var dtDate=new Date();
	var stDate;
	
	
	stDate=dtDate.getDate()+"/"+(dtDate.getMonth()+1)+"/"+dtDate.getFullYear();

	GFunctions=Application.NewObject("geLBN.lbnFunctions");

	TICardex=Application.NewObject("EDOFx.Cardex");
	TICardex.ADOCnn=Application.adoCnn;

	TICardex.AddNew();
	
	if (TICardex.ICategoria.LoadFromADOCByCodigo("<AEI>")==true){

		TICardex.Descripcion="Ajuste de inventario por importación de existencias";
		TICardex.Fecha=stDate;
		TICardex.Referencia="<AEI>"+GFunctions.ReferenciaAleatoria();

		if (TICardex==null){
			Log(TICardex.lastErrDescrip);
			return null;
		}	
	}
	
	GFunctions=null;
	return TICardex;
}

function UpdateCardex(obCardex){
	var IInventario;
	// var EDO;
	
	// EDO=Application.NewObject("EDOFx.EDO_Fx");
	// EDO.SetConnection(Application.adoCnn);

	// IInventario=Application.NewObject("lbnInventario.lgInventario");
	// IInventario.SetObjects(EDO);
	IInventario=Application.InternalObject("LBInventario"); 
	if (IInventario.AplicarMovimiento(obCardex)!=2){
		Log(IInventario.LastErrorDescrip);
		return false;
	}
	
	IInventario=null;
	obCardex=null;
	EDO=null;
	return true;
}

function Procesar(){
	try{
		return ActualizarExistencias();
	}catch(e)
	{
		if(UIP!=null){
			Application.CloseUIProgress(UIP);
			Application.MouseDefault();
		}
		Log("Error al ejecutar subprograma");
		throw e;
		return false;
	}
}


function GetExisteAlmacen(Almacen,Producto){
var r=Application.Database.OpenRecordset("select e.Existencia as X from ((Existencias as E inner join almacen as A on E.ialmacen=a.sys_pk) inner join producto as P on E.FK_Producto_IExistencias=P.sys_pk) where A.codigo='"+Almacen+"' and p.codigo='"+Producto+"';");
if (!(r.EOF && r.BOF)){return r.Fields("X").Value+0;}
return 0;
}

Procesar();