var UIP;
function ActualizarSaldoCliente(){	
	var ICliente;
	var FSystem;
	var LCxC;
	var TextStream;
	var stArray=new Array();
	var stFile;
	var stLine;
	var itLines;
	var itCount=0;
	var cuImporte=0;
	var dtDate=new Date();
	var stDate;	
	var Mov;
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando saldos de clientes"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)|*.txt");

	if (stFile==""){
		return false;
	}

	FSystem=Application.NewObject("Scripting.FileSystemObject");
	TextStream=FSystem.OpenTextFile(stFile);
	ICliente=Application.NewObject("EDOFx.Cliente");
	ICliente.ADOCnn=Application.adoCnn;	
	LCxC=Application.InternalObject("LBCXC"); //Application.NewObject("lbnCXC.lgCXC");	
	
	if(LCxC==null){
		eBasic.eMsgbox("Error al acceder al componente LBCXC.",6);
		return false;
	}
	
	if (FSystem.FileExists(stFile)==false){
		return false;
	}
	
	itLines=LinesCount(stFile, FSystem);
	UIP.Max=itLines+1;
	UIP.Show();
	itLines=1;
	
	Application.MouseHourglass();

	while (TextStream.AtEndOfStream==false){
		try{
		
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");
			
			if (ICliente.LoadFromADOCByCodigo(stArray[0], Application.adoCnn, 2)==true){

				Application.eDoEvents();
				UIP.TopTitle="Actualizando saldo de "+ICliente.Nombre;
				cuImporte=stArray[1]-ICliente.Saldo;
				stDate=dtDate.getDate()+"/"+(dtDate.getMonth()+1)+"/"+dtDate.getFullYear();

				if (cuImporte>0){
					Mov=LCxC.NotaCargo(ICliente.SYS_PK, stDate, stDate, "Movimiento por ajuste de cuentas", cuImporte, ICliente.IDivisa.TCambio, 17, false, "ImportadoDeArchivo"+"17"+ICliente.Codigo);
					
					if (Mov==null){						
						Log("Error al procesar fila "+itLines+". "+LCxC.LastErrorDescrip);
					}
					else{
						itCount=itCount+1;
					}
				}
				
				if (cuImporte<0){
					cuImporte=cuImporte*(-1);
					Mov=LCxC.NotaCredito(ICliente.SYS_PK, stDate, stDate, "Movimiento por ajuste de cuentas", cuImporte, ICliente.IDivisa.TCambio, 5, false, "ImportadoDeArchivo"+"5"+ICliente.Codigo);
					
					if (Mov==null){
						Log("Error al procesar fila "+itLines+". "+LCxC.LastErrorDescrip);
					}
					else{
						itCount=itCount+1;
					}				
				}

				if (cuImporte==0) itCount=itCount+1;
				
			}
			else{
				Log("Error al procesar fila "+itLines+". No se pudo cargar el cliente con código: "+stArray[0]);
			}
		
		}catch(e){
			Log("Error al procesar fila "+itLines);
		}
		itLines=itLines+1;
		UIP.Value=itLines;		
	}

	eBasic.eMsgbox ("Cantidad de registros procesados: "+itCount,6); 	
	
	Application.MouseDefault();
	Application.CloseUIProgress(UIP);
	TextStream.Close();
	ICliente=null;
	FSystem=null;
	LCxC=null;
	TextStream=null;
	stArray=null;
	dtDate=null;	
	Mov=null;
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
		return ActualizarSaldoCliente();
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