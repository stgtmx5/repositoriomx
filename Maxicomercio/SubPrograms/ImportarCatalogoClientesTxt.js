var UIP;


function ImportarCatalogoClientes(){	
	var ICliente;
	var FSystem;
	var TextStream;
	var stArray=new Array();
	var stFile;
	var stLine;
	var LBound;
	var itLines;
	var itCount=0;

	UIP=Application.NewUIProgress();
	UIP.Caption="Importando catálogo de clientes"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)|*.txt");
  
	if (stFile==""){		
		return false;
	}

	FSystem=Application.NewObject("Scripting.FileSystemObject");
	if (FSystem.FileExists(stFile)==false){
		eBasic.eMsgbox("No se pudo abrir el archivo seleccionado",6);
		return false;
	}
	TextStream=FSystem.OpenTextFile(stFile);
	ICliente=Application.NewObject("EDOFx.Cliente");
	ICliente.AddNew();
	ICliente.ADOCnn=Application.adoCnn;
	
	itLines=LinesCount(stFile, FSystem);
	UIP.Max=itLines+1;
	UIP.Show();
	itLines=1;
	
	Application.MouseHourglass();	
	while (TextStream.AtEndOfStream==false){
		try{
		
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");
		
			Application.eDoEvents();
			ICliente.AddNew();
			
			if (ICliente.LoadFromADOCByCodigo(stArray[0])==false){			
				ICliente.Codigo=stArray[0];
				ICliente.Nombre=stArray[1];
				if (ICliente.IDivisa.LoadFromADOCByCodigo(stArray[2])==true){
				
					if (ICliente.Tipo.LoadFromADOCByCodigo(stArray[3])==true){					
						UIP.TopTitle="Almacenando "+ICliente.Nombre;
						
						ICliente.Domicilio1.AddNew();
						
						if (ICliente.Domicilio1.ICiudad.LoadFromADOCByCodigo(stArray[4])==true){
							ICliente.Domicilio1.Direccion=stArray[5];
							ICliente.Domicilio1.CodPos=stArray[6];												
						}
						else{
							ICliente.Domicilio1.ICiudad.LoadFromADOCByCodigo("000");
							ICliente.Domicilio1.Direccion=stArray[5];
							ICliente.Domicilio1.CodPos=stArray[6];						
						}
						
						if(ICliente.Domicilio1.ICiudad.Sys_PK>0){
							ICliente.Domicilio1.Telefonos=stArray[8];
							ICliente.Domicilio1.Update();
						}
						
						ICliente.RFC=stArray[7];
						//ICliente.Telefonos=stArray[8];
						ICliente.eMail=stArray[9];
						ICliente.WebSite=stArray[10];
						ICliente.Status=1; //cNormal
					
						if (!ICliente.Update()){						
							Log("Error al procesar fila "+itLines+". Error al guardar "+ICliente.Nombre+" "+ICliente.lastErrDescrip);
						}
						else{
							itCount=itCount+1;
						}
					}else{
						Log("Error al procesar fila "+itLines+". No se pudo cargar tipo del cliente con código: "+stArray[0]);
					}
				}else{
					Log("Error al procesar fila "+itLines+". No se pudo cargar la divisa del cliente con código: "+stArray[0]);
				}
				
			}else{
				Log("Error al procesar fila "+itLines+". El cliente con código: "+stArray[0]+" ya se encuentra registrado.");
			}
		
		}catch(e){
			Log("Error al procesar fila "+itLines);
		}
		
		itLines=itLines+1;
		UIP.Value=itLines;				
	}
	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox ("Cantidad de registros importados: "+itCount,6); 
	TextStream.Close();
	ICliente=null;
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
	Streamo=null;
	return itCount;
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