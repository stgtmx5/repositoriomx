//Versión: 1.0.0.0
// By JFrank - 11 Noviembre 09

function Main()
{
	try
	{
		mssqldf();
		load_programs();
		init_application_objects();
	}
	catch(e)
	{
		eBasic.eMsgbox("Ocurrio un error al intentar acceder al script principal main.js");
		throw(e);
	}
	upd_impuesto_x_facturacion_electronica(); //solo para facturacion electronica
	return -1;
}

function mssqldf()
{
	try
	{
		Application.Adocnn.Execute("SET DATEFORMAT ymd");
	}
	catch(e)
	{
		
	}
}


function upd_impuesto_x_facturacion_electronica(){
	try{
		var hk;
		var d="";
		var m="";
		hk=eBasic.eCreateObject("geRuntime.eHKCurUser");
		if(hk==null) return 0;
		m=hk.EGetSetting("Maxicomercio","Config","ejecutar_updimpuesto","1");
		//d=hk.EGetSetting("Deminus","Config","ejecutar_updimpuesto","0");
		if(m=="1"){
			Application.Adocnn.Execute("UPDATE cfgImpuesto SET uf_TipoI1='IEPS',uf_TipoI3='IVA';");
			hk.ESaveSetting("Maxicomercio","Config","ejecutar_updimpuesto","0");
		}
	}catch(e){
	}
}

function load_programs()
{ 
var  R;
	R = Application.Adocnn.Execute("Select uf_Archivo FROM ut_autoload ORDER BY uf_Orden");
	while (!R.EOF)
	{
		if (!Application.LoadScript( R.Fields("uf_Archivo").Value )) return 0;
		R.MoveNext
	}	
	return 0;
}

function init_application_objects()
{
var PathXML;
	Application.MouseHourglass();
	UIDef.CreateShortCuts();
	Application.eDoEvents();
	eBasic.ApplicationName="Maxicomercio 2014";
	//Inicializar Acceso a datos	
	DataAccess.SetConnection(Application.adoCnn);			
	AutoCodigo.SetConnection(Application.adoCnn);		
	MXCAsistentes.InnitInterface(DataAccess, Catalogos,AutoCodigo);
	MXCAsistentes.SeteBasic(eBasic,Application.HelpFilePath);
	HTCambio.SetConnection(Application.adoCnn);
	HTCambio.SetUIUser(Application.UIUsers);
	Configuracion.SetObjects(DataAccess,Application.UIUsers,AutoCodigo,Application.SourceAdmin,MXCAsistentes,Contabilidad,Explorador);	
	Configuracion.SeteBasic(eBasic,Application.HelpFilePath);
	FXConfig.ConfigurarSistema();
	PathXML	 = Configuracion.RutaXML;
	//Inicializar biblioteca de catálogos
	Catalogos.SetDataAccess (DataAccess);
	Catalogos.SetUM (Application.UIUsers);	
	Catalogos.SetFxLands (Paises);		
	Catalogos.SetAutoCode(AutoCodigo);
	Catalogos.SetEWFSourcePath (PathXML);	
	Catalogos.SetUIContabilidad(Contabilidad);	
	Catalogos.Browser.SetOwnerForm(Application.MainForm);
	Catalogos.SeteBasic(eBasic,Application.HelpFilePath);
	Expediente.SetUM (Application.UIUsers);
	Expediente.SetADOCnn(Application.adoCnn);
	Expediente.SeteBasic(eBasic,Application.HelpFilePath);
	DocAccess.ADOcnn =Application.adoCnn;
    Imagenes.SetObjects(DocAccess,Expediente,Application.adoCnn,Application.CurrCnnInfo.AppName,Application.CurrCnnInfo.Name);
	Imagenes.SeteBasic(eBasic,Application.HelpFilePath);
	Catalogos.SetDocManager(Expediente,Imagenes); 
	Catalogos.SetInventario(Inventario);
	LBEfectivo.InitInterface(DataAccess, Catalogos, Application.UIUsers, Promocion, gFunciones);
	LBEfectivo.SeteBasic(eBasic,Application.HelpFilePath);
	CuentasXCobrar.SetObjects(DataAccess,LBCXC,LBEfectivo,Catalogos,Application.UIUsers);
	CuentasXCobrar.SeteBasic(eBasic,Application.HelpFilePath);
	CuentasXPagar.SetObjects (DataAccess, LBCxP, LBEfectivo, Catalogos,Application.UIUsers);
	CuentasXPagar.SeteBasic(eBasic,Application.HelpFilePath);
	Inventario.AppNameReg = "Maxicomercio"; 
	Inventario.SetObjects (DataAccess, LBInventario,Catalogos,Application.UIUsers);
	Inventario.SeteBasic(eBasic,Application.HelpFilePath);
	LBPromocion.SetObjects(DataAccess,Inventario);	
	Promocion.SetObjects(DataAccess,Catalogos,LBPromocion);		
	Promocion.SeteBasic(eBasic,Application.HelpFilePath);
	LBVenta.SetObject(DataAccess, Inventario, LBEfectivo, CuentasXCobrar, Application.UIUsers,LBPromocion);	
	Venta.SetObject (Catalogos, Inventario, CuentasXCobrar, LBEfectivo,LBVenta,Application.UIUsers);
	Venta.SeteBasic(eBasic,Application.HelpFilePath);
	Compra.SetObject (Catalogos, Inventario, CuentasXPagar, LBEfectivo, LBCompra,Application.UIUsers);
	Compra.SeteBasic(eBasic,Application.HelpFilePath);	
	Impuestos.Init (DataAccess);
	Impuestos.SeteBasic(eBasic,Application.HelpFilePath);
	DataAccessConta.SetConnection(Application.adoCnn);
	Contabilidad.SetObjects(DataAccessConta,LBContabilidad,Catalogos);		
	Contabilidad.eBrowse.SetOwnerForm(Application.MainForm);	
	Contabilidad.SeteBasic(eBasic,Application.HelpFilePath);
	vbgeUICFD.SetDataObjects(DataAccess,Catalogos);
	
	/* Objectos de compatibilidad con el punto de venta  */
	try
	{
		var newObj;
		newObj = Application.NewObject("geRunTime.eHKCurUser");
		Application.ScriptEngine().AddObject("NodeVars",newObj);
		newObj  = Application.NewObject("BLSubSys.GlobalVars")
		Application.ScriptEngine().AddObject("AppVars",newObj);
		AppVars.SetClient (Application.ADOCnn);
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al crer objetos en main.js",6);		
	}
	
	try
	{
		var objGasto=eBasic.eCreateObject("UIGastos.cMain");
		objGasto.SetObjects(Catalogos,DataAccess,eBasic,LBCompra,LBCxP);
		Application.ScriptEngine().AddObject("Gasto",objGasto);
		LBEfectivo.SetlCXP(LBCxP);
	}catch(e)
	{
		eBasic.eMsgbox("Error al cargar y asignar objetos en main.js",6);		
	}
	Application.MouseDefault();
	return -1;
}

function get_usergroups(userID)
{
/* Dado UserID Usuario - Cadena de los nombre de los Grupos a pertenece */
// Administradores;Ventas
//Application.UIUsers.CurrentUser.UserID  .Sys_PK
var R;
var sql;
var sGroups;

	sGroups = "";
	sql = "SELECT tuser.UserID, usergroup.GroupID, user_usergroup_.Groups,user_usergroup_.Users FROM (user_usergroup_ Inner JOIN usergroup on user_usergroup_.Groups=usergroup.Sys_PK) Inner Join tuser ON user_usergroup_.Users=tuser.Sys_PK Where tuser.UserID = '" + userID + "';";
	R = Application.ADOCnn.Execute(sql);
	while (!R.EOF)
	{
		if (sGroups=="")
			sGroups =  R.Fields("GroupID").Value;
		else
			sGroups =  sGroups + ";" +  R.Fields("GroupID").Value;
		R.MoveNext();
	}
	R = null;
	return sGroups;
}

function find_cad1_in_cad2(sCad1,sCad2){
/* Buscar  elementos de Cad1 en Cad2 - Devolver verdadero si lo encuentra */
var Arr1;
var Arr2;
	try
	{
		Arr1 = sCad1.split(";");
		Arr2 = sCad2.split(";");
	}
	catch(e)
	{
		eBasic.eMsgbox("Ocurrió un error al intentar encontrar lista de grupos del usuario - Line 44");
	}
	
	for (var i=0;i<Arr1.length;i++)
	{
		for (var j=0;j<Arr2.length;j++)
		{
			if (Arr1[i]==Arr2[j]) return true;
		}
	}
	return false;
}