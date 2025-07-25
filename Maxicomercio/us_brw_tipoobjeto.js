/*Archivo de sub-programa generado automáticamente
06/02/2013 10:10:54 a.m.

***********************************************
*/

function ShowBrowser()
{
var Brw=null;
var RstData=null;
var xBrowsers=eBasic.eCreateObject("eBrowsers.eBrw");

RstData=DataAccess.CreateRecordset();
RstData.Source="Select ut_TipoObjeto.Sys_PK, ut_TipoObjeto.uf_codigo as Código, ut_TipoObjeto.uf_descripcion as Descripción From ut_TipoObjeto";

if (!DataAccess.OpenRecordset(RstData,DataAccess.ADOCnn))
{
	eBasic.eMsgbox("Error al ejecutar la consulta SQL");
	return 0;
}

xBrowsers.SetOwnerForm(Application.MainForm);
Brw = xBrowsers.CreateDlgBrowser(true, true, true, false, false);

xBrowsers.SetBrowser(Brw, RstData, "Sys_PK","Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info");

xBrowsers.SetMethods (Brw, us_brw_tipoobjeto, "AddNew", "Edit", "Delete");

Brw.Caption = "Catálogo de objetos";

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
if (!LoadFormScript("us_form_TipoObjeto")) return 0;
return us_form_TipoObjeto.Dlg_AddNew();

}

function Edit(Sys_PK)
{
if (!LoadFormScript("us_form_TipoObjeto")) return 0;
return us_form_TipoObjeto.Dlg_Edit(Sys_PK);

}

function Delete(Sys_PK)
{
if (!LoadFormScript("us_form_TipoObjeto")) return 0;
return us_form_TipoObjeto.Delete(Sys_PK);

}