var UIP; //porgress var

function ImportarCatalogoProductos(){	
	var IProducto;
	var EFile;
	var ESheet;
	var lgItems;
	var itRows;
	var stFile;
	var stTemp;
	var itCount=0;
	var codigoP="";
	
	stFile=Application.OpenFile("Archivos de excel (*.xls)|*.xls");	
	if (stFile==""){		
		return false;
	}
		
	UIP=Application.NewUIProgress();
	UIP.Caption="Importando productos";
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
		
	for (lgItems=2;lgItems<=itRows;lgItems++){
		try{	
		
		
			IProducto.AddNew();
					
			if (IProducto.LoadFromADOCByCodigo(ESheet.Cells(lgItems,1))==false){
				codigoP="";
				codigoP=ESheet.Cells(lgItems,1);						
				codigoP=codigoP+"";
				codigoP=codigoP.toUpperCase();
				IProducto.Codigo=codigoP;
							
				IProducto.Descripcion=ESheet.Cells(lgItems,2);
				IProducto.Unidad=ESheet.Cells(lgItems,3);
				IProducto.UnidadB=IProducto.Unidad;
				
				UIP.TopTitle="Almacenando "+IProducto.Descripcion;
				
				if (IProducto.IDivisa.LoadFromADOCByCodigo(ESheet.Cells(lgItems,4))==true){

					if (IProducto.ILinea.LoadFromADOCByCodigo(ESheet.Cells(lgItems,5))==true){
				
						stTemp=ESheet.Cells(lgItems,6)+"";
						
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
						
						stTemp=ESheet.Cells(lgItems,7);					
						
						if (stTemp>=1 && stTemp<=4){
							IProducto.MetodoValuacion=stTemp;
						}else{
							IProducto.MetodoValuacion=99;
						}
										
						IProducto.CostoUltimo=ESheet.Cells(lgItems,8);
						IProducto.Precio1=ESheet.Cells(lgItems,9);
						IProducto.Precio2=ESheet.Cells(lgItems,10);
						IProducto.Precio3=ESheet.Cells(lgItems,11);
						IProducto.Precio4=ESheet.Cells(lgItems,12);
						IProducto.Precio5=ESheet.Cells(lgItems,13);
						
						stTemp=ESheet.Cells(lgItems,14)+"";
						
						switch (stTemp.toUpperCase()){
							case "G16":
								IProducto.Impuestos.LoadFromADOCByNombre("IVA 16% (México)");
								break;
							case "IIE":
								IProducto.Impuestos.LoadFromADOCByNombre("IVA-IEPS (México)");
								break;
                            //case "G15":
							//	IProducto.Impuestos.LoadFromADOCByNombre("IVA 15% (México)");
							//	break;
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
						
						IProducto.IMarca.LoadFromADOCByCodigo(ESheet.Cells(lgItems,15));
						IProducto.IDepartamento.LoadFromADOCByCodigo(ESheet.Cells(lgItems,16));
						IProducto.CodBar1=ESheet.Cells(lgItems,17);
						IProducto.CodBar2=ESheet.Cells(lgItems,18);
						IProducto.CodBar3=ESheet.Cells(lgItems,19);

						stTemp=ESheet.Cells(lgItems,20)+"";
						
						if(IProducto.IClase!=3){
							if (stTemp.toUpperCase()=="S"){
								IProducto.ReqLote=true;
							}else{
								IProducto.ReqLote=false;
							}					
							stTemp=ESheet.Cells(lgItems,21)+""; 														
							if (stTemp.toUpperCase()=="S"){
								IProducto.ReqSerie=true;
								IProducto.MetodoValuacion=4;//identificado siempre cuando reqserie
							}else{
								IProducto.ReqSerie=false;
							}
						}
						
						IProducto.Visible=true;
						
						if (!IProducto.Update()){
							Log("Error al procesar fila "+lgItems+". Error al guardar producto ("+IProducto.Descripcion+") "+IProducto.lastErrDescrip);
						}
						else{
							itCount=itCount+1;
						}
					}else{
						Log("Error al procesar fila "+lgItems+". No se pudo cargar la línea del producto con código: "+ESheet.Cells(lgItems,1));
					}
				}else{
					Log("Error al procesar fila "+lgItems+". No se pudo cargar la divisa del producto con código: "+ESheet.Cells(lgItems,1));
				}
			}else{
				Log("Error al procesar fila "+lgItems+". El producto con código "+ESheet.Cells(lgItems,1)+" ya se encuentra registrado.");
			}
			
		}catch(e){
			Log("Error al procesar fila "+lgItems);
		}
		UIP.Value=lgItems;
		Application.eDoEvents();
	}
	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox("Cantidad de registros importados "+itCount,6);
	EFile.ActiveWorkBook.Close(false);
	EFile.Quit();
	IProducto=null;
	EFile=null;
	ESheet=null;
	return true;
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
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