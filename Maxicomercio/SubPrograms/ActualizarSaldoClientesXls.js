var UIP;

function ActualizarSaldoCliente(){	
	var ICliente;
	var EFile;
	var ESheet;
	var lgItems;
	var itRows;
	var stFile;
	var itCount=0;
	var cuImporte=0;
	var dtDate=new Date();
	var stDate;	
	var LCxC;	
	var Mov;
	
	stFile=Application.OpenFile("Archivos de excel (*.xls)|*.xls");
	
	if (stFile==""){
		return false;
	}
		
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando lista de precios"
	UIP.Min=0;
	
	EFile=Application.NewObject("Excel.Application");
	EFile.WorkBooks.Open (stFile);		
	ICliente=Application.NewObject("EDOFx.Cliente");
	ICliente.ADOCnn=Application.adoCnn;
	LCxC=Application.InternalObject("LBCXC");//Application.NewObject("lbnCXC.lgCXC");
		
	if(LCxC==null){
		eBasic.eMsgbox("Error al acceder al componente LBCXC.",6);
		return false;
	}
	
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
			
			if (ICliente.LoadFromADOCByCodigo(ESheet.Cells(lgItems,1),Application.adoCnn,2)==true){

				Application.eDoEvents();
				UIP.TopTitle="Actualizando saldo de "+ICliente.Nombre;
				cuImporte=ESheet.Cells(lgItems,2)-ICliente.Saldo;
				stDate=dtDate.getDate()+"/"+(dtDate.getMonth()+1)+"/"+dtDate.getFullYear();
				
				if (cuImporte>0){
					Mov=LCxC.NotaCargo(ICliente.SYS_PK, stDate, stDate, "Movimiento por ajuste de cuentas", cuImporte, ICliente.IDivisa.TCambio, 17, false, "ImportadoDeArchivo"+"17"+ICliente.Codigo);
					
					if (Mov==null){
						Log("Error al procesar fila "+lgItems+". "+LCxC.LastErrorDescrip);
					}
					else{
						itCount=itCount+1;
					}				
				}
				
				if (cuImporte<0){
					cuImporte=cuImporte*(-1);
					Mov=LCxC.NotaCredito(ICliente.SYS_PK, stDate, stDate, "Movimiento por ajuste de cuentas", cuImporte, ICliente.IDivisa.TCambio, 5, false, "ImportadoDeArchivo"+"5"+ICliente.Codigo);
					
					if (Mov==null){
						Log("Error al procesar fila "+lgItems+". "+LCxC.LastErrorDescrip);
					}
					else{
						itCount=itCount+1;
					}				
				}		
				
				if (cuImporte==0) itCount=itCount+1;
			}
			else{
				Log("Error al procesar fila "+lgItems+". No se pudo cargar el cliente con código : "+ESheet.Cells(lgItems,1));
			}		
			
		}catch(e){
			Log("Error al procesar fila "+lgItems);
		}
		UIP.Value=lgItems;		
	}
	
	eBasic.eMsgbox ("Cantidad de registros procesados: "+itCount,6); 	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	EFile.ActiveWorkBook.Close (false);
	EFile.Quit();
	ICliente=null;
	EFile=null;
	ESheet=null;
	dtDate=null;
	LCxC=null;	
	Mov=null;
	return true;	
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
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