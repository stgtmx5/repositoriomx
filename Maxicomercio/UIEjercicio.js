//Version 1.0
//********************
//EJERCICIOS CONTABLES
//********************

var NuevaBDCmdsMSAccess=eBasic.AddSlashPath(Application.GetPath(0))+"AEC.sys";
var NuevaBDCmdsMySQL=eBasic.AddSlashPath(Application.GetPath(0))+"AEC_mysql.sys";
var NuevaBDCmdsMSSqlSrv=eBasic.AddSlashPath(Application.GetPath(0))+"AEC_mssql.sys";
var ADOCnnReports; //conexión del ejercicio abierto  cursor del lado del cliente, utilizado para reportes
var cnn;
function CrearPanel(){
		var ctr;
		try{
			ctr=Application.NewObject("geFrontApplication.AxFormControl");
			ctr.Class="geEjercicioContable.CtrlEjercicioCtble";
			ctr.TemplateName="FormEjercicio";
			Application.cAppInfo.AxFormControls.Add(ctr);
		}catch(e){
			
		}
		
		Application.UIShortCuts.CreateAction("P_FinX_A01","Ejercicios contables",0,"","","","UIEjercicio.EjercicioContable",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A02","Informes",0,"","","","UIEjercicio.Informes",0,"","","",0);		
		Application.UIShortCuts.CreateAction("P_FinX_A03","Poliza de cierre",0,"","","","UIEjercicio.PolizaCierre",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A04","Poliza de ajuste cambiario",0,"","","","UIEjercicio.PolizaAjusteCambiario",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A05","Procesos contables",0,"","","","UIEjercicio.ProcesosContables",0,"","","",0);
	
		Application.UIShortCuts.CreateAction("P_FinX_A12","Guardar y aplicar",0,"","","","UIEjercicio.GuardarAplicar",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A13","Guardar como borrador",0,"","","","UIEjercicio.GuardarBorrador",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A14","Guardar como plantilla",0,"","","","UIEjercicio.GuardarPlantilla",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A15","Usar plantilla",0,"","","","UIEjercicio.UsarPlantilla",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_FinX_A16","Ver comprobantes",0,"","","","UIEjercicio.LanzarVerCfdi",0,"","","",0);
		
}


//**************INICIO*****************
//OPERACIONES CON EJERCICIOS CONTABLES
//*************************************
var nombrebd;
function AdministrarEjercicios(){
var Procesos;
var PKEjercicioSeleccionado=0;
var Ejercicio;
var tipoconexion=0;
var R;
var titulo;
var AnioEjercicio=0;

	Procesos=Application.NewObject("ProcCC.lgProcCC");		//Procesos contables
	if(Procesos==null){		
		eBasic.eMsgbox("Error al crear ProcCC.lgProcCC",6);
		return 0;
	}
	//Ejercicio=Configuracion.eApplicationVars.FXCA076;	
	Procesos.SetObjects(Contabilidad.DataObjects,Contabilidad,gFunciones,DataAccess,HTCambio,Application.UIUsers,eBasic);
	//cambiar antes de liberar
	Procesos.NuevaBDCmdsMSAccess=NuevaBDCmdsMSAccess;
	Procesos.NuevaBDCmdsMySQL=NuevaBDCmdsMySQL;
	Procesos.NuevaBDCmdsMSSqlSrv=NuevaBDCmdsMSSqlSrv;
	
	Procesos.cPermitirConfigurarEjercicio=Application.UIUsers.CheckItem("FX1-71-06-001",false,false);
	Procesos.cPermitirAbrirEjercicio=Application.UIUsers.CheckItem("FX1-71-06-002",false,false);
	Procesos.cPermitirCrearEjercicio=Application.UIUsers.CheckItem("FX1-71-06-003",false,false);
	Procesos.cPermitirBorrarEjercicio=Application.UIUsers.CheckItem("FX1-71-06-004",false,false);
	Procesos.cPermitirImportarEjercicio=Application.UIUsers.CheckItem("FX1-71-06-005",false,false);
	Procesos.cPermitirExportarEjercicio=Application.UIUsers.CheckItem("FX1-71-06-006",false,false);
	Procesos.cPermitirActualizarEPosteriores=Application.UIUsers.CheckItem("FX1-71-06-007",false,false);
	Procesos.cPermitirActualizarEenCurso=Application.UIUsers.CheckItem("FX1-71-06-008",false,false);
	
	
	Ejercicio=AxEjercicio();
	if(Ejercicio!=null){
		PKEjercicioEnPantalla=Ejercicio.PKEjercicioArchivado;		
	}else{
		PKEjercicioEnPantalla=0; //ejercicio que se esta editando( no el actual)		
	}
	
	
	
	
	PKEjercicioSeleccionado=Procesos.AdministrarEjerciciosContables(Application.CurrCnnInfo,PKEjercicioEnPantalla,Application.GetPath(0));
	
	if(PKEjercicioSeleccionado>0){
		ADOCnnReports=null;
		
		tipoconexion=Procesos.DatabaseType(Application.ADOCnn);	
		if(!(tipoconexion>=1 && tipoconexion<=3)){
			Log("Error al abrir ejercicio. No se pudo identificar el tipo de motor de base de datos.");
			return 0;
		}
		
		//OBTENER DATOS DE EJERCICIO ARCHIVADO
		//**************************************
		R=Application.ADOCnn.Execute("SELECT uf_Nombre,uf_NombreBD,uf_Anio FROM ut_CEjercicio WHERE Sys_PK="+PKEjercicioSeleccionado);
		if(R==null){
			Log("Error al obtener datos del ejercicio archivado con clave="+PKEjercicioSeleccionado);
			return 0;
		}
		if(R.EOF && R.BOF){
			Log("No se encontró información del ejercicio archivado con clave="+PKEjercicioSeleccionado);
			return 0;
		}
		nombrebd=R("uf_NombreBD").Value;
		if(nombrebd==null) nombrebd="";
		
		if(nombrebd==""){
			Log("Nombre de base de datos incorrecto.");
			return 0;
		}		
		titulo=R("uf_Nombre").Value;
		AnioEjercicio=R("uf_Anio").Value;
		if(AnioEjercicio==null) AnioEjercicio=0;
		
		R=null;
		//**************************************
		
		
		
		cnn=NuevaConexion(nombrebd,tipoconexion,2);	
			
		if(cnn==null){
			Log("Error al crear conexión.");
			return 0;
		}
		//jv / iniciar objeto para ejercicios anteriores
		UIFoliosPolizas.FoliosPolizaAnt.setObject(cnn);
		ADOCnnReports=NuevaConexion(nombrebd,tipoconexion,3);
		if(ADOCnnReports==null)
			Log("Error al crear conexión para procesamiento de reportes.");
		
		EjercicioContable(cnn,PKEjercicioSeleccionado,titulo,AnioEjercicio);
	}
}

function NuevaConexion(dbname,tipo,CursorLocation){
	var cn;	
	var cnstring="";		
	
	try{	
		//CREAR NUEVA CONEXION	
		cn=Application.NewObject("ADODB.Connection");
		if(cn==null)
			return null;
		
		if(tipo==1){
			cnstring="Provider=Microsoft.Jet.OLEDB.4.0;Data Source="+dbname+";Persist Security Info=False";
		}else{
			cnstring=Application.CurrCnnInfo.ConnectionString;
		}
		cn.CursorLocation=CursorLocation;
		cn.Open(cnstring,Application.CurrCnnInfo.UserID,Application.CurrCnnInfo.PWD);
		if(cn.State==1){
			if(tipo==2 || tipo==3) //si es mysql o ms sqlserver
				cn.Execute("USE "+dbname);			
			return cn;			
		}else{
			Log("Error al abrir conexión.");
			return null;
		}
		
	}catch(e){
		eBasic.eMsgbox("Error al crear conexión.",6);
		cn=null;
		return null;
	}

}

function EjercicioContable(conexion,pk,titulo,AnioEjercicio){	
var dlg;
var ThisObj;
var tempCat;

	dlg=Application.AXForms.AXForm("DlgEjercicioContable");
	if (dlg==null){
		Application.MouseHourglass();
		dlg=Application.AXForms.CreateForm("FormEjercicio","DlgEjercicioContable");		
		dlg.CmdProxyEvent="UIEjercicio.CapturarEvento"; //eventos del AXventa		
		
		dlg.Caption = "Ejercicio contable";
		dlg.TagData="IDEjercicioContable"; //identificador del tipo de documento
		
		dlg.CmdKeyDown="UIEjercicio.Command_KeyDown";		//p
		
		
		dlg.CmdAddNew="UIEjercicio.Nuevo"; 
		dlg.CmdEdit="UIEjercicio.Modificar";		
		dlg.CmdDelete = "UIEjercicio.Eliminar";
		dlg.CmdRefreshRst="UIEjercicio.ActualizarVentana";
		
		dlg.ReportsFolder=Reportes.CarpetaConta_Finanzas;
			
		ThisObj = dlg.GetAXObject();
		ThisObj.SetTitle("EJERCICIO 2009");  

		//ASIGNAR AQUI LOS OBJETOS QUE APUNTAN A LA CONEXIÓN DEL EJERCICIO
		//****************************************************************						
		tempCat=Application.NewObject("eCat.eCatFx");
		if(tempCat==null){
			Log("Error al crear objeto eCat.eCatFx");
			dlg.UnloadMe();
			return 0;
		}
	
		//tempCat.SetDataAccess (DataAccess); //EDO debe ser nuevo por lo que no se envía y se crea un nuevo objeto internamente.
		tempCat.SetUM(Application.UIUsers);	
		tempCat.SetFxLands(Paises);		
		tempCat.SetAutoCode(AutoCodigo);				
		tempCat.SetEWFSourcePath (Configuracion.RutaXML);			
		//tempCat.SetUIContabilidad(Contabilidad);	
		tempCat.Browser.SetOwnerForm(Application.MainForm);
		tempCat.SeteBasic(eBasic,Application.HelpFilePath);	
		
		ThisObj.SetNewObjects(conexion, tempCat,gFunciones,HTCambio, false);    		
		ThisObj.DecPreMontos=FXConfig.NDecsMonto();
		//****************************************************************				
		if(titulo==null) titulo="Ejercicio contable";
		ThisObj.SetTitle(titulo);
		ThisObj.PKEjercicioArchivado=pk;
		ThisObj.AnioEjercicioArchivado=AnioEjercicio;
		ThisObj.ShowContent();
		ThisObj.SetExplorer(Explorador);		
		//ThisObj.SetOwnerForm(Application.MainForm); //p
		
		
		dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos

		dlg.AddButton("Informes","P_FinX_A02");					
		dlg.AddButton("Procesos contables","P_FinX_A05");					
				
		dlg.ShowButtons();
		dlg.ZOrder();
		Application.MouseDefault();
	}else{
		dlg.ZOrder();
	}
}

function Nuevo(){
	var E;
	E=AxEjercicio();
	E.Agregar();	
}

function Modificar(){
	var E;
	E=AxEjercicio();
	E.Modificar();	
}

function Eliminar(){
	var E;
	E=AxEjercicio();
	E.Eliminar();	
}

function CapturarEvento(ID){
	var AX;
	AX=Application.ActiveWindow();
	switch(ID){
		case "Policy_AddNew": NuevaPolizaEnEjecicioAnterior(AX);break;		
		case "Policy_Edit": EditarPolizaEnEjercicioAnterior(AX);break;
	}
}

function NuevaPolizaEnEjecicioAnterior(AX){
//Feb 2010
var dlg;
var FormPoliza;
var objPoliza;	
dlg=null;
dlg=Application.AXForms.AXForm("dlgPoliza"+UIFinanzas.NPolizas);

	if (dlg==null){			
		dlg=Application.AXForms.CreateForm("FormPoliza","dlgPoliza"+UIFinanzas.NPolizas);
		UIFinanzas.NPolizas=UIFinanzas.NPolizas+1; //Contador de pólizas
		dlg.Caption="Nueva póliza";
		dlg.CmdPreview="UIEjercicio.PrevisualizarPoliza";
		dlg.CmdPrint="UIEjercicio.ImprimirPoliza";
	
		dlg.ReportsFolder=Reportes.CarpetaConta_Finanzas;
		dlg.ObjectTypeName="CPoliza";		
		dlg.CmdKeyDown="UIEjercicio.Command_KeyDown";
		
	
		dlg.AddButton("Guardar y aplicar","P_FinX_A12");
		dlg.AddButton("Guardar como borrador","P_FinX_A13");
		dlg.AddButton("Guardar como plantilla","P_FinX_A14");
		dlg.AddButton("Usar plantilla","P_FinX_A15");
		dlg.AddButton("Ver comprobantes","P_FinX_A16");
		
		dlg.ShowButtons();			
		FormPoliza=dlg.GetAXObject();
		UIFoliosPolizas.FoliosPolizaAnt.setObject(cnn);
		FormPoliza.SetObjectsFl(UIFoliosPolizas.FoliosPolizaAnt); //jv - Enviar objeto para control de polizas
		FormPoliza.SetObjects(objPoliza,ObjetoEjercicioAnterior("edoconta"),ObjetoEjercicioAnterior("uiconta"),0);					
		FormPoliza.NDecimales=FXConfig.NDecsMonto();
		FormPoliza.NFormato=FXConfig.FormatoMonto();
		FormPoliza.InicializarCuadricula();	    
		if (!FormPoliza.CargarPoliza())				
				Log(FormPoliza.LastErrorDescrip);				
				
	}else
		dlg.Zorder();	
	
}
var PKPrueba;

function EditarPolizaEnEjercicioAnterior(AX){
var dlg;
var FormPoliza;
var ObjPoliza;	

PK=AX.GetAXObject().PrimaryKeyValue;

if (PK==0 || PK==null){	
	Log("Seleccione una póliza");
	return 0;
}
PKPrueba = PK;
dlg=null;
dlg=Application.AXForms.AXForm("dlgPoliza_" + PK);

	if (dlg==null){			
		dlg=Application.AXForms.CreateForm("FormPoliza","dlgPoliza_" + PK);		
		if (dlg != null){
				FormPoliza=dlg.GetAXObject();
				UIFoliosPolizas.FoliosPolizaAnt.setObject(cnn);
				FormPoliza.SetObjectsFl(UIFoliosPolizas.FoliosPolizaAnt); //jv - Enviar objeto para control de polizas
				FormPoliza.SetObjects(ObjPoliza,ObjetoEjercicioAnterior("edoconta"),ObjetoEjercicioAnterior("uiconta"),1,PK);		
				FormPoliza.NDecimales=FXConfig.NDecsMonto();
				FormPoliza.NFormato=FXConfig.FormatoMonto();				
				FormPoliza.InicializarCuadricula();	    
			    if (!FormPoliza.CargarPoliza()){
					if (FormPoliza.LastErrorDescrip!="") 
						eBasic.eMsgbox(FormPoliza.LastErrorDescrip,6);															
					return 0;
				}
				dlg.Caption="Póliza " + FormPoliza.Poliza.Referencia;
				dlg.CmdPreview="UIEjercicio.PrevisualizarPoliza";
				dlg.CmdPrint="UIEjercicio.ImprimirPoliza";
				dlg.ReportsFolder=Reportes.CarpetaConta_Finanzas;
				dlg.ObjectTypeName="CPoliza";				
				dlg.CmdKeyDown="UIEjercicio.Command_KeyDown";
				
				dlg.SetPrimaryKeyValue(PK);
				if (FormPoliza.Poliza.Aplicada){
					FormPoliza.DeshabilitarPoliza();						
					//eBasic.eMsgbox("No puede modificar la póliza actual porque ya ha sido aplicada.",6);
				}else{				
					dlg.AddButton("Guardar y aplicar","P_FinX_A12");
					dlg.AddButton("Guardar como borrador","P_FinX_A13");
					dlg.AddButton("Guardar como plantilla","P_FinX_A14");
					dlg.AddButton("Usar plantilla","P_FinX_A15");
					dlg.AddButton("Ver comprobantes","P_FinX_A16");
					dlg.ShowButtons();
				}
		}		
	}else
		dlg.Zorder();		

}

function ObjetoEjercicioAnterior(Name){
var ThisObj;	
	ThisObj = AxEjercicio();	
	switch(Name.toLowerCase()){
		case "edoconta": return ThisObj.cMain.EDOConta;
		case "uiconta": return ThisObj.cMain.UI;
		case "lbconta": return ThisObj.cMain.LB;
		case "connection": return ThisObj.cMain.ADOCnn;
	}
}

function AxEjercicio(){
	var dlg;
	var ThisObj;

	dlg=Application.AXForms.AXForm("DlgEjercicioContable");
	if (dlg==null)
		return null;
	ThisObj = dlg.GetAXObject();
	return ThisObj;
}


//okkkkkkkkkkkkkkkkkkkkkkkkkkkkk

function GuardarAplicar(A){
	//Guarda la Poliza y la aplica automaticamente
	GuardarPoliza(A,true); 
}

function GuardarBorrador(A){
	GuardarPoliza(A,false); 
}
function GuardarPoliza(A,bAplicar){
	var dlg;
	var FormPoliza;	
	dlg=Application.AXForms.AXForm(A.Context.TagData);
	if (dlg!=null){
		FormPoliza=dlg.GetAXObject();
		if (FormPoliza.ActualizarPoliza()==true){						
				FormPoliza.Accion=1;
				if(FormPoliza.Poliza.Debe==FormPoliza.Poliza.Haber){
					if (bAplicar){ //eBasic.eMsgbox("La póliza se guardó correctamente. ¿Desea aplicarla ahora?",4)==6 - --Jfrank -> Comentado para aplicar automaticamente
						if (AplicarPolizaPK(FormPoliza.Poliza.Sys_PK)==-1){
							FormPoliza.Aplicada=true;
							FormPoliza.DeshabilitarPoliza();							
							dlg.HideToolBar();
						}
					}
				}else{
					eBasic.eMsgbox("La póliza se guardó como borrador, porque las sumas de Debe y Haber son diferentes.",6);
				}
				dlg.Caption="Póliza " + FormPoliza.Poliza.Referencia;
				if(eBasic.eMsgbox("¿Desea imprimir el documento?",4)==6){
					ImprimirPoliza(dlg);
				}
				
				ActualizarVentana();
				//evento
				try{
					Eventos.EvDespuesPoliza(FormPoliza.Poliza);
				}catch(e){				
				}
				//fin evento
		}else{			
			if (FormPoliza.LastErrorDescrip!="")
				eBasic.eMsgbox(FormPoliza.LastErrorDescrip,6);
		}
	}else{
		Log("Error al acceder al formulario. La póliza no se guardó.");
	}
}

function ActualizarVentana(){
	var E;
	E=AxEjercicio();
	E.Refresh();
}

function AplicarPolizaPK(PKPoliza){
var LB;
LB=ObjetoEjercicioAnterior("lbconta");

	if (LB.AplicarPoliza(PKPoliza)){
		eBasic.eMsgbox("La póliza se aplicó correctamente.",6);		
		//HabilitarAplicarPoliza();
		return -1;
	}else{
		eBasic.eMsgbox(LB.LastErrorDescript,6);				
		return 0;
	}
}

function GuardarPlantilla(A){
var NombrePlantilla="";
var Fld=null; // Fields
var ColFld; // Coleccion de FLD
var objDB=null; // Manejador de Tabla
var bSave;
var Content=null;
var dlg;
var FormPoliza;

	NombrePlantilla=eBasic.eInputbox("Introduzca el nombre de la Plantilla");
	
	if (NombrePlantilla==""){
		eBasic.eMsgbox("Nombre inválido, no se guardo la plantilla",6);
		return 0;
	}
	
		
	dlg=Application.AXForms.AXForm(A.Context.TagData);

	if (dlg!=null) 
		FormPoliza=dlg.GetAXObject();
	else{
		Log("Error al intentar acceder a la póliza");
		return 0;
	}
		
	Content=FormPoliza.ObtenerPlantilla();
	
	if (Content==null){
		eBasic.eMsgbox("Error al intentar crear plantilla",6);
		return 0;
	}
	
	if (Content==""){
		eBasic.eMsgbox("Error al intentar crear plantilla",6);
		return 0;
	}
	
	objDB = eBasic.eCreateObject("geSDK_DB.DBTable");
	
	if (objDB==null){
		eBasic.eMsgbox("Error al crear el componente geSDK_DB.DBTable",6);
		return 0;
	}
	
	Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");
	
	if (Fld==null){
		eBasic.eMsgbox("Error al crear el componente eSQLBD.clsTypeInfo",6);
		return 0;
	}
	// Guardar a Base de taos
	objDB.ADOCnn=Application.adocnn;
	objDB.SetTableName ("ut_PolicyTemplate");
	
	objDB.AddNew();
	
	ColFld = objDB.cTypeInfo;
	
	if (ColFld==null){
		eBasic.eMsgbox("Error al intentar cargar colección de campos",6);
		return 0;
	}
	
		Fld.classType = "String";
        Fld.ClassField = "uf_Nombre";
        Fld.DefaultVal = "";
        Fld.Value = NombrePlantilla;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 50;
        Fld.TableField = "uf_Nombre";
        
		ColFld.Add (Fld);
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");
	
		Fld.classType = "String";
        Fld.ClassField = "uf_Datos";
        Fld.DefaultVal = "";
        Fld.Value = Content;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 32000;
        Fld.TableField = "uf_Datos";
        
		ColFld.Add (Fld);
		
		bSave=objDB.Update();
		
		if(!bSave){
			Log("Error al guardar:" + objDB.lastErrDescrip);
			return 0;
		}
		else
			eBasic.eMsgbox("Plantilla guardada correctamente",6);
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
var QName="";
var AppName="";

function LanzarVerCfdi(){
GetQName();
var B;
var PKPoliza=0;
var appExe = "r5.vercfdis.porpoliza.exe " + QName + " " + PKPrueba + " " + nombrebd;
eBasic.eShell(appExe,1);
// eBasic.eShell(appExe,1);
}

function UsarPlantilla(A){
	
var dlg;
var FormPoliza;
var Content;
var PKPoliza=0;
var sql;
var R=null;
	dlg=Application.AXForms.AXForm(A.Context.TagData);

	if (dlg!=null) 
		FormPoliza=dlg.GetAXObject();
	else{
		Log("Error al intentar acceder a la poliza");
		return 0;
	}
	
	if (!ModuleLoaded("us_templates"))
	{
		if (!Application.LoadScript("us_templates.js")) 
		{
			eBasic.eMsgbox("El sub-programa no pudo cargarse",6);
			return 0;
		}
	}
	PKPoliza=us_templates.ShowBrowser();
	
	if(PKPoliza<=0)	return 0;
	
	sql="Select uf_Datos FROM ut_PolicyTemplate Where Sys_PK=" + PKPoliza;
	
	R=Application.adocnn.execute(sql);
	
	if(R==null){
		Log("Error al ejecutar comando");
		return false;
	}
	if (R.EOF && R.BOF){			
		Log("No se encontraron datos de plantilla");
		return false;
	}
	
	Content = R("uf_Datos").Value;
	
	FormPoliza.UsarPlantilla(Content);
	
}


function Command_KeyDown(KeyCode){

if(KeyCode==null) return 0;		

//var ThisObj;

	try{
		//ThisObj = AxEjercicio();
		
		switch(KeyCode){ 		
			case 117://f6 Guardar 
				Application.ActiveWindow().ExecuteButtonAction("P_Fin_A04");
		}
	}catch(e){

	}
	
} 

function ImprimirPoliza(AXForm){
	ProcesarReporte(AXForm,2);
 } 
 function PrevisualizarPoliza(AXForm){
	ProcesarReporte(AXForm,1);
 }
 
 function ProcesarReporte(AXForm,Destino){
	var Formato;
	var ObjPoliza;
	var myADOCnn;
	ObjPoliza=null;
	ObjPoliza=AXForm.GetAxObject().Poliza;
	if(ObjPoliza==null){
		Log("Error al acceder al documento");
		return 0;
	}
	if(ObjPoliza.Sys_PK==0){
		eBasic.eMsgbox("Primero debe guardar la póliza.",6);
		return 0;
	}
	Formato="";
	switch(ObjPoliza.Tipo){
		//Ingreso
		case 0:Formato=FXConfig.FormatoPolizaIngresos();break;
		//Egreso
		case 1:Formato=FXConfig.FormatoPolizaEgresos();break;	
		//Diario
		case 2:Formato=FXConfig.FormatoPolizaDiario();break;
	}
	if(Formato==""){
		Log("No se encontro el formato de reporte de póliza.");
		return 0;
	}
	if(ADOCnnReports!=null)
		myADOCnn=ADOCnnReports;
	else
		myADOCnn=ObjetoEjercicioAnterior("connection");
		
	Reportes.EjecutarReporte(Formato,Destino,ObjPoliza.Sys_PK,true,null,null,null,null,myADOCnn);	
	myADOCnn=null;
 }
 
 
 //NUEVOS
 function Informes(AX){
	var sFormato,sPath,sApp_Rpath,sCnn_Rpath;
	var RootName="";
	var SelPathIndexNode=1;
	var  sFilter = "*.xpd";
	var btnAction=0; //byRef
	var DefaultBtn=1;	
	var myADOCnn;
		
	sApp_Rpath = Application.ResolvePath("$AppReportsPath$");
    sCnn_Rpath = Application.ResolvePath("$CnnReportsPath$");
	
	if(sApp_Rpath!="" && sCnn_Rpath!=""){
		sPath = eBasic.AddSlashPath(sApp_Rpath) + "|" + eBasic.AddSlashPath(sCnn_Rpath);
		RootName = "Reportes de Aplicación|Reportes de Conexión";
	}else{
		if(sCnn_Rpath!=""){
			sPath = eBasic.AddSlashPath(sCnn_Rpath);
			RootName = "Reportes de Conexión";
		}
		if(sApp_Rpath!=""){
			sPath = eBasic.AddSlashPath(sApp_Rpath);
			RootName = "Reportes de Aplicación";
		}
	}
	sPath=eBasic.AddSlashPath(sPath)+Reportes.CarpetaConta_Finanzas;			
	
	sFormato=AxEjercicio().cMain.SelectFile(sPath, sFilter, btnAction, "","", "Seleccionar archivo", "\&Vista previa,\&Imprimir", DefaultBtn, "", 0, SelPathIndexNode, RootName);	
	btnAction=AxEjercicio().cMain.SelectedBtn;

	if(ADOCnnReports!=null)
		myADOCnn=ADOCnnReports;
	else
		myADOCnn=ObjetoEjercicioAnterior("connection");
		
	switch(btnAction){
		case 0: //'cancelar
            return 0;
        case 1: //'Imprimir en impresora predeterminada
            Reportes.EjecutarReporte(sFormato,1,0,true,null,null,null,null,myADOCnn); break;		
        case 2: //'vista previa
			Reportes.EjecutarReporte(sFormato,2,0,true,null,null,null,null,myADOCnn); break;
	}
	myADOCnn=null;
	
	return -1;
 }
 
function ProcesosContables(){
var ask;
var opc;

	ask=Application.NewAsk();
	ask.SetOption(10,"Póliza de ajuste cambiario","Elija esta opción para generar una póliza de ajuste cambiario del ejercicio abierto");
	ask.SetOption(20,"Póliza de cierre","Elija esta opción para generar la póliza de cierre para el ejercicio abierto.");
	ask.SetOption(30,"Reiniciar contabilidad","Seleccione esta opción si desea desaplicar todas las pólizas y borrar los saldos de cada una de las cuentas. Utilice la opción aplicar pólizas pendientes para ajustar los saldos.");
	ask.SetOption(40,"Aplicar pólizas pendientes","Esta opción le permite seleccionar un conjunto de póliza y aplicarlas.");
	//ask.SetOption(50,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	ask.SetOption(50,"Refoliar pólizas","Elija esta opción para eliminar el folio actual de las pólizas y crear nuevos.");
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10:	
			PolizaAjusteCambiario();break;
		case 20:
			PolizaCierre();break;
		case 30:		
			ReiniciarContabilidad();break;
		case 40:
			AplicarPolizasPendientes();break;
		case 50:
			RefoliarAnt(false);break;
	}
	ask=null;
}
 
function PolizaCierre(AX){
var E;
	try{
		E=AxEjercicio();
		E.cMain.ProcessCC.PolizaCierre(true); //(guardar as boolean)
		return -1;
	}catch(e){
		Log("Error al ejecutar póliza de cierre");
		return 0;
	}	
}

function PolizaAjusteCambiario(){
var E;
	try{
		E=AxEjercicio();
		E.cMain.ProcessCC.PolizaAjusteCambiario(true);//(guardar as boolean)
		return -1;
	}catch(e){
		Log("Error al ejecutar póliza de ajuste cambiario");
		return 0;
	}	
}

function ReiniciarContabilidad(){
var E;
	try{
		E=AxEjercicio();
		if(E.cMain.ProcessCC.ReiniciarContabilidad()){
			E.Refresh();
			return -1;
		}else
			return 0;
	}catch(e){
		Log("Error al ejecutar proceso");
		return 0;
	}	
}

function AplicarPolizasPendientes(){
var E;
	try{
		E=AxEjercicio();
		if(E.cMain.ProcessCC.AplicarPolizasPendientes()){
			E.Refresh();
			return -1;
		}else
			return 0;
			
	}catch(e){
		Log("Error al ejecutar proceso");
		return 0;
	}	
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
 
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

//jv - Refoliar ejercicios anteriores...
//Nuevos métodos 2014
function RefoliarAnt(ask)
{
	if(!Application.UIUsers.CheckItem("FX4-CFL-00-001"))  //PERMITIR ACCESO
	return 0;
	
	if(validarEstructura() == -1) //Falló necesario crear estructura y refoliar.
	{
		if(!UIFoliosPolizas.FoliosPolizaAnt.crearEstructura())
			return 0;
	}
	
	if(!ask)
	{
		if(eBasic.eMsgbox("El proceso de refoliado de pólizas puede tardar varios minutos, ¿Seguro que desea continuar?",4)==7)
		return 0;
	}
	
	UIFoliosPolizas.FoliosPolizaAnt.refoliar(true);
}

function validarEstructura()
{
	try
	{
		var R = eBasic.eCreateObject("ADODB.Recordset");
		if(R==null)
		{
			eBasic.eMsgbox("Error al crear objeto ADODB.Recordset");
			return 0;
		}
		
		R.ActiveConnection = cnn;
		R.CursorLocation = 3;
		R.Source = "select count(sys_pk) as contador from foliospolizas;";
		R.Open;
		R.Close;
		return 1;
	}
	catch(e)
	{
		R.Close;
		return -1;
	}
}
//************************************************************************