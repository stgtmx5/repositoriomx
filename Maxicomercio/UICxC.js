//Versión: 0.9.0.3

//NOTA: No agregar punto y coma la final de las consultas que no lo tienen.

//var CmdSQLQGrupoCliente = "SELECT * FROM qryCatClientes WHERE PKTipoCliente=@PKTipoCli";
// By JFrank 11/sept/09

var CmdSQLQGrupoCliente = "Select qryCatClientes.*, Pais.Nombre as Pais, Edoprov.Nombre as Estado,Ciudad.Nombre as Ciudad,Zona.Nombre as Zona,TipoCliente.Descripcion as TipoCliente,Agente.Nombre AS Agente,ut_Color.uf_Color FROM (qryCatClientes LEFT JOIN ((((Cliente LEFT Join(Domicilio LEFT JOIN (Ciudad LEFT JOIN (EdoProv LEFT JOIN Pais On EdoProv.IPais=Pais.Sys_PK) ON Ciudad.Estado=EdoProv.Sys_PK) ON Domicilio.ICiudad=Ciudad.Sys_PK) ON Cliente.Domicilio1=Domicilio.Sys_PK) LEFT JOIN TipoCliente On Cliente.Tipo =TipoCliente.Sys_PK) LEFT JOIN Agente ON Cliente.Agente=Agente.Sys_PK) LEFT JOIN Zona ON Cliente.Zona=Zona.Sys_PK) ON qryCatClientes.Sys_PK=Cliente.Sys_PK) LEFT JOIN ut_Color ON (qryCatClientes.Sys_PK=ut_Color.uf_PK AND ut_Color.uf_Tabla='cliente') WHERE qryCatClientes.PKTipoCliente=@PKTipoCli";

//var CmdSQLQClientes = "SELECT * FROM qryCatClientes";  - By JFrank 11/sept/09

var CmdSQLQClientes = "Select qryCatClientes.*, Pais.Nombre as Pais, Edoprov.Nombre as Estado,Ciudad.Nombre as Ciudad,Zona.Nombre as Zona,TipoCliente.Descripcion as TipoCliente,Agente.Nombre AS Agente,ut_Color.uf_Color FROM (qryCatClientes LEFT JOIN ((((Cliente LEFT Join(Domicilio LEFT JOIN (Ciudad LEFT JOIN (EdoProv LEFT JOIN Pais On EdoProv.IPais=Pais.Sys_PK) ON Ciudad.Estado=EdoProv.Sys_PK) ON Domicilio.ICiudad=Ciudad.Sys_PK) ON Cliente.Domicilio1=Domicilio.Sys_PK) LEFT JOIN TipoCliente On Cliente.Tipo =TipoCliente.Sys_PK) LEFT JOIN Agente ON Cliente.Agente=Agente.Sys_PK) LEFT JOIN Zona ON Cliente.Zona=Zona.Sys_PK) ON qryCatClientes.Sys_PK=Cliente.Sys_PK) LEFT JOIN ut_Color ON (qryCatClientes.Sys_PK=ut_Color.uf_PK AND ut_Color.uf_Tabla='cliente')";

var CmdSQLQEstadoCuenta="SELECT * FROM qryEstadoCuentaCliente WHERE Cliente=@PKCliente";
var CmdSQLQMovimientos="SELECT * FROM qryMovimientosCliente WHERE Cliente=@PKCliente AND Mes=@Mes AND Anio=@Anio;";
var CmdSQLQMovimientosPorAnio="SELECT * FROM qryMovimientosCliente WHERE Cliente=@PKCliente AND Anio=@Anio;";
var CmdSQLQEstadoCuentaAplicable="SELECT * FROM qryestadocuentaclienteaplicables WHERE Cliente=@PKCliente AND Mes=@Mes AND Anio=@Anio";


//var CmdSQLQGrupoClientesaldo = "SELECT * FROM qryCatClientes WHERE PKTipoCliente=@PKTipoCli and saldo>0";// 
//var CmdSQLQClientessaldo = "SELECT * FROM qryCatClientes AND saldo>0";

var CmdSQLQGrupoClientesaldo = CmdSQLQGrupoCliente + " and qryCatClientes.saldo>0";// 
var CmdSQLQClientessaldo =   CmdSQLQClientes  + " WHERE qryCatClientes.saldo>0";


function CrearPanel(){
	Application.UIShortCuts.CreatePane("P_CxC","Clientes y cuentas por cobrar","","","ICON_CXC","",0);

	Application.UIShortCuts.Pane("P_CxC").CreateGroup(2,"P_CxC_G_01","Ver","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_A01","Clientes y cuentas por cobrar",0,"","","","UICxC.QCxC",0,"","","",0);
	
	Application.UIShortCuts.Pane("P_CxC").CreateGroup(2,"P_CxC_G_02","Acciones","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_B01","Agregar cliente",0,"","","","UICxC.AgregarCliente",0,"","","",0);
    Application.UIShortCuts.CreateAction("P_CxC_B02","Agregar tipo de cliente",0,"","","","UICxC.AgregarTipoCliente",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_CxC_B03","Alta de documento por cobrar",0,"","","","UICxC.AltaDxC",0,"","","",0);
	
	
	Application.UIShortCuts.CreateAction("P_CxC_B04","Ventas",0,"","","","UICxC.OpcVentas",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_B05","Informes",0,"","","","UICxC.Informes",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_CxC_B06","Agregar",0,"","","","UICxC.OpcionesAgregar",0,"","","",0);
	//Application.UIShortCuts.CreateAction("P_CxC_B07","Auto-aplicar todo",0,"","","","UICxC.AutoAplicarTodo",0,"","","",0);	
	
	//Versión 2014 - JV
	Application.UIShortCuts.CreateAction("P_CxC_B08","Doc. por cobrar",0,"","","","UICxC.AddDocXCobrar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_B09","Recibo",0,"","","","UICxC.AddRecibo",0,"","","",0);
	Application.UIShortCuts.Pane("P_CxC").CreateGroup(2,"P_CxC_G_03","Movimientos de ajuste","","",0);	
	Application.UIShortCuts.CreateAction("P_CxC_C00","Estado de cuenta",0,"","","","UICxC.QEstadoCuenta",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C01","Nota de crédito",0,"","","","UICxC.NotaCredito",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C02","Nota de cargo",0,"","","","UICxC.NotaCargo",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C03","Recibo simple",0,"","","","UICxC.Recibo",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C04","Aplicar abonos",0,"","","","UICxC.Aplicar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C10","Desaplicar abonos",0,"","","","UICxC.Desaplicar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C12","Desaplicar otros Doctos.",0,"","","","UICxC.AddAplicar",0,"","","",0);



	Application.UIShortCuts.CreateAction("P_CxC_C05","Bonificaciones",0,"","","","UICxC.Bonificaciones",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C06","Financiar documento",0,"","","","UICxC.FinanciarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C07","Financiar capital",0,"","","","UICxC.FinanciarCapital",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C08","Cobrar documento",0,"","","","UICxC.CobrarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C09","Aplicar intereses moratorios",0,"","","","UICxC.AplicarInteresesMoratorios",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_C11","Crear CFDI",0,"","","","UICxC.Timbrar",0,"","","",0);
	
	
	Application.UIShortCuts.Pane("P_CxC").CreateGroup(2,"P_CxC_G_04","Catálogos","","",0);
	Application.UIShortCuts.CreateAction("P_CxC_D01","Catálogo tipos de clientes",0,"","","","UICxC.CatalogoTiposClientes",0,"","","",0);

	
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_01").AddItem("P_CxC_A01");
	
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_02").AddItem("P_CxC_B01");
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_02").AddItem("P_CxC_B02");
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_02").AddItem("P_CxC_B03");
	
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_03").AddItem("P_CxC_C01");
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_03").AddItem("P_CxC_C02");
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_03").AddItem("P_CxC_C03");	
	
	Application.UIShortCuts.Pane("P_CxC").Group("P_CxC_G_04").AddItem("P_CxC_D01");
	}
	
function AddRecibo(PKCliente)
{
	var Cliente;
	var r;
		
	Cliente = ClienteSeleccionado();
	if(Cliente < 1) 
	{
		Log("Error al obtener datos del cliente, intentelo nuevamente por favor.");
		return -1;
	}

	if (!AbrirCaja()) return;	
	r=null;
	r=CuentasXCobrar.Recibo(LBEfectivo.objCorte,Cliente);
	if(r!=null){
		Application.MouseHourglass();
		Poliza.PolizaReciboCXC(Recibo.Sys_PK);
		Application.MouseDefault();
		if (eBasic.eMsgbox("Se ha creado un Recibo. ¿Desea imprimir el documento?", 4)==6){
			Reportes.EjecutarReporte(FXConfig.FormatoRecibo(),2,Recibo.Sys_PK,true);
		}
		
		if(Application.ActiveWindow().ObjectTypeName=="DCXC")
				Application.ActiveWindow().RefreshRst();		
		
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
}

function AddDocXCobrar(PKCliente)
{
	var Cliente;

	Cliente = ClienteSeleccionado();
	
	if(Cliente < 1)
	{
		Log("Error al obtener datos del cliente, intentelo nuevamente por favor.");
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

function AddAplicar(A,Brw)
{
	var Cliente;
var Cliente;	
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	
	if(CuentasXCobrar.Aplicar(Cliente)){
		if (A!=null)			
			A.Context.ActiveWindow.RefreshRst();
		else			
			if (Brw!=null) Brw.RefreshRst();		
	}		
	else
		Log(CuentasXCobrar.LastErrorDescrip);
		
}	

function NotaCredito(A,Brw)
{
	var Cliente;
	var NCredito;
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
		
	NCredito=null;
	NCredito=CuentasXCobrar.NotaCredito(Cliente);
	if(NCredito!=null){
		Application.MouseHourglass();
		Poliza.PolizaNotaCreditoCXC(CuentasXCobrar.ResultadoCXC);
		Application.MouseDefault();
		if (eBasic.eMsgbox("Se ha creado una Nota de Crédito. ¿Desea imprimir el documento?", 4)==6){
			Reportes.EjecutarReporte(FXConfig.FormatoNotaCreditoCXC(),2,NCredito.Sys_PK,true);
		}
		
		if (Brw!=null) 
			Brw.RefreshRst();
		else{	
			if(Application.ActiveWindow().ObjectTypeName=="DCXC")
				Application.ActiveWindow().RefreshRst();		
		}
			
		
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
}

function NotaCargo(A,Brw)
{
	var Cliente;
	var NCargo;
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	
	NCargo=null;
	NCargo=CuentasXCobrar.NotaCargo(Cliente);
	if(NCargo!=null){
		Application.MouseHourglass();
		Poliza.PolizaNotaCargoCXC(CuentasXCobrar.ResultadoCXC);
		Application.MouseDefault();
		
		if (eBasic.eMsgbox("Se ha creado una Nota de Cargo. ¿Desea imprimir el documento?", 4)==6){
			Reportes.EjecutarReporte(FXConfig.FormatoNotaCargo(),2,NCargo.Sys_PK,true);
		}
		
		if (Brw!=null) 
			Brw.RefreshRst();
		else{	
			if(Application.ActiveWindow().ObjectTypeName=="DCXC")
				Application.ActiveWindow().RefreshRst();
		}		
	}else	
		Log(CuentasXCobrar.LastErrorDescrip);
}
function Recibo(A,Brw)
{		
	var Cliente;
	var Recibo;
	if (!AbrirCaja()) return;		
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	Recibo=null;
	Recibo=CuentasXCobrar.Recibo(LBEfectivo.objCorte,Cliente);
	if(Recibo!=null){
		Application.MouseHourglass();
		Poliza.PolizaReciboCXC(Recibo.Sys_PK);
		Application.MouseDefault();
		if (eBasic.eMsgbox("Se ha creado un Recibo. ¿Desea imprimir el documento?", 4)==6){
			Reportes.EjecutarReporte(FXConfig.FormatoRecibo(),2,Recibo.Sys_PK,true);
		}
		
		if (Brw!=null) 
			Brw.RefreshRst();
		else{	
			if(Application.ActiveWindow().ObjectTypeName=="DCXC")
				Application.ActiveWindow().RefreshRst();		
		}
		
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
}
function Bonificaciones(A,Brw)
{
	var Doc=0;
	var Aplicable;	
		
	Aplicable=true;
	if (A!=null){ 
		Brw=A.Context.ActiveWindow;		
	}else{		//EL METODO SE LLAMÓ DESDE METODO ASK : OpcEdoCUENTA	
		if (Brw==null)
			return 0;
	}
	Doc=Brw.PrimaryKeyValue;		
	if (Brw.sqlCommand.Parameter("Info").Value==1)
		Aplicable=Brw.GetFieldValue("Aplicable");		
	if (Doc==null){
		Log("Seleccione un documento");
		return 0;
	}
	//if (!AbrirCaja()) return;	
	if (Aplicable==true){
		if(CuentasXCobrar.Bonificar(Doc)){//,LBEfectivo.objCorte))			
			Application.MouseHourglass();
			Poliza.PolizaBonificacionCXC(CuentasXCobrar.ResultadoCXC);
			Application.MouseDefault();
			Brw.RefreshRst();
		}else
			Log(CuentasXCobrar.LastErrorDescrip);
	}else
		Log("Error Bonificar: No se puede bonificar el documento seleccionado");		
}

function FinanciarDocumento(A,Brw)
{
	var Doc=0;
	var Aplicable;
	
	Aplicable=true;
	if (A!=null){ 				
		Brw=A.Context.ActiveWindow;				
	}else{		//EL METODO SE LLAMÓ DESDE METODO ASK : OpcEdoCUENTA
		if (Brw==null)
			return 0;
	}	
			
	Doc=Brw.PrimaryKeyValue;
	if (Brw.sqlCommand.Parameter("Info").Value==1)
			Aplicable=Brw.GetFieldValue("Aplicable");
	if (Doc==null){
		Log("Seleccione un documento");
		return 0;
	}
	if (Aplicable==true){	
		if(CuentasXCobrar.FinanciarDocumento(Doc)){
			Application.MouseHourglass();
			Poliza.PolizaIntFinancierosCXC(CuentasXCobrar.Blogic.ResultadoLGCXC);
			Application.MouseDefault();
			
			//imprimir reporte
			if (eBasic.eMsgbox("Los pagarés se crearon correctamente. ¿Desea imprimirlos?", 4)==6){
				if(CuentasXCobrar.Blogic.Resultado(CuentasXCobrar.Blogic.ResultadoLGCXC,0)!=1){ //si no es financiar documento
					eBasic.eMsgbox("Error al obtener lista de pagarés.",6);
					return 0;
				}			
				var Pagares;			
				Pagares=CrearListaPagares(CuentasXCobrar.Blogic.ResultadoLGCXC);
				if(Pagares==""){
					eBasic.eMsgbox("Error al obtener lista de pagarés.",6);
					return 0;
				}
				//El reporte de pagare debe tener un parámetro llamado pPagares donde se almacenarán las claves primarias de los pagares generados en una cadena separado por comas.
				Reportes.EjecutarReporte(FXConfig.FormatoPagare(),2,0,true,"","pPagares",Pagares);
			}
			
			
			
			Brw.RefreshRst();
		}else
			Log(CuentasXCobrar.LastErrorDescrip);
	}else
		Log("Error Financiar documento: No se puede financiar el documento seleccionado");		

}
function FinanciarCapital(A,Brw)
{	
	var Cliente=0;
	if(A!=null){		
		Cliente=ObtenerCliente(A);
	}else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
		
	if(CuentasXCobrar.FinanciarCapital(Cliente)){
		Application.MouseHourglass();
		Poliza.PolizaIntFinancierosCXC(CuentasXCobrar.Blogic.ResultadoLGCXC);
		Application.MouseDefault();
		
		//imprimir reporte
		if (eBasic.eMsgbox("Los pagarés se crearon correctamente. ¿Desea imprimirlos?", 4)==6){
			if(CuentasXCobrar.Blogic.Resultado(CuentasXCobrar.Blogic.ResultadoLGCXC,0)!=0){ //si no es financiar capital
				eBasic.eMsgbox("Error al obtener lista de pagarés.",6);
				return 0;
			}			
			var Pagares;			
			Pagares=CrearListaPagares(CuentasXCobrar.Blogic.ResultadoLGCXC);
			if(Pagares==""){
				eBasic.eMsgbox("Error al obtener lista de pagarés.",6);
				return 0;
			}
			//El reporte de pagare debe tener un parámetro llamado pPagares donde se almacenarán las claves primarias de los pagares generados en una cadena separado por comas.
			Reportes.EjecutarReporte(FXConfig.FormatoPagare(),2,0,true,"","pPagares",Pagares);
		}
		
		if (Cliente>0 && A!=null)
			A.Context.ActiveWindow.RefreshRst();
		else
			if (Brw!=null) Brw.RefreshRst();
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
		
		
}

function CrearListaPagares(mResultado){
	var I;
	var Lista;
	var PK;
	Lista="";
	I=0;
	PK=0;			
	do{	
		PK=CuentasXCobrar.Blogic.Resultado(mResultado,6,I);
		if(PK>0){
			if(Lista=="")
				Lista=""+PK;
			else
				Lista=Lista+","+PK;		
		}		
		I=I+1;
	}while(PK>0);
	return Lista;
}

function CobrarDocumento(A,Brw)
{	
	var Doc=0;
	var Aplicable;
	Aplicable=true;
		
	if (A!=null){ //EL METODO SE LLAMÓ DESDE METODO ASK : OpcEdoCUENTA
		Brw=A.Context.ActiveWindow;				
	}else{
		if(Brw==null)
			return 0;
	}
	Doc=Brw.PrimaryKeyValue;
	if (Brw.sqlCommand.Parameter("Info").Value==1)
			Aplicable=Brw.GetFieldValue("Aplicable");
			
	if (Doc==null){
		Log("Seleccione un documento");
		return 0;
	}

	if (!AbrirCaja()) return;
	
	if (Aplicable==true){
		if (CuentasXCobrar.CobrarDocumento(Doc,LBEfectivo.objCorte)){
			Application.MouseHourglass();
			Poliza.PolizaCobroCXC(CuentasXCobrar.ResultadoCXC);
			Application.MouseDefault();			
			Brw.RefreshRst();
			
			//intentar crear comprobante fiscal 
			//gb 10022012
			//---------------------------------
			//if(gFunciones.CFDActivo()){
				if(LBCXC.posibleGenerarComprobanteFiscal(Doc)){
					cfd.crearCFDCXC2(Doc);
				}
			//}
			//---------------------------------						
			
		}else
			Log(CuentasXCobrar.LastErrorDescrip);
	}else
		Log("Error Cobrar documento: No se puede cobrar el documento seleccionado");
	
}


function Aplicar(A,Brw){
	
	var Cliente;	
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	
	var qname="";
	if (Application.cAppInfo.Name=="MaxiComercio")
	qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
	else if (Application.cAppInfo.Name=="Deminus")
	qname=Application.CurrCnnInfo.Name+"@Deminus.R5";
	else if (Application.cAppInfo.Name=="ContaBlink")
	qname=Application.CurrCnnInfo.Name+"@ContaBlink.R5";
	else
	qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";

	var CXC=eBasic.eCreateObject("Induxsoft.SE.ERP.UIAplCxC.COMShell");
	CXC.Qname = qname;
	CXC.pkCliente = Cliente;
	
	if (CXC.AbrirApl()){
	Log("Error al abrir la extención APLCXC");
	return false;
	}
	
	
	/* 
	var CXC=eBasic.eCreateObject("Induxsoft.SE.ERP.UIAplCxC.dlgAplicarA");
	if(!CXC.LoadFromADOConnection()){
			Log("Error al cargar documento CXC");
			return false;
		}

	Induxsoft.SE.ERP.UIAplCxC
	
	--------------------
	
	var Cliente;	
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	if(CuentasXCobrar.Aplicar(Cliente)){
		if (A!=null)			
			A.Context.ActiveWindow.RefreshRst();
		else			
			if (Brw!=null) Brw.RefreshRst();		
	}		
	else
		Log(CuentasXCobrar.LastErrorDescrip);	
	*/
}

function Desaplicar(A,Brw){
	
	var Cliente;	
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	
	var qname="";
	if (Application.cAppInfo.Name=="MaxiComercio")
	qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
	else if (Application.cAppInfo.Name=="Deminus")
	qname=Application.CurrCnnInfo.Name+"@Deminus.R5";
	else if (Application.cAppInfo.Name=="ContaBlink")
	qname=Application.CurrCnnInfo.Name+"@ContaBlink.R5";
	else
	qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";

	var CXC=eBasic.eCreateObject("Induxsoft.SE.ERP.UIAplCxC.COMShell");
	CXC.Qname = qname;
	CXC.pkCliente = Cliente;
	
	if (CXC.AbrirDes()){
	Log("Error al abrir la extención APLCXC");
	return false;
	}
}

function Timbrar(A,Brw){
	
	var Cliente;	
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
	
	var qname="";
	if (Application.cAppInfo.Name=="MaxiComercio")
	qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
	else if (Application.cAppInfo.Name=="Deminus")
	qname=Application.CurrCnnInfo.Name+"@Deminus.R5";
	else if (Application.cAppInfo.Name=="ContaBlink")
	qname=Application.CurrCnnInfo.Name+"@ContaBlink.R5";
	else
	qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";

	var CXC=eBasic.eCreateObject("Induxsoft.SE.ERP.UIAplCxC.COMShell");
	CXC.Qname = qname;
	CXC.pkCliente = Cliente;
	
	if (CXC.AbrirComplPago()){
	Log("Error al abrir la extención APLCXC");
	return false;
	}
}

function AltaDxC(A,Brw)
{
	var Cliente=0;
	
	if(A!=null)
		Cliente=ObtenerCliente(A);
	else{		
		if (Brw!=null)
			Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;
		else
			Cliente=0;
	}
				
	if(CuentasXCobrar.DocXCobrar(Cliente)!=null){
		Application.MouseHourglass();
		Poliza.PolizaDocumentoXCobrar(CuentasXCobrar.ResultadoCXC);
		Application.MouseDefault();
		
		if(CuentasXCobrar.TipoNuevoDocumento==18){
			if (eBasic.eMsgbox("¿Desea imprimir el documento?", 4)==6){					
				var PK;
				PK=CuentasXCobrar.Resultado(CuentasXCobrar.ResultadoCXC,1);
				// switch(CuentasXCobrar.TipoNuevoDocumento){
					// case 3: //remisión
						// Reportes.EjecutarReporte(FXConfig.FormatoRemision(),2,PK,true);break;
					// case 4: //Factura
						// Reportes.EjecutarReporte(FXConfig.FormatoFactura(),2,PK,true);break;
					// case 18: //Pagare
						Reportes.EjecutarReporte(FXConfig.FormatoPagare(),2,PK,true,null,null,null,"DCXC");
					//case 6: //ticket					
				//
			}
		}
		if (Brw!=null) 
			Brw.RefreshRst();
		else{	
			if(Application.ActiveWindow().ObjectTypeName=="DCXC")
				Application.ActiveWindow().RefreshRst();		
		}
			
	}else
		Log(CuentasXCobrar.LastErrorDescrip);
		
		
}

function AbrirCaja(){
  //comprobar que haya una caja abierta
  if (LBEfectivo.objCorte==null) 
		if (!LBEfectivo.ShowdlgCaja()) return 0;
		
  return -1;
}


function ObtenerCliente(Accion){
//Buscar la clave del cliente .. del parametro PKcliente	
	if (Accion.Context.ActiveWindow!=null){		
		if (Accion.Context.ActiveWindow.Parameter("PKCliente")!=null)			
			return (Accion.Context.ActiveWindow.Parameter("PKCliente").Value);
		else{
			try{
				var p=Accion.Context.ActiveWindow.PrimaryKeyValue;
				if(p>0)
					return p;
				else
					return 0;
			}catch(e){
				return 0;
			}
		}
	}else
		return 0;	
}

function OpcAgregarTipoCliente(){
var ask;
var Brw=null;

	ask=Application.NewAsk();
	ask.SetOption(1,"Agregar Tipo de Cliente","Crear un nuevo Tipo para clasificar Clientes.");
	ask.SetOption(2,"Agregar Cliente","Agregar un nuevo Cliente.");
	switch(ask.Ask())
	{
		case 1:
			return AgregarTipoCliente(null);break;
		case 2:
			return AgregarCliente();			
	}
}

function OpcModificarTipoCliente(PK){
var ask;
	ask=Application.NewAsk();
	ask.SetOption(1,"Modificar Tipo de Cliente","Modificar el tipo de cliente seleccionado.");
	ask.SetOption(2,"Modificar Cliente","Modificar cliente seleccionado.");
	switch(ask.Ask())
	{
		case 1:
			return ModificarTipoCliente(PK);break;
		case 2:
			return ModificarCliente(ClienteSeleccionado());			
	}
}

function OpcEliminarTipoCliente(PK){
var ask;
var Brw=null;

	ask=Application.NewAsk();
	ask.SetOption(1,"Eliminar Tipo de Cliente","Eliminar el tipo de cliente seleccionado.");
	ask.SetOption(2,"Eliminar Cliente","Eliminar cliente seleccionado.");
	switch(ask.Ask())
	{
		case 1:
			return EliminarTipoCliente(PK);break;
		case 2:
			return EliminarCliente(ClienteSeleccionado());			
	}
}

function AgregarTipoCliente(A)
{
	if(Catalogos.dlgTipoCliente())
		ActualizarClientes();
}
function ModificarTipoCliente(PK)
{
	if(PK==null){
		Log("Seleccione un tipo de cliente");
		return 0;
	}
	if (Catalogos.dlgTipoCliente_BySysPK(PK))
		ActualizarClientes();
}

function EliminarTipoCliente(PK)
{
	if(PK==null){
		Log("Seleccione un tipo de cliente");
		return 0;
	}
	if (Catalogos.DelTipoCliente_BySysPK(PK))
		ActualizarClientes();
}
function ClienteSeleccionado(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCXC");
	if (Brw!=null)
		return Brw.PrimaryKeyValue;
	else{
		Log("Error cuentas por cobrar: No se pudo obtener cliente seleccionado.");
		return 0;
	}
}

function ActualizarClientes(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCXC");
	if (Brw!=null)
		Brw.RefreshRst();
}

function CatalogoTiposClientes()
{
	Catalogos.BrwTiposClientes();
	ActualizarClientes();
}

function AgregarCliente(){
	if (Catalogos.dlgCliente_BySysPK()){		
		ActualizarClientes();		
	}
}

function ModificarCliente(PK)
{		
	var Brw;	
	if(PK==null){
		Log("Seleccione un cliente");
		return 0;
	}
	if(Catalogos.dlgCliente_BySysPK(PK)){
		Brw=null;
		Brw=Application.Browsers.GetBrowser("qEstadoCuentaCliente_"+PK);
		if (Brw!=null)
			Brw.SetTitle(CuentasXCobrar.NombreCliente(PK));
		return -1;
	}else
		return 0;
}

function EliminarCliente(PK)
{
var saldo=0;
	if(PK==null) PK=0;		
	if(PK==0){
		Log("Seleccione un cliente");
		return 0;
	}
	
	saldo=LBCXC.SaldoCliente(PK);
	saldo=saldo.toFixed(LBCXC.DecPreMontos);
	if(saldo!=0){
		eBasic.eMsgbox("No se puede eliminar un cliente con saldo diferente de cero.",6);
		return 0;
	}
	
	if(eBasic.eMsgbox("¿Está seguro que desea eliminar el elemento seleccionado?",4)==7)
		return 0;
		
	if (Catalogos.DelCliente_BySysPK(PK,false)) 
		return -1;		
	else{
		if(MXCAsistentes.DarBajaElemento(2,PK))
			return -1;
		else
			return 0;
	}	
}

//Ventana de clientes - cuentas x cobrar
function QCxC(){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser("qCXC");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-50-01-000"))  //PERMITIR ACCESO
			return 0;
		
		Brw=Application.Browsers.CreateBrowser("qCXC");
		Brw.Caption="Cuentas por cobrar";
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKTipoCli",0));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("FiltroSaldos",1));		
		Brw.sqlCommand.CmdSQL=CmdSQLQGrupoCliente;
		Brw.KeyField = "Sys_PK";
		Brw.CmdAfterRetriveFields="UICxC.RedimensionarColumnas";
	    Brw.CmdAddNew="UICxC.AgregarCliente";
		Brw.CmdEdit="UICxC.ModificarCliente";
		Brw.CmdDelete = "UICxC.EliminarCliente";
		Brw.CmdDblClick="UICxC.dblClickEvent";
		Brw.CmdLeftAddNew="UICxC.OpcAgregarTipoCliente";
		Brw.CmdLeftEdit= "UICxC.ModificarTipoCliente";
		Brw.CmdLeftDelete = "UICxC.OpcEliminarTipoCliente";
		Brw.CmdLeftDblClick=Brw.CmdLeftEdit;		
		Brw.CmdLeftClick="UICxC.FiltrarPorSaldo";
		Brw.SubTitle1="Tipos de Clientes";
		Brw.SubTitle2="Clientes";
		Brw.FilterList.sqlQuery="Select Sys_PK, Descripcion From tipocliente Order By Descripcion";
		Brw.FilterList.KeyField="Sys_PK";
		Brw.FilterList.ListField="Descripcion";
		Brw.FilterList.Parameter="PKTipoCli";
		Brw.FilterList.HaveFirstItem=-1;
		Brw.FilterList.TextFirsItem="< Todos los Tipos >";
		Brw.FilterList.FirstItemValue=0;
		Brw.FilterList.FirstItemSQL=CmdSQLQClientes;
		
		Brw.ReportsFolder=Reportes.CarpetaCXC;		
		Brw.ObjectTypeName="Cliente";
		
		Brw.ShowToolBar();
		Brw.AddButton("Agregar...","P_CxC_B06");
		Brw.AddButton("Estado de cuenta","P_CxC_C00");
		Brw.AddButton("Vender","P_CxC_B04");
		
		/*Versión 2014*/
		Brw.AddButton("Doc. por cobrar","P_CxC_B08");
		Brw.AddButton("Recibo","P_CxC_B09");
/* ojo*/
		Brw.AddButton("Aplicar abonos","P_CxC_C04");
		Brw.AddButton("Desaplicar abonos","P_CxC_C10");

		Brw.AddButton("Aplicar otros Doctos.","P_CxC_C12");

		// Brw.AddButton("Desaplicar abonos","P_CxC_B11");
		
		//Brw.AddButton("Auto-aplicar todo","P_CxC_B07");
		Brw.AddButton("Informes","P_CxC_B05");		
		
		
		Brw.TopTabParameter="FiltroSaldos";		
		Brw.CmdTopTabClick="UICxC.FiltrarPorSaldo";
		Brw.AddTopTab("Todos los clientes",1);
		Brw.AddTopTab("Clientes con saldo",2);
		Brw.AddTopTab("Clientes sin saldo",3);
		Brw.AddTopTab("Clientes con acuerdos de pago",4);
		Brw.ShowTopTabsBar();
		Brw.SelectTopTab(0);
		
		Brw.ShowFilterList();
		Brw.FillFilterList();
		Brw.SetItemList(0);		
		Brw.ShowFindBar();
		
		//Funcionalidad del panel de Detalle - > By J.Frank
		Brw.DetailFunction="UICxC.Detail";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="ut_Color";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="Cliente";
	}
	else
		Brw.Zorder();
}

function dblClickEvent(PK)
{
	var Brw;
	var Filtro;
	Brw=null;	
	Brw=Application.Browsers.GetBrowser("qCXC");
	if (Brw!=null){
		if (Filtro==null) Filtro=Brw.Parameter("FiltroSaldos").Value;
		switch(Filtro)
		{
			case 4: historialAcuerdos(PK);break;
			default: ModificarCliente(PK);
		}
	}
}

function historialAcuerdos(PKCliente)
{
	try
	{
		var NProyecto = eBasic.eCreateObject("ReportesVentas.rptVentas");
		var cObj = Application.InternalObject("UIDef");
		var motorBD = cObj.inDataBaseType;
		if(NProyecto==null)
		{
			eBasic.eMsgbox("Error al crear el objeto NProject", 6);
			return false;
		}
		
		if(PKCliente == null || PKCliente == 0)
		{
			eBasic.eMsgbox("Debe seleccionar un cliente.", 6);
			return false;
		}
		
		NProyecto.Conexion = Application.ADOCnn;
		NProyecto.eUISS = Application.UIUsers;
		//eBasic.eMsgbox(motorBD);
		NProyecto.SQLServer = (motorBD == 1 ? true : false);
		
		if(!NProyecto.AdmonAcuerdoDePago(PKCliente))
		{
			eBasic.eMsgbox(NProyecto.LastError, 6);
		}
		else
		{
			return NProyecto.AcuerdoEstablecido;
		}
	}
	catch(e)
	{
		eBasic.eMsgbox(e.message, 6);
	}
}

function Detail(){

var r=null;
var dtls;

try
	{
	
		dtls=Application.GetDetailPanel();
		dtls.SetCaption("Documentos del Cliente: " + GetNameClient(dtls.CurrentValue));
		r=Application.Database.OpenRecordset("SELECT * FROM qryEstadoCuentaCliente WHERE Cliente="+dtls.CurrentValue,Application.adoCnn);
		
		//Poner datos en el panel
		dtls.SetDataSource(r,"Sys_PK");
		dtls.HideFields("Sys_PK;Cliente");
		
		dtls.SetColumnWidth("Documento",100);
		dtls.SetColumnWidth("Referencia",115);
		dtls.SetColumnWidth("Fecha",85);
		dtls.SetColumnWidth("Vencimiento",85);
		dtls.SetColumnWidth("Importe",100);
		dtls.SetColumnWidth("Cargos",100);
		dtls.SetColumnWidth("Bonificaciones",100);
		dtls.SetColumnWidth("Cobros",100);
		dtls.SetColumnWidth("Saldo",100);
		
	}
	catch(e)
	{
		Log("Error al obtener información para el panel de detalle");
		return;
	}
}

function GetNameClient(PK){
	var r=null;
	var s;
	
	try
	{
		r=Application.Database.OpenRecordset("Select Nombre FROM Cliente Where Sys_PK="+PK,Application.adoCnn);
		if (!(r.EOF && r.BOF))
			s=r.Fields("Nombre").Value;
		else
			s="No se encontró el producto";
		r.Close();
		return s;
	}
	catch(e)
	{
		return "Error al buscar el Cliente";
	}
}

function FiltrarPorSaldo(Filtro){
	var Brw;
	var sExt1;
	var sExt2;
	Brw=null;	
	Brw=Application.Browsers.GetBrowser("qCXC");
	if (Brw!=null){
		if (Filtro==null) Filtro=Brw.Parameter("FiltroSaldos").Value;
		switch(Filtro){
			case 1: sExt1="";sExt2="";break;
			//case 2: sExt1=" AND Saldo<>0";sExt2=" WHERE Saldo<>0";break;
			//case 3:	sExt1=" AND Saldo=0";sExt2=" WHERE Saldo=0";
			//By JFrank -> 11/Sept/09
			case 2: sExt1=" AND qryCatClientes.Saldo<>0";sExt2=" WHERE qryCatClientes.Saldo<>0";break;
			case 3:	sExt1=" AND qryCatClientes.Saldo=0";sExt2=" WHERE qryCatClientes.Saldo=0";break;
			case 4:	sExt1=" AND qryCatClientes.AcuerdosPendientes0";sExt2=" WHERE qryCatClientes.AcuerdosPendientes0=0";
			
			//case 2: sExt1=" AND Saldo>0";sExt2=" WHERE Saldo>0";break;
			//case 3:	sExt1=" AND Saldo<=0";sExt2=" WHERE Saldo<=0";
		}
		if (Brw.Parameter("PKTipoCli").Value==0){
			Brw.sqlCommand.CmdSQL=CmdSQLQClientes+sExt2;
			Brw.FilterList.FirstItemSQL=CmdSQLQClientes+sExt2;
		}else{
			Brw.sqlCommand.CmdSQL=CmdSQLQGrupoCliente+sExt1;
		}		
	}else{
		Log("No se pudo obtener el formulario de clientes.");		
	}
	return -1;
}

function RedimensionarColumnas(BrwName){
	var Brw;
	Brw=null;

	Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null)
	{
		Brw.HideFields("Sys_PK;PKTipoCliente;uf_Color");		
		Brw.SetColumnWidth("Codigo",80);	
		Brw.SetColumnWidth("Nombre",250);	
		Brw.SetColumnWidth("RFC",100);			
		Brw.SetColumnWidth("Direccion",250);
		Brw.SetColumnWidth("Colonia",120);					
		Brw.SetColumnWidth("Codigo_Postal",80);	
		Brw.SetColumnWidth("Telefono",120);
		Brw.SetColumnWidth("eMail",120);
		Brw.SetColumnWidth("Saldo",80);
		Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
		
		
		Brw.SetColumnWidth("Pais",100);
		Brw.SetColumnWidth("Estado",100);
		Brw.SetColumnWidth("Ciudad",150);
		Brw.SetColumnWidth("Zona",100);
		Brw.SetColumnWidth("TipoCliente",150);
		Brw.SetColumnWidth("Agente",200);
		
		Brw.SetCaptionByFieldName("Codigo_Postal","Código Postal");
		Brw.SetCaptionByFieldName("TipoCliente","Tipo de cliente");		
	}
}

function Vender(){	
	eBasic.eMsgbox("Abrir ventas");
}

function Informes(){
	Application.MasInformesYGraficos();
}

function QEstadoCuenta(A){
var Brw;
var Cliente;
Brw=null;
Cliente=A.Context.TagData;
if(Cliente==null){
	Log("Seleccione un cliente");
	return 0;
}
Brw=Application.Browsers.GetBrowser("qEstadoCuentaCliente_"+Cliente);
if (Brw==null)
	{
		Application.MouseHourglass();
		CuentasXCobrar.RedondearSaldos(Cliente);
		Application.MouseDefault();
		
		Brw=Application.Browsers.CreateBrowser("qEstadoCuentaCliente_"+Cliente);				
		Brw.Caption="Estado de cuenta: "+ A.Context.ActiveWindow.GetFieldValue("Nombre"); //+ Nombre del proveedor
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
		
		Brw.SetTitle(A.Context.ActiveWindow.GetFieldValue("Nombre"));
		
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
		//if(gFunciones.CFDActivo()){
		var txtDoc="CFD";
		try{ txtDoc=cfd.textTipoComprobanteConfigurado()}catch(ex){txtDoc="CFD";}
		//Brw.AddButton("Crear "+txtDoc,"CFD_A09"); //CFD 2010
		Brw.AddButton("Crear "+txtDoc,"P_CxC_C11")
		Brw.AddButton("Cancelar "+txtDoc,"CFD_A09b"); //CFD 16122011
		//}
		Brw.ShowToolBar();
		
		Brw.TopTabParameter="Info";
		Brw.CmdTopTabClick="UICxC.ConfigurarBrowser";
		Brw.CmdBottomTabClick="UICxC.ReasignarConsulta";
		Brw.CmdAfterRetriveFields="UICxC.RedimensionarColEstadoCuenta";
		Brw.AddTopTab("Documentos",0);
		Brw.AddTopTab("Movimientos",1);
		Brw.AddTopTab("Documentos Saldados",2);
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
	Tab=Brw.Parameter("Info").Value;
	if (Tab==0){
		//Documentos con saldo
		Brw.sqlCommand.CmdSQL=CmdSQLQEstadoCuenta;
		Brw.HideBottomCombo();
		Brw.HideBottomTabsBar();		
		DesactivarBotonesEstadoCuenta(Brw,true);
		ActivarTimbrado(Brw,true);
	}else if (Tab==1){		
		//Todos los movimientos
		if (Brw.Parameter("Mes").Value==0)
			Brw.sqlCommand.CmdSQL=CmdSQLQMovimientosPorAnio;
		else
			Brw.sqlCommand.CmdSQL=CmdSQLQMovimientos;
			
		Brw.ShowBottomCombo();
		Brw.ShowBottomTabsBar();
		DesactivarBotonesEstadoCuenta(Brw,false)
		ActivarTimbrado(Brw,false);
	}
	else
	{
		Brw.sqlCommand.CmdSQL=CmdSQLQEstadoCuentaAplicable;
		Brw.ShowBottomCombo();
		Brw.ShowBottomTabsBar();
		DesactivarBotonesEstadoCuenta(Brw,false);		
		ActivarTimbrado(Brw,true);
	}

}

function DesactivarBotonesEstadoCuenta(Brw,Activar){	
	Brw.GetButtonByIDAction("P_CxC_C05").Enabled=Activar;
	Brw.GetButtonByIDAction("P_CxC_C06").Enabled=Activar;
	Brw.GetButtonByIDAction("P_CxC_C08").Enabled=Activar;	
	
	
}

function ActivarTimbrado(Brw,Activar)
{
	try
	{
		Brw.GetButtonByIDAction("CFD_A09b").Enabled=Activar;
	}
	catch(e)
	{ }
	//Brw.GetButtonByIDAction("CFD_A09").Enabled=Activar;
	
}

function ReasignarConsulta(){
	//Tab superior seleccionado es el 1
	ConfigurarBrowser(1);	
}

function RedimensionarColEstadoCuenta(){
	Brw=Application.ActiveWindow();	
	if (Brw==null) return;
	
	Brw.HideFields("Sys_PK;Cliente;Aplicable;Dia;Mes;Anio;ND_Aplicacion;IntMoratorios;Bonificaciones;Tipo;Zona;Pagos");
		//Brw.SetGridTitle("");
	if (Brw.sqlCommand.Parameter("Info").Value==0){
		
		Brw.SetGridTitle(SaldoCliente(Brw.sqlCommand.Parameter("PKCliente").Value));
		
		Brw.SetColumnWidth("Documento",100);
		Brw.SetColumnWidth("Referencia",130);
		Brw.SetColumnWidth("Fecha",80);
		Brw.SetColumnWidth("Vencimiento",80);
		Brw.SetColumnWidth("Importe",90);
		Brw.SetColumnWidth("Cargos",90);
		Brw.SetColumnWidth("Bonificaciones",90);
		Brw.SetColumnWidth("Cobros",90);
		Brw.SetColumnWidth("Saldo",90);		
		Brw.HideBottomCombo();
		Brw.HideBottomTabsBar();

		try{
			Brw.SetColumnFormat("Importe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Cargos",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Bonificaciones",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Cobros",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());			
		}catch(e){}
		
	}else {
		
		if (Brw.sqlCommand.Parameter("Info").Value==1)
			Brw.SetGridTitle(SaldoMovimientos(Brw));
		else
			Brw.SetGridTitle("");	
		
		Brw.SetColumnWidth("Documento",100);
		Brw.SetColumnWidth("Referencia",130);
		Brw.SetColumnWidth("Fecha",80);
		Brw.SetColumnWidth("Vencimiento",80);
		Brw.SetColumnWidth("Concepto",500);
		Brw.SetColumnWidth("Debe",90);
		Brw.SetColumnWidth("Haber",90);								
		Brw.ShowBottomCombo();
		Brw.ShowBottomTabsBar();	
		
		try{
			Brw.SetColumnFormat("Debe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Haber",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());			
		}catch(e){}
		
	}	

}


function SaldoCliente(PKCliente){	
	var	AbonosXAplicar;
	var SCliente;		
		AbonosXAplicar=0;
		AbonosXAplicar=LBCXC.AbonosSinAplicar(PKCliente);				
		SCliente=LBCXC.SaldoCliente(PKCliente);
		return("Saldo: " + eBasic.eFormat(AbonosXAplicar+SCliente,CuentasXCobrar.FormatoMontos) + "  (Importe por aplicar: "+ eBasic.eFormat(AbonosXAplicar,CuentasXCobrar.FormatoMontos) + ")");//Saldo final: $" +  (SDocs -(SDocs-SCliente)) );
		
}

function SaldoMovimientos(Brw){
	var Cliente=Brw.sqlCommand.Parameter("PKCliente").Value;	
	var Mes=1;
	var FUltima;	
	var Debe;
	var Haber;
	var Saldo;
	var TodosMeses;	
	var SInicial=0;
		Mes=Brw.sqlCommand.Parameter("Mes").Value			
		FUltima=new Date();
		if (Mes==0){	//Cuando mes =0 entonces obtener la fecha del 01 de enero del año alcual para calcular el saldo inicial de acuardo al año anterior.
			FUltima="01/01/"+Brw.sqlCommand.Parameter("Anio").Value;				
			TodosMeses=true;
		}else{
			FUltima="01/"+Mes+"/"+Brw.sqlCommand.Parameter("Anio").Value;				
			TodosMeses=false;
		}		
		Debe=LBCXC.DebeCliente(Cliente,TodosMeses,FUltima);
		Haber=LBCXC.HaberCliente(Cliente,TodosMeses,FUltima);
	    SInicial=LBCXC.SaldoAl(Cliente,FUltima);
		Saldo=(SInicial+Debe)-Haber;
		return("Saldo inicial= "+eBasic.eFormat(SInicial,CuentasXCobrar.FormatoMontos)+"        Debe= "+ eBasic.eFormat(Debe,CuentasXCobrar.FormatoMontos) + "        Haber= "+ eBasic.eFormat(Haber,CuentasXCobrar.FormatoMontos) + "        Saldo= " +eBasic.eFormat(Saldo,CuentasXCobrar.FormatoMontos));

}


function OpcEdoCuentaAgregar(){
	var ask;
	var Brw;
	var opc;
	ask=Application.NewAsk();
	ask.SetOption(10,"Bonificaciones","Seleccione ésta opción para realizar una bonificación al documento seleccionado.");
	ask.SetOption(20,"Aplicar abonos","Elija ésta opción para aplicar los abonos hechos por el cliente a una o más cuentas por cobrar.");
	ask.SetOption(30,"Alta de documento por cobrar","Elija ésta opción para crear un nuevo documento por cobrar.");
	ask.SetOption(40,"Financiar capital","Realizar financiamiento de un monto determinado creando pagarés por el número total de periodos indicados.");
	ask.SetOption(50,"Recibo","Seleccione ésta opción si desea crear un recibo.");
	ask.SetOption(60,"Nota de crédito","Elija ésta opción para crear una nota de crédito.");
	ask.SetOption(70,"Nota de cargo","Elija ésta opción para crear una nota de cargo.");
	ask.SetOption(80,"Desaplicar abonos","Elija ésta opción para desaplicar los abonos hechos por el cliente a una o más cuentas por cobrar.");
	ask.SetOption(90,"Crear CFDI","Elija ésta opción para timbrar un CFDI.");
	
	opc=ask.Ask();	
	if(opc==0) return;
	
	Brw=null;
	Brw=Application.ActiveWindow();
	if (Brw==null){
		Log("Error Agregar: No se pudo obtener información del Estado de cuenta.");
		return 0;
	}
		
	switch(opc)
	{
		case 10: 				
			Bonificaciones(null,Brw);break;			
		case 20:
			Aplicar(null,Brw);break;
		case 30:
			AltaDxC(null,Brw);break;
		case 40:
			FinanciarCapital(null,Brw);break;
		case 50:
			Recibo(null,Brw);break;
		case 60:
			NotaCredito(null,Brw);break;
		case 70:
			NotaCargo(null,Brw);
		case 80:
			Desaplicar(null, Brw);break;
		case 90:
			Timbrar(null, Brw);break;
	}
	
	ask=null;
}

function OpcEdoCuentaModificar(){
	var ask;
	var Brw;
	var opc;
	ask=Application.NewAsk();
	ask.SetOption(10,"Cobrar documento","Seleccione ésta opción para realizar el cobro del documento seleccionado");
	ask.SetOption(20,"Financiar documento","Elija ésta opción para financiar el documento seleccionado.");
	
	opc=ask.Ask();	
	if(opc==0) return;
	
	Brw=null;
	Brw=Application.ActiveWindow();
	if (Brw==null){
		Log("Error: No se pudo obtener información del Estado de cuenta.");
		return 0;
	}
		
	switch(opc)
	{
		case 10: 				
			CobrarDocumento(null,Brw);break;			
		case 20:
			FinanciarDocumento(null,Brw);
	}
	
	ask=null;
}


function OpcVentas(A){
	var ask;
	var Cliente;
	Cliente=A.Context.ActiveWindow.PrimaryKeyValue;
	if(Cliente==null){
		Log("Seleccione un Cliente.");
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

function AplicarInteresesMoratorios(A){
	var Cliente;	
	
   if (eBasic.eMsgbox("Se aplicarán los intereses moratorios al cliente seleccionado. ¿Desea continuar?", 4)==7)
		return 0;
	
	Application.MouseHourglass();	
		
	Cliente=A.Context.ActiveWindow.Parameter("PKCliente").Value;		
	if (CuentasXCobrar.Blogic.GenerarInteresesMoratorios(Cliente,Application.CurrentDate(),FXConfig.DiasInteresesMoratorios())){
		Application.MouseHourglass();
		Poliza.PolizaIntMoratoriosCXC(CuentasXCobrar.Blogic.ResultadoLGCXC);
		Application.MouseDefault();
		eBasic.eMsgbox("¡Los intereses se han aplicado correctamente!",6);
		A.Context.ActiveWindow.RefreshRst();
	}else{
		eBasic.eMsgbox("Error: los intereses moratorios no fueron aplicados.",6);
		Log(CuentasXCobrar.Blogic.LastErrorDescrip);
	}
	
	Application.MouseDefault();
}

function OpcionesAgregar(A){
var ask;

	ask=Application.NewAsk();	
	ask.SetOption(1,"Agregar Cliente","Use esta opción para agregar un nuevo cliente.");
	ask.SetOption(2,"Agregar Tipo de cliente","Seleccione esta opción para crear un nuevo tipo de cliente.");
	
	/* Comentado para la versión 2014 - JV
	ask.SetOption(3,"Nuevo documento por cobrar","Permite registrar un nuevo documento por cobrar.");
	ask.SetOption(4,"Nuevo Recibo","Seleccione esta opción para registrar un recibo.");
	*/
	ask.SetOption(5,"Catálogo de tipos de clientes","Use esta opción para administrar el catálogo de tipos de clientes.");
	
	switch(ask.Ask())
	{
		case 1:
			return AgregarCliente();break;	
		case 2:
			return AgregarTipoCliente(null);break;
		case 3:
			return AltaDxC(A);break;
		case 4:
			return Recibo(A);break;
		case 5:
			return CatalogoTiposClientes();break;
	}
	ask=null;
}

function AutoAplicarTodo(){
	CuentasXCobrar.AutoAplicarTodo();
	ActualizarClientes();
}
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}
