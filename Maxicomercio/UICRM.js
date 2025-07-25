var DocMagager;


function AddControlCRM(){
var pid;

	pid=Application.NewObject("geFrontApplication.AxFormControl");
	pid.Class="AxCrm.ctrlCRM";
	pid.TemplateName="ctrlCRM";
	Application.cAppInfo.AxFormControls.Add(pid);

	Application.UIShortCuts.CreateAction("CRM_001","Nuevo Cliente",0,"","","","UICxC.AgregarCliente",0,"","","",0);
	Application.UIShortCuts.CreateAction("CRM_002","Editar Cliente",0,"","","","UICRM.EditClient",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("CRM_003","Estado de Cuenta",0,"","","","UICRM.ShowStatus",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("CRM_004","Vender",0,"","","","UICRM.SalesToClient",0,"","","Haga click aquí",0);
	
	Application.UIShortCuts.CreateAction("CRM_010","Doc. por cobrar",0,"","","","UICRM.AddDocXCobrar",0,"","","",0);
	Application.UIShortCuts.CreateAction("CRM_011","Recibo",0,"","","","UICRM.AddRecibo",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("CRM_012","Aplicar otros Doctos.",0,"","","","UICRM.AddAplicar",0,"","","Haga click aquí",0);
	//Application.UIShortCuts.CreateAction("CRM_013","Auto-aplicar todo",0,"","","","UICRM.AutoAplicarTodo",0,"","","",0);

	Application.UIShortCuts.CreateAction("CRM_014","Informes",0,"","","","UICRM.Informes",0,"","","",0);	
	Application.UIShortCuts.CreateAction("CRM_015","Archivos adjuntos",0,"","","","UICRM.ArchivosAdjuntos",0,"","","",0);
}

function AddControlAdmonCRM(){
	var pid;
	pid=Application.NewObject("geFrontApplication.AxFormControl");
	pid.Class="AxCrm.AxAdmonCasos";
	pid.TemplateName="AxAdmonCasos";
	Application.cAppInfo.AxFormControls.Add(pid);
}

function ShowCRM(){

if(!Application.UIUsers.CheckItem("FX3-CRM-10-001"))  //PERMITIR ACCESO
			return 0;
			
var dlg;

dlg=Application.AXForms.AXForm("exCRM");
if (dlg==null)
{
	dlg=Application.AXForms.CreateForm("ctrlCRM","exCRM");	
	if (dlg==null){
		eBasic.eMsgbox("Error al cargar control ActiveX.",6);
		return 0;
	}
	dlg.Caption="Atención a clientes";	
	
	//eBasic.eMsgbox("AX");
	dlg.GetAXObject().setObject(Application.Adocnn, Application.UIUsers, GetRepository()+"\\UICRM_Aux.js", Application, eBasic.ApplicationName);
	//eBasic.eMsgbox("BX");
	dlg.GetAXObject().SetDocManager(Expediente,Imagenes);	
	dlg.GetAXObject().loadControl();
	dlg.AddButton("Nuevo Cliente","CRM_001");
	dlg.AddButton("Editar Cliente","CRM_002");
	dlg.AddButton("Estado de Cuenta","CRM_003");
	dlg.AddButton("Vender","CRM_004");
        dlg.AddButton("Aplicar otros Doctos.","CRM_012");
	dlg.AddButton("Doc. por cobrar","CRM_010");
	dlg.AddButton("Recibo","CRM_011");
	//dlg.AddButton("Auto-aplicar todo","CRM_013");
	dlg.AddButton("Informes","CRM_014");	
	dlg.AddButton("Archivos adjuntos","CRM_015");

	dlg.ReportsFolder=Reportes.CarpetaCXC;	//Agregado para correcta funcionalidad de botón de Informes...
	
	DocMagager = eBasic.eCreateObject("geDocRep.Manager");
	if(DocMagager==null)
	{
		eBasic.eMsgbox("Error al crear objeto para administración de datos adjuntos.", 6);
		return -1;
	}
	
	DocMagager.SetADOCnn(Application.AdoCnn);
	DocMagager.CanAddDocument = "FX1-10-100-005-A"
	DocMagager.CanAddLink = "FX1-10-100-005-B"
	DocMagager.CanEdit = "FX1-10-100-005-C"
	DocMagager.CanDeleteLink = "FX1-10-100-005-D"
	DocMagager.CanDeleteDocument = "FX1-10-100-005-E"
}

dlg.Zorder();	
} 

function EditClient(){

var Frm;
var Cliente;
var isEdit;

Frm=null;
Frm=Application.AXForms.AXForm("exCRM");
	if (Frm==null){
		Log("Error al intentar acceder al control ActiveX");
		return 0;
	}
	
	Cliente=Frm.GetAxObject().SelectedClient;
	
	if(Cliente==null){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
	
	if(Cliente<=0){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
		
	isEdit=UICxC.ModificarCliente(Cliente);
	if (isEdit<0){
		Frm.GetAxObject().SelCliente (Cliente);
	}
	
}

function GetRepository(){
var sp="";
	try{
		sp=Application.ScrAdmin.GetPath(0);
	}catch(e){
		sp=Application.SourceAdmin.GetPath(0);
	}
	return sp;
}

function SalesToClient(){
	var Frm;
	var ask;
	var Cliente;
	var Frm=null;
	
	Frm=Application.AXForms.AXForm("exCRM");
	if (Frm==null) return 0;
	Cliente=Frm.GetAxObject().SelectedClient;
	
	if(Cliente==null){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
	if(Cliente<=0){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
	
	
	ask=Application.NewAsk();
	ask.SetOption(10,"Cotización","Elija ésta opción para crear una cotización para el cliente seleccionado.");
	ask.SetOption(20,"Pedido","Seleccione ésta opción para registrar un nuevo pedido del cliente.");
	ask.SetOption(30,"Remisión","Elija ésta opción para crear una nueva remisión.");
	ask.SetOption(40,"Factura","Elija ésta opción para crear una nueva factura.");
	ask.SetOption(50,"Nota de crédito","Elija ésta opción para realizar una nota de crédito.");
		
	//Cliente=parseInt(A.Context.TagData);
	switch(ask.Ask())
	{
		case 10: 				
			UIVentas.CrearCotizacion(Cliente);break;			
		case 20:
			UIVentas.CrearPedido(null,Cliente);break;
		case 30:
			UIVentas.CrearRemision(null,Cliente);break;
		case 40:
			UIVentas.CrearFactura(null,Cliente);break;
		case 50:
			UIVentas.CrearNotaC(null,Cliente);
	}
	
	ask=null;
	
}

function loadProfile()
{
	var dlg;
	try
	{
		dlg = eBasic.eCreateObject("dlCrmGen.Actions");
		
		if(dlg==null)
		{
			Log("Error al crear objeto para el control de permisos.");
			return -1;
		}
		
		dlg.showDLGTipoCaso(Application.ADOCnn);
	}
	catch(e)
	{
		eBasic.eMsgbox(e.description);
	}
}

function Log(Error){
	if (Error!="")
		eBasic.eMsgbox(Error,6);
		//Application.FireEventLog(Error);
}

function ShowStatus(){
var Frm;
var Cliente;
var Brw;
var NameClient="";

Frm=null;
Frm=Application.AXForms.AXForm("exCRM");

	if (Frm==null){
		Log("Error al intentar acceder al control ActiveX");
		return 0;
	}
	
	Cliente=Frm.GetAxObject().SelectedClient;
	
	if(Cliente==null){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
	if(Cliente<=0){
		Log("Debe seleccionar un cliente.");
		return 0;
	}

	NameClient = GetNameClient(Cliente);
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qEstadoCuentaCliente_"+Cliente);
	
	if (Brw==null){
		Application.MouseHourglass();
		CuentasXCobrar.RedondearSaldos(Cliente);
		Application.MouseDefault();
		
		Brw=Application.Browsers.CreateBrowser("qEstadoCuentaCliente_"+Cliente);				
		Brw.Caption="Estado de cuenta: " + NameClient;  //A.Context.ActiveWindow.GetFieldValue("Nombre"); 
		Brw.sqlCommand.CmdType=1;
		Brw.TagData="EdoCtaCliente";
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKCliente",Cliente));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Info",0));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio",2007));
		
		Brw.KeyField = "Sys_PK";
		Brw.CmdEditTitleClick="UICxC.ModificarCliente";
		Brw.SetEditTitleParameter("PKCliente","Editar cliente");
		
		Brw.ReportsFolder=Reportes.CarpetaCXC;		
		Brw.ObjectTypeName="DCXC";
		
		Brw.SetTitle(NameClient);
		
	    Brw.CmdAddNew="UICxC.OpcEdoCuentaAgregar";
		Brw.CmdEdit="UICxC.OpcEdoCuentaModificar";
		Brw.CmdDelete = "UICxC.OpcEdoCuentaModificar";
		Brw.CmdDblClick="UICxC.OpcEdoCuentaModificar";
		
		// Brw.SubTitle1="Tipos de Proveedores";
		// Brw.SubTitle2="Proveedores";
					
		Brw.AddButton("Recibo","P_CxC_C03");
		Brw.AddButton("Cobrar documento","P_CxC_C08");
		Brw.AddButton("Financiar documento","P_CxC_C06");
		Brw.AddButton("Financiar capital","P_CxC_C07");
		Brw.AddButton("Bonificaciones","P_CxC_C05");
		Brw.AddButton("Aplicar abonos","P_CxC_C04");
		Brw.AddButton("Desaplicar abonos","P_CxC_C10");
		Brw.AddButton("Aplicar otros Doctos","P_CxC_C12");

		Brw.AddButton("Nota de cargo","P_CxC_C02");
		Brw.AddButton("Nota de crédito","P_CxC_C01");
		Brw.AddButton("Aplicar intereses","P_CxC_C09");
		Brw.AddButton("Crear CFDI","P_CxC_C11");
		Brw.ShowToolBar();
		
		Brw.TopTabParameter="Info";
		Brw.CmdTopTabClick="UICxC.ConfigurarBrowser";
		Brw.CmdBottomTabClick="UICxC.ReasignarConsulta";
		Brw.CmdAfterRetriveFields="UICxC.RedimensionarColEstadoCuenta";
		Brw.AddTopTab("Documentos",0);
		Brw.AddTopTab("Movimientos",1);
		Brw.SelectTopTab(0);
		Brw.ShowTopTabsBar();		
		
		Brw.AddBottomTab("Enero",1);
		Brw.AddBottomTab("Febrero",2);
		Brw.AddBottomTab("Marzo",3);
		Brw.AddBottomTab("Abril",4);
		Brw.AddBottomTab("Mayo",5);
		Brw.AddBottomTab("Junio",6);
		Brw.AddBottomTab("Julio",7);
		Brw.AddBottomTab("Agosto",8);
		Brw.AddBottomTab("Septiembre",9);
		Brw.AddBottomTab("Octubre",10);
		Brw.AddBottomTab("Noviembre",11);
		Brw.AddBottomTab("Diciembre",12);	
		Brw.AddBottomTab("Todos",0);	
		
		Brw.BottomTabParameter="Mes";
		Brw.BottomComboParameter="Anio";						
		Brw.ShowBottomTabsBar(); 
		Brw.ShowBottomCombo();
		UIDef.FillComboYears(Brw,false,true,true);	
		ConfigurarBrowser(0);	
		Brw.Execute();
		
	}
	else
		Brw.Zorder();
}

function ConfigurarBrowser(Tab){ 
	Brw=Application.ActiveWindow();	
	if (Brw==null) return;
	if (Tab==0){
		//Documentos con saldo
		Brw.sqlCommand.CmdSQL= UICxC.CmdSQLQEstadoCuenta;
		Brw.HideBottomCombo();
		Brw.HideBottomTabsBar();		
		DesactivarBotonesEstadoCuenta(Brw,true);
	}else{		
		//Todos los movimientos
		if (Brw.Parameter("Mes").Value==0)
			Brw.sqlCommand.CmdSQL=UICxC.CmdSQLQMovimientosPorAnio;
		else
			Brw.sqlCommand.CmdSQL=UICxC.CmdSQLQMovimientos;
			
		Brw.ShowBottomCombo();
		Brw.ShowBottomTabsBar();
		DesactivarBotonesEstadoCuenta(Brw,false)
	}
}

function DesactivarBotonesEstadoCuenta(Brw,Activar){	

	Brw.GetButtonByIDAction("P_CxC_C05").Enabled=Activar;
	Brw.GetButtonByIDAction("P_CxC_C06").Enabled=Activar;
	Brw.GetButtonByIDAction("P_CxC_C08").Enabled=Activar;	
}

function GetNameClient(PkClient){
var sql;
var R;
	sql = "select Nombre from Cliente where Sys_PK=" + PkClient;
	R = Application.adocnn.execute(sql);
	
	if(R==null){
			Log(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los datos del cliente)");
			return 0;
		}
		if (R.EOF && R.BOF){			
			Log(ErrDesc +"(No se encontró el cliente indicado con clave"+ PKCorte +")");
			return 0;
		}
		
	return R("Nombre").Value;
}

function AddRecibo()
{
	var Cliente;
	var r;
		
	Cliente = ClienteSeleccionado();
	if(Cliente < 1) 
	{
		return -1;
	}

	if (!AbrirCaja()) return;	
	r=null;
	r=CuentasXCobrar.Recibo(LBEfectivo.objCorte,Cliente);
	if(r!=null){
		Application.MouseHourglass();
		Poliza.PolizaReciboCXC(r.Sys_PK);
		Application.MouseDefault();
		if (eBasic.eMsgbox("Se ha creado un Recibo. ¿Desea imprimir el documento?", 4)==6){
			Reportes.EjecutarReporte(FXConfig.FormatoRecibo(),2,r.Sys_PK,true);
		}
		
		if(Application.ActiveWindow().ObjectTypeName=="DCXC")
				Application.ActiveWindow().RefreshRst();		
		
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
}

function AddDocXCobrar()
{
	var Cliente;

	Cliente = ClienteSeleccionado();
	
	if(Cliente < 1)
	{
		return -1;
	}
	
	if(CuentasXCobrar.DocXCobrar(Cliente)!=null){
		Application.MouseHourglass();
		Poliza.PolizaDocumentoXCobrar(CuentasXCobrar.ResultadoCXC);
		Application.MouseDefault();
		
		if(CuentasXCobrar.TipoNuevoDocumento==18){
			if (eBasic.eMsgbox("¿Desea imprimir el documento?", 4)==6){					
				var PK;
				PK=CuentasXCobrar.Resultado(CuentasXCobrar.ResultadoCXC,1);
						Reportes.EjecutarReporte(FXConfig.FormatoPagare(),2,PK,true,null,null,null,"DCXC");
			}
		}

		if(Application.ActiveWindow().ObjectTypeName=="DCXC")
			Application.ActiveWindow().RefreshRst();		
			
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
		
}

function AddAplicar()
{
	var Cliente;

	Cliente = ClienteSeleccionado();
	
	if(Cliente < 1)
	{
		return -1;
	}

	if(!CuentasXCobrar.Aplicar(Cliente))
		Log(CuentasXCobrar.LastErrorDescrip);
}	

function ClienteSeleccionado()
{
	var Cliente;
	var Frm=null;
		
	Frm=Application.AXForms.AXForm("exCRM");
		
	if (Frm==null) return 0;
	Cliente=Frm.GetAxObject().SelectedClient;
		
	if(Cliente==null){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
	if(Cliente<=0){
		Log("Debe seleccionar un cliente.");
		return 0;
	}
	
	return Cliente;
}

function AbrirCaja(){
  //comprobar que haya una caja abierta
  if (LBEfectivo.objCorte==null) 
		if (!LBEfectivo.ShowdlgCaja()) return 0;
		
  return -1;
}

function Informes(){
	Application.MasInformesYGraficos();
}

function AutoAplicarTodo(){
	CuentasXCobrar.AutoAplicarTodo();
}

function ArchivosAdjuntos()
{
	try
	{
		if(ClienteSeleccionado()<1)
		{
			return -1;
		}
			
		var Nombre;
		var GUID;
		var Frm=null;
			
		Frm=Application.AXForms.AXForm("exCRM");
			
		if (Frm==null) return -1;
		
		Nombre = Frm.GetAxObject().NombreCliente;
		GUID = Frm.GetAxObject().GUIDCliente;
		
		if(Nombre==""||GUID=="")
		{
			Log("Error al obtener datos del cliente");
			return -1;
		}
		DocMagager.BrowseDlg(GUID, Nombre, "Cliente");
	}
	catch(e)
	{
		Log(e.description);
	}
}

function AdmonCRM(){

if(!Application.UIUsers.CheckItem("FX3-CRM-30-100"))  //PERMITIR ACCESO
	return 0;
			
var dlg;

dlg=Application.AXForms.AXForm("exAdmonCRM");
if (dlg==null)
{
	dlg=Application.AXForms.CreateForm("AxAdmonCasos","exAdmonCRM");	
	if (dlg==null){
		eBasic.eMsgbox("Error al cargar control ActiveX.",6);
		return 0;
	}
	dlg.Caption="Administracion de módulo de atención a clientes";	
	dlg.GetAXObject().SetUIAsistentes(MXCAsistentes);
	dlg.GetAXObject().mSetObjects(Application.Adocnn, Application.UIUsers, GetRepository()+"\\UICRM_Aux.js", Application);	
	dlg.CmdRefreshRst = "UICRM.Refresh";
}

dlg.Zorder();
}

function Refresh()
{
	try
	{
		var Frm;
		var Admon;
		Frm=Application.AXForms.AXForm("exAdmonCRM");
		if (Frm==null)
		{
			Log("Error al acceder al control ActiveX");
			return 0;
		}	
		Frm.GetAxObject().mRefresh();
	}
	catch(e)
	{
		Log(e.description);
	}
}