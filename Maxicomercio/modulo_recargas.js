var QName="";
var corte=-99;
var sessionId="";

function load()
{
	try{		
		if (!loadScript("modulo_recargas")){
			eBasic.eMsgbox("Error al cargar el script");
			return 0;
		}
		Application.Eval("modulo_recargas.configValues()");
	}
	catch(e){
		eBasic.eMsgbox(e.message);
	}
}
function configValues()
{
	var FXGFactNet=null;
	try{
		GetSessionId();
		QName=Application.GetQName();
		corte = MainForm.CorteActual().Sys_PK;
		var command = "Browser/EnterpriseBrowser.exe \"http://comercial.recargas/front.dkl?token="+sessionId+"&corte="+corte+"&qname="+QName+"\" \"maximized\" \"noborder\" \"topmost\"";
		eBasic.eShell(command, 1);
	}
	catch(e){
		Log(e.message);
	}
}
function GetSessionId()
{
	var currUser = Application.UIUsers.CurrentUser.Sys_PK;
	// SQLSERVER:
	// var query = "SELECT TOP(1) s.sys_guid FROM sys_session s INNER JOIN tuser u ON s.iuser = u.Sys_PK WHERE s.sys_deleted IS NULL AND u.Sys_PK = " + currUser + ";";
	// MySQL:
	var query = "SELECT s.sys_guid FROM sys_session s INNER JOIN tuser u ON s.iuser = u.sys_pk WHERE s.sys_deleted IS NULL AND u.sys_pk = " + currUser + " LIMIT 1;";
	var obj = Application.UIUsers.CurrentUser.ADOCnn.Execute(query);
	
	if(obj != null && !obj.EOF && !obj.BOF)
		sessionId = obj("sys_guid").Value;
	else{
		// SQLSERVER:
		// var querySession = "INSERT INTO sys_session(sys_timestamp, sys_guid, sys_dtcreated, iuser, clientinfo) VALUES(GETDATE(), LOWER(REPLACE(NEWID(), '-', '')), GETDATE(), "+currUser+", 'Unknow');"
		// MySQL:
		var querySession = "INSERT INTO sys_session(sys_timestamp, sys_guid, sys_dtcreated, iuser, clientinfo) VALUES(NOW(), LOWER(REPLACE(UUID(), '-', '')), NOW(), "+currUser+", 'Unknow');"
		Application.UIUsers.CurrentUser.ADOCnn.Execute(querySession);
		var obj = Application.UIUsers.CurrentUser.ADOCnn.Execute(query);
		sessionId = obj("sys_guid").Value;
	}
		
}
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}