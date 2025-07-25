/*
Informaci?n de versi?n
============================
	Versi?n: 2.0.2
	Julio ..., 2010 
	COMPATIBILIDAD CON FACTURACION ELECTRONICA

Objetos disponibles en el  script
============================
	AppVars .- Tiene acceso a las variables globales del sistema
	NodeVar.- Acceso a variables locales del sistema
	ThisCnn .- Acceso a Conexion
	Impresora .- Acceso a Impresora
	eBasic- Referencia a objeto de funciones para prop?sito general
	MainForm-Referencia a la ventana principal
	Objetos del Backoffice soportados: ....
	
Sub-programas asociados
============================
	prn_arqueo.js   = Contiene el c?digo para imprimir el arqueo y corte de caja
	prn_ticket.js   = Realiza la impresi?n del comprobante de venta
	prn_vales.js    = Imprime los recibos y vales
	pos_usercmds.js = Contiene los comandos definidos por el usuario
	pos_events.js   = Contiene los manejadores para los eventos del punto de ventas
*/

mssqldf1();
var RegAppName = "Maxicomercio";

//Componente Net de Timbrado 3.3
var NetCfdi33 = null;

//Interfaz b?scula
var ultimo_peso = "";	//Variable de control, NO MODIFICAR

var bascula_params = "P COM4";	//Par?metros de l?nea de comando para leer el puerto
var habilitar_bascula_aut = false;	//true=habilita la lectura autom?tica
var bascula_intervalo = 1000;		//Tiempo de sondeo de la b?scula (Milisegundos)

function evAlIniciar() {
	loadScript("modulo_recargas","(Subprograma de recargas)");
	//	loadScript("modulo_guarderia", "(Subprograma de guarderia de equipaje)");

	//Ejemplo de inicializaci?n de control ActiveX acoplado
	//if (!MainForm.CreateAX("HPOSExample.Simulador", "NombreCualquiera", "", "")) eBasic.eMsgbox("Error al crear ActiveX");

	//JV versi?n 2014
	//loadScript("dkl_sendmail","(Subprograma Env?o de ticket por correo)");
	loadScript("UIRequisiciones", "(Subprograma Funciones de configuraci?n de requisiones)");
	loadScript("pos_requisiciones", "(Subprograma Funciones de browser de requisiciones)");
	//UIRequisiciones.createObjects();
	loadScript("pos_events", "(Subprograma manejador de eventos)");
	loadScript("pos_support", "(Subprograma Funciones de Soporte)");
	loadScript("mov_inventario", "(Subprograma Funciones de movimientos de inventario)");
	//loadScript("config_email_arqueo", "(Subprograma para editar las configuraciones del env?o de correo)");
	//loadScript("documentos_flujo","(Subprograma de conexi?n)");
	//loadScript("Requisicion","(Subprograma Funciones de Soporte)");
	//loadScript("tiempo","(Subprograma De Configuracion de Alertas de Productos debajo del minimo)");
	loadScript("saldoCaja", "(Subprograma funciones al cerrar el corte)");

/*
	if (habilitar_bascula_aut) {
		MainForm.customTimer.Interval = bascula_intervalo;
		MainForm.customTimer.Enabled = true;
	}
*/
	try {
		if (LBEfectivo.CurrentPKMovCajaXFondoInicial > 0) {
			Ingreso(LBEfectivo.CurrentPKMovCajaXFondoInicial);
			LBEfectivo.CurrentPKMovCajaXFondoInicial = 0;
		}
		//UIRequisiciones.createObjects();
		//pos_guarderias.configurar();
	} catch (e) {
		//eBasic.eMsgbox("No fue posible imprimir el vale de ingreso de efectivo.");		
		//eBasic.eMsgbox(e.description);		
	}

	/*if(MainForm.CreateAX("lstAutoProductos.ctrAuto", "ctrAuto", "", ""))
		{
			var tiempo = parseInt(NodeVars.EGetSetting("Maxicomercio","Config","tiempoProdMinimos","3600" ));
			
			time=MainForm.getAX("ctrAuto");                                              
			if(time!=null)
			{			
				time.AXControl.Object.setTimerPDM(UIRequisiciones.uiDocFlujo,MainForm.CorteActual().ICaja.CentroConsumo.IAlmacen.Sys_PK,tiempo);
			}
		}*/

	AddPosCommand();

	//if(gFunciones.CFDActivo()){
	loadScript("cfd", "(Subprograma funciones para generac?n de Comprobantes Fiscales Digitales)");

	cfd.ApplicationName = "Maxicomercio";
	cfd.OnBackOffice = false;
	cfd.IniciarScript();
	//}
}

function evAntesProducto(PKProducto, CodigoProducto, Cantidad) {
	//Se ejecuta antes de que un producto se agregue o se modifique su cantidad con los comandos ++,+X y *X en la venta actual
	//Si la funci?n retorna 1 el producto no se agregar? o modificar?
	return pos_events.evAntesProducto(PKProducto, CodigoProducto, Cantidad);
}

function evAntesQuitarProducto(PKProducto) {
	//Se ejecuta antes de quitarse un producto
	//Si la funci?n retorna 1 el producto no se quitar?
	return pos_events.evAntesQuitarProducto(PKProducto);
}

function evAlAgregarProducto(PKProducto, CodigoProducto, Cantidad) {
	//Se ejecuta cuando el producto se ha agregado por primera vez
	pos_events.evAlAgregarProducto(PKProducto, CodigoProducto, Cantidad);
}

function evAntesProcesarVenta(PKVenta) {
	//Si la funci?n devuelve 1 la venta no se procesar?
	return pos_events.evAntesProcesarVenta(PKVenta);
}

function evAlGuardarCotizacion(PKVenta) {
	//Se ejecuta al guardarse una cotizaci?n
	pos_events.evAlGuardarCotizacion(PKVenta)
}

function evAlProcesarVenta(PKVenta) {
	//Se ejecuta cuando la venta ha sido procesada (contado, cr?dito o facturada)
	//Application.Eval("pos_events.evAlProcesarVenta(");

	//pos_events.eVAlProcesarVenta(PKVenta); //ERROR EL EVENTO ES CON v MINUSCULA: Modificado:GabrielJG

	pos_events.evAlProcesarVenta(PKVenta);
}

function evAlCrearVenta(PKVenta) {
	//Se ejecuta cuando se crea una venta
	pos_events.evAlCrearVenta(PKVenta);
}

function evAlSeleccionarVenta(PKVenta) {
	//Se ejecuta cuando se selecciona una venta que estaba retenida
	pos_events.evAlSeleccionarVenta(PKVenta);
}

function evAXInput(NomControl, IDEvento, Valor) {
	//Responde al mensaje enviado por un control ActiveX acoplado
	//eBasic.eMsgbox("Control:"+NomControl+"\rEvento:"+IDEvento+"\rValor:"+Valor);
	pos_events.evAXInput(NomControl, IDEvento, Valor);
}

function evComandoDeUsuario(sCMD) {
	/*Funci?n obsoleta pero todav?a operativa
		//Se ejecuta al introducir un comando de usuario, su ejecuci?n es posterior a los comandos definidos en AddUserCommands
	
		eBasic.eMsgbox(sCMD);
	*/
}

function Ticket(SysTicket, Referencia, Cambio, Efectivo, Cheque, Tarjeta, Vale, Deposito, Credito, IsReprint) {
	if (loadScript("prn_ticket", "El sub-programa para imprimir el ticket no pudo cargarse"))
		prn_ticket.ticket(SysTicket, Referencia, Cambio, Efectivo, Cheque, Tarjeta, Vale, Deposito, Credito, IsReprint);

	return 0;
}

function Arqueo(PKCorte) {

	if (loadScript("prn_arqueo", "El sub-programa para imprimir arqueo/corte no pudo cargarse"))
		prn_arqueo.arqueo(PKCorte);

	return 0;
}

function Egreso(PKMovCaja) {
	var ErrDesc = "Error al imprimir vale de egreso";

	if (PKMovCaja == null) {
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)");
		return 0;
	}

	if (loadScript("prn_vale", "El sub-programa para imprimir vales  pudo cargarse"))

		return prn_vale.ImprimirVale(PKMovCaja, "EGRESO", ErrDesc);
}

function Ingreso(PKMovCaja) {
	var ErrDesc = "Error al imprimir vale de ingreso";

	if (PKMovCaja == null) {
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)");
		return 0;
	}

	if (loadScript("prn_vale", "El sub-programa para imprimir vales  pudo cargarse"))
		return prn_vale.ImprimirVale(PKMovCaja, "INGRESO", ErrDesc);
}

function ReciboProveedor(PKDCxP) {
	return pos_support.ReciboProveedor(PKDCxP);
}

function ReciboCliente(PKDCxC) {
	pos_support.ReciboCliente(PKDCxC);
}

// *************************************
function AddPosCommand() {
	try {

		//*****************************************************Comandos del sistema

		//Leyenda al pie cuando est? oculta la barra de funciones
		Application.MainForm.SetBottomText("F6 - Cobro de contado | F7- Venta a cr?dito | F8 - Facturar | F9 - Cancelaciones y devoluciones ** MaxiComercio (R) POS www.maxicomercio.com **");

		//Comandos m?s utilizados
		Application.MainForm.AddSysCommand("F6", "Venta de contado (Cobrar)", "Despliega la ventana de cobro para cerrar la transacci?n actual", true, 0xC000);
		Application.MainForm.AddSysCommand("F7", "Venta a crédito", "Cierra la venta a cr?dito siempre que no exceda el l?mite definido al cliente");
		Application.MainForm.AddSysCommand("F8", "Facturar la venta actual", "Genera una factura a partir de la venta actual, puede agregar un cliente o elegir alguno de los disponibles en la base de datos");
		Application.MainForm.AddSysCommand("F9", "Cancelación o devolución", "Permite efectuar una cancelaci?n o devoluci?n parcial o total");

		//Comandos del usuario
		AddUserCommands();

		//Todos los dem?s comandos disponibles
		Application.MainForm.AddSysCommand("F1", "Ayuda", "Muestra la ayuda en pantalla del programa");
		Application.MainForm.AddSysCommand("F11", "Cotizar", "Cambia al modo de cotizaci?n o guarda la cotizaci?n actual y regresa a la venta retenida");
		Application.MainForm.AddSysCommand("F12", "Consultar existencias", "Muestra las existencias en todos los almacenes del producto seleccionado");
		Application.MainForm.AddSysCommand("+C", "Indicar cliente/vendedor/repartidor", "Muestra la ventana para indicar el cliente, el vendedor y el repartidor");
		Application.MainForm.AddSysCommand("++", "Incrementar cantidad", "Incrementa en una unidad la cantidad del producto seleccionado");
		Application.MainForm.AddSysCommand("-+", "Disminur cantidad", "Disminuye en una unidad la cantidad del producto seleccionado");
		Application.MainForm.AddSysCommand("--", "Quitar producto", "Elimina el producto seleccionado de la venta actual");
		Application.MainForm.AddSysCommand("+02", "(F2) Cambiar ticket", "Permite liberar la venta (o cotizaci?n) actual y seleccionar alguna otra abierta (retenida)");
		Application.MainForm.AddSysCommand("+03", "(F3) Liberar ticket", "Libera la venta actual sin crear un nuevo ticket");
		Application.MainForm.AddSysCommand("+04", "(Alt + I) Imprimir ticket", "Imprime la venta actual");
		Application.MainForm.AddSysCommand("Alt D", "Efectuar descuento", "Permite aplicar un % de descuento a toda la venta");
		Application.MainForm.AddSysCommand("Alt S", "Consular saldo de cliente", "Muestra el saldo por cobrar de un cliente");
		Application.MainForm.AddSysCommand("Alt N", "Nuevo ticket", "Crea una nueva venta y libera la actual sin cerrarla (retenida)");
		Application.MainForm.AddSysCommand("Alt P", "Leer peso desde b?scula", "Consulta el peso en la b?scula conectada al puerto serie");
		Application.MainForm.AddSysCommand("Alt 0", "Abrir caj?n de dinero", "Abre el caj?n de dinero conectado");
		Application.MainForm.AddSysCommand("Alt 1", "Recepci?n de abono", "Permite cobrar un abono de cliente");
		Application.MainForm.AddSysCommand("Alt 2", "Pagar", "Permite registrar el pago a un proveedor");
		Application.MainForm.AddSysCommand("Alt 3", "Otros Ingresos", "Permite registrar una entrada de valores");
		Application.MainForm.AddSysCommand("Alt 4", "Retiros", "Permite registrar una salida de valores");
		Application.MainForm.AddSysCommand("Alt 5", "Arqueo", "Imprime el arqueo de caja");
		Application.MainForm.AddSysCommand("Alt 6", "Corte (cierre) de caja", "Cierra el corte y libera la caja");
		Application.MainForm.AddSysCommand("Alt 7", "Configurar", "Permite configurar el punto de venta");
		Application.MainForm.AddSysCommand("Shift F2", "Calculadora", "Despliega la calculadora del sistema");
		Application.MainForm.AddSysCommand("Shift F12", "Cambiar precio", "Cambia el precio del producto seleccionado");
		Application.MainForm.AddSysCommand("..", "(F10) Lista de funciones del punto de venta", "Muestra la lista de funciones del punto de venta");
		Application.MainForm.AddSysCommand("+SALIR", "(Alt+F4) Salir", "Termina la ejecuci?n del software punto de venta");
		//****************************************************************************************************

	} catch (e) {
		eBasic.eMsgbox("Error al cargar comandos del sistema.");
		return 0;
	}

}

function AddUserCommands() {

	//Comandos definidos por el usuario

	if (loadScript("pos_usercmds", "( script de la definici?n de comandos del usuario)"))
		pos_usercmds.main();
}

/* Funciones de Soporte */
function ModuleLoaded(OName) {
	var col;

	col = Application.MainForm.Engine.Modules;

	for (var i = 1; i <= col.Count; i++) {
		//eBasic.eMsgbox("mod: "+col.Item(i).Name);
		if (col.Item(i).Name == "mdl" + OName) return true;
	}

	return false;
}

function loadScript(sName, Err) {

	try {
		if (!ModuleLoaded(sName)) {
			if (!Application.LoadScript(sName + ".js")) {
				eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
				return false;
			}
		}
	} catch (e) {
		eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
		return false;
	}
	return true;

}

function mssqldf1() {
	try {

		//Application.Adocnn.Execute("SET DATEFORMAT ymd");
		var esFactura = ExecuteSQL("SET DATEFORMAT ymd");

	}
	catch (e) {

	}
}

function generarCFD(PKVenta) {
	/*
var pkcfd=0;
var r;
	if(!gFunciones.CFDActivo()) return 0;
	
	if(!cfd.esFactura(PKVenta)) return 0;
	
	//cfd.despuesGuardarVenta(PKVenta,"La Factura se guard? correctamente.?Desea crear el Comprobante Fiscal Digital?");
	pkcfd=cfd.despuesGuardarVenta(PKVenta,""); //Si no es autom?tico no crear? el cfd, si se envia el par?metro 2 pregutar? al usuario.
	if(pkcfd<1){
		eBasic.eMsgbox("Error, no se pudo crear el cfdi. Intente desde el BackOffice.",6);
	}
	*/

	try {
		if (PKVenta == undefined || PKVenta == null) return;
		Application.MouseHourglass();

		var esFactura = ExecuteSQL("SELECT Documento FROM Venta WHERE Sys_PK=" + PKVenta);
		if (esFactura == null) {
			Application.MouseDefault();
			return;
		}
		if (esFactura.Fields("Documento").Value != 4) {
			Application.MouseDefault();
			return;
		}

		if (NetCfdi33 == null)
			NetCfdi33 = eBasic.eCreateObject("induxsoft.genCFDI.GenCFDI");

		NetCfdi33.AplicationName = Application.AppName;
		NetCfdi33.CnnQName = Application.GetQName();
		NetCfdi33.PathXsltCadOriCfdi = "cadenaoriginal.xslt";

		NetCfdi33.GetDoctoVenta(PKVenta);
		Application.MouseDefault();

		if (NetCfdi33.GetIsError())
			throw new Error(NetCfdi33.GetMsgLastError());
		else {
			Application.MouseHourglass();
			var FolioSAT = NetCfdi33.FolioSAT;
			var cmdData = ExecuteSQL("select coalesce(uf_rfc_emisor,'-') as RFCEmisor from ut_cfd where uf_FolioSAT='" + FolioSAT + "';");
			if (cmdData == null) throw new Error("El recurso solicitado no existe.");
			var Rfc = cmdData("RFCEmisor");
			NetCfdi33.DownloadCfdi(FolioSAT, Rfc, false);
			if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
			Application.MouseDefault();
			NetCfdi33.PrintCFDIs(FolioSAT);
			if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
		}

	} catch (e) {
		Application.MouseDefault();
		eBasic.eMsgbox(e.message);
	}
}

function ExecuteSQL(cmdSQL) {
	var r = null;
	try {
		r = Application.ADOCnn.Execute(cmdSQL);
		if (!(r.EOF && r.BOF)) return r;
		r = null;
	}
	catch (e) {
		return null;
	}
}

function Factura(PKFactura) {
	//ESTA FUNCION ES LLAMADA SOLO SI EL CFD esta desactivado

	//function sustituida por metodos dentro de cfd.js
	//que imprimen la factura si asi fue indicado
	//dic2010 gb


	if (!Impresora.PrintReport(AppVars.GetTextVar("FXCA032", ""), PKFactura)) {
		eBasic.eMsgBox("Error al imprimir factura.");
	}
	return -1;
}

function evInicioSesion(Usuario, PKCaja, PKCajero) {

	//Al iniciar sesion

//	var sql;
//	try {
		/*sql = "DELETE FROM ut_cnn_tuser WHERE CnnID = @@SPID AND Host=HOST_NAME()";
		Application.ADOCnn.Execute(sql);
		sql = "INSERT INTO ut_cnn_tuser (Sys_DTCreated, Sys_GUID, CnnID, Host, IUser) VALUES (GETDATE(), REPLACE(NEWID(),'-',''), @@SPID, HOST_NAME(),"+ Application.UIUsers.CurrentUser.Sys_PK+")";
		Application.ADOCnn.Execute(sql);*/
//	} catch (e) {

//	}
}

//nuevos eventos abril-2011
function evAlRecuperarVenta(PKVenta) {
	//Antes de cobrar, Al guardar venta
	return pos_events.evAlRecuperarVenta(PKVenta);
}

function evAlCancelarTicketTotal(PKVenta) {
	//se ejecuta despues de cancelar un ticket totalmente en un solo paso.
	//no tiene que devolver ning?n valor
	pos_events.evAlCancelarTicketTotal(PKVenta);
}

function evAlCancelarTicketParcial(PKVenta, PKNCredito) {
	//se ejecuta al hacer devoluciones parciales del ticket a traves de una nota de cr?dito
	//no tiene que devolver ning?n valor
	pos_events.evAlCancelarTicketParcial(PKVenta, PKNCredito);
}

function evAlLiberarTicket(PKVenta) {
	//se ejecuta al liberar una venta
	//no tiene que devolver ning?n valor
	pos_events.evAlLiberarTicket(PKVenta);
}

function evAlRealizarCorte(PKCorte) {

	var R;
	var sql;
	var caja;
	sql = "Select Icaja As PKCaja From Corte Where Sys_PK=" + PKCorte;
	R = ThisCnn.execute(sql);
	//eBasic.eMsgbox("Ingresando al cierre de caja " + PKCorte);
	if (R == null) {

		return 0;
	}
	if (R.EOF && R.BOF) {
		eBasic.eMsgbox("No se encontró Nada que cancelar");
		return saldoCaja.corteCajaTerminal();
	}
	caja = R("PKCaja").Value;
//	sql = "Update venta set statusAdministrativo=99 where statusfinanciero=0 AND Formapago=0 AND Subtotal=0 AND statusAdministrativo=1 AND Icorte is null AND ICaja=" + caja;
	sql= "Update venta set statusAdministrativo=99 where statusfinanciero=0 AND Formapago=0 AND Subtotal=0 AND statusAdministrativo=1 AND Icorte = "+PKCorte+" AND ICaja="+caja;
	Application.ADOCnn.Execute(sql);



	return saldoCaja.corteCajaTerminal();
	//evento antes de realizar corte
	//retornar -2 para cancelar el corte de caja
	//eBasic.eMsgbox(PKCorte);
}

function evCustomTimer() {
	//eBasic.eMsgBox("ok");
	Application.MainForm.ClearConsole();
	var command = "readcom.exe " + bascula_params;
	Application.MainForm.ExecInConsole(command);
	var response = Application.MainForm.txtConsole.Text;

	response = response.replace(command, "");

	var ultMayorQue = response.lastIndexOf(">");
	var firstAdmiracion = response.indexOf("!");
	
	response = response.substr(ultMayorQue + 1, firstAdmiracion - ultMayorQue - 1);
	if (ultimo_peso != response) {
		//Actualizar cantidad
		//lksdlksdfkls aqui poner el codigo
		Application.MainForm.SetCantidad(response);
		ultimo_peso = response;
		Application.MainForm.BlockCountAutBas();
	}

	//eBasic.eMsgBox(response);
	//return response;*/
}