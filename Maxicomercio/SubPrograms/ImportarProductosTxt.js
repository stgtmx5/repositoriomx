var UIP; //`porgress var
var ValueDate;

function mImportar(){
	
	if(formato() == 0)
	{
		Log("Error al obtener motor de la base de datos, imposible continuar.");
		return;
	}
	
	var R;
	var W;
	var FSystem;
	var TextStream;
	var stFile;
	var itLines;
	var itCount=0;
	var stArray=new Array();
	
	var codigo="";
	var pk_grupo=0;

	UIP=Application.NewUIProgress();
	UIP.Caption="Importando productos a grupos"
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
	
	itLines=LinesCount(stFile, FSystem);
	var Lineas = itLines;
	UIP.Max=itLines+1;
	UIP.Show();
	itLines=1;
	
	Application.MouseHourglass();
	Application.eDoEvents();
	while (TextStream.AtEndOfStream==false){
	
	try{
	
		stLine=TextStream.ReadLine();
		stArray=stLine.split(",");
	
	pk_grupo=stArray[0];
	
	codigo=trim(stArray[1]);
	
	
	var sql;
	sql = "SELECT SYS_PK FROM producto where codigo='" + codigo +"'";
	
	R=Application.Database.OpenRecordset(sql);
	if(R!=null)
	{
		if (!(R.EOF && R.BOF))
		{
			if(!existe(pk_grupo, R("Sys_PK")))
			{
				var sqlInsert;
				sqlInsert = "INSERT into grupoproductos_producto_ (Sys_TimeStamp,IProductos,IGrupos) values(" + ValueDate + "," + R("Sys_PK") + "," + pk_grupo +");";
				W=Application.adoCnn.execute(sqlInsert);
				itCount++;
				itLines=itLines+1;
				UIP.Value=itLines;		
				Application.eDoEvents();
			}
		}
	}
	}
	catch(e)
	{
		Log("Error al procesar fila "+ e.description);
	}
}
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();
	eBasic.eMsgbox ("Cantidad de registros importados: "+itCount+" de " + Lineas,6);
	TextStream.Close();
	FSystem=null;
	TextStream=null;
	stArray=null;
	return true;	
}

function existe(pkgrupo, pkproducto)
{
	try
	{
		var R;
		sql = "SELECT SYS_PK FROM grupoproductos_producto_ where IGrupos=" + pkgrupo +" AND IProductos="+pkproducto;
		
		R=Application.Database.OpenRecordset(sql);
		if(R==null)
		{
			return false;
		}
		
		if (R.EOF && R.BOF)
		{
			return false;	
		}
			
		R.Close();	
		return true;
	}
	catch(e)
	{
		return false;
	}
}

function formato(){
  var getTypeDB = 0;
  
  var R,S,T;

  try{
		R=Application.Database.OpenRecordset("select UUID()");//mysql
		if(!(R.BOF && R.EOF)){
		getTypeDB = 1
		ValueDate = "NOW()";
		return 1;
	}
	else{
		return 0;
	}	
   }
   catch(e){
   
   
   }

   try{
	   S=Application.Database.OpenRecordset("select NEWID()");//sql server
		if(!(S.BOF && S.EOF)){
		getTypeDB = 2;
		ValueDate = "GETDATE()";
		return 1;
	}
	else{
		return 0;
	}
  
	}
  catch(e){
  
	}
	 
	try 
	{
		T=Application.Database.OpenRecordset("Select cbool(-1) as Valor");//access
		 if(!(T.BOF && T.EOF)){
			getTypeDB = 3;	
			ValueDate="Now()";
			return 1;
		}
		else{
			return 0;
		}
	}
	catch(e){
	
	}
	return 0;

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
		return mImportar();
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

function trim(myString)
{
	return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
}

Procesar();