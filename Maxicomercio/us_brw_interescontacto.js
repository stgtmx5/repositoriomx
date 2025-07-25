/*Archivo de sub-programa generado automáticamente
12/02/2016 12:02:54

***********************************************
*/

function ShowBrowser()
{
var Brw=null;
var RstData=null;
var xBrowsers=eBasic.eCreateObject("eBrowsers.eBrw");

RstData=DataAccess.CreateRecordset();
RstData.Source="SELECT ut_interescontacto.Sys_PK AS ID, ut_interescontacto.uf_Interes AS Interes, ut_interescontacto.uf_Descripcion AS Descripción  FROM ut_interescontacto;";

if (!DataAccess.OpenRecordset(RstData,DataAccess.ADOCnn))
{
	eBasic.eMsgbox("Error al ejecutar la consulta SQL");
	return 0;
}

xBrowsers.SetOwnerForm(Application.MainForm);
Brw = xBrowsers.CreateDlgBrowser(true, true, true, false, false);

xBrowsers.SetBrowser(Brw, RstData, "ID","Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info");

xBrowsers.SetMethods (Brw, us_brw_interescontacto, "AddNew", "Edit", "Delete");

Brw.Caption = "Intereses de contactos";

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
if (!LoadFormScript("us_form_InteresContacto")) return 0;
return us_form_InteresContacto.Dlg_AddNew();

}

function Edit(Sys_PK)
{
if (!LoadFormScript("us_form_InteresContacto")) return 0;
return us_form_InteresContacto.Dlg_Edit(Sys_PK);

}

function Delete(Sys_PK)
{
if (!LoadFormScript("us_form_InteresContacto")) return 0;
return us_form_InteresContacto.Delete(Sys_PK);

}