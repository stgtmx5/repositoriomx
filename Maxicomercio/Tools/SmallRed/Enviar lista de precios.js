//Maxicomercio
EnviarListaPrecios();

var QName="";
var AppName="";
function EnviarListaPrecios()
{
	var FXGFactNet=null;
	try
	{
		GetQName();
		var appExe = "r5.enviarprecio.exe " + QName;
		eBasic.eShell(appExe,1);
	}
	catch(e)
	{
		Log(e.message);
	}
}

function GetQName()
{
	AppName=Application.cAppInfo.Name;
	if (AppName=="MaxiComercio")
		QName=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
	else if (AppName=="Deminus")
		QName=Application.CurrCnnInfo.Name+"@Deminus.R5";
	else if (AppName=="ContaBlink")
		QName=Application.CurrCnnInfo.Name+"@ContaBlink.R5";
	else
		QName=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}
