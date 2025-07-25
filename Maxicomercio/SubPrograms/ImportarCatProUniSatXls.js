var UIP;

function ImportarCatProUniSat(){	
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
	UIP.Caption="Importando Codigo de Productos y Unidades del Sat";
	UIP.Min=0;
	
	EFile=Application.NewObject("Excel.Application");
	EFile.WorkBooks.Open (stFile);
	
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
		
	for (lgItems=2;lgItems<=itRows;lgItems++)
	{
		try
		{
			Application.adoCnn.Execute("update producto set uf_sat_proser='"+ESheet.Cells(lgItems,2)+"',uf_sat_uniproser='"+ESheet.Cells(lgItems,3)+"' where Codigo='"+ESheet.Cells(lgItems,1)+"'");
			UIP.Value=lgItems;
			Application.eDoEvents();
			itCount++;
		}
		catch(e)
		{
			Log("Error al procesar fila "+lgItems+", Producto: "+ESheet.Cells(lgItems,1));
		}
		UIP.Value=lgItems;
		Application.eDoEvents();
	}
	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox("Cantidad de registros actualizados "+itCount,6);
	EFile.ActiveWorkBook.Close(false);
	EFile.Quit();
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
		return ImportarCatProUniSat();
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