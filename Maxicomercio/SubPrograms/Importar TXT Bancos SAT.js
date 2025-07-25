var UIP;

function UpdateBancosSat(){
	var ICardex;
	var IDCardex;
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
	var sR=null;
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando Bancos SAT"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)");

	if (stFile==""){
		return false;
	}

	FSystem=Application.NewObject("Scripting.FileSystemObject");
	TextStream=FSystem.OpenTextFile(stFile);
	
	if (FSystem.FileExists(stFile)==false){
		return false;
	}
	
	itLines=LinesCount(stFile, FSystem);
	UIP.Max=itLines;//no modificar el valor itLines ya que se valida abajo
	UIP.Show();
	
	Application.MouseHourglass();
	sR=Application.NewObject("ADODB.Recordset");
	if(sR==null){
		return false;
	}
	
	itCount=0;
	
	try{
		Application.adoCnn.Execute("delete from ut_sat_banco");
	}catch(e){
		try{
			Application.adoCnn.Execute("delete * from ut_sat_banco");
		}catch(ee){
			Application.CloseUIProgress(UIP);
			Application.MouseDefault();
			return false;
		}
	}
	
	
	sR.Open("ut_sat_banco",Application.adoCnn,1,3);
	
	stLine=TextStream.ReadLine();
	while (TextStream.AtEndOfStream==false){
		try{
		
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");
			UIP.TopTitle="Actualizando Banco: "+stArray[3];
			
			sR.AddNew();
			//Campos de Control
			sR("Sys_TimeStamp").Value = sNow();
			sR("Sys_GUID").Value = GUID();
			sR("Sys_DTCreated").Value = sNow();
			sR("Sys_User").Value = null;
			sR("Sys_LastUser").Value = null;
			sR("Sys_Exported").Value = false;
			sR("Sys_DTExported").Value = sNow();
			sR("Sys_Info").Value = null;
			
			//Campos Operativos
			sR("uf_cve").Value = stArray[1];
			sR("uf_nombre").Value = stArray[2];
			sR("uf_descripcion").Value = stArray[3];
			
			sR.Update();
			itCount++;
			Application.eDoEvents();
			
			
		}catch(e){
			Log("Error al procesar fila "+itLine);
		}
		
		itLine=itLine+1;
		UIP.Value=itLine;		
	}
	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();	
	eBasic.eMsgbox ("Cantidad de registros actualizados: "+itCount,6); 	
	
	TextStream.Close();
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

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
function GUID(){
return (S4() + S4() + "" + S4() + "4" + S4().substr(0,3) + "" + S4() + "" + S4() + S4() + S4()).toUpperCase();
}

function sDate(){
	var t=new Date;
	var sT="";
	
	try{
		sT=t.getDate().toString()+"/"+(t.getMonth()+1).toString()+"/"+t.getFullYear().toString();
	}catch(e){
		sT="";
	}
	
	return sT;
}

function sTime(){
	var t=new Date;
	var sT="";
	
	try{
		sT=t.getHours().toString()+":"+t.getMinutes().toString()+":"+t.getSeconds().toString();
	}catch(e){
		sT="";
	}
	
	return sT;
}

function sNow(){
	var t=new Date;
	var sT="";
	
	try{
		sT=t.getDate().toString()+"/"+(t.getMonth()+1).toString()+"/"+t.getFullYear().toString()+" "+t.getHours().toString()+":"+t.getMinutes().toString()+":"+t.getSeconds().toString();
	}catch(e){
		sT="";
	}
	
	return sT;
}

function Procesar(){
	try{
		return UpdateBancosSat();
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