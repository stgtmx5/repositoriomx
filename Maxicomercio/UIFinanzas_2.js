//Versión: 0.9.0.2
//Déminus

var CmdSQLQPolizas = "SELECT * FROM qryPoliza;";
var CmdSQLQDepartamentos = "SELECT Sys_PK,Codigo,Descripcion FROM CDepartamento ORDER BY Codigo;";
var CmdSQLQRubros = "SELECT Sys_PK,Codigo,Descripcion FROM CRubro ORDER BY Codigo;";
var CmdSQLQConceptosPoliza = "SELECT Sys_PK,Codigo,Descripcion FROM CConcepto ORDER BY Codigo;";


//var CmdSQLQCuentasCheques="SELECT * FROM qryCatChequera;";

var CmdSQLQCuentasCheques = "Select qryCatChequera.Sys_PK,qryCatChequera.CodCuenta,qryCatChequera.NumCuenta,qryCatChequera.Nombre,qryCatChequera.Divisa,qryCatChequera.Banco,qryCatChequera.CLABE,qryCatChequera.Notas,Sum(MovCuenta.Ingreso-MovCuenta.Egreso) as Saldo FROM qryCatChequera Left Join MovCuenta ON MovCuenta.ICuenta=qryCatChequera.Sys_PK  Group BY qryCatChequera.Sys_PK,qryCatChequera.CodCuenta,qryCatChequera.NumCuenta,qryCatChequera.Nombre,qryCatChequera.Divisa,qryCatChequera.Banco,qryCatChequera.CLABE,qryCatChequera.Notas;";

//var cmdSQLMovCuentasCheques="SELECT * FROM qryMovCuentasCheques WHERE ICuenta=@PKChequera AND Mes=@Mes AND Anio=@Anio;";
//var cmdSQLMovCuentasChequesTodos="SELECT * FROM qryMovCuentasCheques WHERE ICuenta=@PKChequera AND Anio=@Anio;";

var cmdSQLMovCuentasCheques="SELECT qryMovCuentasCheques.*,MovCuenta.uf_Color FROM (qryMovCuentasCheques INNER JOIN MovCuenta ON qryMovCuentasCheques.Sys_PK=MovCuenta.Sys_PK) WHERE qryMovCuentasCheques.ICuenta=@PKChequera AND qryMovCuentasCheques.MesAplicacion=@Mes AND qryMovCuentasCheques.AnioAplicacion=@Anio;";
var cmdSQLMovCuentasChequesTodos="SELECT qryMovCuentasCheques.*,MovCuenta.uf_Color FROM (qryMovCuentasCheques INNER JOIN MovCuenta ON qryMovCuentasCheques.Sys_PK=MovCuenta.Sys_PK) WHERE qryMovCuentasCheques.ICuenta=@PKChequera AND qryMovCuentasCheques.AnioAplicacion=@Anio;";
var cmdSQLQCatalogoCajas="SELECT * FROM qryCatCajas;";
var cmdSQLCortes="SELECT * FROM qryCortes ORDER BY Sys_PK";
var cmdSQLCortesXCaja="SELECT * FROM qryCortes WHERE ICaja=@PKCaja ORDER BY Sys_PK";

var cmdSQLDetalleCortes="SELECT * FROM qryDetalleCorte WHERE ICorte=@PKCorte UNION ALL SELECT MovCaja.Sys_PK AS Folio, MovCaja.Fecha AS Fecha, MovCaja.Hora AS Hora, MovCaja.Referencia AS Referencia, Categoria.Descripcion AS Categoria, cDocumentos.Const AS Documento, MovCaja.Efectivo AS Efectivo, MovCaja.Cheques AS Cheques, MovCaja.Tarjetas AS Tarjetas, MovCaja.Vales AS Vales, MovCaja.Depositos AS Depositos, Divisa.Descripcion AS Divisa, (MovCaja.Efectivo+MovCaja.Cheques+MovCaja.Tarjetas+MovCaja.Vales+MovCaja.Depositos) AS Total, MovCaja.Notas, MovCaja.ICorte, Corte.ICaja FROM Divisa INNER JOIN ((Venta INNER JOIN (ut_RelVta_Boleto INNER JOIN Corte ON ut_RelVta_Boleto.ICorte = Corte.Sys_PK) ON Venta.Sys_PK = ut_RelVta_Boleto.IVenta) INNER JOIN (Categoria INNER JOIN (cDocumentos INNER JOIN MovCaja ON cDocumentos.ID = MovCaja.Documento) ON Categoria.Sys_PK = MovCaja.ICategoria) ON MovCaja.Referencia LIKE Venta.Referencia OR MovCaja.Referencia LIKE ('RET_' + Venta.Referencia)) ON Divisa.Sys_PK = MovCaja.IDivisa WHERE Corte.Sys_PK = @PKCorte;";

var cmdSQLDetalleMov="Select sum(total) as tot from qryDetalleCorte where ICorte=@PKCorte";

var NPolizas=0; //Cuenta el numero de polizas que se crean para asignarle un nuevo nombre a cada poliza y asi poder crear mas de una.

function CrearPanel(){
	Application.UIShortCuts.CreatePane("P_Fin","Contabilidad y finanzas","","","ICON_FINANZAS","",0);
	
	Application.UIShortCuts.Pane("P_Fin").CreateGroup(2,"P_Fin_G01","Contabilidad","","",0);	
	Application.UIShortCuts.Pane("P_Fin").CreateGroup(1,"P_Fin_G02","Cuentas de cheques","","",0);	
	Application.UIShortCuts.Pane("P_Fin").CreateGroup(2,"P_Fin_G02_1","Operaciones con cuentas de cheques","","",0);	
	Application.UIShortCuts.Pane("P_Fin").CreateGroup(2,"P_Fin_G03","Cajas de efectivo","","",0);	
	
	Application.UIShortCuts.CreateAction("P_Fin_A01","Cuentas contables",0,"","","","UIFinanzas.qCuentas",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_A02","Catálogos relacionados",0,"","","","UIFinanzas.CatalogosRelacionados",0,"","","",0);		
	
	Application.UIShortCuts.CreateAction("P_Fin_A03","Pólizas",0,"","","","UIFinanzas.QPoliza",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_A04","Guardar y Aplicar póliza",0,"","","","UIFinanzas.GuardarAplicar",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_A05","Aplicar póliza",0,"","","","UIFinanzas.AplicarPoliza",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_A06","Desaplicar póliza",0,"","","","UIFinanzas.DesaplicarPoliza",0,"","","",0);	
	
	Application.UIShortCuts.CreateAction("P_Fin_A07","Departamentos",0,"","","","UIFinanzas.QDepartamento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_A08","Rubros",0,"","","","UIFinanzas.QRubro",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_A09","Agregar cuenta",0,"","","","UIFinanzas.AgregarCuenta",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Fin_A10","Nueva póliza",0,"","","","UIFinanzas.NuevaPoliza",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Fin_A12","Conceptos de póliza",0,"","","","UIFinanzas.QConcepto",0,"","","",0);
	
	//by jFrank 08/Sept/09 ->Uso de Plantilas 
	//****************************************************************
	
	Application.UIShortCuts.CreateAction("P_Fin_A13","Guardar como Borrador",0,"","","","UIFinanzas.GuardarBorrador",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_A14","Guardar como plantilla",0,"","","","UIFinanzas.GuardarPlantilla",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_A15","Usar plantilla",0,"","","","UIFinanzas.UsarPlantilla",0,"","","",0);	
	//****************************************************************
	
	Application.UIShortCuts.CreateAction("P_Fin_A16","Auditar póliza",0,"","","","UIFinanzas.AuditarPoliza",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_A17","Modificar póliza",0,"","","","UIFinanzas.ModificarPoliza",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_A18","Eliminar póliza",0,"","","","UIFinanzas.EliminarPoliza",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_A19","Cerrar póliza",0,"","","","UIFinanzas.CerrarPoliza",0,"","","",0);	
	
	//Sin funciones
	Application.UIShortCuts.CreateAction("P_Fin_B02","Administrar cuentas de cheques",0,"","","","UIFinanzas.QAdminCuentasCheques",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B01","Consultar cuenta",0,"","","","UIFinanzas.QCuentaCheques",1,"","UIFinanzas.LLenarCmbCuentasCheques","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B03","Registrar pago",0,"","","","UIFinanzas.RegistrarCheque",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B04","Registrar depósito",0,"","","","UIFinanzas.RegistrarDeposito",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B05","Retiro por ajuste",0,"","","","UIFinanzas.Retiro",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B06","Transferencia entre cuentas",0,"","","","UIFinanzas.TransferenciaCuentas",0,"","","",0);	
	//Application.UIShortCuts.CreateAction("P_Fin_B07","Más opciones",0,"","","","UIFinanzas.MasOpciones",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Fin_B08","Cancelar movimiento de cuenta",0,"","","","UIFinanzas.CancelarMovCuenta",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B09","Movimientos de cuenta",0,"","","","UIFinanzas.DetallesMovCuenta",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B10","Conciliar movimiento de cuenta",0,"","","","UIFinanzas.ConciliarMovCuenta",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_B30","Saldo Total",0,"","","","UIFinanzas.SaldoTotalCuentas",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Fin_C01","Abrir sesión de caja",0,"","","","UIFinanzas.AbrirSesionCaja",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_C02","Consultar sesiones de caja",0,"","","","UIFinanzas.ConsultarSesionesCaja",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_C03","Agregar caja",0,"","","","UIFinanzas.AgregarCaja",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_C04","Cierre de caja",0,"","","","UIFinanzas.CierreCaja",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_C05","Cancelar sesión de caja",0,"","","","UIFinanzas.AbandonarSesionCaja",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_C06","Ver detalles de corte",0,"","","","UIFinanzas.DetalleCorte",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Fin_DC01","Ver detalles de corte",0,"","","","UIFinanzas.VerDetalleDocumento",0,"","","",0);
	
	
	
	Application.UIShortCuts.CreateAction("P_Fin_C07","Ingreso",0,"","","","UIFinanzas.IngresoCaja",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_C08","Egreso",0,"","","","UIFinanzas.EgresoCaja",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Fin_D01","Agregar chequera",0,"","","","UIFinanzas.AgregarChequera",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_D02","Modificar chequera",0,"","","","UIFinanzas.ModificarChequera",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Fin_D03","Eliminar chequera",0,"","","","UIFinanzas.EliminarChequera",0,"","","",0);
	
	
	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G01").AddItem("P_Fin_A01");		
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G01").AddItem("P_Fin_A03");
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G01").AddItem("P_Fin_A10");
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G01").AddItem("P_Fin_A02");		
	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02").AddItem("P_Fin_B01");
	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02_1").AddItem("P_Fin_B02");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02_1").AddItem("P_Fin_B03");		
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02_1").AddItem("P_Fin_B04");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02_1").AddItem("P_Fin_B05");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02_1").AddItem("P_Fin_B06");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02_1").AddItem("P_Fin_B07");
	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G03").AddItem("P_Fin_C01");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G03").AddItem("P_Fin_C02");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G03").AddItem("P_Fin_C03");	
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G03").AddItem("P_Fin_C07");
	Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G03").AddItem("P_Fin_C08");	
	
	//MostrarCuentasCheque();
}


// function MostrarCuentasCheque(){
	// var R;	
	// R=Application.Database.OpenRecordset("SELECT Sys_PK,Nombre FROM qryCatChequera;");
	// if (R==null) return;
	// while(!R.EOF){
		
		// id="P_Fin_CH"+R.AbsolutePosition;
		// name=R("Nombre").Value;
		// eBasic.eMsgbox("entré" + id +name);
		// if (Application.UIShortCuts.CreateAction(id,name,0,"","","","UIFinanzas.VerCuenta",0,"","","Haga click aquí",0)==null);		
			// eBasic.eMsgbox("null");
		// Application.UIShortCuts.Pane("P_Fin").Group("P_Fin_G02").AddChild("Root",id);
		// R.Movenext;
	// }		
	
// }

// function VerCuenta(A){

// }


function CatalogosRelacionados(){
	var ask;
	ask=Application.NewAsk();
	ask.SetOption(10,"Catálogo de departamentos","Seleccione ésta opción si desea explorar el catálogo de departamentos, agregar, modificar o eliminar un departamento.");
	ask.SetOption(20,"Catálogo de rubros","Seleccione ésta opción si desea explorar el catálogo de rubros, agregar, modificar o eliminar un rubro.");
	ask.SetOption(30,"Conceptos de pólizas","Despliega una lista de conceptos utilizados en pólizas.");
		
	switch(ask.Ask())
	{
		case 10: 
			QDepartamento(); 
			break;
		case 20:
			QRubro();
			break;
		case 30:
			QConcepto();
	}
	
	ask=null;
}



// function AgregarCuentaXDepto(){
	// return AgregarCuentaAnidada("qDeptos");
// }

// function AgregarCuentaXRubro(){
	// return AgregarCuentaAnidada("qRubros");
// }

function AgregarCuenta(){	
var Brw;
var PK;
Brw=null;
Brw=Application.Browsers.GetBrowser("qCuentas");
if (Brw!=null){
	PK=Brw.PrimaryKeyValue;
	if(PK==null)	
		PK=0;
}
		
	if (Contabilidad.CrearCuenta(PK)!=null)
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}	
}


function ModificarCuenta(PK){	
	if(PK==null){
		Log("Seleccione un cuenta");
		return 0;
	}	
	
	if(Contabilidad.ModificarCuenta(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
}
function EliminarCuenta(PK){	
	if(PK==null){
		Log("Seleccione un cuenta");
		return 0;
	}					
	if(Contabilidad.DelCContable_BySysPK(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;	
	}
}
function AgregarRubro(){					
	if(Contabilidad.dlgCRubro())
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
}
function ModificarRubro(PK){		
	if(PK==null){
		Log("Seleccione un rubro");
		return 0;
	}
			
	if (Contabilidad.dlgCRubro_BySysPK(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
}
function EliminarRubro(PK){					
	if(PK==null){
		Log("Seleccione un rubro");
		return 0;
	}

	if(Contabilidad.DelCRubro_BySysPK(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
}
function AgregarDepartamento(){					
	if(Contabilidad.dlgCDepartamento()){		
		return -1;
	}else{		
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
}
function ModificarDepartamento(PK){
	if(PK==null){
		Log("Seleccione un departamento");
		return 0;
	}	
	
	if (Contabilidad.dlgCDepartamento_BySysPK(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;	
	}
}
function EliminarDepartamento(PK){					
	if(PK==null){
		Log("Seleccione un departamento");
		return 0;
	}	
	if(Contabilidad.DelCDepartamento_BySysPK(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;	
	}
}

/* function CuentasPorPeriodo_Rubros(P){	
	//P es un parametro que pasa el sistema con el valor del tab seleccionado	
	var B;		
	B=Application.Browsers.GetBrowser("qCtasRubro");
	if (B!=null){			
		B.sqlCommand.CmdSQL=GetsSQL(P,B.sqlCommand.Parameter("PKRubro").Value,0);			
		B.Execute();
		return -1;		
	}else 
		return 0;
}


function CuentasPorPeriodo_Departamentos(P){	
	//P es un parametro que pasa el sistema con el valor del tab seleccionado	
	var B;		
	B=Application.Browsers.GetBrowser("qCtasDepto");
	if (B!=null){			
		B.sqlCommand.CmdSQL=GetsSQL(P,B.sqlCommand.Parameter("PKDepto").Value,1);			
		B.Execute();
		return -1;		
	}else 
		return 0;
} */
function FiltrarCuenta(P){
	//P es un parametro que pasa el sistema con el valor del tab seleccionado	
	var B;		
	var Filtro;	
	//var Restaurar;
	B=Application.Browsers.GetBrowser("qCuentas");
	if (B!=null){		
		B.sqlCommand.CmdSQL=GetsSQL(B.sqlCommand.Parameter("Periodo").Value,B.sqlCommand.Parameter("PKRubro").Value,B.sqlCommand.Parameter("Filtro").Value);
		//Restaurar=false;
		if((B.ActiveBrowserType()==1 && B.sqlCommand.Parameter("Filtro").Value==0) || (B.ActiveBrowserType()==0 && B.sqlCommand.Parameter("Filtro").Value==1)){
			B.SwitchBrowser();
			//Restaurar=true;			
		}		
		//B.Execute();
		//if(Restaurar) ConfigurarBrowser(B);		
		return -1;		
	}else 
		return 0;
}

function ActualizaCmdSQL(){
	var B;
	var Fecha;
	Fecha=new Date();	
	B=Application.Browsers.GetBrowser("qCuentas");
	if (B!=null){
		B.FilterList.FirstItemSQL=GetsSQL(B.Parameter("Periodo").Value,B.Parameter("PKRubro").Value,B.Parameter("Filtro").Value);
		B.sqlCommand.CmdSQL=B.FilterList.FirstItemSQL;
	}		
	//El metodo en CmdLeftClick debe regresar -1 para que continue... caso contrario no realiza el proceso de filtro.
	return -1;
}

function GetsSQL(Mes,TRubro,Filtro){
//Mes= Periodo seleccionado
//TRubro =0 para todos los rubros.
//TRubro=1 para obtener consulta filtrado por Rubro.
//Filtro=0 'obtener registros de la consulta qRyCuentasXRubro
//Filtro=1 'obtener registros de la consulta qRyCuentasXDepto
	var Field;
	var SaldoInicial;
	var Saldo;
	switch(Mes){
			case 1:Field="01";SaldoInicial="SInicial AS SaldoInicial";Saldo="01";break;
			case 2:Field="02";SaldoInicial="S01 AS SaldoInicial";Saldo="02";break;
			case 3:Field="03";SaldoInicial="S02 AS SaldoInicial";Saldo="03";break;
			case 4:Field="04";SaldoInicial="S03 AS SaldoInicial";Saldo="04";break;
			case 5:Field="05";SaldoInicial="S04 AS SaldoInicial";Saldo="05";break;
			case 6:Field="06";SaldoInicial="S05 AS SaldoInicial";Saldo="06";break;
			case 7:Field="07";SaldoInicial="S06 AS SaldoInicial";Saldo="07";break;
			case 8:Field="08";SaldoInicial="S07 AS SaldoInicial";Saldo="08";break;
			case 9:Field="09";SaldoInicial="S08 AS SaldoInicial";Saldo="09";break;
			case 10:Field="10";SaldoInicial="S09 AS SaldoInicial";Saldo="10";break;
			case 11:Field="11";SaldoInicial="S10 AS SaldoInicial";Saldo="11";break;
			case 12:Field="12";SaldoInicial="S11 AS SaldoInicial";Saldo="12";break;
			//case 0: Field="FINAL";SaldoInicial="S12 AS SaldoInicial";
			case 13: Field="FINAL";SaldoInicial="S12 AS SaldoInicial";Saldo="FINAL";break;
			case 0: Field="Total";SaldoInicial="SInicial AS SaldoInicial";Saldo="FINAL";
			
	}
		if (TRubro==0){ //Todas las cuentas
			if (Filtro==0) //Del Rubro
				Field="Select Sys_PK,Codigo,Descripcion,ICuenta," +SaldoInicial+",D" + Field + " as Debe,H" + Field +" as Haber,S" + Saldo +" as Saldo From qryCContable;";//CContable
			else //Departamentales
				Field="SELECT DISTINCT Sys_PK,Codigo,Descripcion,ICuenta," +SaldoInicial+",D" + Field + " as Debe,H" + Field +" as Haber,S" + Saldo +" as Saldo,DPK,Departamento From qryCuentasXDepto;";//qRyCuentasXRubro;";						
		}else{//Por Rubro
			if (Filtro==0) //del rubro  
				Field="Select Sys_PK,Codigo,Descripcion,ICuenta," +SaldoInicial+",D" + Field + " as Debe,H" + Field +" as Haber,S" + Saldo +" as Saldo From qryCuentasXRubro Where RPK=@PKRubro;";
			else		//Departamentales
				Field="SELECT DISTINCT Sys_PK,Codigo,Descripcion,ICuenta," +SaldoInicial+",D" + Field + " as Debe,H" + Field +" as Haber,S" + Saldo +" as Saldo,DPK,Departamento From qryCuentasXDepto Where Rubros=@PKRubro;";
		}
		return (Field);
}



//Ventana de clientes - cuentas x cobrar
function qCuentas(){
var Brw;
var Fecha;
Brw=null;
Brw=Application.Browsers.GetBrowser("qCuentas");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-71-00-001"))  //PERMITIR ACCESO
			return 0;
		
		Fecha=new Date();
		Brw=Application.Browsers.CreateTreeBrowser("qCuentas");		
		Brw.Caption="Contabiliad y finanzas";
		Brw.sqlCommand.CmdType=1;		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKRubro",0));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Periodo",Fecha.getMonth()+1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Filtro",0));						
		Brw.sqlCommand.CmdSQL=GetsSQL(Fecha.getMonth()+1,0,0);
		
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;		
		Brw.ObjectTypeName="CContable";
		
		Brw.CmdAfterRetriveFields="UIFinanzas.ConfigurarBrowser";		
	    Brw.CmdAddNew="UIFinanzas.AgregarCuenta";
		Brw.CmdEdit="UIFinanzas.ModificarCuenta";
		Brw.CmdDelete = "UIFinanzas.EliminarCuenta";
		Brw.CmdDblClick="UIFinanzas.ModificarCuenta";
		Brw.CmdLeftAddNew="UIFinanzas.OpcionesAgregarRubro";
		Brw.CmdLeftEdit= "UIFinanzas.ModificarRubro";
		Brw.CmdLeftDelete = "UIFinanzas.OpcionesEliminarRubro";
		Brw.CmdLeftDblClick=Brw.CmdLeftEdit;
		Brw.CmdLeftClick="UIFinanzas.ActualizaCmdSQL";
		Brw.SubTitle1="Rubros";
		Brw.SubTitle2="Cuentas";
		Brw.FilterList.sqlQuery="Select Sys_PK,Descripcion From CRubro Order By Descripcion";
		Brw.FilterList.KeyField="Sys_PK";
		Brw.FilterList.ListField="Descripcion";
		Brw.FilterList.Parameter="PKRubro";
		Brw.FilterList.HaveFirstItem=-1;
		Brw.FilterList.TextFirsItem="<Todos los rubros>";
		Brw.FilterList.FirstItemValue=0;
		Brw.FilterList.FirstItemSQL=GetsSQL(Fecha.getMonth()+1,0,0);
		Brw.TopTabParameter="Filtro";
		Brw.CmdTopTabClick="UIFinanzas.FiltrarCuenta";
		Brw.AddTopTab("Todas las cuentas",0);
		Brw.AddTopTab("Solo departamentales",1);
		Brw.SelectTopTab(0);
		Brw.ShowTopTabsBar();
		
		Brw.BottomTabParameter="Periodo";
		Brw.CmdBottomTabClick="UIFinanzas.FiltrarCuenta";
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
		Brw.AddBottomTab("Periodo final",13);				
		Brw.AddBottomTab("Todos",0);		
		
		Brw.ShowBottomTabsBar();	
		Brw.ShowFilterList();
		Brw.FillFilterList();
		
		Brw.SelectBottomTab(Fecha.getMonth());
		Brw.SetItemList(0);
		ConfigurarBrowser("qCuentas");
		Brw.ShowToolBar();
		Brw.ShowFindBar();
	}
	else
		Brw.Zorder();

}


function ConfigurarBrowser(BrwName){
	var sFields;
	var Brw;
	var	Periodo;	
	var SaldoInicial;
	var Debe;
	var Haber;
	var SaldoFinal;
	var Departamental;
	
	Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw==null) {
		Log("No se pudo obtener informacion de la cuadrícula cuentas");
		return 0;
	}				
	
	sFields="Sys_PK;ICuenta";	
	Brw.KeyField = "Sys_PK";		
	if (Brw.ActiveBrowserType()==0){	
		//El browser activo es de tipo Arbol
		Departamental=false;
		Brw.ParentKeyField="ICuenta";		
	}else{
		sFields=sFields+";DPK";		
		Brw.SetGroup("Departamento");
		Departamental=true;
	}	
	
	Periodo=Brw.Parameter("Periodo").Value;
	//SaldoInicial=eBasic.eFormat(LBContabilidad.SaldoInicial(Periodo,Departamental),Contabilidad.FormatoMontos);
	Debe=eBasic.eFormat(LBContabilidad.DebeTotal(Periodo,Departamental),Contabilidad.FormatoMontos);
	Haber=eBasic.eFormat(LBContabilidad.HaberTotal(Periodo,Departamental),Contabilidad.FormatoMontos);
	//SaldoFinal=eBasic.eFormat(LBContabilidad.SaldoTotal(Periodo,Departamental),Contabilidad.FormatoMontos);
	
	Brw.SetTitle("Debe= "+Debe+"    Haber= " + Haber);
	Brw.HideFields(sFields);
	Brw.SetCaptionByFieldName("SaldoInicial","Saldo inicial");
	Brw.SetColumnWidth("Codigo",100);
	Brw.SetCaptionByFieldName("Codigo","Número de cuenta");	
	Brw.SetColumnWidth("Descripcion",200);
	Brw.SetColumnWidth("SaldoInicial",100);	
	Brw.SetColumnWidth("Debe",90);
	Brw.SetColumnWidth("Haber",90);
	Brw.SetColumnWidth("Saldo",90);
	
	//Asignar número de decimales a los importes.
	//06/03/2010
	Brw.SetColumnFormat("SaldoInicial",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
	Brw.SetColumnFormat("Debe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
	Brw.SetColumnFormat("Haber",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
	Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
	//*************************************
	
	if (Brw.Parameter("Filtro").Value==1)		
		Brw.SetColumnWidth("Departamento",100);
	
	Brw.OrderBy("Codigo",2);	
	Brw.SetFontColor(Contabilidad.ColorRubro(Brw.Parameter("PKRubro").Value)); 
			
	return -1;
}

function OpcionesAgregarRubro(){
	var ask;	
	ask=Application.NewAsk();
	ask.SetOption(10,"Agregar Rubro","Elija ésta opción si desea agregar un nuevo rubro.");
	ask.SetOption(20,"Agregar Cuenta","Elija ésta opción para agregar una cuenta contable");
	
	switch(ask.Ask())
	{
		case 10: 				
			return AgregarRubro();break;
		case 20:			
			return AgregarCuenta();break;			
	}
	
	ask=null;
}

function OpcionesEliminarRubro(PK){
	var ask;
	var	Brw;
	ask=Application.NewAsk();
	ask.SetOption(10,"Eliminar Rubro","Elija ésta opción si desea eliminar el rubro seleccionado.");
	ask.SetOption(20,"Eliminar Cuenta","Elija ésta opción si desea eliminar la cuenta seleccionada.");
	
	switch(ask.Ask())
	{
		case 10: 				
			return EliminarRubro(PK);break;
		case 20:
		
			Brw=Application.Browsers.GetBrowser("qCuentas");
			if (Brw==null){
				Log("Error al obtener clave de cuenta");
				return 0;
			}else{				
				return EliminarCuenta(Brw.PrimaryKeyValue);break;
			}			
	}
	
	ask=null;
}



//*****************Uso de Plantillas *********************
// By Jfrank -> 08/Sept/09


function GuardarAplicar(A){
	//Guarda la Poliza y la aplica automaticamente
	GuardarPoliza(A,true); 
}

function GuardarBorrador(A){
	GuardarPoliza(A,false); 
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

	if (dlg!=null) FormPoliza=dlg.GetAXObject();
	else{
		Log("Error al intentar acceder a la poliza");
		return 0;
	}
		
	Content=FormPoliza.ObtenerPlantilla();
	
	if (Content==null){
		eBasic.eMsgbox("Error al intentar crear plantilla");
		return 0;
	}
	
	if (Content==""){
		eBasic.eMsgbox("Error al intentar crear plantilla");
		return 0;
	}
	
	objDB = eBasic.eCreateObject("geSDK_DB.DBTable");
	
	if (objDB==null){
		eBasic.eMsgbox("Error al crear el componente geSDK_DB.DBTable");
		return 0;
	}
	
	Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");
	
	if (Fld==null){
		eBasic.eMsgbox("Error al crear el componente eSQLBD.clsTypeInfo");
		return 0;
	}
	// Guardar a Base de taos
	objDB.ADOCnn=Application.adocnn;
	objDB.SetTableName ("ut_PolicyTemplate");
	
	objDB.AddNew();
	
	ColFld = objDB.cTypeInfo;
	
	if (ColFld==null){
		eBasic.eMsgbox("Error al intentar cargar coleccion de campos");
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
			eBasic.eMsgbox("Plantilla Guardada con exito",6);
}

function UsarPlantilla(A){
	
var dlg;
var FormPoliza;
var Content;
var PKPoliza=0;
var sql;
var R=null;
	dlg=Application.AXForms.AXForm(A.Context.TagData);

	if (dlg!=null) FormPoliza=dlg.GetAXObject();
	else{
		Log("Error al intentar acceder a la poliza");
		return 0;
	}
	
	if (!ModuleLoaded("us_templates"))
	{
		if (!Application.LoadScript("us_templates.js")) 
		{
			eBasic.eMsgbox("El sub-programa no pudo cargarse");
			return 0;
		}
	}
	PKPoliza=us_templates.ShowBrowser();
	
	if(PKPoliza<=0)	return 0;
	
	sql="Select uf_Datos FROM ut_PolicyTemplate Where Sys_PK=" + PKPoliza;
	
	R=Application.adocnn.execute(sql);
	
	if(R==null){
		Log(ErrDesc + "(No se en encontro motor de base de datos MySql)");
		return false;
	}
	if (R.EOF && R.BOF){			
		Log(ErrDesc +"(No se en encontro motor de base de datos MySql)");
		return false;
	}
	
	Content = R("uf_Datos").Value;
	
	FormPoliza.UsarPlantilla(Content);
	
}

//*******************************POLIZAS*************************************

function NuevaPoliza(){
var dlg;
var FormPoliza;
var objPoliza;	
dlg=null;
dlg=Application.AXForms.AXForm("dlgPoliza"+NPolizas);
	if (dlg==null){			
		dlg=Application.AXForms.CreateForm("FormPoliza","dlgPoliza"+NPolizas);
		NPolizas=NPolizas+1; //Contador de pólizas
		dlg.Caption="Nueva póliza";
		dlg.CmdPreview="UIFinanzas.PrevisualizarPoliza";
		dlg.CmdPrint="UIFinanzas.ImprimirPoliza";
	
		dlg.ReportsFolder=Reportes.CarpetaConta_Finanzas;
		dlg.ObjectTypeName="CPoliza";		
		dlg.CmdKeyDown="UIFinanzas.Command_KeyDown";
		
		/***************     By JFrank - 08/Sept/09   */
		dlg.AddButton("Guardar y Aplicar","P_Fin_A04");
		dlg.AddButton("Guardar como Borrador","P_Fin_A13");
		dlg.AddButton("Guardar como plantilla","P_Fin_A14");
		dlg.AddButton("Usar plantilla","P_Fin_A15");
		dlg.AddButton("Prorratear", "P_Fin_PRO");// CARLOS 121212
		dlg.AddButton("Cerrar","P_Fin_A19");
		
		dlg.ShowButtons();			
		FormPoliza=dlg.GetAXObject();			
		FormPoliza.SetObjects(objPoliza,DataAccessConta,Contabilidad,0);					
		FormPoliza.NDecimales=FXConfig.NDecsMonto();
		FormPoliza.NFormato=FXConfig.FormatoMonto();
		FormPoliza.InicializarCuadricula();	    
		if (!FormPoliza.CargarPoliza())				
				Log(FormPoliza.LastErrorDescrip);				
		
		
	}else
		dlg.Zorder();	
	
}

function GuardarPoliza(A,bAplicar){
	var dlg;
	var FormPoliza;	
	var cerrar=false;
	var boAplicada=false;
	
	dlg=Application.AXForms.AXForm(A.Context.TagData);
	if (dlg!=null){
		FormPoliza=dlg.GetAXObject();
		if (FormPoliza.ActualizarPoliza()==true){						
				FormPoliza.Accion=1;
				boAplicada=false;
				if (bAplicar){ //eBasic.eMsgbox("La póliza se guardó correctamente. ¿Desea aplicarla ahora?",4)==6 - --Jfrank -> Comentado para aplicar automaticamente
					if(FormPoliza.Poliza.Debe==FormPoliza.Poliza.Haber){
						if (AplicarPolizaPK(FormPoliza.Poliza.Sys_PK,null)==-1){
							boAplicada=true;
							FormPoliza.Aplicada=true;
							FormPoliza.DeshabilitarPoliza();							
							//dlg.HideToolBar();														
						}
					}else{						
						eBasic.eMsgbox("La póliza se guardó como borrador, porque las sumas de Debe y Haber son diferentes.",6);
					}
				}				
				
				dlg.Caption="Póliza " + FormPoliza.Poliza.Referencia;													
				if(eBasic.eMsgbox("¿Desea imprimir el documento?",4)==6){
					ImprimirPoliza(dlg);
				}
				ActualizarQPoliza();				
				
				//evento
				try{
					Eventos.EvDespuesPoliza(FormPoliza.Poliza);
				}catch(e){				
				}
				//fin evento
				
				if(boAplicada){
					if(eBasic.eMsgbox("¿Desea crear nueva póliza?",4)==6){
						FormPoliza.PrepareNew();
						dlg.Caption="Póliza";	
					}else{
						dlg.UnloadMe();							
					}
				}else{				
					if(eBasic.eMsgbox("¿Desea cerrar?",4)==6){
						dlg.UnloadMe();
					}
				}	
		}else{			
			if (FormPoliza.LastErrorDescrip!="")
				eBasic.eMsgbox(FormPoliza.LastErrorDescrip,6);
		}
	}else{
		Log("Error al acceder al formulario. La póliza no se guardó.");
	}
}

function ActualizarQPoliza(){
	var Brw;
	try{
		Brw=null;
		Brw=Application.Browsers.GetBrowser("qPoliza");
		if (Brw!=null)
			Brw.RefreshRst();
	}catch(e){
	//
	}
}

function ModificarPoliza(){
var dlg;
var FormPoliza;
var ObjPoliza;	

var PK;
var B;
	B=Application.Browsers.GetBrowser("qPoliza");	
	if (B!=null){
		PK=B.GetFieldValue("Sys_PK");
	}
	
if (PK==0 || PK==null){	
	Log("Seleccione una póliza");
	return 0;
}

dlg=null;
dlg=Application.AXForms.AXForm("dlgPoliza_" + PK);

	if (dlg==null){			
		dlg=Application.AXForms.CreateForm("FormPoliza","dlgPoliza_" + PK);		
		if (dlg != null){
				FormPoliza=dlg.GetAXObject();
				FormPoliza.SetObjects(ObjPoliza,DataAccessConta,Contabilidad,1,PK);					
				FormPoliza.NDecimales=FXConfig.NDecsMonto();
				FormPoliza.NFormato=FXConfig.FormatoMonto();				
				FormPoliza.InicializarCuadricula();	    
			    if (!FormPoliza.CargarPoliza()){
					if (FormPoliza.LastErrorDescrip!="") 
						eBasic.eMsgbox(FormPoliza.LastErrorDescrip,6);															
					return 0;
				}
				dlg.Caption="Póliza " + FormPoliza.Poliza.Referencia;
				dlg.CmdPreview="UIFinanzas.PrevisualizarPoliza";
				dlg.CmdPrint="UIFinanzas.ImprimirPoliza";
				dlg.ReportsFolder=Reportes.CarpetaConta_Finanzas;
				dlg.ObjectTypeName="CPoliza";				
				dlg.CmdKeyDown="UIFinanzas.Command_KeyDown";
				
				dlg.SetPrimaryKeyValue(PK);
				if (FormPoliza.Poliza.Aplicada){
					FormPoliza.DeshabilitarPoliza();						
					dlg.AddButton("Cerrar","P_Fin_A19");
					//eBasic.eMsgbox("No puede modificar la póliza actual porque ya ha sido aplicada.",6);
				}else{
				
					dlg.AddButton("Guardar y Aplicar","P_Fin_A04");
					dlg.AddButton("Guardar como Borrador","P_Fin_A13");
					dlg.AddButton("Guardar como plantilla","P_Fin_A14");
					dlg.AddButton("Usar plantilla","P_Fin_A15");
					dlg.AddButton("Prorratear", "P_Fin_PRO");// CARLOS 121212
					dlg.AddButton("Cerrar","P_Fin_A19");
					
				}
				dlg.ShowButtons();
		}		
	}else
		dlg.Zorder();		
		
}
function EliminarPoliza(){
	var PK;
	var B;
	B=Application.Browsers.GetBrowser("qPoliza");	
	if (B!=null){
		PK=B.GetFieldValue("Sys_PK");
	}
	
	if(PK==null){
		Log("Seleccione una póliza");
		return 0;
	}

	if (Contabilidad.DelCPoliza_BySysPK(PK))
		return -1;
	else{
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
	
}

function AplicarPoliza(){
	var B;
	var PKPoliza;
	B=null;	
	B=Application.Browsers.GetBrowser("qPoliza");		
	if (B!=null){
		PKPoliza=B.GetFieldValue("Sys_PK");		
		if (PKPoliza!=null){
			AplicarPolizaPK(PKPoliza,B);
		}			
	}
}

function AplicarPolizaPK(PKPoliza,Brw){
	if (Contabilidad.BLogic.AplicarPoliza(PKPoliza)){
		eBasic.eMsgbox("La póliza se aplicó correctamente.",6);				
		if (Brw!=null) 
			Brw.RefreshRst();
		HabilitarAplicarPoliza();
		return -1;
	}else{
		eBasic.eMsgbox(Contabilidad.BLogic.LastErrorDescript,6);				
		return 0;
	}
}

function DesaplicarPoliza(){
	var B;
	var PKPoliza;
	B=null;	
	B=Application.Browsers.GetBrowser("qPoliza");	
	if (B!=null){
		PKPoliza=B.GetFieldValue("Sys_PK");
		if (PKPoliza!=null)
			if (Contabilidad.BLogic.DesAplicarPoliza(PKPoliza)){
				eBasic.eMsgbox("La póliza se desaplicó correctamente",6);
				B.RefreshRst();
				HabilitarAplicarPoliza();
			}else
				Log(Contabilidad.BLogic.LastErrorDescript);
	}	
}

function AuditarPoliza(){
	var B;
	var PKPoliza;
	var Auditada;
	var Auditar=0;
	B=null;	
	B=Application.Browsers.GetBrowser("qPoliza");	
	if (B!=null){
		PKPoliza=B.GetFieldValue("Sys_PK");
		Auditada=B.GetFieldValue("Auditada");		
		if(Auditada==null) Auditada=0;
				
		if (PKPoliza!=null){
			if(Auditada)
				Auditar=0;
			else
				Auditar=-1;
			
			if (Contabilidad.BLogic.AuditarPoliza(PKPoliza,Auditar))
				B.RefreshRst();				
			else
				Log(Contabilidad.BLogic.LastErrorDescript)
		}else{
			Log("Seleccione una póliza");
		}
	}else{
		Log("Error al acceder a la póliza");
	}
}


//Catalogo de polizas
function QPoliza(){
var Brw;
var Fecha;
Brw=null;

Brw=Application.Browsers.GetBrowser("qPoliza");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-71-05-006"))  //PERMITIR ACCESO
			return 0;
		
		Brw=Application.Browsers.CreateBrowser("qPoliza");		
		Brw.Caption="Catálogo de polizas";
		Brw.sqlCommand.CmdType=1;		
						
		Brw.sqlCommand.CmdSQL=CmdSQLQPolizas;
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarColQPoliza";
		Brw.KeyField = "Sys_PK";		
	    Brw.CmdAddNew="UIFinanzas.NuevaPoliza";
		Brw.CmdRowChanged="UIFinanzas.HabilitarAplicarPoliza";
		Brw.CmdEdit="UIFinanzas.ModificarPoliza";
		Brw.CmdDelete = "UIFinanzas.EliminarPoliza";
		Brw.CmdDblClick="UIFinanzas.ModificarPoliza";
		
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;
		Brw.ObjectTypeName="CPoliza";
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Nuevo (F2)","P_Fin_A10");
		Brw.AddButton("Editar (F3)","P_Fin_A17");
		Brw.AddButton("Aplicar","P_Fin_A05");				
		Brw.AddButton("Desaplicar","P_Fin_A06");				
		Brw.AddButton("Auditar/No Auditar","P_Fin_A16");
		Brw.AddButton("Eliminar","P_Fin_A18");				
		
		//pestañas de filtro 03/03/2010
		Brw.BottomTabParameter="PeriodoP";
		Brw.CmdBottomTabClick="UIFinanzas.FiltrarPolizas";
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
		Brw.AddBottomTab("Periodo final",13);				
		Brw.AddBottomTab("Todos",0);		
		
		Brw.ShowBottomTabsBar();
		Fecha=new Date();
		Brw.SelectBottomTab(Fecha.getMonth()); //03/03/2010 
		
		//****************************			
				
		
		Brw.Execute();
		
		Brw.DetailFunction="UIFinanzas.DetallePoliza";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);			
		
	}
	else
		Brw.Zorder();
	
	HabilitarAplicarPoliza();

}

function FiltrarPolizas(P){
	//P es un parametro que pasa el sistema con el valor del tab seleccionado	
	var B;		
	var Filtro;	
	//var Restaurar;
	B=Application.Browsers.GetBrowser("qPoliza");
	if (B!=null){		
		if(P>0)
			B.sqlCommand.CmdSQL="SELECT qryPoliza.* FROM qryPoliza INNER JOIN CPoliza ON qryPoliza.Sys_PK=CPoliza.Sys_PK WHERE CPoliza.Periodo="+P;		
		else
			B.sqlCommand.CmdSQL="SELECT qryPoliza.* FROM qryPoliza";		
		return -1;		
	}else 
		return 0;
}

function DetallePoliza()
{
//Gabriel JG
//Panel del detalle de poliza.
	
	var r=null;
	var p;	
	
	var Brw;
	var Referencia;
	try{
		Brw=null;
		Brw=Application.Browsers.GetBrowser("qPoliza");
		Referencia=": "+Brw.GetFieldValue("Referencia");
		Brw=null;
	}catch(e){
		Referencia="";
	}
	
	
	try
	{
		p=Application.GetDetailPanel();
		p.SetCaption("Detalle de Póliza"+Referencia);
		
		r=Application.Database.OpenRecordset("SELECT CDPoliza.Sys_PK, CContable.Codigo AS Codigo, CContable.Descripcion AS Cuenta, CDPoliza.Concepto, CDPoliza.Debe, CDPoliza.Haber, CDPoliza.TCambio AS TipoCambio, CDepartamento.Descripcion AS Departamento FROM CDepartamento RIGHT JOIN (CContable INNER JOIN CDPoliza ON CContable.Sys_PK = CDPoliza.ICuenta) ON CDepartamento.Sys_PK = CDPoliza.IDepto WHERE CDPoliza.FK_CPoliza_Detalle=" +p.CurrentValue + " ORDER BY CDPoliza.Sys_PK",Application.adoCnn);
		
	
		//Poner datos en el panel
		p.SetDataSource(r,"Sys_PK");
		p.HideFields("Sys_PK");
		p.SetColumnWidth("Codigo",90);
		p.SetColumnWidth("Cuenta",200);
		p.SetColumnWidth("Concepto",200);
		p.SetColumnWidth("Debe",95);
		p.SetColumnWidth("Haber",95);
		p.SetColumnWidth("TipoCambio",70);
		p.SetColumnWidth("Departamento",200);
		
	}catch(e)
	{
		Log("Error al obtener información para el panel de detalle");
		return 0 ;
	}
	

}


function HabilitarAplicarPoliza(){
	var Brw;
	var Aplicada;
	Brw=null; 
	Brw=Application.Browsers.GetBrowser("qPoliza");
	
	if (Brw!=null){
		Aplicada=Brw.GetFieldValue("Aplicada");
		if (Aplicada!=null){			
			Brw.GetButtonByIDAction("P_Fin_A05").Enabled=!Aplicada; //Aplicar
			Brw.GetButtonByIDAction("P_Fin_A06").Enabled=Aplicada;  //Desaplicar
		}else{
			Brw.GetButtonByIDAction("P_Fin_A05").Enabled=false;
			Brw.GetButtonByIDAction("P_Fin_A06").Enabled=false;
		}	
	}
}

function RedimensionarColQPoliza(BrwName){
var Brw;
Brw=null; 
Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null){			
		Brw.HideFields("Sys_PK");
		Brw.SetColumnWidth("Tipo",80);	
		Brw.SetColumnWidth("Referencia",100);	
		Brw.SetColumnWidth("Fecha",80);
		Brw.SetColumnWidth("Concepto",150);
		Brw.SetColumnWidth("Auditada",80);
		Brw.SetColumnWidth("Aplicada",80);		
		Brw.SetColumnWidth("Debe",80);	
		Brw.SetColumnWidth("Haber",80);	
		Brw.SetColumnWidth("Notas",500);	
		
		try{
			Brw.SetColumnFormat("Debe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Haber",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
		}catch(e){}
	}	
HabilitarAplicarPoliza();
}


function QDepartamento(){
var Brw;
Brw=null;
Application.eDoEvents();
Brw=Application.Browsers.GetBrowser("qDeptos");
if (Brw==null)
	{		
		Brw=Application.Browsers.CreateBrowser("qDeptos");		
		Brw.Caption="Departamentos";
		Brw.sqlCommand.CmdType=1;			
		Brw.sqlCommand.CmdSQL=CmdSQLQDepartamentos;
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarQDepartamento";
		Brw.KeyField = "Sys_PK";		
	    Brw.CmdAddNew="UIFinanzas.AgregarDepartamento";
		Brw.CmdEdit="UIFinanzas.ModificarDepartamento";
		Brw.CmdDelete = "UIFinanzas.EliminarDepartamento";
		Brw.CmdDblClick="UIFinanzas.ModificarDepartamento";
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;		
		Brw.ObjectTypeName="CDepartamento";
		Brw.Execute();				
		Brw.HideFields("Sys_PK");
		//Brw.AutoAdjust();
		//Application.eDoEvents();
	}
	else			
		Brw.Zorder();

}

function RedimensionarQDepartamento(BrwName){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null){
		Brw.SetColumnWidth("Codigo",100);	
		Brw.SetColumnWidth("Descripcion",600);			
	}
	
}

function QRubro(){
var Brw;
Brw=null;
	
	Application.eDoEvents();
	Brw=Application.Browsers.GetBrowser("qRubros");
	if (Brw==null){
		Brw=Application.Browsers.CreateBrowser("qRubros");		
		Brw.Caption="Rubros";
		Brw.sqlCommand.CmdType=1;			
		Brw.sqlCommand.CmdSQL=CmdSQLQRubros;
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarQRubro";
		Brw.KeyField = "Sys_PK";		
	    Brw.CmdAddNew="UIFinanzas.AgregarRubro";
		Brw.CmdEdit="UIFinanzas.ModificarRubro";
		Brw.CmdDelete = "UIFinanzas.EliminarRubro";
		Brw.CmdDblClick="UIFinanzas.ModificarRubro";
		
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;		
		Brw.ObjectTypeName="CRubro";
		
		Brw.Execute();				
		Brw.HideFields("Sys_PK");		
	}
	else
		Brw.Zorder();	
}

function RedimensionarQRubro(BrwName){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null){
		Brw.SetColumnWidth("Codigo",100);	
		Brw.SetColumnWidth("Descripcion",600);			
	}
	
}

function QConcepto(){
var Brw;
Brw=null;
Application.eDoEvents();
Brw=Application.Browsers.GetBrowser("qConcepto");
if (Brw==null)
	{
		Brw=Application.Browsers.CreateBrowser("qConcepto");		
		Brw.Caption="Conceptos de póliza";
		Brw.sqlCommand.CmdType=1;			
		Brw.sqlCommand.CmdSQL=CmdSQLQConceptosPoliza;
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarQConcepto";
		Brw.KeyField = "Sys_PK";		
	    Brw.CmdAddNew="UIFinanzas.AgregarConcepto";
		Brw.CmdEdit="UIFinanzas.ModificarConcepto";
		Brw.CmdDelete = "UIFinanzas.EliminarConcepto";
		Brw.CmdDblClick="UIFinanzas.ModificarConcepto";
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;		
		Brw.ObjectTypeName="CConcepto";
		
		Brw.Execute();				
		Brw.HideFields("Sys_PK");				
	}
	else
		Brw.Zorder();
}

function RedimensionarQConcepto(BrwName){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null){
		Brw.SetColumnWidth("Codigo",100);	
		Brw.SetColumnWidth("Descripcion",600);			
	}
	
}


function AgregarConcepto(){
	if (Contabilidad.dlgCConcepto())
		return -1;
	else
		return 0;
}
function ModificarConcepto(PK){
	if(PK==null){
		Log("Seleccione un concepto");
		return 0;
	}	
	if (Contabilidad.dlgCConcepto_BySysPK(PK))
		return -1;
	else
		return 0;
}
function EliminarConcepto(PK){
	if(PK==null){
		Log("Seleccione un concepto");
		return 0;
	}

	if (Contabilidad.DelCConcepto_BySysPK(PK))
		return -1;
	else{		
		Log(Contabilidad.LastErrorDescript);
		return 0;
	}
}


function LLenarCmbCuentasCheques(Cmb){
	var R;	
	R=Application.Database.OpenRecordset("SELECT Sys_PK,Nombre FROM qryCatChequera;");
	if (R==null) return;
	Cmb.Clear();
	while(!R.EOF){
		Cmb.AddItem(R("Nombre").Value);
		Cmb.ItemData(Cmb.ListCount-1)=R("Sys_PK").Value;
		R.Movenext;
	}	
}


function QCuentaCheques(ItemData){
var Brw;
var NombreChequera;
Brw=null;

Brw=Application.Browsers.GetBrowser("qCuentaCheque"+ItemData);
if (Brw==null)
	{		
		Brw=Application.Browsers.CreateBrowser("qCuentaCheque"+ItemData);		
		
		NombreChequera=ObtenerNombreChequera(ItemData);
		
		Brw.Caption="Cuenta de cheques: " + NombreChequera;
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKChequera",ItemData));						
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));	
		
		Brw.sqlCommand.CmdType=1;		
		Brw.sqlCommand.CmdSQL=cmdSQLMovCuentasCheques;
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarColumnas";
		Brw.CmdEditTitleClick="UIFinanzas.ModificarChequera";
		Brw.SetEditTitleParameter("PKChequera","Editar Chequera");
		Brw.KeyField = "Sys_PK";		
	    Brw.CmdAddNew="UIFinanzas.OpcionesCuentaAgregar";
		Brw.CmdEdit="UIFinanzas.OpcionesCuentaEditar";
		Brw.CmdDelete = "UIFinanzas.CancelarMovCuenta";
		Brw.CmdDblClick="UIFinanzas.OpcionesCuentaEditar";
		Brw.CmdRowChanged="UIFinanzas.ActualizarBotones";
		
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;		
		Brw.ObjectTypeName="MovCuenta";
		
		Brw.ShowToolBar();
		Brw.SetTitle(NombreChequera);		
		Brw.AddButton("Pago","P_Fin_B03");
		Brw.AddButton("Depósito","P_Fin_B04");				
		Brw.AddButton("Transferencia","P_Fin_B06");
		Brw.AddButton("Egreso por ajuste","P_Fin_B05");	
		
		Brw.AddButton("Cancelar movimiento","P_Fin_B08");
		Brw.AddButton("Activar conciliar","P_Fin_B10");						
		
		Brw.CmdBottomTabClick="UIFinanzas.FiltrarCuentaCheques";
		Brw.BottomTabParameter="Mes";	
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
		Brw.AddBottomTab("Todos",13);
		Brw.ShowBottomTabsBar();
		Brw.ShowBottomCombo();		
		Brw.BottomComboParameter="Anio"	
		UIDef.FillComboYears(Brw,false,true,true);			
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="MovCuenta";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="MovCuenta";
	}
	else
		Brw.Zorder();
}

function FiltrarCuentaCheques(Mes){
	var Brw;
	Brw=null;
	Brw=Application.ActiveWindow(); //Browsers.GetBrowser("qCuentaCheque"+ItemData);
	if (Brw!=null){		
		if(Mes==13)
			Brw.sqlCommand.CmdSQL=cmdSQLMovCuentasChequesTodos;
		else
			Brw.sqlCommand.CmdSQL=cmdSQLMovCuentasCheques;			
	}
}

function ObtenerNombreChequera(PK){
	var R;
	R=null;
	R=DataAccess.AdoCnn.Execute("SELECT Nombre FROM Chequera WHERE Sys_PK="+PK+";");
	if (R!=null)
		return (R("Nombre").Value);
	else
		return ("");
}

function RedimensionarColumnas(BrwName){
var Brw;
var FUltima;
var Mes;
var Ingreso=0;
var Egreso=0;
var R;
var Saldo;
var Anio;
var SaldoInicial=0;
var SaldoPeriodo=0;
var Anual;
Brw=null;
Brw=Application.Browsers.GetBrowser(BrwName);
if (Brw!=null)
	{			
		/*if (Brw.sqlCommand.Parameter("Mes").Value>1)
			Mes=Brw.sqlCommand.Parameter("Mes").Value-1;	
		else
			Mes=12;*/
		
		Anio=Brw.sqlCommand.Parameter("Anio").Value;
		Mes=Brw.sqlCommand.Parameter("Mes").Value;
		
		if (Mes>1 && Mes<13){
			Anual=false;
			Mes=Mes-1;
		}
		else{
			if (Mes==13) Anual=true;
			else Anual=false;
			Anio=Anio-1;
			Mes=12;
		}
			
		FUltima=new Date();
		FechaIE=new Date();
		FechaIE=("01/"+Brw.sqlCommand.Parameter("Mes").Value+"/"+Brw.sqlCommand.Parameter("Anio").Value);
		FUltima=gFunciones.UltimoDiaMes("01/"+Mes+"/"+Anio);
		
		SaldoInicial=LBEfectivo.SaldoEnCuentaAl(Brw.sqlCommand.Parameter("PKChequera").Value,FUltima);
		Ingreso=LBEfectivo.IngresosCuentaAl(Brw.sqlCommand.Parameter("PKChequera").Value,FechaIE,Anual);
		Egreso=LBEfectivo.EgresosCuentaAl(Brw.sqlCommand.Parameter("PKChequera").Value,FechaIE,Anual);
		Saldo=LBEfectivo.SaldoCuenta(Brw.sqlCommand.Parameter("PKChequera").Value);
		SaldoPeriodo=SaldoInicial+(Ingreso-Egreso);
		//Saldo=Ingreso-Egreso;		
		Brw.SetGridTitle("Saldo inicial= "+eBasic.eFormat(SaldoInicial,Contabilidad.FormatoMontos)+"        Ingresos= "+ eBasic.eFormat(Ingreso,Contabilidad.FormatoMontos) + "        Egresos= "+ eBasic.eFormat(Egreso,Contabilidad.FormatoMontos) + "        Saldo del periodo= " +eBasic.eFormat(SaldoPeriodo,Contabilidad.FormatoMontos) + "        Saldo total= " +eBasic.eFormat(Saldo,Contabilidad.FormatoMontos));
				
		//Brw.HideFields("Sys_PK;ICuenta;Mes;Anio;Partida");		
		Brw.HideFields("Sys_PK;ICuenta;Mes;Anio;Partida;MesAplicacion;AnioAplicacion;uf_Color");		
		Brw.SetColumnWidth("Creado",80);	
		Brw.SetColumnWidth("Referencia",80);
		Brw.SetColumnWidth("Documento",80);
		Brw.SetColumnWidth("Ingreso",80);
		Brw.SetColumnWidth("Egreso",80);
		Brw.SetColumnWidth("Aplicacion",80)
		Brw.SetColumnWidth("Categoria",150)
		Brw.SetColumnWidth("Beneficiario",200);
		Brw.SetColumnWidth("Auditado",60);
		Brw.SetColumnWidth("Conciliado",60);
		Brw.SetColumnWidth("Contabilizado",70);
		Brw.SetColumnWidth("Cancelado",70);
		//Brw.SetColumnWidth("Partida",70);
		Brw.SetColumnWidth("Poliza",70);
		Brw.SetColumnWidth("Notas",150);
		
		try{
			Brw.SetColumnFormat("Ingreso",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());				
			Brw.SetColumnFormat("Egreso",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());				
		}catch(e){}
	}
	ActualizarBotones();
}
//**********************

//**********************


function RegistrarCheque(A){	
	var PK;
	var MovCuenta;
	if (A==null && arguments.length==1) 
		PK=0;	
	else{	
		if (A==null && arguments.length==2)
			PK=arguments[1];
		else{
			if (A.Context.ActiveWindow!=null)
				PK=A.Context.ActiveWindow.sqlCommand.Parameter("PKChequera").Value;
			else
				PK=0;
		}
	}
	MovCuenta=LBEfectivo.Cheque(PK);
	if (MovCuenta!=null){
		Poliza.PolizaCheque(MovCuenta);
		
		if (eBasic.eMsgbox("¿Desea imprimir el cheque?", 4)==6){
			var Nombre;
			var Ubicacion;
			Nombre=NombreChequera(MovCuenta.ICuenta.Sys_PK);
			if(Nombre!=""){
				Ubicacion=eBasic.AddSlashPath(FXConfig.FormatoCheques())+Nombre+".xpd";
				Reportes.EjecutarReporte(Ubicacion,2,MovCuenta.Sys_PK,true);
			}else{
				eBasic.eMsgbox("Error al imprimir reporte no se pudo obtener nombre de chequera.",6);				
			}
		}
		if (eBasic.eMsgbox("¿Desea imprimir la póliza de cheque?", 4)==6){			
			var Ubicacion="";			
			Ubicacion=FXConfig.FormatoPolizaDeCheque();
			if(Ubicacion!=""){				
				Reportes.EjecutarReporte(Ubicacion,2,MovCuenta.Sys_PK,true);
			}else{
				eBasic.eMsgbox("Error al imprimir reporte no se pudo obtener la ubicación del formato.",6);			   
			}
		}
		
		try{
			var pkp;
			if(LBEfectivo.PKReciboXMovCuenta(MovCuenta.Sys_PK)>0){
				pkp=MovCuenta.FieldbyName("uf_IProveedor");
				if(pkp==null) pkp=0;
				if(pkp>0) CuentasXPagar.Aplicar(pkp);
			}
		}catch(e){}
		
		//evento
		try{
			Eventos.EvDespuesMovChequera(MovCuenta);
		}catch(e){			
		}
		//fin evento
		
		ActualizarQCuentaCheques(MovCuenta.ICuenta.Sys_PK);
	}else{
		Log(LBEfectivo.LastErrorDescrip);		
	}
}
function RegistrarDeposito(A){
    var PK=0;
	var MovCuenta;
	if (A==null && arguments.length==1) 
		PK=0;	
	else{
		if (A==null && arguments.length==2)
			PK=arguments[1];
		else{
			if (A.Context.ActiveWindow!=null)
				PK=A.Context.ActiveWindow.sqlCommand.Parameter("PKChequera").Value;
			else
				PK=0;
		}
	}

	MovCuenta=null;
	MovCuenta=LBEfectivo.Deposito(PK);
	if (MovCuenta!=null){
		Poliza.PolizaIngresoDeposito(MovCuenta);
		
		//evento
		try{
			Eventos.EvDespuesMovChequera(MovCuenta);
		}catch(e){			
		}
		//fin evento
		
		ActualizarQCuentaCheques(MovCuenta.ICuenta.Sys_PK);
	}else{
		Log(LBEfectivo.LastErrorDescrip);	
	}
}

function Retiro(A){
    var PK;
	var MovCuenta;
	if (A==null && arguments.length==1) 
		PK=0;	
	else{
		if (A==null && arguments.length==2)
			PK=arguments[1];
		else{
			if (A.Context.ActiveWindow!=null)
				PK=A.Context.ActiveWindow.sqlCommand.Parameter("PKChequera").Value;
			else
				PK=0;
		}
	}	
	MovCuenta=LBEfectivo.Retiro(PK);
	if(MovCuenta!=null){
		Poliza.PolizaRetiro(MovCuenta);		
		
		//evento
		try{
			Eventos.EvDespuesMovChequera(MovCuenta);
		}catch(e){			
		}
		//fin evento
		
		ActualizarQCuentaCheques(MovCuenta.ICuenta.Sys_PK);
	}else{
		Log(LBEfectivo.LastErrorDescrip);		
	}
}
function TransferenciaCuentas(A){
	var PK;
	if (A==null && arguments.length==1) 
		PK=0;	
	else{
		if (A==null && arguments.length==2)
			PK=arguments[1];
		else{
			if (A.Context.ActiveWindow!=null)
				PK=A.Context.ActiveWindow.sqlCommand.Parameter("PKChequera").Value;
			else
				PK=0;
		}
	}	
	if (LBEfectivo.Transferencia(PK)){
		Poliza.PolizaTraspaso(LBEfectivo.Traspaso_PKRetiro,LBEfectivo.Traspaso_PKDeposito);
		//evento
		try{
			Eventos.EvDespuesTrasferenciaChequera(LBEfectivo.Traspaso_PKRetiro,LBEfectivo.Traspaso_PKDeposito);
		}catch(e){			
		}
		//fin evento
		
		ActualizarQCuentaCheques(PK);	
	}else
		Log(LBEfectivo.LastErrorDescrip);
}

function  CancelarMovCuenta(PK){
	gestion_poliza.CancelarMC(PK);
	/*
	if (LBEfectivo.CancelarMovCuenta(PK))
		return -1;
	else{
		Log(LBEfectivo.LastErrorDescrip);
		return 0;
	}
	*/
}

function ConciliarMovCuenta(A,PK){
var Brw;
var PK;
Brw=null;

	if (A==null)
		Brw=Application.ActiveWindow();	
	else{		
		PK=0;
		if (A.Context.TagData!=""){
			PK=parseInt(A.Context.TagData);
			Brw=A.Context.ActiveWindow;
		}
	}
	
	if(PK==0){
		Log("Error: No se encontró la clave del movimiento de cuenta.");
		return 0;	
	}
	if(Brw.GetButton(1,6).Caption=="Activar conciliado"){		
		if (LBEfectivo.ConciliarMovCuenta(PK)){
			Brw.GetButton(1,6).Caption="Desactivar conciliado";
			Brw.RefreshRst();
		}else
			Log(LBEfectivo.LastErrorDescrip);
	}else{				
		if (LBEfectivo.ConciliarMovCuenta(PK,false)){
			Brw.GetButton(1,6).Caption="Activar conciliado";
			Brw.RefreshRst();
		}else
			Log(LBEfectivo.LastErrorDescrip);
	}	
}

function ActualizarBotones(){
	var Brw;
	var Btn;
	Brw=null;
	Brw=Application.ActiveWindow();
	if (Brw!=null){			
		Btn=Brw.GetButtonByIDAction("P_Fin_B10");
		if(Btn!=null){
			if (Brw.GetFieldValue("Conciliado")==true)							
				Btn.Caption="Desactivar conciliado";
			else
				Btn.Caption="Activar conciliado";
		}
		
		Btn=Brw.GetButtonByIDAction("P_Fin_B08");
		if(Btn!=null){
			if (Brw.GetFieldValue("Cancelado")==true)
				Btn.Enabled=false;
			else
				Btn.Enabled=true;
		}
	}
}

function ActualizarBotonesSesionCaja(){
var Brw;

	Brw=null;
	Brw=Application.Browsers.GetBrowser("qSesionCaja");
	if (Brw!=null){
		Brw.GetButtonByIDAction("P_Fin_C05").Enabled=false; // Abandonar
		
		if(LBEfectivo.ObjCorte==null){
			Brw.GetButtonByIDAction("P_Fin_C01").Enabled=true; //Abrir			
		}else
			Brw.GetButtonByIDAction("P_Fin_C01").Enabled=false; //Abrir
		
		if (Brw.PrimaryKeyValue==null){						
			Brw.GetButtonByIDAction("P_Fin_C04").Enabled=false; //Cierre			
			Brw.GetButtonByIDAction("P_Fin_C06").Enabled=false;//Detalle		
		}else{
			Brw.GetButtonByIDAction("P_Fin_C06").Enabled=true;//Detalle		
									
			if (!Brw.GetFieldValue("Cerrado")){				
				Brw.GetButtonByIDAction("P_Fin_C04").Enabled=true; //Cierre				
				//Brw.GetButtonByIDAction("P_Fin_C05").Enabled=true; //abandonar
				//Brw.GetButtonByIDAction("P_Fin_C06").Enabled=false;//Detalle						
			}else{				
				Brw.GetButtonByIDAction("P_Fin_C04").Enabled=false; //Cierre
				//Brw.GetButtonByIDAction("P_Fin_C05").Enabled=false; //abandonar
			}
		}
		
		if (!Brw.GetFieldValue("Cerrado")){
			if(LBEfectivo.ObjCorte!=null){
				if(LBEfectivo.ObjCorte.ICaja.Sys_PK==Brw.GetFieldValue("ICaja"))
					Brw.GetButtonByIDAction("P_Fin_C05").Enabled=true; // Abandonar
				else
					Brw.GetButtonByIDAction("P_Fin_C05").Enabled=false; // Abandonar
			}
		}
		
	}
	
	
}


function OpcionesCuentaEditar(PK){
	var ask;
	var A;
	ask=Application.NewAsk();
	ask.SetOption(10,"Cancelar movimiento de cuenta","Elija ésta opción si desea cancelar el movimiento seleccionado.");
	ask.SetOption(20,"Activar/desactivar movimiento conciliado","Elija ésta opción para conciliar el movimiento seleccionado.");	
	
	switch(ask.Ask())
	{
		case 10: 				
			return CancelarMovCuenta(PK);break;
		case 20:			
			return ConciliarMovCuenta(null,PK);
	}
	
	ask=null;
}



function OpcionesCuentaAgregar(){
	var ask;
	var opc;
	ask=Application.NewAsk();
	ask.SetOption(10,"Registrar cheque","Seleccione ésta opción si desea registrar un cheque. Este proceso realiza un retiro de la cuenta de cheques que seleccione.");
	ask.SetOption(20,"Registrar depósito","Elija ésta opción para registrar un déposito en la chequera seleccionada.");
	ask.SetOption(30,"Retiro","Realiza un retiro de la chequera.");
	ask.SetOption(40,"Transferencia entre cuentas","Seleccione ésta opción para hacer un transferencia entre dos cuentas de cheques.");	
	
	var Brw;
	var PKChequera;
	
	opc=ask.Ask();
	
	if(opc==0) return;
	
	Brw=null;
	Brw=Application.ActiveWindow();
	if (Brw==null){
		Log("Error: No se pudo obtener información de la chequera.");
		return 0;
	}
	
	PKChequera=Brw.sqlCommand.Parameter("PKChequera").Value;		
	switch(opc)
	{
		case 10: 				
			RegistrarCheque(null,PKChequera);break;
		case 20:
			RegistrarDeposito(null,PKChequera);break;
		case 30:
			Retiro(null,PKChequera);break;
		case 40:
			TransferenciaCuentas(null,PKChequera);
	}
	
	ask=null;
}

function ActualizarQCuentaCheques(PK){
	var Brw;	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCuentaCheque"+PK);	
	if (Brw!=null)
		Brw.RefreshRst();	
}

function QAdminCuentasCheques(){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser("qAdminCuentasCheques");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-72-00-001"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qAdminCuentasCheques");		
		Brw.Caption="Administrar cuentas de cheque";
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("SysPK",0));						
		Brw.sqlCommand.CmdType=1;		
		Brw.sqlCommand.CmdSQL=CmdSQLQCuentasCheques;
		Brw.KeyField = "Sys_PK";
	    Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarColChequeras";
		Brw.CmdAddNew="UIFinanzas.AgregarChequera";
		Brw.CmdEdit="UIFinanzas.ModificarChequera";
		Brw.CmdDelete = "UIFinanzas.EliminarChequera";
		Brw.CmdDblClick="UIFinanzas.ModificarChequera";		
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;		
		Brw.ObjectTypeName="Chequera";
		Brw.ShowToolBar();
		Brw.AddButton("Nueva chequera","P_Fin_D01");
		Brw.AddButton("Modificar chequera","P_Fin_D02");
		Brw.AddButton("Eliminar chequera","P_Fin_D03");			
		Brw.AddButton("Movimientos","P_Fin_B09");				
		Brw.AddButton("Saldo Total","P_Fin_B30");				
		Brw.Execute();		
	}
	else
		Brw.Zorder();
}

function SaldoTotalCuentas()
{

var PredDivisa; // Divisa Predeterminada
var TCambio=0;
var Cnn;
var R;
var data;
Cnn = Application.ADoCnn;



//"Mostrar: Cuenta|Saldo|TCambio |Saldo DivPred");
data="";

PredDivisa = FXConfig.DivisaPredeterminada();
sql ="Select TCambio FROM Divisa Where Sys_PK=" + PredDivisa;


	try
	{
	R = Cnn.Execute(sql);
	}catch(e){
		Log("No se pudo recuperar el tipo de cambio de la divisa predeterminada");
		return 0;
	}

	if (R==null){
		Log("No se pudo recuperar el tipo de cambio de la divisa predeterminada");
		return 0;
	}
	if (R.EOF && R.BOF) {
		Log("No se pudo recuperar el tipo de cambio de la divisa predeterminada");
		return 0;
	}

	TCambio = R.Fields("TCambio").Value;
	
	sql ="Select Chequera.Nombre,Sum(MovCuenta.Ingreso-MovCuenta.Egreso) as Saldo,Divisa.TCambio FROM ((Chequera left join Banco  on Banco.Sys_PK=Chequera.IBanco)  left join divisa on divisa.Sys_Pk=Chequera.IDivisa) left join MovCuenta ON MovCuenta.ICuenta=Chequera.Sys_PK  Group BY Chequera.Nombre,Divisa.TCambio;"
	
	if (TCambio==0) return 0;
	try
	{
		R=Cnn.Execute(sql);
		
		if (R==null){
		Log("Error al intentar recuperar Saldos. -Line: 1707");
		return 0;
		}
		if (R.EOF && R.BOF) {
		Log("Error al intentar recuperar Saldos. -Line: 1711");
		return 0;
		}
		
		while(!R.EOF)
		{
				
				if (data=="")
				{
					data =Impresora.AligTextInStr("Cuenta",20,0," " );
					data = data + Impresora.AligTextInStr("Saldo",15,1," " );
					data = data + Impresora.AligTextInStr("TCambio",10,1," " );
					data = data + Impresora.AligTextInStr("Saldo Divisa Pred",20,1," " );
					data=data +  " \r\n  \r\n";
				}
				data = data + Impresora.AligTextInStr( R.Fields("Nombre").Value,20,0," ");
				data = data + Impresora.AligTextInStr(eBasic.eFormat(R.Fields("Saldo").Value, "$ #,#.00"),15,1," ");
				data = data +  Impresora.AligTextInStr(R.Fields("TCambio").Value,10,1," ");
				data = data +  Impresora.AligTextInStr(eBasic.eFormat((R.Fields("Saldo").Value * R.Fields("TCambio").Value)/TCambio,"$ #,#.00"),20,1," ");
				data = data + "\r\n" ; 
			R.MoveNext();
		}
		
	}catch(e){
		Log("Error al intentar recuperar Saldos. -Line: 1700");
		return 0;
	}
	
	if (data!="")
	{
		
		var dlg;
		var UIO;
		
		UIO = eBasic.eCreateObject("ge_sdk_uidlg.UIDlg");
		dlg =  UIO.CreateTextDialog("Saldos totales",data,0);
		dlg.setwidth (8000);
		dlg.showdialog();
		
	}

}

function RedimensionarColChequeras(BrwName){
var Brw;
Brw=null; 
Brw=Application.Browsers.GetBrowser(BrwName);	
	if (Brw!=null){
		Brw.HideFields("Sys_PK");
		Brw.SetColumnWidth("NumCuenta",110);  
		Brw.SetColumnWidth("Nombre",200);		
		Brw.SetColumnWidth("Banco",150);
		Brw.SetColumnWidth("CodCuenta",100);			
		Brw.SetColumnWidth("CLABE",100);
		Brw.SetColumnWidth("Divisa",60);
		Brw.SetColumnWidth("Notas",200);
		Brw.SetColumnWidth("Saldo",110);
		
		Brw.SetCaptionByFieldName("NumCuenta","Número de cuenta");
		Brw.SetCaptionByFieldName("CodCuenta","Cuenta Contable");
		
		try{
			Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());				
		}catch(e){}
	}
}

function AgregarChequera(){
	if(Catalogos.dlgChequera())
		return -1;
	else
		return 0;	
}
function EliminarChequera(PK){	
	if(PK==null){
		Log("Seleccione una chequera");
		return 0;
	}
	if(Catalogos.DelChequera_BySysPK(PK))
		return -1;
	else
		return 0;
}
function ModificarChequera(PK){
	if(PK==null){
		Log("Seleccione una chequera");
		return 0;
	}
	if(Catalogos.dlgChequera_BySysPK(PK)){
		ActualizarDatosChequera(PK);		
		return -1;
	}else
		return 0;
}
function ActualizarDatosChequera(PK){
	var Brw;
	var Nombre;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCuentaCheque"+PK);
	Nombre="";
	if (Brw!=null){
		Brw.Execute();
		Nombre=Catalogos.NombreChequera(PK);
		if(Nombre!="")
			Brw.SetTitle(Nombre);	
	}
		
}

function DetallesMovCuenta(A){		
	if (parseInt(A.Context.TagData)>0)
		QCuentaCheques(parseInt(A.Context.TagData));
	else
		Log("Seleccione una cuenta de cheques.");
}

function AbrirSesionCaja(A){
	if (LBEfectivo.ShowdlgCaja()){		
		ActualizarQSesionesCaja();
		ActualizarBotonesSesionCaja();		
	}else
		Log(LBEfectivo.LastErrorDescrip);	
}

function ActualizarQSesionesCaja(){
		var Brw;
		Brw=null;
		Brw=Application.Browsers.GetBrowser("qSesionCaja");
		if (Brw!=null){
			Brw.RefreshRst();
		}
}

function ConsultarSesionesCaja(){
	QSesionesCaja();
}

//Sesiones de caja...
function QSesionesCaja(){
var Brw;
var RCaja;
Brw=null;

Brw=Application.Browsers.GetBrowser("qSesionCaja");

if (Brw==null)
	{		
		if(!Application.UIUsers.CheckItem("FX1-73-00-001"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qSesionCaja");		
		Brw.Caption="Sesiones de caja";
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKCaja",0));						
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.CmdSQL=cmdSQLCortesXCaja;
		Brw.KeyField = "Sys_PK";
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarColumnasCaja";
		Brw.CmdRowChanged="UIFinanzas.ActualizarBotonesSesionCaja";
							
		Brw.CmdDblClick="UIFinanzas.DetalleCorte";
		
		Brw.CmdLeftAddNew="UIFinanzas.AgregarCaja";
		Brw.CmdLeftEdit= "UIFinanzas.ModificarCaja";
		Brw.CmdLeftDelete = "UIFinanzas.EliminarCaja";
		Brw.CmdLeftDblClick=Brw.CmdLeftEdit;
		
		Brw.CmdAddNew="UIFinanzas.CambiarA_AgregarCaja";
		Brw.CmdEdit="UIFinanzas.CambiarA_ModificarCaja";
		Brw.CmdDelete="UIFinanzas.CambiarA_EliminarCaja";
		
		Brw.ReportsFolder=Reportes.CarpetaConta_Finanzas;
		Brw.ObjectTypeName="Corte";
		
		Brw.SubTitle1="Lista de Cajas";
		Brw.SubTitle2="Lista de Cortes";
		Brw.FilterList.sqlQuery="Select Sys_PK,Codigo,Descripcion From Caja Order By Codigo";
		Brw.FilterList.KeyField="Sys_PK";
		Brw.FilterList.ListField="Descripcion";
		Brw.FilterList.Parameter="PKCaja";
		Brw.FilterList.HaveFirstItem=-1;
		Brw.FilterList.TextFirsItem="< Todas los Cajas >";
		Brw.FilterList.FirstItemValue=0;
		Brw.FilterList.FirstItemSQL=cmdSQLCortes;
		Brw.SelectTopTab(0);
		Brw.ShowTopTabsBar();
	    
		Brw.ShowToolBar();
		Brw.AddButton("Abrir sesión de caja","P_Fin_C01");				
		Brw.AddButton("Abandonar sesión de caja","P_Fin_C05");	
		Brw.AddButton("Cierre de caja","P_Fin_C04");		
		Brw.AddButton("Ver detalles de corte","P_Fin_C06");
		Brw.Execute();		
		Brw.SetTitle("Sesiones de caja");
		Brw.ShowFilterList();
		Brw.FillFilterList();
		Brw.SetItemList(0);			

		/* Panel de Detalle - By JFrank 13Nov09 */	
		Brw.DetailFunction="UIFinanzas.DetailSaldos";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);

		
	}
	else
		Brw.Zorder();
	
	ActualizarBotonesSesionCaja();
}

function EgresoCaja(A){
	var MovCaja;
	MovCaja=LBEfectivo.ValeEgreso();
	ActualizarQDetalleCorte(MovCaja);
}
function IngresoCaja(A){
	var MovCaja;
	MovCaja=LBEfectivo.ValeIngreso();	
	ActualizarQDetalleCorte(MovCaja);
}
function ActualizarQDetalleCorte(MovCaja){
	var Brw;
	Brw=null;
	if(MovCaja!=null){
		Brw=Application.Browsers.GetBrowser("qDetalleCorte"+MovCaja.ICorte.Sys_PK);
		if (Brw!=null)
			Brw.RefreshRst();		
	}
}

function CambiarA_AgregarCaja(){	
	Application.ActiveWindow().SelectLeftList();
	return AgregarCaja();
}
function CambiarA_ModificarCaja(){	
	Application.ActiveWindow().SelectLeftList();
	return ModificarCaja(Application.ActiveWindow().Parameter("PKCaja").Value);
}
function CambiarA_EliminarCaja(){	
	Application.ActiveWindow().SelectLeftList();
	return EliminarCaja(Application.ActiveWindow().Parameter("PKCaja").Value);
}

function RedimensionarColumnasCaja(brwname){
		Brw=Application.Browsers.GetBrowser(brwname);
		Brw.HideFields("ICaja");
		Brw.HideFields("ICajero");
		Brw.HideFields("Descripcion");	
		
		Brw.SetColumnWidth("Sys_PK",50);
		Brw.SetColumnWidth("Nombre",150);	
		Brw.SetColumnWidth("Cerrado",50);	
		Brw.SetColumnWidth("FApertura",80);	
		Brw.SetColumnWidth("FCierre",80);
		Brw.SetColumnWidth("HApertura",80);
		Brw.SetColumnWidth("HCierre",80);
		Brw.SetCaptionByFieldName("Sys_PK","Folio");
		Brw.SetCaptionByFieldName("Nombre","Cajero");	

		ActualizarBotonesSesionCaja();
}

function AgregarCaja(){	
	if (Catalogos.dlgCaja()){
		ActualizarQSesionesCaja();
	}
	return 0;
}	

function EliminarCaja(PK){
	if(PK==null){
		Log("Seleccione una caja");
		return 0;
	}

	if(Catalogos.DelCaja_BySysPK(PK))
		return -1;
	else
		return 0;
}

function ModificarCaja(PK){
	if(PK==null){
		Log("Seleccione una caja");
		return 0;
	}
	if(Catalogos.dlgCaja_BySysPK(PK))
		return -1;
	else
		return 0;
}
function CierreCaja(A){
	
	if (LBEfectivo.CerrarCorte(LBEfectivo.CorteAbierto(A.Context.ActiveWindow.GetFieldValue("ICaja")))){
		eBasic.eMsgbox("La caja se ha cerrado correctamente.",6);		
		A.Context.ActiveWindow.RefreshRst();
		ActualizarBotonesSesionCaja();
	}
	else{
		Log(LBEfectivo.LastErrorDescrip);
		eBasic.eMsgbox("Error al cerrar sesión de caja",6);
	}	
}

function AbandonarSesionCaja(A){	
	if (LBEfectivo.CancelarCorte()){		
		eBasic.eMsgbox("¡Sesión de caja actual abandonada!",6);
		ActualizarBotonesSesionCaja();
	}else{
		if (LBEfectivo.LastErrorDescrip!="")
			eBasic.eMsgbox(LBEfectivo.LastErrorDescrip,6);
	}
}

function DetalleCorte(A){
	var Brw;	
	var PK;
	Brw=null;
	
	PK=Application.ActiveWindow().PrimaryKeyValue;
	if(PK==null)
		return 0;
	Brw=Application.Browsers.GetBrowser("qDetalleCorte"+PK);
	if (Brw==null){				
		Brw=Application.Browsers.CreateBrowser("qDetalleCorte"+PK);
		Brw.Caption="Detalle del Corte "+PK;
		Brw.CmdAfterRetriveFields="UIFinanzas.RedimensionarColDetalleCorte";		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKCorte",PK));	 
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.CmdSQL=cmdSQLDetalleCortes;	
		Brw.KeyField = "Folio";		
		
		
		// BY JFrank - 13 Nov
		//Brw.ShowToolBar();
		Brw.AddButton("Ver Documento","P_Fin_DC01");				
	
		Brw.Execute();
		
		//Funcionalidad del Panel de detalle -> By  JFrank : 13/Nov/09
		Brw.DetailFunction="UIFinanzas.Detail";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);

	}else
		Brw.Zorder();
}


function DetailSaldos()
{
//Panel del detalle de las seciones de Caja.
	
	var r=null;
	var p;	
	
	
	try
	{
		p=Application.GetDetailPanel();
		p.SetCaption("Saldos del Corte ");
		
		r=Application.Database.OpenRecordset("SELECT Folio as Sys_PK,Divisa,Sum(Efectivo) as Efectivo,Sum(Cheques) as Cheques,Sum(Tarjetas) as Tarjetas, Sum(Vales) as Vales, Sum(Depositos) as Depositos, Sum(Total) as Saldo FROM qrydetallecorte Where ICorte=" +p.CurrentValue + " Group By Folio,Divisa",Application.adoCnn);
		
	
		//Poner datos en el panel
		p.SetDataSource(r,"Sys_PK");
		p.HideFields("Sys_PK");
		
		p.SetColumnWidth("Divisa",150);
		p.SetColumnWidth("Efectivo",95);
		p.SetColumnWidth("Cheques",95);
		p.SetColumnWidth("Tarjetas",95);
		p.SetColumnWidth("Vales",95);		
		p.SetColumnWidth("Depositos",95);		
		p.SetColumnWidth("Saldo",95);		
	}catch(e)
	{
		Log("Error al obtener información para el panel de detalle");
		return 0 ;
	}
	

}

function Detail()
{

	var SysVenta;
	var TDocumento=0;
	var sql;
	var p;
	
	p= Application.GetDetailPanel();
	sql="Select Documento,Sys_PK as PKVenta from Venta Where IMovCaja=" + p.CurrentValue + ";";
	
	try{
		R = Application.AdoCnn.Execute(sql);
	}catch(e){
		Log("Error al intentar mostrar información del detalle de la venta");
		return 0;
	}
	
	
	if (R==null){

		p.HideGrid();
		//p.SetCaption("No se puede visulizar este tipo de documento en el panel de detalle");
		return 0;
	}
	
	if (R.EOF && R.BOF){
		p.HideGrid();
		//p.SetCaption("No se puede visulizar este tipo de documento en el panel de detalle");
		return 0;
	}
	
	
	TDocumento= R.Fields("Documento").Value;
	SysVenta =R.Fields("PKVenta").Value; 
	
	
		switch(TDocumento)
	{
		case 1:
		case 17:
		case 18:
		case 19:
		case 33:
		case 34:
		case 65:
		case 66:
		case 67:
			//MostrarDetallVenta(0);
			p.HideGrid();
			p.SetCaption("");
			break;
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			MostrarDetallVenta(SysVenta);
			break;

	}
	
	return 0;

}

function MostrarDetallVenta(PK){
	var r=null;
	var p;	
	// Mostrar Detalle de venta
	try
	{
	
		p=Application.GetDetailPanel();
		p.SetCaption("Detalle de la Venta: " + GetReferencia(PK));
		r=Application.Database.OpenRecordset("Select DVenta.Sys_PK,Producto.Descripcion as Producto,DVenta.Cantidad,DVenta.Unidad,DVenta.Precio*DVenta.Cantidad as Subtotal,DVenta.Descuento1+DVenta.Descuento2 as Descuentos, DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4 as Impuestos,(DVenta.Precio*DVenta.Cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4 as Total FRom DVenta INNER JOIN Producto ON DVenta.IProducto=Producto.Sys_PK  Where Dventa.FK_Venta_Detalle="+PK,Application.adoCnn);
		
		//Poner datos en el panel
	
		p.SetDataSource(r,"Sys_PK");
		p.HideFields("Sys_PK");
		
		p.SetColumnWidth("Producto",445);
		p.SetColumnWidth("Cantidad",90);
		p.SetColumnWidth("Unidad",90);
		p.SetColumnWidth("Subtotal",90);
		p.SetColumnWidth("Descuentos",90);
		p.SetColumnWidth("Impuestos",90);
		p.SetColumnWidth("Total",90);
		
	}
	catch(e)
	{
		Log("Error al obtener información para el panel de detalle");
		return 0 ;
	}
	
}

function GetReferencia(PK){

	var r=null;
	var s;
	try
	{
		r=Application.Database.OpenRecordset("SELECT Referencia FROM Venta WHERE Sys_PK="+PK,Application.adoCnn);
		if (!(r.EOF && r.BOF))
			s=r.Fields("Referencia").Value;
		else
			s="No se encontró la venta";
		r.Close();
		return s;
	}
	catch(e)
	{
		return "Error al buscar la venta";
	}
}

function VerDetalleDocumento()
{

var sql;
var R;
var SysVenta;
var TDocumento=0;
var PK = Application.ActiveWindow().PrimaryKeyValue;

	sql="Select Documento,Sys_PK as PKVenta from Venta Where IMovCaja=" + PK + ";";
	
	try{
		R = Application.AdoCnn.Execute(sql);
	}catch(e){
		Log("Error al intentar acceder a la información del movimiento de caja");
		return 0;
	}
	
	if (R==null){
		eBasic.eMsgbox("No se encontro documento relacionado al movimiento caja");
		return 0;
	}
	
	if (R.EOF && R.BOF){
		eBasic.eMsgbox("No se encontro documento relacionado al movimiento caja");
		return 0;
	}
	
	TDocumento= R.Fields("Documento").Value;
	SysVenta =R.Fields("PKVenta").Value; 
	
	
	switch(TDocumento)
	{
		case 1:
		case 2:
		case 17:
		case 18:
		case 19:
		case 33:
		case 34:
		case 65:
		case 66:
		case 67:
			Log("Seleccione Ticket,Remision,Factura,Nota de Credito para su visualización.");
			break;
		case 3:
		case 4:
		case 5:
			UIVentas.EditarVenta(SysVenta);
			break;
		case 6:
			MostrarTicket(SysVenta);
			break;
	
	}
	
}

function MostrarTicket(PK)
{
var dlg;
var UIO;
var data;
	UIO = eBasic.eCreateObject("ge_sdk_uidlg.UIDlg");

	Impresora.LimpiarBuffer();
	Impresora.UsarBuffer=true;
	try
	{
		if (!ModuleLoaded("pos_support"))
		{
			if (!Application.LoadScript("pos_support.js")) 
			{
			Log("El sub-programa para visualizar el ticket no pudo cargarse");
			return 0;
			}
		}
		
		if (!ModuleLoaded("prn_ticket"))
		{
			if (!Application.LoadScript("prn_ticket.js")) 
			{
			Log("El sub-programa para visualizar el ticket no pudo cargarse");
			return 0;
			}
		}
					
		Application.Eval("prn_ticket.ticket(" + PK + ");");	
			
		
	}catch(e){Log("Error al intentar cargar ticket");}
	
	
	data = Impresora.ObtenerBuffer();
	
	//data= "Mostrar Ticket: " + PK;
	if (data=="") return 0;
	Impresora.UsarBuffer=false;
	Impresora.LimpiarBuffer();
	
	dlg =  UIO.CreateTextDialog("Ticket - Referencia",data,0);
	dlg.showdialog();
	
	/* Metodos adicionales
	
	dlg.setwidth 12500
	dlg.setalig 1
	dlg.addline "Saldo del banco: $ 12, 5689.00"
	dlg.addline "Otro valor: $77.00"
	dlg.addstring "=", 20
	dlg.showdialog
	*/
}


function RedimensionarColDetalleCorte(BrwName){
	var Brw;
	var PKCorte;
	var SaldoI;
	var SaldoF;
	var Caja;
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null){				
		Brw.HideFields("ICorte");
		Brw.HideFields("ICorte");
		Brw.HideFields("ICaja");
		Brw.SetColumnWidth("Referencia",100);	
		Brw.SetColumnWidth("Categoria",80);	
		Brw.SetColumnWidth("Documento",80);
		Brw.SetColumnWidth("Divisa",80);
		Brw.SetColumnWidth("Notas",400);
		
		Caja=Brw.GetFieldValue("ICaja");
		if(Caja==null)
			Caja=0;
		PKCorte=Brw.Parameter("PKCorte").Value;
		SaldoI=LBEfectivo.SaldoIncial(PKCorte,Caja);
		SaldoF=LBEfectivo.SaldoFinal(PKCorte);		
		Brw.SetGridTitle("Saldo Inicial= " + eBasic.eFormat(SaldoI,LBEfectivo.MontosFormat) + "     Saldo Final= " +eBasic.eFormat((SaldoF+SaldoI),LBEfectivo.MontosFormat));		
	
		try{
			Brw.SetColumnWidth("Efectivo",80);
			Brw.SetColumnWidth("Cheques",80);
			Brw.SetColumnWidth("Tarjetas",80);
			Brw.SetColumnWidth("Vales",80);
			Brw.SetColumnWidth("Depositos",80);
			Brw.SetColumnWidth("Total",80);
			
			Brw.SetColumnFormat("Efectivo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Cheques",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Tarjetas",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Vales",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Depositos",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Total",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
		}catch(e){}
	
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
	Reportes.EjecutarReporte(Formato,Destino,ObjPoliza.Sys_PK,true);	
 }

function NombreChequera(PKCuenta){
	var R;
	R=Application.Database.OpenRecordset("SELECT Nombre	FROM Chequera WHERE Sys_PK="+PKCuenta);
	if(R==null){
		Log("Error al obtener nombre de chequera: "+Application.Database.LastErrorDescrip);
		return "";
	}
	if(R.BOF && R.EOF){
		Log("No se encontró la chequera indicada.");
		return "";
	}
	return R.Fields("Nombre").Value;	
}

function Command_KeyDown(KeyCode){
	if(KeyCode==null) return 0;		
	var id="";
	
	switch(KeyCode){
		case 117: //F6
			id="P_Fin_A04"; break;
		case 114: //F3
			id="P_Fin_A17"; break;
	}
	if (id!=""){ //F6		
		Application.ActiveWindow().ExecuteButtonAction(id);
	}
} 

function CerrarPoliza(objAction){
    try{
		objAction.Context.ActiveWindow.UnloadMe();
	}catch(e){}
} 
 
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
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
