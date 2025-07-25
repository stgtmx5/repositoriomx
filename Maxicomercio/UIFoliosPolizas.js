/*Archivo de sub-programa generado automáticamente
29/01/2014 06:13:26 p.m.

***********************************************
*/
var BrwName="UIFoliosPolizas";
var TiposPoliza;
var FoliosPolizas;
var FoliosPolizaAnt;

function ShowBrowser()
{

if(TiposPoliza == null)
{
	eBasic.eMsgbox("Error al cargar componentes necesarios.", 6);
	return;
}

var Brw;
var sSQL="SELECT * FROM ctipospolizas ORDER BY ID";
var BrwTitle="Tipos de póliza";
var BrwPKField="ID";
var Function_AddNew="UIFoliosPolizas.AddNew";
var Function_Edit="UIFoliosPolizas.Edit";
var Function_Delete="UIFoliosPolizas.Delete";

Brw=null;

Brw=Application.Browsers.GetBrowser(BrwName);
if (Brw==null)
	{
		/*Habilite esta sección de código para controlar el acceso por permisos
		if(!Application.UIUsers.CheckItem("ID_DE_ PERMISO")) 
			return 0;
		*/
		Application.MouseHourglass();

		Brw=Application.Browsers.CreateBrowser(BrwName);
		Brw.Caption=BrwTitle;
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.CmdSQL=sSQL;
		Brw.KeyField = BrwPKField;
		
		Brw.AddButton("Agregar","P_Tipos_01");
		Brw.AddButton("Editar","P_Tipos_02");
		Brw.AddButton("Eliminar","P_Tipos_03");
		
		//Brw.ObjectTypeName="Nombre_Tipo_de_Entidad";		
		Brw.CmdAddNew=Function_AddNew;
		Brw.CmdEdit=Function_Edit;
		Brw.CmdDelete = Function_Delete;
		Brw.CmdDblClick=Function_Edit;
		Brw.CmdClick="UIFoliosPolizas.enabledButtons";
		Brw.CmdAfterRetriveFields="UIFoliosPolizas.RedimensionarColumnas";
			
		Brw.RefreshRst();
		
		//Ocultar columnas
		Brw.HideFields("Sys_TimeStamp;Sys_GUID;Sys_DTCreated;Sys_User;Sys_LastUser;Sys_Exported;Sys_DTExported;Sys_Info");

		
		/*Asignar nombres a Columnas
		Brw.SetCaptionByFieldName("NombreCampo","Nuevo titulo de columna");
		*/
		enabledButtons();
		Application.MouseDefault();
	}
	else
		Brw.Zorder();
		
		
}

function CrearPanel(){
	Application.UIShortCuts.CreateAction("P_Tipos_01","Agregar",0,"","","","UIFoliosPolizas.AddNew",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Tipos_02","Editar",0,"","","","UIFoliosPolizas.Edit",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Tipos_03","Eliminar",0,"","","","UIFoliosPolizas.Delete",0,"","","",0);
	
	if(crearObjetos() == 0)
		return -1;
}

function crearObjetos()
{
	TiposPoliza=Application.NewObject("cTiposPoliza.cMain");
	FoliosPolizas = Application.NewObject("FLPolizas.cAdminFolios");
	FoliosPolizaAnt = Application.NewObject("FLPolizas.cAdminFolios");
	if (TiposPoliza==null)
	{
		eBasic.eMsgbox("No se pudo inicializar el componente.",6);
		return 0;
	}
	
	if(FoliosPolizas==null)
	{
		eBasic.eMsgbox("No se pudo crear el componente FoliosPolizas.",6);
		return 0;
	}
	
	if(FoliosPolizaAnt==null)
	{
		eBasic.eMsgbox("No se pudo crear el componente FoliosPolizas para ejercicios anteriores.",6);
		return 0;
	}
	
	TiposPoliza.setObject(Application.adoCnn);
	FoliosPolizas.setObject(Application.adoCnn);
	return 1;
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
	if(TiposPoliza.addEdit())
		Actualizar();
}

function Edit()
{
	var pk = obtenerSeleccionado();
		
	if(pk<=2)
	{
		eBasic.eMsgbox("No es posible editar el tipo de póliza seleccionada.",6);
		return 1;
	}		
	
	if(TiposPoliza.addEdit(pk))
		Actualizar();	
}

function Delete()
{
	var pk = obtenerSeleccionado();
		
	if(pk<=2)
	{
		eBasic.eMsgbox("No es posible eliminar el tipo de póliza seleccionado.",6);
		return 1;
	}

	if(eBasic.eMsgbox("¿Seguro que desea eliminar el tipo de póliza seleccionado?",4)==7)
		return -1;
	
	try
	{	
		Application.adoCnn.execute("Delete from ctipospolizas where ID = " + pk);
	}
	catch(e)
	{
		eBasic.eMsgbox("No es posible eliminar el tipo de póliza seleccionado, es posible que cuente con movimientos en el sistema.");
		return -1;
	}
		
	Actualizar();
}

function obtenerSeleccionado()
{
	var Brw;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);

	if (Brw==null) return -1;
	
	return Brw.PrimaryKeyValue;
}

function RedimensionarColumnas(Brw){
	
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);
	
	if (Brw!=null){		
				
		Brw.SetColumnWidth("ID",100);
		Brw.SetColumnWidth("Const",1200);
				
		Brw.SetCaptionByFieldName("Const","Descripción");
	}
}

function Actualizar(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null)
		Brw.RefreshRst();
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function enabledButtons()
{
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);
	
	if (Brw!=null){		
		var pk = obtenerSeleccionado();
		if(pk <= 2)
		{
			Brw.GetButtonByIDAction("P_Tipos_02").Enabled=false;
			Brw.GetButtonByIDAction("P_Tipos_03").Enabled=false;
		}
		else
		{
			Brw.GetButtonByIDAction("P_Tipos_02").Enabled=true;
			Brw.GetButtonByIDAction("P_Tipos_03").Enabled=true;
		}
	}
}