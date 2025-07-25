var UIP;
	
function ImportarCatalogoClientes(){
	var ICliente;
	var EFile;
	var ESheet;
	var lgItems;
	var itRows;
	var stFile;
	var stTemp;
	var itCount=0;
	
	stFile=Application.OpenFile("Archivos de excel (*.xls)|*.xls");	
	if (eBasic.FileExists(stFile)==false){
		return false;
	}
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Importando católogo de clientes"
	UIP.Min=0;
	
	EFile=Application.NewObject("Excel.Application");
	EFile.WorkBooks.Open (stFile);
	ICliente=Application.NewObject("EDOFx.Cliente");
	ICliente.ADOCnn=Application.adoCnn;

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
				
			Application.eDoEvents();
			ICliente.AddNew();
			
			if (ICliente.LoadFromADOCByCodigo(ESheet.Cells(lgItems,1))==false){
				
				ICliente.Codigo=ESheet.Cells(lgItems,1);
				ICliente.Nombre=ESheet.Cells(lgItems,2);
				if (ICliente.IDivisa.LoadFromADOCByCodigo(ESheet.Cells(lgItems,3))==true){
				
					if (ICliente.Tipo.LoadFromADOCByCodigo(ESheet.Cells(lgItems,4))==true){
					
						UIP.TopTitle="Almacenando "+ICliente.Nombre;
						
						ICliente.Domicilio1.AddNew();
						
						if (ICliente.Domicilio1.ICiudad.LoadFromADOCByCodigo(ESheet.Cells(lgItems,5))==true){
							ICliente.Domicilio1.Direccion=ESheet.Cells(lgItems,6);
							ICliente.Domicilio1.CodPos=ESheet.Cells(lgItems,7);
						}
						else{
							ICliente.Domicilio1.ICiudad.LoadFromADOCByCodigo("000");
							ICliente.Domicilio1.Direccion=ESheet.Cells(lgItems,6);
							ICliente.Domicilio1.CodPos=ESheet.Cells(lgItems,7);
						}
						if(ICliente.Domicilio1.ICiudad.Sys_PK>0){
							ICliente.Domicilio1.Telefonos=ESheet.Cells(lgItems,9);
							ICliente.Domicilio1.Update();
						}
						
						ICliente.RFC=ESheet.Cells(lgItems,8);
						//ICliente.Telefonos=ESheet.Cells(lgItems,9);
						ICliente.eMail=ESheet.Cells(lgItems,10);
						ICliente.WebSite=ESheet.Cells(lgItems,11);
						ICliente.Status=1; //cNormal
					
						if (!ICliente.Update()){
							Log("Error al procesar fila "+lgItems+". Error al guardar "+ICliente.Nombre+" "+ICliente.lastErrDescrip);
						}
						else{
							itCount=itCount+1;
						}
					}else{
						Log("Error al procesar fila "+lgItems+". No se pudo cargar tipo del cliente con código: "+ESheet.Cells(lgItems,1));
					}
					
				}else{
					Log("Error al procesar fila "+lgItems+". No se pudo cargar la divisa del cliente con código: "+ESheet.Cells(lgItems,1));
				}
				
			}else{
				Log("Error al procesar fila "+lgItems+". El cliente con código: "+ESheet.Cells(lgItems,1)+" ya se encuentra registrado.");
			}
		
		}catch(e){
			Log("Error al procesar fila "+lgItems);
		}
		UIP.Value=lgItems;
	}
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox ("Cantidad de registros importados: "+itCount,6); 	
	EFile.ActiveWorkBook.Close (false);
	EFile.Quit();
	ICliente=null;
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
		return ImportarCatalogoClientes();
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