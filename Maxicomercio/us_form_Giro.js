var TableName="ut_Giro";
var FormName="uform_Giro";



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
	if(Sys_PK<1)
	{
		eBasic.eMsgbox("Seleccione un elemento",6);
		return 0;
	}
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
	if(Sys_PK<1)
	{
		eBasic.eMsgbox("Seleccione un elemento",6);
		return 0;
	}
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