/*Archivo de sub-programa generado automáticamente
09/09/2009 12:42:20 p.m.

***********************************************
*/

function ShowBrowser()
{
var Brw=null;
var RstData=null;
var xBrowsers=eBasic.eCreateObject("eBrowsers.eBrw");

RstData=DataAccess.CreateRecordset();
RstData.Source="Select Sys_PK,uf_Nombre as Nombre_Poliza FROM ut_PolicyTemplate";

if (!DataAccess.OpenRecordset(RstData,DataAccess.ADOCnn))
{
	eBasic.eMsgbox("Error al ejecutar la consulta SQL");
	return 0;
}

Brw = xBrowsers.CreateDlgBrowser(false, false, false, false, true,false,false);
		    

xBrowsers.SetBrowser(Brw, RstData, "Sys_PK","Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info");

xBrowsers.SetMethods (Brw, us_templates, "","","");

Brw.Caption = "Plantillas de Poliza";
Brw.SetColumnWidth("Sys_PK",100);
Brw.SetColumnWidth("Nombre_Poliza",590);
Brw.SetCaptionByFieldName("Sys_PK","ID");
Brw.SetCaptionByFieldName("Nombre_Poliza","Nombre de Plantilla");

return xBrowsers.ShowBrowserLng(Brw);

}

function ModuleLoaded(OName)
{
var col;

col=Application.MainForm.Engine.Modules;

for (var i=1; i<=col.Count;i++)
{
	if (col.Item(i).Name=="mdl"+OName) return true;
}

return false;
}

function LoadFormScript(scriptName) 
{
	if (!ModuleLoaded(scriptName))
	{
		if (!Application.LoadScript(scriptName+".js")) 
		{
			eBasic.eMsgbox("El sub-programa de dialogos no pudo cargarse");
			return false;
		}
	}
	
	return true;
}


