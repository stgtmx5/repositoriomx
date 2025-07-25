/*Archivo de sub-programa generado automáticamente
06/02/2013 12:12:08 p.m.

***********************************************
*/

function ShowBrowser()
{
var Brw=null;
var RstData=null;
var xBrowsers=eBasic.eCreateObject("eBrowsers.eBrw");

RstData=DataAccess.CreateRecordset();
RstData.Source="Select Sys_PK, uf_Codigo as Codigo, uf_Descripcion as Descripcion From ut_Giro";

if (!DataAccess.OpenRecordset(RstData,DataAccess.ADOCnn))
{
	eBasic.eMsgbox("Error al ejecutar la consulta SQL");
	return 0;
}

Brw = xBrowsers.CreateDlgBrowser(true, true, true, false, false);

xBrowsers.SetBrowser(Brw, RstData, "Sys_PK","Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info");

xBrowsers.SetMethods (Brw, us_brw_giro, "AddNew", "Edit", "Delete");
Brw.SetColumnWidth("Codigo", "80");
Brw.SetColumnWidth("Descripcion", "390");
Brw.Caption = "Giros";

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

function AddNew()
{
if (!LoadFormScript("us_form_Giro")) return 0;
return us_form_Giro.Dlg_AddNew();

}

function Edit(Sys_PK)
{
if (!LoadFormScript("us_form_Giro")) return 0;
return us_form_Giro.Dlg_Edit(Sys_PK);

}

function Delete(Sys_PK)
{
if (!LoadFormScript("us_form_Giro")) return 0;
return us_form_Giro.Delete(Sys_PK);

}