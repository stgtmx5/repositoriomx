var UIP;

function ActualizarExistencias(){
	var ICardex;
	var IDCardex;
	var IProducto;	
	var EFile;
	var ESheet;
	var lgItems;
	var itRows;
	var stFile;
	var itCount=0;
	var itExistencias=0;
	var c=0;
	
	stFile=Application.OpenFile("Archivos de excel (*.xls)|*.xls");

	if (stFile==""){
		return false;
	}
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando existencias"
	UIP.Min=0;
	
	EFile=Application.NewObject("Excel.Application");
	EFile.WorkBooks.Open (stFile);
	IProducto=Application.NewObject("EDOFx.Producto");
	IProducto.ADOCnn=Application.adoCnn;
	
    // si es la versión de Excel 97, asigna la hoja activa ( ActiveSheet )
	if (EFile.Application.Version>=8){
		ESheet = EFile.ActiveSheet;
	}
	else{
		ESheet = EFile;
	}
	
	itRows=ESheet.UsedRange.Rows.Count;
	UIP.Max=itRows;
	UIP.Show();
	
	Application.MouseHourglass();
	
	ICardex=AddCardex();
	
	itCount=0;
	
	for (lgItems=2;lgItems<=itRows;lgItems++)
	{
		Application.eDoEvents();
		
		try{		
		
		
			if (IProducto.LoadFromADOCByCodigo(ESheet.Cells(lgItems,1),Application.adoCnn,2)==true)
			{
				if(IProducto.ReqLote || IProducto.ReqSerie)
				{
					Log("Error al procesar fila "+lgItems+". Error al actualizar ("+IProducto.Descripcion+") No se especificaron lotes y/o series");
				}
				else
				{
					
							UIP.TopTitle="Actualizando existencias de "+IProducto.Descripcion;
							
					if(IProducto.IClase==3)
					{
						Log("Error al procesar fila "+lgItems+". Error al actualizar ("+IProducto.Descripcion+") no se pueden agregar existencias a un elemento de clase: servicio");
					}
					else
					{
						
						if(IProducto.ITipo==1)
						{
							Log("Error al procesar fila "+lgItems+". Error al actualizar ("+IProducto.Descripcion+") no se pueden agregar existencias a un elemento de tipo: No Inventariable");
						}
						else
						{
							itExistencias=GetExisteAlmacen(ESheet.Cells(lgItems,2)+"",ESheet.Cells(lgItems,1)+"");
							
							itExistencias=itExistencias-(ESheet.Cells(lgItems,3)+0);
							if(itExistencias!=0){						
								IDCardex=(ICardex.Movimientos.NewElement());
								IDCardex.ADOCnn=Application.adoCnn;
								IDCardex.AddNew();
											
								if (IDCardex.IAlmacen.LoadFromADOCByCodigo(ESheet.Cells(lgItems,2))==true){
									
									IDCardex.IProducto.LoadFromADOCByCodigo(ESheet.Cells(lgItems,1));
									IDCardex.TipoCambio=IProducto.IDivisa.TCambio;
									
									if (itExistencias>0){
										IDCardex.Salidas=itExistencias;
									}
								
									if (itExistencias<0){
										itExistencias=itExistencias*(-1);
										IDCardex.Entradas=itExistencias;
										//c=costo total/cantidad
										c=ESheet.Cells(lgItems,4)/ESheet.Cells(lgItems,3);
										IDCardex.Cargos=c*itExistencias; //COSTO DE LA ENTRADA
									}									
									itCount=itCount+1;	
								}
							}
						}
					}
				}
			}else{
				Log("Error al procesar fila "+lgItems+". No se pudo cargar el producto: "+ESheet.Cells(lgItems,1));
			}
			
			if ((lgItems-1)%20==0){			
				if(ICardex.Movimientos.Elements.Count()>0){
					if (UpdateCardex(ICardex)==true){								
						ICardex=null;
						ICardex=AddCardex();
					}
				}
			}else{							
				if (lgItems==itRows){
					if(ICardex.Movimientos.Elements.Count()>0){
						if (UpdateCardex(ICardex)==true){									
							ICardex=null;
						}
					}
				}
			}
		
		}catch(e){
			Log("Error al procesar fila "+lgItems);
		}
		
		IProducto.AddNew();
		UIP.Value=lgItems;		
	}
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox ("Cantidad de registros actualizados: "+itCount,6); 		
	EFile.ActiveWorkBook.Close (false);
	EFile.Quit();
	ICardex=null;
	IDCardex=null;
	IProducto=null;
	EFile=null;
	ESheet=null;
	return true;	
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function AddCardex(){
	var TICardex;
	var GFunctions;
	var dtDate=new Date();
	var stDate;
	
	
	stDate=dtDate.getDate()+"/"+(dtDate.getMonth()+1)+"/"+dtDate.getFullYear();

	GFunctions=Application.NewObject("geLBN.lbnFunctions");

	TICardex=Application.NewObject("EDOFx.Cardex");
	if (TICardex==null){
			Log(TICardex.lastErrDescrip);
			return null;
	}
	TICardex.ADOCnn=Application.adoCnn;

	TICardex.AddNew();
	
	if (TICardex.ICategoria.LoadFromADOCByCodigo("<AEI>")==true){

		TICardex.Descripcion="Ajuste de inventario por importación de existencias";
		TICardex.Fecha=stDate;
		TICardex.Referencia="<AEI>"+GFunctions.ReferenciaAleatoria();
		
	}
	
	GFunctions=null;
	return TICardex;
}

function UpdateCardex(obCardex,Cod){
	var IInventario;
	//var EDO;
	
	//EDO=Application.NewObject("EDOFx.EDO_Fx");
	//EDO.SetConnection(Application.adoCnn);

	IInventario=Application.InternalObject("LBInventario"); //Application.NewObject("lbnInventario.lgInventario");
	
	//IInventario.SetObjects(EDO);	
	if (IInventario.AplicarMovimiento(obCardex)!=2){
		Log(IInventario.LastErrorDescrip);
		return false;
	}
	
	IInventario=null;
	obCardex=null;
	//EDO=null;
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