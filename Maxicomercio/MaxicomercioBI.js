var CmdSQLQTableros="select Sys_PK,uf_Nombre AS Nombre,uf_Color from ut_bi_tablero";
var MBI;
var cntT=0;
var Acceso;

function CrearPanel(){
	
	Application.UIShortCuts.CreateAction("P_MXBI_A01","Explorar tableros",0,"","","","MaxicomercioBI.qTableros",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_MXBI_A02","Agregar",0,"","","","MaxicomercioBI.Agregar",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_MXBI_A03","Editar",0,"","","","MaxicomercioBI.Editar",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_MXBI_A04","Eliminar",0,"","","","MaxicomercioBI.Eliminar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_A05","Abrir",0,"","","","MaxicomercioBI.axTablero",0,"","","",0);
	
	
	Application.UIShortCuts.CreateAction("P_MXBI_B01","Biblioteca de métricas",0,"","","","MaxicomercioBI.BibliotecaMetricas",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_B02","Biblioteca de indicadores",0,"","","","MaxicomercioBI.BibliotecaIndicadores",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_B03","Insertar indicador",0,"","","","MaxicomercioBI.InsertarIndicador",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_B04","Insertar texto",0,"","","","MaxicomercioBI.InsertarTexto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_B05","Propiedades del elemento",0,"","","","MaxicomercioBI.PropiedadesElemento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_B06","Borrar elemento",0,"","","","MaxicomercioBI.BorrarElemento",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_MXBI_B07","Actualizar",0,"","","","MaxicomercioBI.ActualizarTablero",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_MXBI_B08","Guardar y cerrar",0,"","","","MaxicomercioBI.GuardarCerrarTablero",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_MXBI_B09","Guardar",0,"","","","MaxicomercioBI.GuardarTablero",0,"","","",0);
	
	
	MBI_Engine=eBasic.eCreateObject("MaxiComercioBI.EEngine");
	MBI_Engine.SetConnection(Application.ADOCnn,Application.UIUsers.CurrentUser.Sys_PK);
	MBI_Engine.SetUM(Application.UIUsers);
	
	
	var pid;

	pid=Application.NewObject("geFrontApplication.AxFormControl");
	pid.Class="maxicomercio_stats.ctrTablero";
	pid.TemplateName="FormTablero";
	Application.cAppInfo.AxFormControls.Add(pid);
}
function qTableros(){
var Brw=null;

Brw=Application.Browsers.GetBrowser("qTableros");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX2-MBI-00-000"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qTableros");
		Brw.Caption="Tableros";
		Brw.sqlCommand.CmdType=1;								
		Brw.KeyField = "Sys_PK";
		Brw.sqlCommand.CmdSQL=CmdSQLQTableros+" where uf_FK_Usuario="+Application.UIUsers.CurrentUser.Sys_PK+" order by uf_Nombre";			
		Brw.CmdAfterRetriveFields="MaxicomercioBI.RedimensionarColumnas";
		
		Brw.CmdAddNew="MaxicomercioBI.Agregar"; 
		Brw.CmdEdit="MaxicomercioBI.Editar";
		//Brw.CmdRowChanged = "MaxicomercioBI.TituloVenta";
		Brw.CmdDelete = "MaxicomercioBI.Eliminar";
		Brw.CmdDblClick="MaxicomercioBI.axTablero";
				
		Brw.ShowToolBar();
				
		Brw.AddButton("Agregar","P_MXBI_A02");
		Brw.AddButton("Abrir","P_MXBI_A05");
		Brw.AddButton("Cambiar nombre","P_MXBI_A03");
		Brw.AddButton("Eliminar","P_MXBI_A04");		
		Brw.AddButton("Biblioteca de Métricas","P_MXBI_B01");
		Brw.AddButton("Indicadores","P_MXBI_B02");
		
		Brw.HideFields("Sys_PK;uf_Color");
		//Brw.AutoAdjust();
				
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="ut_bi_tablero";
		
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="ut_bi_tablero";		
		Brw.RefreshRst();
	}
	else
		Brw.Zorder();
}
function RedimensionarColumnas(){
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qTableros");	
	if (Brw!=null){				
		Brw.SetColumnWidth("Nombre",Brw.dxGrid.Width);
	}
}
function Agregar(){
	var pk;
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qTableros");
	
	var pktablero = MBI_Engine.Form_Agregar_Tablero(Application.UIUsers.CurrentUser.Sys_PK);
    if(pktablero>0){
		Brw.RefreshRst();
		return -1;
	}
}
function Editar(A){
	var pk;
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qTableros");
	if(Brw==null) eBasic.eMsgbox("error");
	
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk==0){
		eBasic.eMsgbox("Seleccione un elemento de la lista.");
		return 0;
	}
	
	
	if(MBI_Engine.Form_Editar_Tablero(pk)){		
		Brw.RefreshRst();
		return -1;
	}else
		return 0;
	
}
function Eliminar(A){
	var pk;
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qTableros");
	
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk==0){
		eBasic.eMsgbox("Seleccione un elemento de la lista.");
		return 0;
	}
			
	if(MBI_Engine.EliminarTablero(pk)){
		Brw.RefreshRst();
		return -1;
	}else{
		eBasic.eMsgbox("Error al eliminar tablero.",6);
		return 0;
	}
}
function axTablero(){
var dlg;
var crtTablero;
var brw=null;
var pk=0;

if(!Application.UIUsers.CheckItem("FX2-MBI-02-000"))  //PERMITIR ACCESO
	return 0;

brw=Application.Browsers.GetBrowser("qTableros");
pk=brw.PrimaryKeyValue;

if(pk==null) pk=0;
if(pk==0) return 0;

	dlg=Application.AXForms.AXForm("DlgTablero" + pk);
	if (dlg!=null){
		dlg.ZOrder();
		return -1;
	}
		
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormTablero","DlgTablero" + pk);		
	//dlg.CmdProxyEvent=""
	
	dlg.Caption = brw.GetFieldValue("Nombre")+"(Tablero)";
	dlg.TagData=""; //identificador del tipo de documento
	
	crtTablero = dlg.GetAXObject();
		
	crtTablero.InitCtr(MBI_Engine,pk);
	
	//dlg.SetParent(ParentWindow);	
	//dlg.SetProxyEvents(); //asignar manejador de eventos
	dlg.AddButton("Guardar","P_MXBI_B09");
	dlg.AddButton("Guardar y cerrar","P_MXBI_B08");
	dlg.AddButton("Insertar indicador","P_MXBI_B03");
	dlg.AddButton("Insertar texto","P_MXBI_B04");	
	dlg.AddButton("Borrar elemento","P_MXBI_B06");
	dlg.AddButton("Propiedades","P_MXBI_B05");
	dlg.AddButton("Actualizar","P_MXBI_B07");	
	dlg.ShowButtons();
	dlg.ZOrder();
	Application.MouseDefault();
	return -1;
}
function BibliotecaMetricas(A){
	MBI_Engine.Biblioteca_Metricas();	
}
function BibliotecaIndicadores(A){
	MBI_Engine.Biblioteca_Indicadores();
}
function InsertarIndicador(A){
	var ctrTablero=A.Context.ActiveWindow.GetAXObject();
	ctrTablero.Window_InsertarIndicador();
}
function InsertarTexto(A){
	var ctrTablero=A.Context.ActiveWindow.GetAXObject();
	ctrTablero.InsertFigura();
}
function PropiedadesElemento(A){
	var ctrTablero=A.Context.ActiveWindow.GetAXObject();
	ctrTablero.Window_Propiedades();
}
function BorrarElemento(A){
	var ctrTablero=A.Context.ActiveWindow.GetAXObject();
	ctrTablero.Window_EliminarObjeto();
}
function ActualizarTablero(A){
	var ctrTablero=A.Context.ActiveWindow.GetAXObject();
	ctrTablero.ActualizarTodo();
}
function GuardarCerrarTablero(A){
	var dlg=A.Context.ActiveWindow;
	if(dlg.GetAXObject().GuardarCambios()){
		dlg.UnloadMe();
	}
}
function GuardarTablero(A){
	var dlg=A.Context.ActiveWindow;
	dlg.GetAXObject().GuardarCambios();
}