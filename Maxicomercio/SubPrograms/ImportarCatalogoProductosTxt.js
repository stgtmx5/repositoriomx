var UIP;

function ImportarCatalogoProductos(){	
	var IProducto;
	var FSystem;
	var TextStream;
	var stArray=new Array();
	var stFile;
	var stLine;
	var itLines;
	var itCount=0;
	var stTemp;
	var codigoP="";
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Importando productos"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)|*.txt");
	
	if (stFile==""){
		return false;
	}
	
	FSystem=Application.NewObject("Scripting.FileSystemObject");
	IProducto=Application.NewObject("EDOFx.Producto");
	IProducto.ADOCnn=Application.adoCnn;
	TextStream=FSystem.OpenTextFile(stFile);
	
	if (FSystem.FileExists(stFile)==false){
		return false;
	}
	
	itLines=LinesCount(stFile, FSystem);
	UIP.Max=itLines+1;
	UIP.Show();
	itLines=1;
	
	Application.MouseHourglass();
	Application.eDoEvents();
	while (TextStream.AtEndOfStream==false){
		try{
				
		
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");
				
			//Application.eDoEvents();
			IProducto.AddNew();
			
			if (IProducto.LoadFromADOCByCodigo(stArray[0])==false){
				//IProducto.Codigo=stArray[0];
				codigoP="";
				codigoP=stArray[0];
				codigoP=codigoP+"";
				codigoP=codigoP.toUpperCase();
				IProducto.Codigo=codigoP;
				
				IProducto.Descripcion=stArray[1];
				IProducto.Unidad=stArray[2];
				IProducto.UnidadB=IProducto.Unidad; //22-05-08
				
				UIP.TopTitle="Almacenando "+IProducto.Descripcion;
				
				if (IProducto.IDivisa.LoadFromADOCByCodigo(stArray[3])==true){
					
					if (IProducto.ILinea.LoadFromADOCByCodigo(stArray[4])==true){
					
						stTemp=stArray[5]+"";
						
						switch (stTemp.toUpperCase()){
							case "S":
								IProducto.IClase=3; //cServicio
								IProducto.ITipo=1; //cNo_Inventariable
								IProducto.ReqSerie=false;
								IProducto.ReqLote=false;
								break;
							case "A":
								IProducto.IClase=4; //cArtículo
								IProducto.ITipo=2; //cInventariable
								break;
							case "K":
								IProducto.IClase=5; //cEnsamble
								IProducto.ITipo=2; //cInventariable
								break;
							default:
								IProducto.IClase=4; //cArtículo
								IProducto.ITipo=2; //cInventariable
								break;
						}
										
						if(stArray[6]>=1 && stArray[6]<=4){						
							IProducto.MetodoValuacion=stArray[6];
						}else{
							IProducto.MetodoValuacion=99;
						}
											
						IProducto.CostoUltimo=parseFloat("0"+stArray[7]);					
						IProducto.Precio1=parseFloat("0"+stArray[8]);
						IProducto.Precio2=parseFloat("0"+stArray[9]);
						IProducto.Precio3=parseFloat("0"+stArray[10]);
						IProducto.Precio4=parseFloat("0"+stArray[11]);
						IProducto.Precio5=parseFloat("0"+stArray[12]);
						
						stTemp=stArray[13]+"";
						
						switch (stTemp.toUpperCase()){
							case "G16":
								IProducto.Impuestos.LoadFromADOCByNombre("IVA 16% (México)");
								break;
							case "G15":
								IProducto.Impuestos.LoadFromADOCByNombre("IVA 15% (México)");
								break;
							case "G0":
								IProducto.Impuestos.LoadFromADOCByNombre("IVA 0% (México)");
								break;
							case "E":
								IProducto.Impuestos.LoadFromADOCByNombre("Exento");
								break;
							default:
								IProducto.Impuestos.LoadFromADOCByNombre("IVA 0% (México)");
								break;
						}
						
						IProducto.IMarca.LoadFromADOCByCodigo(stArray[14]);
						IProducto.IDepartamento.LoadFromADOCByCodigo(stArray[15]);
						IProducto.CodBar1=stArray[16];
						IProducto.CodBar2=stArray[17];
						IProducto.CodBar3=stArray[18];
						
						stTemp=stArray[19]+"";
						if(IProducto.IClase!=3){
								if (stTemp.toUpperCase()=="S"){
									IProducto.ReqLote=true;
								}
								else{
									IProducto.ReqLote=false;
								}
							
								stTemp=stArray[20]+"";
							
								if (stTemp.toUpperCase()=="S"){
									IProducto.ReqSerie=true;
								}
								else{
									IProducto.ReqSerie=false;
								}
						}
						IProducto.Visible=true;
						if (!IProducto.Update()){
							Log("Error al procesar fila "+itLines+". Error al guardar producto ("+IProducto.Descripcion+") "+IProducto.lastErrDescrip);
						}
						else{
							itCount=itCount+1;
						}
					}else{
						Log("Error al procesar fila "+itLines+". No se pudo cargar la línea del producto con código: "+stArray[0]);
					}
				}else{
					Log("Error al procesar fila "+itLines+". No se pudo cargar la divisa del producto con código: "+stArray[0]);
				}
			}else{
				Log("Error al procesar fila "+itLines+". El producto con código "+stArray[0]+" ya se encuentra registrado.");
			}
			
		}catch(e){
			Log("Error al procesar fila "+itLines);
		}
		itLines=itLines+1;
		UIP.Value=itLines;		
		Application.eDoEvents();
	}
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox ("Cantidad de registros importados: "+itCount,6); 	
	TextStream.Close();
	IProducto=null;
	FSystem=null;
	TextStream=null;
	stArray=null;
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

function Procesar(){
	try{
		return ImportarCatalogoProductos();
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
Procesar();