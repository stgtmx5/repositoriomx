//Versión: 0.9.0.0

function ConfigurarSistema(){

	Application.CmdPanelControl="FXConfig.AbrirPanelControl";
	Application.CmdOnLoad="FXConfig.AlConectar";
	Application.CmdHome="UIMiEmpresa.FrmMiEmpresa";
	Application.CmdFind="FXConfig.Buscar";
	Application.CmdOnDisConnect="FXConfig.AlDesconectar";
	Application.CmdOnCreateBrowser="Eventos.AIBrowser";
	Application.CmdOnCreateAxForm="Eventos.AIAxForm";
	
	Application.DefauldWeb="$AppPath$\\HTML\\Index.htm";
	//Application.CmdRefresh="";
	Application.PrimaryKeyADOType="adInteger";//"adBigInt";		
	Configuracion.RutaXML=eBasic.AddSlashPath(Application.GetPath(0)) + "XMLForms";	
	Configuracion.RutaCOM=Application.AppPath + "\\COM\\";
	Configuracion.MainForm=Application.MainForm;
	Application.OmitirPermisos=false;
	Application.cPermisoIntercambiarDatos="FX1-30-02-000";
	Application.cPermisoExportar="FX1-30-03-000";
	Application.cPermisoEjecutarCommandoSQL="FX1-30-04-000";
    Application.cPermisoSoloConsultas="FX1-30-04-001";
    Application.cPermisoSinRestricciones="FX1-30-04-002";
    Application.cPermisoEjecutarReportes="FX1-30-05-000";
			
	ActualizarConfiguracionSistema();	
	//ESTADO AL QUE CAMBIARA LAS SERIES DE PRODUCTOS QUE SEA DEVUELTO
	//1=DISPONIBLE  //4=DEVUELTO POR CLIENTE	
	//NOTA: No disponible en panel de control.
	LBVenta.EstatusDevolucionSeries=1;	
	EstablecerParametrosGlobales();	
	
	if(Configuracion.eLocalVars.FXCT130){
		HTCambio.SetDivisaPred(DivisaPredeterminada());
		HTCambio.RegTCambio();
	}
	try{
		AboutMC.VersionBaseDatos=Configuracion.eApplicationVars.GetGlobalvar.GetTextVar("DB_SCHEMA_VER","1.0");
	}catch(e){}	
}

function AlConectar(){
	//evento
	try{
		Eventos.EvInicioSesion();
	}catch(e){				
	}
	//fin evento
	Application.eDoEvents();
	UIMiEmpresa.FrmMiEmpresa();
}

function AlDesconectar(){
	//evento
	var Continuar;
	try{
		Continuar=Eventos.EvFinSesion();
	}catch(e){			
		Continuar=true;
	}
	if(!Continuar)
		return false;
	//fin evento
	
	DestruirObjetos();
	return true;
}

function DestruirObjetos(){
	LBEfectivo.Dispose();
	CuentasXCobrar.Dispose();
	CuentasXPagar.Dispose();
	Explorador.Dispose();
	Configuracion.Dispose();
	MXCAsistentes.Dispose();
}

function ActualizarConfiguracionSistema(){
	var AppVars;	
	AppVars=Configuracion.eApplicationVars;

//APLICATION VARS	
	Application.SetEnterpriseName(AppVars.FXCA099);
	AutoCodigo.Requery();
	
//Ejercicio actual
	LBContabilidad.EjercicioActual=AppVars.FXCA076;
//Mascara para el codigo de cuenta
	Catalogos.MasKContabilidad =AppVars.FXCA017;
	Contabilidad.MaskCuenta = AppVars.FXCA017;

//Ciudad Predeterminada en campos de Dirección
	Catalogos.PKCiudadPredeterminada =AppVars.FXCA020;
	
//DivisaPredeterminada
	Catalogos.PKDivisaPredeterminada=AppVars.FXCA013;
	Contabilidad.DivisaPredeterminada=AppVars.FXCA013;
	LBEfectivo.DivisaPredeterminada=AppVars.FXCA013;
	MXCAsistentes.DivisaPredeterminada=AppVars.FXCA013;
//Configuaración de Impuestos predeterminado
	Catalogos.PKImpuestoPredeterminado=AppVars.FXCA090;
//Cambio en cobro con vales
	LBEfectivo.PermiteCambioVales=AppVars.FXCA114;
//Monto minimo para cobros y pagos	
	CuentasXCobrar.MontoMinimo=AppVars.FXCA000;
	LBCXC.MontoMinimo=AppVars.FXCA000;
	CuentasXPagar.MontoMinimo=AppVars.FXCA000;
	LBCxP.MontoMinimo=AppVars.FXCA000;
//Método de cálculo de porcentajes
	CuentasXCobrar.MetodoPorcentaje=AppVars.FXCA021;
	CuentasXPagar.MetodoPorcentaje=AppVars.FXCA021;
	Catalogos.MetodoPorcentaje = AppVars.FXCA021;
	LBPromocion.MetodoPorcentaje=AppVars.FXCA021;
	LBVenta.MetodoPorcentaje=AppVars.FXCA021;
//Categoría predeterminada  de inventario para promociones
	LBPromocion.Categoria_Promocion=AppVars.FXCA091;
	
	//Categoría predeterminada  para ingreso y egreso--(utilizado en traspaso)
	//Ingreso
	LBEfectivo.CatPredIngreso=AppVars.FXCA026;
	LBCompra.CatPredIngreso=AppVars.FXCA026;
	LBVenta.CatPredIngreso=AppVars.FXCA026;
			
	//Egreso
	LBEfectivo.CatPredEgreso=AppVars.FXCA027;
	LBCompra.CatPredEgreso=AppVars.FXCA027;
	LBVenta.CatPredEgreso=AppVars.FXCA027;
	LBVenta.CatPredEgresoDevoluciones=Configuracion.eLocalVars.FXCT115;//AppVars.FXCA027;
	
	LBCompra.Categoria_SysPK=AppVars.FXCA014;	//Categoría de invetario para compras	 
	LBVenta.Categoria_SysPK=AppVars.FXCA015;	//Categoría de inventario para ventas

	try{
		LBEfectivo.CatPredEgresoXTransferencia=Configuracion.ConvertToLong(AppVars.GetGlobalvar.GetNumVar("gvar_CatEgresoTransf", AppVars.FXCA027)); //predeterminada la pred de egresos
		LBEfectivo.CatPredIngresoXTransferencia=Configuracion.ConvertToLong(AppVars.GetGlobalvar.GetNumVar("gvar_CatIngresoTransf", AppVars.FXCA026)); //predeterminada la pred de ingresos
		LBEfectivo.FormaPagoPermitida=Configuracion.ConvertToInteger(AppVars.GetGlobalvar.GetNumVar("gvar_FormaPago", 1));
		LBEfectivo.MontoMaximoPagoEfectivo=AppVars.GetGlobalvar.GetNumVar("gvar_MaxPagoEfectivo", "2320");
	}catch(e){}
	
//Decimales en dinero
	Inventario.DecPreMontos=AppVars.FXCA001;
	LBInventario.DecPreMontos=AppVars.FXCA001;
	CuentasXCobrar.DecPreMontos=AppVars.FXCA001;
	LBCXC.DecPreMontos=AppVars.FXCA001;
	CuentasXPagar.DecPreMontos=AppVars.FXCA001;
	LBCxP.DecPreMontos=AppVars.FXCA001;
	Contabilidad.DecPreMontos=AppVars.FXCA001;
	LBContabilidad.DecPreMontos=AppVars.FXCA001;
	Promocion.DecPreMontos=AppVars.FXCA001;
	LBCompra.DecPreMontos=AppVars.FXCA001;	
	Compra.NoDecimal=AppVars.FXCA001;
	LBVenta.DecPreMontos=AppVars.FXCA001;
	Venta.NoDecimal=AppVars.FXCA001;
	LBEfectivo.DecPreMontos=AppVars.FXCA001;
	MXCAsistentes.DecPrecMontos=AppVars.FXCA001;
	LBPromocion.DecPreMontos=AppVars.FXCA001;
	Catalogos.DecPreMontos=AppVars.FXCA001;
	// AxCompra.FormCompra. DecimalCurrency
	// AxVenta.FormVenta.DecimalCurrency
	
//Decimales en volúmenes	 		
	Inventario.DecPreUnidades=AppVars.FXCA002;
	LBInventario.DecPreUnidades=AppVars.FXCA002;
	CuentasXCobrar.DecPreUnidades=AppVars.FXCA002;
	CuentasXPagar.DecPreUnidades=AppVars.FXCA002;
	Promocion.DecPreUnidades=AppVars.FXCA002;	
	Catalogos.DecPreUnidades=AppVars.FXCA002;
	// AXCompra.FormCompra.DecimalCount
	// AxVenta.FormVenta.DecimalCount

//Formato de dinero	 
	Inventario.FormatoMontos=AppVars.FXCA003;
	CuentasXCobrar.FormatoMontos=AppVars.FXCA003;
	CuentasXPagar.FormatoMontos=AppVars.FXCA003;
	Contabilidad.FormatoMontos=AppVars.FXCA003;
	LBEfectivo.MontosFormat=AppVars.FXCA003;
	Promocion.FormatoMontos=AppVars.FXCA003;	
	Compra.CurrencyFormat=AppVars.FXCA003;	
	Venta.CurrencyFormat=AppVars.FXCA003;
	MXCAsistentes.FormatoMontos=AppVars.FXCA003;
	Catalogos.FormatoMontos=AppVars.FXCA003;
	
	// AxCompra.FormCompra.FormatCurrency
	// AxVenta.FormVenta.FormatCurrency

	//Formato de fechas
	LBEfectivo.DateFormat=AppVars.FXCA004;
	Promocion.FormatoFechas=AppVars.FXCA004;
	Inventario.FormatoFechas=AppVars.FXCA004;
	CuentasXCobrar.FormatoFechas=AppVars.FXCA004;
	CuentasXPagar.FormatoFechas=AppVars.FXCA004;
	Compra.FormatoFechas=AppVars.FXCA004;
	Venta.FormatoFechas=AppVars.FXCA004;
	
	//Formas de cobro adicionales al efectivo
	LBEfectivo.Tarjetas=AppVars.FXCA008;	//Tarjetas de crédito	
	LBEfectivo.Cheques=AppVars.FXCA009;	//Cheques	
	LBEfectivo.Vales=AppVars.FXCA010;	//Vales	
	LBEfectivo.Cupones=AppVars.FXCA011;	//Cupones promocionales	
	LBEfectivo.Monedero=AppVars.FXCA012;	//Monedero electrónico	
	LBEfectivo.Depositos=AppVars.FXCA016;	//Depósitos

	/* 	 
FXCA112	Encabezado ticket	Informacion de tickets
FXCA113	Pie de ticket	Informacion de tickets
*/
	
}

function EstablecerParametrosGlobales(){
	var eP;
	var AppVars;
	AppVars=Configuracion.eApplicationVars;
	Application.XPD.ClearGlobarParameters();
	//Application.XPD.CreateParameter(Name,eType = "adVarChar",Value,DTFormat)
	eP=Application.XPD.CreateParameter("pNombreCom","adVarChar",AppVars.FXCA099);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pNombreFis","adVarChar",AppVars.FXCA100);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pRFC","adVarChar",AppVars.FXCA101);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pDomicilio","adVarChar",AppVars.FXCA102);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pLocalidad","adVarChar",AppVars.FXCA103);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pTelefonos","adVarChar",AppVars.FXCA104);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pFax","adVarChar",AppVars.FXCA105);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pWeb","adVarChar",AppVars.FXCA106);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pRepresentante","adVarChar",AppVars.FXCA107);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pTitulo","adVarChar",AppVars.FXCA108);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pSubTitulo","adVarChar",AppVars.FXCA109);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pSubTitulo2","adVarChar",AppVars.FXCA110);
	Application.XPD.SetGlobalParameter(eP);
	eP=Application.XPD.CreateParameter("pPie","adVarChar",AppVars.FXCA111);
	Application.XPD.SetGlobalParameter(eP);
	}

function FormatoAXCompraVenta(AX){
	var AppVars;
	AppVars=Configuracion.eApplicationVars;
	
	AX.DecimalCount=AppVars.FXCA002;
	AX.DecimalCurrency=AppVars.FXCA001;
	AX.FormatCurrency=AppVars.FXCA003;
	AX.DateFormat=AppVars.FXCA004;
}

function DivisaPredeterminada(){	
	return Configuracion.eApplicationVars.FXCA013;
}
function MtdCalculoP(){
	//Devuelve el metodo de calculo de porcentaje
	return  Configuracion.eApplicationVars.FXCA021;
}

function CConsumoPredeterminado(){
	return Configuracion.eApplicationVars.FXCA022;
}

function DiasInteresesMoratorios(){
	return Configuracion.eApplicationVars.FXCA028;
}
function CaregoriaIngresos(){
	return Configuracion.eApplicationVars.FXCA026;
}
function CaregoriaEgresos(){
	return Configuracion.eApplicationVars.FXCA027;
}

function CategoriaInventarioPromociones(){
	return Configuracion.eApplicationVars.FXCA091;
}
function CategoriaInventarioVentas(){
	return Configuracion.eApplicationVars.FXCA015;
}

function Buscar(){	
var Info;
var PK;
	Info=MXCAsistentes.AsistenteBusqueda();
	PK=MXCAsistentes.DetalleBusqueda(Info,"PK");
	if(PK<1)
		return 0;
	switch(MXCAsistentes.DetalleBusqueda(Info,"Tipo")){
		case 0: //Clientes
			UICxC.ModificarCliente(PK);break;
		case 1: //Proveedores
			UICxP.ModificarProveedor(PK);break;
		case 2: //Contactos
			Catalogos.dlgContacto_BySysPK(PK);break;
		case 3: //Productos
			UIInventario.EditarProducto(PK);break;
		case 4: //Ventas
			UIVentas.EditarVenta(PK);break;
		case 5: //Compras		
			UICompras.EditarCompra(PK);
	}
}

		//Formatos para repotes
//****************************************

function FormatoCotizacion(){	
	return Configuracion.eApplicationVars.FXCA029;
}
function FormatoPedido(){
	return Configuracion.eApplicationVars.FXCA030;
}
function FormatoRemision(){
	return Configuracion.eApplicationVars.FXCA031;
}
function FormatoFactura(){
	return Configuracion.eApplicationVars.FXCA032;
}
function FormatoNotaCredito(){
	return Configuracion.eApplicationVars.FXCA033;
}
function FormatoNotaCreditoCXC(){
	return Configuracion.eApplicationVars.FXCA042;
}
function FormatoNotaCargo(){
	return Configuracion.eApplicationVars.FXCA034;
}
function FormatoRecibo(){
	return Configuracion.eApplicationVars.FXCA035;
}
function FormatoPagare(){
	return Configuracion.eApplicationVars.FXCA036;
}
function FormatoValeDeEntrada(){
	return Configuracion.eApplicationVars.FXCA037;
}
function FormatoValeDeSalida(){
	return Configuracion.eApplicationVars.FXCA038;
}
function FormatoPolizaIngresos(){
	return Configuracion.eApplicationVars.FXCA039;
}
function FormatoPolizaEgresos(){
	return Configuracion.eApplicationVars.FXCA040;
}
function FormatoEnsamble(){
	return Configuracion.eApplicationVars.FXCA082;
}	
function FormatoPolizaDiario(){
	return Configuracion.eApplicationVars.FXCA041;
}
function FormatoCheques(){
	return Configuracion.eApplicationVars.FXCA080;
}
function FormatoPolizaDeCheque(){
	//NOTA: SE BUSCA LA MISMA UBICACIÓN DEL FORMATO DE CHEQUE.	
	return eBasic.AddSlashPath(Configuracion.eApplicationVars.FXCA080)+"Poliza de cheque.xpd";
}

//************** Sys_PK de Cuentas contales conocidas ***********************
function CuentaImpuestosXPagar(){
	return Configuracion.eApplicationVars.FXCA062;
}
function CuentaImpuestosXAcreditar(){
	return Configuracion.eApplicationVars.FXCA063;
}
function CuentaIngresoXVentas(){
	return Configuracion.eApplicationVars.FXCA064;
}
function CuentaCostoVenta(){
	return Configuracion.eApplicationVars.FXCA065;
}
function CuentaDevolucionesSobreVentas(){
	return Configuracion.eApplicationVars.FXCA066;
}
function CuentaDevolucionesSobreCompras(){
	return Configuracion.eApplicationVars.FXCA067;
}
function CuentaBonificacionesSobreVentas(){
	return Configuracion.eApplicationVars.FXCA068;
}
function CuentaBonificacionesSobreCompras(){
	return Configuracion.eApplicationVars.FXCA069;
}
function CuentaInteresesMoratoriosClientes(){
	return Configuracion.eApplicationVars.FXCA070;
}
function CuentaInteresesMoratoriosProveedores(){
	return Configuracion.eApplicationVars.FXCA071;
}
function CuentaInteresesFinancierosClientes(){
	return Configuracion.eApplicationVars.FXCA072;
}
function CuentaInteresesFinancierosProveedores(){
	return Configuracion.eApplicationVars.FXCA073;
}
function CuentaOtrosCargosCXC(){
	return Configuracion.eApplicationVars.FXCA077;
}
function CuentaOtrosCargosCXP(){
	return Configuracion.eApplicationVars.FXCA078;
}


//POLIZAS
function GenerarPolizasAutomaticamente(){
	return Configuracion.eApplicationVars.FXCA074;
}
function AplicarPolizasAutomaticamente(){
	return Configuracion.eApplicationVars.FXCA075;
}

//Formato de montos
function FormatoMonto(){
	return Configuracion.eApplicationVars.FXCA003;
}
function NDecsMonto(){
	return Configuracion.eApplicationVars.FXCA001;
}

//Mascara de cuentas contables
function MascaraCuentas(){
	return Configuracion.eApplicationVars.FXCA017;
}

// VARIABLES DE TERMINAL

function UtilizarImpuestoFrontera(){
	return Configuracion.eLocalVars.FXCT116;
}

function AbrirPanelControl()
{
	/*if(Configuracion.ShowConfigDialog())
		ActualizarConfiguracionSistema();	
	*/
	
	var ButtonMenu;
	var Frm;	
	
	if(!Application.UIUsers.CheckItem("FX1-30-01-000"))  //PERMITIR ACCESO
		return 0;
	
Frm=null;
Frm=Application.AXForms.AXForm("PanelControl");
	if (Frm==null){
		Frm=Application.AXForms.CreateForm("FormButtonMenu","PanelControl");
		Frm.CmdOnEvent="FXConfig.OnClick_Panel";
		if (Frm==null){
			eBasic.eMsgbox("Error al crear ventana de del panel de control.",6);
			return 0;
		}
		
		Application.MouseHourglass();
		Frm.Caption="Panel de control";		
		ButtonMenu=Frm.GetAXObject();			
		ButtonMenu.CreateTitle ("Configuración general");				
		ButtonMenu.CreateButton ("1", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\miempresa.jpg",false));
		ButtonMenu.CreateButton ("2", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\opciones.jpg",false));
		ButtonMenu.CreateButton ("3", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\herramientas.jpg",false));		
		ButtonMenu.CreateButton ("4", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\modulos.jpg",false));
		ButtonMenu.CreateButton ("5", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\cargainicial.jpg",false));
		
		/*
		ButtonMenu.CreateTitle ("Configuración de Comprobantes Fiscales");
		if(gFunciones.CFDActivo() && Configuracion.FECompleta) ButtonMenu.CreateButton ("16", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\asistente.jpg",false));
		//Original if(gFunciones.CFDActivo() && Configuracion.FECompleta) ButtonMenu.CreateButton ("16", "Asistente de configuración",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\Wizard64.bmp",false));
		if(gFunciones.CFDActivo() && Configuracion.FECompleta) ButtonMenu.CreateButton ("13", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\Facturacion electronica.jpg",false));
		//Originalif(gFunciones.CFDActivo()) ButtonMenu.CreateButton ("15", "Facturación con CBB",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\configCBB.bmp",false));
		if(gFunciones.CFDActivo()) ButtonMenu.CreateButton ("15", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\ConfigCBB.jpg",false));
		if(gFunciones.CFDActivo()) ButtonMenu.CreateButton ("14", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\diseñador.jpg",false));
		*/
		
		//start R5
		ButtonMenu.CreateTitle ("Configuración de Comprobantes Fiscales");
		//ButtonMenu.CreateButton ("16", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\asistente.jpg",false));
		ButtonMenu.CreateButton ("13", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\Facturacion electronica.jpg",false));
		//ButtonMenu.CreateButton ("14", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\diseñador.jpg",false));
		//end R5
		
		ButtonMenu.CreateTitle ("Seguridad de la aplicación");
		ButtonMenu.CreateButton ("6", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\user.jpg",false));
		ButtonMenu.CreateButton ("7", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\grupos2.jpg",false));
		ButtonMenu.CreateButton ("8", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\permisos.jpg",false));
		
		ButtonMenu.CreateTitle ("Kit de Desarrollo de Software (SDK)");
		ButtonMenu.CreateButton ("9", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\forms3.jpg",false));
		ButtonMenu.CreateButton ("10", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\programas.jpg",false));
		ButtonMenu.CreateButton ("11", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\reportes.jpg",false));
		ButtonMenu.CreateButton ("12", "",Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+"icons\\consola.jpg",false));
		ButtonMenu.Draw();
		Application.MouseDefault();
		}
		else
			Frm.Zorder();
	
}

function OnClick_Panel(obj)
{
	if(obj==null)
		return 0;
	if (obj.Name == "OnClick") 
	{
	opt=(obj.EventParameters(0).Value);
		switch(opt){
			case "1": ctr_paginainicio();break;			
			case "2": ctr_opciones();break;					
			case "3": ctr_herramientas();break;			
			case "4": ctr_mod_instalados();break;				
			case "5": ctr_cargainicial();break;				
			case "6": ctr_usuarios();break;					
			case "7": ctr_grupos();break;					
			case "8": ctr_permisos_rpt();break;					
			case "9": ctr_formularios();break;					
			case "10": ctr_programas();break;			
			case "11": ctr_reportes();break;				
			case "12": Application.ShowConsole();break;			
			case "13": cfd.getUICFD().ConfiguracionPrincipal();break;			
			case "14": cfd.dsgnTemplate2.newTemplate();break;	
			case "15": cfd.getUICFD().RangoFoliosCBB();break;						
			case "16": cfd.getUICFD().AsistenteConfiguracion();break;
		}
	}
}

function ctr_paginainicio()
{
	var obj=null;
	obj=eBasic.eCreateObject("MCUIDef.cTools");
	if (obj==null)
	{
		eBasic.eMsgbox("No se pudo crear la clase MCUIDef.cTools",6);
		return;
	}
	obj.SetPath (eBasic.AddSlashPath(Application.GetPath(0)));
	obj.SetObjects(DataAccess);
	if (obj.DesignHomePage())
				eBasic.eMsgbox("Los cambios se aplicarán la próxima vez que se conecte.",6);
	obj=null;
}
function ctr_opciones()
{
	var r=false;
	r=Configuracion.ShowConfigDialog();
	if(r)
		Application.MainForm.ApplySkin(true);
}

function ctr_herramientas()
{
	Configuracion.ShowGlobalProcs();
}
function ctr_mod_instalados()
{
	var obj=null;
	obj=eBasic.eCreateObject("MCUIDef.cTools");
	if (obj==null)
	{
		eBasic.eMsgbox("No se pudo crear la clase MCUIDef.cTools");
		return;
	}
	obj.SetPath (eBasic.AddSlashPath(Application.GetPath(0)));
	obj.SetObjects(DataAccess);
	obj.ShowInstalledInfo();
	
	obj=null;
	
}
function ctr_cargainicial()
{

var obj=null;
	obj=eBasic.eCreateObject("MCUIDef.cTools");
	if (obj==null)
	{
		eBasic.eMsgbox("No se pudo crear la clase MCUIDef.cTools");
		return;
	}
	obj.SetPath (eBasic.AddSlashPath(Application.GetPath(0)));
	obj.SetObjects(DataAccess);
	if (obj.EditAutoload())
				eBasic.eMsgbox("Los cambios se aplicarán la próxima vez que se conecte.");
	obj=null;

}
function ctr_usuarios()
{
	Configuracion.UM.EditUsers(Application.MainForm);
}
function ctr_grupos()
{
	Configuracion.OpenBrwGroups();
}

function ctr_permisos_rpt()
{
	Configuracion.AutorizarReporte();
}
function ctr_formularios()
{
	Configuracion.ShowFrmDesing();
}

function ctr_programas()
{
	Configuracion.UIGen.ManageFiles(eBasic.AddSlashPath(Application.GetPath(0)) + "sdk\\templates\\files", "@" + Application.GetPath(0) + "|@" + eBasic.AddSlashPath(Application.GetPath(0)) + "Subprograms|" + eBasic.AddSlashPath(Application.GetPath(0)) + "Tools", "*.js", "" ,Configuracion.GetNothing(),"" ,"Administrar repositorio" ,1 ,"" ,"Notepad.exe" , "*.js.tpl");
}

function ctr_reportes()
{
	Configuracion.UIGen.ManageFiles(eBasic.AddSlashPath(Application.GetPath(0)) + "sdk\\templates\\files", eBasic.AddSlashPath(Application.GetPath(0)) + "Reports", "*.xpd", "" ,Configuracion.GetNothing(),"" ,"Administrar reportes" ,1 ,"" ,"Notepad.exe" , "*.xpd.tpl");
}