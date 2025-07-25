var TableName="ut_Tamano";
var FormName="uform_Tamano";



function Dlg_AddNew()
{
	var forms;
	
	forms=eBasic.eCreateObject("geSDK_DB.DBForms");
	
	if (forms==null)
	{
		eBasic.eMsgbox("No se pudo crear el objeto, puede que no se encuentre instalado el componente.");
		return 0;
	}
	
	return forms.AddNew(DataAccess.ADOCnn, TableName, FormName, Configuracion.RutaXML,Application);
}

function Dlg_Edit(Sys_PK)
{
	var forms;
	
	forms=eBasic.eCreateObject("geSDK_DB.DBForms");
	
	if (forms==null)
	{
		eBasic.eMsgbox("No se pudo crear el objeto, puede que no se encuentre instalado el componente.");
		return 0;
	}
	
	return forms.Edit(DataAccess.ADOCnn, TableName, FormName, Configuracion.RutaXML,Sys_PK, Application);
}

function Delete(Sys_PK)
{
	if (eBasic.eMsgbox("¿Seguro desea eliminar este registro?",4)!=6) return false;
	try
	{
		DataAccess.ADOCnn.Execute("DELETE FROM " + TableName + " WHERE Sys_PK="+Sys_PK);
	}
	catch(e)
	{	
		eBasic.eMsgbox("Ha ocurrido un error");
		return false;
	}
	
	return true;
}