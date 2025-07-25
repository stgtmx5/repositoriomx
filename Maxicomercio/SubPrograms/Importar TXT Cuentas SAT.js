var UIP;

function UpdateBancosSat(){
	var ICardex;
	var IDCardex;
	var FSystem;
	var TextStream;
	var stArray=new Array();
	var sPK=new Array(2);
	var stFile;
	var stLine;
	var itLines;
	var itCount=0;
	var itExistencias=0;
	var itLine=0;
	var c=0;
	var sR=null;
	var bFlag=0;
	var nBase=0;
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando Cuentas SAT"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)|*.txt");

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
		Application.adoCnn.Execute("delete from ut_sat_cuenta");
	}catch(e){
		try{
			Application.adoCnn.Execute("delete * from ut_sat_cuenta");
		}catch(ee){
			return false;
		}
	}
	
	
	sR.Open("ut_sat_cuenta",Application.adoCnn,1,3);
	
	stLine=TextStream.ReadLine();
	nBase=0;
	while (TextStream.AtEndOfStream==false){
		try{
		
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");
			UIP.TopTitle="Actualizando Cuenta: "+stArray[4];
			
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
			sR("uf_Nivel").Value = stArray[0];
			
			
			if(bFlag==0)
				sR("uf_SubCuentaDe").Value = stArray[1];
			else
				sR("uf_SubCuentaDe").Value = nBase+Number(stArray[1]);
			
			
			sR("uf_CodAgrup").Value = stArray[3];
			sR("uf_NumCta").Value = stArray[3];
			sR("uf_Desc").Value = stArray[4];
			
			if(stArray[5]=="D")
				sR("uf_Naturaleza").Value = 0;
			else
				sR("uf_Naturaleza").Value = 1;
			
			sR.Update();
			itCount++;
			
			if(bFlag==0){
				sR.Requery();
				nBase=sR("Sys_PK").Value-1;
				if(nBase<=0) nBase=0;
				bFlag=1;
				//Log("PK = "+nBase);
			}
			
			Application.eDoEvents();
			
			
		}catch(e){
			Log("Error al procesar fila "+(itLine+1)+" Error:"+e.description);
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