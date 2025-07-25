//Versión: 0.9.0.0
//Versión: 0.9.0.1 -> JFrank -  Se agregaron Campos a las consultas

//NOTA: No agregar punto y coma la final de las consultas que no lo tienen.
//var CmdSQLQGrupoProveedor = "SELECT * FROM qryCatProveedores WHERE PKTipoProveedor=@PKTipoProv";
//var CmdSQLQProveedores = "SELECT * FROM qryCatProveedores";

var CmdSQLQGrupoProveedor = "Select qryCatProveedores.*, Pais.Nombre as Pais, Edoprov.Nombre as Estado,Ciudad.Nombre as Ciudad,Zona.Nombre as Zona,TipoProveedor.Descripcion as TipoProveedor,ut_Color.uf_Color FROM (qryCatProveedores LEFT JOIN (((Proveedor LEFT Join(Domicilio LEFT JOIN (Ciudad LEFT JOIN (EdoProv LEFT JOIN Pais On EdoProv.IPais=Pais.Sys_PK) ON Ciudad.Estado=EdoProv.Sys_PK) ON Domicilio.ICiudad=Ciudad.Sys_PK) ON Proveedor.Domicilio1=Domicilio.Sys_PK) LEFT JOIN TipoProveedor On Proveedor.Tipo =TipoProveedor.Sys_PK) LEFT JOIN Zona ON Proveedor.IZona=Zona.Sys_PK) ON qryCatProveedores.Sys_PK=Proveedor.Sys_PK) LEFT JOIN ut_Color ON (qryCatProveedores.Sys_PK=ut_Color.uf_PK AND ut_Color.uf_Tabla='proveedor') WHERE qryCatProveedores.PKTipoProveedor=@PKTipoProv";

var CmdSQLQProveedores = "Select qryCatProveedores.*, Pais.Nombre as Pais, Edoprov.Nombre as Estado,Ciudad.Nombre as Ciudad,Zona.Nombre as Zona,TipoProveedor.Descripcion as TipoProveedor,ut_Color.uf_Color FROM (qryCatProveedores LEFT JOIN (((Proveedor LEFT Join(Domicilio LEFT JOIN (Ciudad LEFT JOIN (EdoProv LEFT JOIN Pais On EdoProv.IPais=Pais.Sys_PK) ON Ciudad.Estado=EdoProv.Sys_PK) ON Domicilio.ICiudad=Ciudad.Sys_PK) ON Proveedor.Domicilio1=Domicilio.Sys_PK) LEFT JOIN TipoProveedor On Proveedor.Tipo =TipoProveedor.Sys_PK) LEFT JOIN Zona ON Proveedor.IZona=Zona.Sys_PK) ON qryCatProveedores.Sys_PK=Proveedor.Sys_PK) LEFT JOIN ut_Color ON (qryCatProveedores.Sys_PK=ut_Color.uf_PK AND ut_Color.uf_Tabla='proveedor')";



var CmdSQLQEstadoCuenta="SELECT * FROM qryEstadoCuentaProveedor WHERE Proveedor=@PKProv";
var CmdSQLQMovimientos="SELECT * FROM qryMovimientosProveedor WHERE Proveedor=@PKProv AND Mes=@Mes AND Anio=@Anio;";
var CmdSQLQMovimientosPorAnio="SELECT * FROM qryMovimientosProveedor WHERE Proveedor=@PKProv AND Anio=@Anio;";

function CrearPanel(){
	
	Application.UIShortCuts.CreatePane("P_CxP","Proveedores y cuentas por pagar","","","ICON_CXP","",0);	
	
	Application.UIShortCuts.Pane("P_CxP").CreateGroup(2,"P_CxP_G_01","Ver","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_A01","Proveedores y cuentas por pagar",0,"","","","UICxP.QCxP",0,"","","",0);	
	
	Application.UIShortCuts.Pane("P_CxP").CreateGroup(2,"P_CxP_G_02","Acciones","","",0);	
    Application.UIShortCuts.CreateAction("P_CxP_B01","Agregar proveedor",0,"","","","UICxP.AgregarProveedor",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_B02","Agregar tipo proveedor",0,"","","","UICxP.AgregarTipoProveedor",0,"","","",0);		
	Application.UIShortCuts.CreateAction("P_CxP_B03","Alta de documento por pagar",0,"","","","UICxP.AltaDxP",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_CxP_B04","Compras",0,"","","","UICxP.OpcCompras",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_B05","Informes",0,"","","","UICxP.Informes",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_B06","Agregar",0,"","","","UICxP.OpcionesAgregar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_B07","Auto-aplicar todo",0,"","","","UICxP.AutoAplicarTodo",0,"","","",0);

	
	Application.UIShortCuts.Pane("P_CxP").CreateGroup(2,"P_CxP_G_03","Movimientos de ajuste","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C00","Estado de cuenta",0,"","","","UICxP.QEstadoCuenta",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C01","Nota de crédito",0,"","","","UICxP.NotaCredito",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C02","Nota de cargo",0,"","","","UICxP.NotaCargo",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C03","Recibo simple",0,"","","","UICxP.Recibo",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C04","Aplicar abonos",0,"","","","UICxP.Aplicar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C05","Bonificaciones",0,"","","","UICxP.Bonificaciones",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C06","Financiar documento",0,"","","","UICxP.FinanciarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C07","Financiar capital",0,"","","","UICxP.FinanciarCapital",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C08","Pagar documento",0,"","","","UICxP.PagarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_C09","Aplicar intereses moratorios",0,"","","","UICxP.AplicarInteresesMoratorios",0,"","","",0);
	Application.UIShortCuts.Pane("P_CxP").CreateGroup(2,"P_CxP_G_04","Catálogos","","",0);
	Application.UIShortCuts.CreateAction("P_CxP_D01","Catálogo tipos de proveedores",0,"","","","UICxP.CatalogoTiposProveedor",0,"","","",0);
		
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_01").AddItem("P_CxP_A01");
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_02").AddItem("P_CxP_B01");
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_02").AddItem("P_CxP_B02");
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_02").AddItem("P_CxP_B03");
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_03").AddItem("P_CxP_C01");
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_03").AddItem("P_CxP_C02");
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_03").AddItem("P_CxP_C03");	
	Application.UIShortCuts.Pane("P_CxP").Group("P_CxP_G_04").AddItem("P_CxP_D01");
	
	
}

function NotaCredito(A,Brw)
{
	var Prov;	
	if(A!=null)
		Prov=ObtenerProveedor(A);
	else{
		if (Brw!=null)
			Prov=Brw.sqlCommand.Parameter("PKProv").Value;
		else
			Prov=0;
	}
				
	if(CuentasXPagar.NotaCredito(Prov)!=null){
		Application.MouseHourglass();
		Poliza.PolizaNotaCreditoCXP(CuentasXPagar.ResultadoCXP);
		Application.MouseDefault();
		
		if (Brw!=null) 
			Brw.RefreshRst();
		else{		
			if(Application.ActiveWindow().ObjectTypeName=="DCXP")
				Application.ActiveWindow().RefreshRst();		
		}		
		
	}else
		Log(CuentasXPagar.LastErrorDescrip);
	
	
}

function NotaCargo(A,Brw)
{
	var Prov;	
	if(A!=null)
		Prov=ObtenerProveedor(A);
	else{
		if (Brw!=null)
			Prov=Brw.sqlCommand.Parameter("PKProv").Value;
		else
			Prov=0;
	}
	if(CuentasXPagar.NotaCargo(Prov)!=null){
		
		Application.MouseHourglass();
		Poliza.PolizaNotaCargoCXP(CuentasXPagar.ResultadoCXP);
		Application.MouseDefault();

		if (Brw!=null) 
			Brw.RefreshRst();
		else{		
			if(Application.ActiveWindow().ObjectTypeName=="DCXP")
				Application.ActiveWindow().RefreshRst();		
		}		
		
	}else
		Log(CuentasXPagar.LastErrorDescrip);		
}
function Recibo(A,Brw)
{
	var Prov;		
	var Recibo;
	if(A!=null)
		Prov=ObtenerProveedor(A);
	else{
		if (Brw!=null)
			Prov=Brw.sqlCommand.Parameter("PKProv").Value;
		else
			Prov=0;
	}	
	Recibo=CuentasXPagar.Recibo(Prov);
	if(Recibo!=null){
		Application.MouseHourglass();
		Poliza.PolizaReciboCXP(Recibo.Sys_PK);		
		Application.MouseDefault();
		if (Brw!=null) 
			Brw.RefreshRst();
		else{		
			if(Application.ActiveWindow().ObjectTypeName=="DCXP")
				Application.ActiveWindow().RefreshRst();		
		}		
		
	}else
		Log(CuentasXPagar.LastErrorDescrip);	
}

function Bonificaciones(A,Brw)
{
	var Doc=0;
	var Aplicable;
	Aplicable=true;
	if (A!=null){ 
		Brw=A.Context.ActiveWindow;		
	}else{		//EL METODO SE LLAMÓ DESDE METODO ASK : OpcEdoCUENTA		
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
	if (Aplicable==true){				
		if(CuentasXPagar.Bonificar(Doc)){
			Application.MouseHourglass();
			Poliza.PolizaBonificacionCXP(CuentasXPagar.ResultadoCXP);
			Application.MouseDefault();
			Brw.RefreshRst();
		}else
			Log(CuentasXPagar.LastErrorDescrip);	
	}else
		Log("Error Bonificar: No se puede bonificar el documento seleccionado");
}

function FinanciarDocumento(A,Brw)
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
	
	if (Aplicable==true){		
		if(CuentasXPagar.Financiar(Doc)){						
			Application.MouseHourglass();
			Poliza.PolizaIntFinancierosCXP(CuentasXPagar.Blogic.ResultadoLGCXP);
			Application.MouseDefault();			
			Brw.RefreshRst();
		}else
			Log(CuentasXPagar.LastErrorDescrip);	
	}else
		Log("Error Financiar documento: No se puede financiar el documento seleccionado");	
	
}
function FinanciarCapital(A,Brw)
{	
	var Prov=0;
	if(A!=null){		
		Prov=ObtenerProveedor(A);
	}else{
		if (Brw!=null)
			Prov=Brw.sqlCommand.Parameter("PKProv").Value;
		else
			Prov=0;
	}
	
	if(CuentasXPagar.FinanciarCapital(Prov)){
		Application.MouseHourglass();
		Poliza.PolizaIntFinancierosCXP(CuentasXPagar.Blogic.ResultadoLGCXP);
		Application.MouseDefault();				
		
		if (Prov>0 && A!=null)
			A.Context.ActiveWindow.RefreshRst();
		else
			if (Brw!=null) Brw.RefreshRst();
	}else
		Log(CuentasXPagar.LastErrorDescrip);	
	
	
}


function PagarDocumento(A,Brw)
{	
	var Doc=0;
	var Aplicable;
	Aplicable=true;
	if (A!=null){ //EL METODO SE LLAMÓ DESDE METODO ASK : OpcEdoCUENTA		
		Brw=A.Context.ActiveWindow;	
	}else{		
		if (Brw==null)
			return 0;
	}
	Doc=Brw.PrimaryKeyValue;	
	if (Brw.sqlCommand.Parameter("Info").Value==1)
			Aplicable=Brw.GetFieldValue("Aplicable");
	if(Doc==null){
		Log("Seleccione un documento");
		return 0;
	}
	if (Aplicable==true)
		if(CuentasXPagar.PagarDocumento(Doc)){						
			Application.MouseHourglass();
			Poliza.PolizaPagoCXP(CuentasXPagar.ResultadoCXP);
			Application.MouseDefault();
			Brw.RefreshRst();
		}else{
			Log(CuentasXPagar.LastErrorDescrip);				
		}
	else
		Log("Error Pagar documento: No se puede pagar el documento seleccionado");
	
	
}


function Aplicar(A,Brw){
	var Prov;
	Prov=0;
	if(A!=null)
		Prov=ObtenerProveedor(A);
	else{
		if (Brw!=null)
			Prov=Brw.sqlCommand.Parameter("PKProv").Value;
		else
			Prov=0;
	}
	
	if(CuentasXPagar.Aplicar(Prov)){
		if (A!=null)
			A.Context.ActiveWindow.RefreshRst();
		else
			if (Brw!=null) Brw.RefreshRst();
	}else
		Log(CuentasXPagar.LastErrorDescrip);
			
}

function AltaDxP(A,Brw)
{	
	var Prov=0;		
	if(A!=null)
		Prov=ObtenerProveedor(A);
	else{
		if (Brw!=null)
			Prov=Brw.sqlCommand.Parameter("PKProv").Value;
		else
			Prov=0;
	}
	if (Prov==null) Prov=0;	
	if(CuentasXPagar.DocXPagar(Prov)!=null){
		
		Poliza.PolizaDocumentoXPagar(CuentasXPagar.ResultadoCXP);
		
		if (Brw!=null) 
			Brw.RefreshRst();
		else{		
			if(Application.ActiveWindow().ObjectTypeName=="DCXP")
				Application.ActiveWindow().RefreshRst();		
		}		
	}else{
		Log(CuentasXPagar.LastErrorDescrip);	
		return 0;
	}
}

function ObtenerProveedor(Accion){
//Buscar la clave del proveedor .. del parametro PKProv
	
	if (Accion.Context.ActiveWindow!=null)
	{		
		if (Accion.Context.ActiveWindow.Parameter("PKProv")!=null)						
			return (Accion.Context.ActiveWindow.Parameter("PKProv").Value);
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

function OpcAgregarTipoProvedor(){
var ask;
var Brw=null;

	ask=Application.NewAsk();
	ask.SetOption(1,"Agregar Tipo de Proveedor","Crear un nuevo Tipo para clasificar Proveedores.");
	ask.SetOption(2,"Agregar Proveedor","Agregar un nuevo Proveedor.");
	switch(ask.Ask())
	{
		case 1:
			AgregarTipoProveedor();
			break;
		case 2:
			return AgregarProveedor();			
	}
}

function OpcModificarTipoProvedor(PK){
var ask;
	ask=Application.NewAsk();
	ask.SetOption(1,"Modificar Tipo de Proveedor","Modificar el tipo de proveedor seleccionado.");
	ask.SetOption(2,"Modificar Proveedor","Modificar proveedor seleccionado.");
	switch(ask.Ask())
	{
		case 1:
			ModificarTipoProveedor(PK);
			break;
		case 2:			
			return ModificarProveedor(ProveedorSeleccionado());			
	}
}


function OpcEliminarTipoProvedor(PK){
var ask;
var Brw=null;

	ask=Application.NewAsk();
	ask.SetOption(1,"Eliminar Tipo de Proveedor","Eliminar el tipo de proveedor seleccionado.");
	ask.SetOption(2,"Eliminar Proveedor","Eliminar proveedor seleccionado.");
	switch(ask.Ask())
	{
		case 1:
			EliminarTipoProveedor(PK);
			break;
		case 2:
			return EliminarProveedor(ProveedorSeleccionado());
	}
}


function AgregarTipoProveedor()
{
	if (Catalogos.dlgTipoProveedor_BySysPK()) 
		 ActualizarProveedor();		
}
function ModificarTipoProveedor(PK)
{
	if(PK==null){
		Log("Seleccione un tipo de proveedor");
		return 0;
	}
	if (Catalogos.dlgTipoProveedor_BySysPK(PK)) 
		 ActualizarProveedor();
}


function EliminarTipoProveedor(PK)
{
	if(PK==null){
		Log("Seleccione un tipo de proveedor");
		return 0;
	}
	if (Catalogos.DelTipoProveedor_BySysPK(PK)) 
		 ActualizarProveedor();
}

function ActualizarTipoProveedor(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCXP");
	if (Brw!=null)
		Brw.FillFilterList();
}

function ActualizarProveedor(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCXP");
	if (Brw!=null)
		Brw.RefreshRst();
}


function ProveedorSeleccionado(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qCXP");
	if (Brw!=null)
		return Brw.PrimaryKeyValue;
	else
		return 0;
}


function AgregarProveedor(){
	if (Catalogos.dlgProveedor_BySysPK()) 
		ActualizarProveedor();		
}

function ModificarProveedor(PK)
{
	var Brw;
	
	if(PK==null){
		Log("Seleccione un proveedor");
		return 0;
	}
	
	if(Catalogos.dlgProveedor_BySysPK(PK)){
		Brw=null;
		Brw=Application.Browsers.GetBrowser("qEstadoCuentaProv_"+PK);
		if (Brw!=null)
			Brw.SetTitle(CuentasXPagar.NombreProveedor(PK));		
		return -1;
	}else		
		return 0;
}
function EliminarProveedor(PK)
{
var saldo=0;
	if(PK==null) PK=0;	
	if(PK==0){
		Log("Seleccione un proveedor");
		return 0;
	}
		
	saldo=LBCxP.SaldoProveedor(PK);
	saldo=saldo.toFixed(LBCxP.DecPreMontos);
	if(saldo!=0){
		eBasic.eMsgbox("No se puede eliminar un proveedor con saldo diferente de cero.",6);
		return 0;
	}
	
	if(eBasic.eMsgbox("¿Está seguro que desea eliminar el elemento seleccionado?",4)==7)
		return 0;
		
	if (Catalogos.DelProveedor_BySysPK(PK,false)) 
		return -1;
	else{
		if(MXCAsistentes.DarBajaElemento(3,PK))
			return -1;
		else
			return 0;
	}	
}

function CatalogoTiposProveedor()
{
	Catalogos.BrwTipoProveedor();
	ActualizarProveedor();
}



//Ventana de proveedores - cunetas x pagar
function QCxP(){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser("qCXP");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-60-01-000"))  //PERMITIR ACCESO
			return 0;
		
		Brw=Application.Browsers.CreateBrowser("qCXP");		
		Brw.Caption="Cuentas por pagar";
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKTipoProv",0));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("FiltroSaldos",1));
		Brw.sqlCommand.CmdSQL=CmdSQLQGrupoProveedor;
		Brw.KeyField = "Sys_PK";
		Brw.CmdAfterRetriveFields="UICxP.RedimensionarColumnas";
	    Brw.CmdAddNew="UICxP.AgregarProveedor";
		Brw.CmdEdit="UICxP.ModificarProveedor";
		Brw.CmdDelete = "UICxP.EliminarProveedor";
		Brw.CmdDblClick="UICxP.ModificarProveedor";
		Brw.CmdLeftAddNew="UICxP.OpcAgregarTipoProvedor";
		Brw.CmdLeftEdit= "UICxP.ModificarTipoProveedor";
		Brw.CmdLeftDelete = "UICxP.OpcEliminarTipoProvedor";
		Brw.CmdLeftDblClick="UICxP.ModificarTipoProveedor";
		Brw.CmdLeftClick="UICxP.FiltrarPorSaldo";
		Brw.SubTitle1="Tipos de Proveedores";
		Brw.SubTitle2="Proveedores";
		Brw.FilterList.sqlQuery="Select Sys_PK, Descripcion From tipoproveedor Order By Descripcion";
		Brw.FilterList.KeyField="Sys_PK";
		Brw.FilterList.ListField="Descripcion";
		Brw.FilterList.Parameter="PKTipoProv";
		Brw.FilterList.HaveFirstItem=-1;
		Brw.FilterList.TextFirsItem="< Todos los Tipos >";
		Brw.FilterList.FirstItemValue=0;
		Brw.FilterList.FirstItemSQL=CmdSQLQProveedores;
		
		Brw.ReportsFolder=Reportes.CarpetaCXP;		
		Brw.ObjectTypeName="Proveedor";
		
		Brw.ShowToolBar();		
		Brw.AddButton("Agregar","P_CxP_B06");
		Brw.AddButton("Estado de cuenta","P_CxP_C00");				
		Brw.AddButton("Comprar","P_CxP_B04");
		Brw.AddButton("Auto-aplicar todo","P_CxP_B07");
		Brw.AddButton("Informes","P_CxP_B05");
		
		Brw.TopTabParameter="FiltroSaldos";		
		Brw.CmdTopTabClick="UICxP.FiltrarPorSaldo";
		Brw.AddTopTab("Todos los proveedores",1);
		Brw.AddTopTab("Proveedores con saldo",2);
		Brw.AddTopTab("Proveedores sin saldo",3);
		Brw.ShowTopTabsBar();
		Brw.SelectTopTab(0);
		
		Brw.ShowFilterList();
		Brw.FillFilterList();
		Brw.SetItemList(0);				
		Brw.ShowFindBar();
		
		Brw.DetailFunction="UICxP.Detail";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="ut_Color";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="Proveedor";
	}
	else
		Brw.Zorder();

}

function Detail(){
var r=null;
var dtls;

try
	{
	
		dtls=Application.GetDetailPanel();
		dtls.SetCaption("Documentos del Cliente: " + GetNameProv(dtls.CurrentValue));
		r=Application.Database.OpenRecordset("SELECT * FROM qryEstadoCuentaProveedor WHERE Proveedor="+dtls.CurrentValue,Application.adoCnn);
		
		//Poner datos en el panel
		dtls.SetDataSource(r,"Sys_PK");
		dtls.HideFields("Sys_PK;Proveedor");
		
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


function  GetNameProv(PK){
var r=null;
	var s;
	
	try
	{
		r=Application.Database.OpenRecordset("Select Nombre FROM Proveedor Where Sys_PK="+PK,Application.adoCnn);
		if (!(r.EOF && r.BOF))
			s=r.Fields("Nombre").Value;
		else
			s="No se encontró el Proveedor";
		r.Close();
		return s;
	}
	catch(e)
	{
		return "Error al buscar el Proveedor";
	}

}

function FiltrarPorSaldo(Filtro){
	var Brw;
	var sExt1;
	var sExt2;
	Brw=null;	
	Brw=Application.Browsers.GetBrowser("qCXP");
	if (Brw!=null){
		if (Filtro==null) Filtro=Brw.Parameter("FiltroSaldos").Value;
		switch(Filtro){
			case 1: sExt1="";sExt2="";break;
			case 2: sExt1=" AND qryCatProveedores.Saldo<>0";sExt2=" WHERE qryCatProveedores.Saldo<>0";break;
			case 3:	sExt1=" AND qryCatProveedores.Saldo=0";sExt2=" WHERE qryCatProveedores.Saldo=0";
		}
		if (Brw.Parameter("PKTipoProv").Value==0){
			Brw.sqlCommand.CmdSQL=CmdSQLQProveedores+sExt2;
			Brw.FilterList.FirstItemSQL=CmdSQLQProveedores+sExt2;
		}else{
			Brw.sqlCommand.CmdSQL=CmdSQLQGrupoProveedor+sExt1;
		}		
	}else{
		Log("No se pudo obtener el formulario de proveedores.");
	}
	return -1;
}


function RedimensionarColumnas(BrwName){
	var Brw;
	Brw=null;

	Brw=Application.Browsers.GetBrowser(BrwName);
	if (Brw!=null)
	{
		Brw.HideFields("Sys_PK;PKTipoProveedor;uf_Color");		
		Brw.SetColumnWidth("Codigo",80);	
		Brw.SetColumnWidth("Nombre",200);
		Brw.SetColumnWidth("RFC",80);			
		Brw.SetColumnWidth("Direccion",200);
		Brw.SetColumnWidth("Colonia",120);
		Brw.SetColumnWidth("Codigo_postal",80);
		Brw.SetColumnWidth("Telefono",120);	
		Brw.SetColumnwidth("eMail",120);
		Brw.SetColumnWidth("Saldo",80); 
		
		Brw.SetColumnWidth("Pais",100);
		Brw.SetColumnWidth("Estado",100);
		Brw.SetColumnWidth("Ciudad",150);
		Brw.SetColumnWidth("Zona",100);
		Brw.SetColumnWidth("TipoProveedor",150);
		
		Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
		
		Brw.SetCaptionByFieldName("Codigo_Postal","Código Postal");
		Brw.SetCaptionByFieldName("TipoProveedor","Tipo de proveedor");			
	}
}

function Comprar(A){		
	UICompras.CrearPedido(null,parseInt(A.Context.TagData));
}
function Informes(){
	Application.MasInformesYGraficos();
}



function QEstadoCuenta(A){
var Brw;
var Prov;
Brw=null;
	
Prov=A.Context.TagData;
if(Prov==null){
	Log("Seleccione un proveedor");
	return 0;
}


if (ProveedorSeleccionado() < 1)
{
	eBasic.eMsgbox("Para continuar necesita seleccionar un proveedor.",6);
	return 0;
}


Brw=Application.Browsers.GetBrowser("qEstadoCuentaProv_"+Prov);
if (Brw==null)
	{
		Application.MouseHourglass();
		CuentasXPagar.RedondearSaldos(Prov);
		Application.MouseDefault();
		
		Brw=Application.Browsers.CreateBrowser("qEstadoCuentaProv_"+Prov);
		Brw.Caption="Estado de cuenta: "+ A.Context.ActiveWindow.GetFieldValue("Nombre"); //+ Nombre del proveedor
		Brw.TagData="EdoCtaProveedor";
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("PKProv",Prov));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Info",0));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio",2007));	
		Brw.KeyField = "Sys_PK";
		
		Brw.ReportsFolder=Reportes.CarpetaCXP;		
		Brw.ObjectTypeName="DCXP";
		
		Brw.CmdEditTitleClick="UICxP.ModificarProveedor";
		Brw.SetEditTitleParameter("PKProv","Editar proveedor");
		
		
		Brw.SetTitle(A.Context.ActiveWindow.GetFieldValue("Nombre"));			
	    Brw.CmdAddNew="UICxP.OpcEdoCuentaAgregar";
		Brw.CmdEdit="UICxP.OpcEdoCuentaModificar";
		Brw.CmdDelete = "UICxP.OpcEdoCuentaModificar";
		Brw.CmdDblClick="UICxP.OpcEdoCuentaModificar";
						
		// Brw.SubTitle2="Proveedores";
					
		Brw.AddButton("Recibo","P_CxP_C03");
		Brw.AddButton("Pagar documento","P_CxP_C08");
		Brw.AddButton("Financiar documento","P_CxP_C06");
		Brw.AddButton("Financiar capital","P_CxP_C07");
		Brw.AddButton("Bonificaciones","P_CxP_C05");
		Brw.AddButton("Aplicar abonos","P_CxP_C04");
		Brw.AddButton("Nota de cargo","P_CxP_C02");
		Brw.AddButton("Nota de crédito","P_CxP_C01");
		Brw.AddButton("Aplicar intereses","P_CxP_C09");
		
		Brw.ShowToolBar();
		
		Brw.TopTabParameter="Info";
		Brw.CmdTopTabClick="UICxP.ConfigurarBrowser";
		Brw.CmdBottomTabClick="UICxP.ReasignarConsulta";
		Brw.CmdAfterRetriveFields="UICxP.RedimensionarColEstadoCuenta";
		Brw.AddTopTab("Documentos",0);
		Brw.AddTopTab("Movimientos",1);		
		Brw.ShowTopTabsBar();	
		Brw.SelectTopTab(0);
		
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
		Brw.sqlCommand.CmdSQL=CmdSQLQEstadoCuenta;		
		Brw.HideBottomCombo();
		Brw.HideBottomTabsBar();
		DesactivarBotonesEstadoCuenta(Brw,true);
	}else{
		//tab=1		
		if (Brw.Parameter("Mes").Value==0)
			Brw.sqlCommand.CmdSQL=CmdSQLQMovimientosPorAnio;
		else
			Brw.sqlCommand.CmdSQL=CmdSQLQMovimientos;		
		Brw.ShowBottomCombo();
		Brw.ShowBottomTabsBar(); 
		DesactivarBotonesEstadoCuenta(Brw,false);
	}	
}

function DesactivarBotonesEstadoCuenta(Brw,Activar){	
	Brw.GetButtonByIDAction("P_CxP_C05").Enabled=Activar;
	Brw.GetButtonByIDAction("P_CxP_C06").Enabled=Activar;
	Brw.GetButtonByIDAction("P_CxP_C08").Enabled=Activar;	
}


function ReasignarConsulta(){
	//Tab superior seleccionado es el 1
	ConfigurarBrowser(1);	
}
function RedimensionarColEstadoCuenta(){
	Brw=Application.ActiveWindow();	
	if (Brw==null) return;
	
	Brw.HideFields("Sys_PK;Proveedor;Aplicable;Dia;Mes;Anio;ND_Aplicacion;IntMoratorios;Bonificaciones;Tipo;IZona;Pagos");
		
	if (Brw.sqlCommand.Parameter("Info").Value==0){		
		Brw.SetGridTitle(SaldoProveedor(Brw.sqlCommand.Parameter("PKProv").Value));
		Brw.SetColumnWidth("Documento",100);
		Brw.SetColumnWidth("Referencia",130);
		Brw.SetColumnWidth("Fecha",80);
		Brw.SetColumnWidth("Vencimiento",80);
		Brw.SetColumnWidth("Importe",90);
		Brw.SetColumnWidth("Cargos",90);
		Brw.SetColumnWidth("Bonificaciones",90);
		Brw.SetColumnWidth("Cobros",90);
		Brw.SetColumnWidth("Saldo",90);	
				
		try{
			Brw.SetColumnFormat("Importe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Cargos",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Bonificaciones",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Cobros",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());			
		}catch(e){}
		
	}else{		
		Brw.SetGridTitle(SaldoMovimientos(Brw));
		Brw.SetColumnWidth("Documento",100);
		Brw.SetColumnWidth("Referencia",130);
		Brw.SetColumnWidth("Fecha",80);		
		Brw.SetColumnWidth("Vencimiento",80);		
		Brw.SetColumnWidth("Debe",90);
		Brw.SetColumnWidth("Haber",90);		
		Brw.SetColumnWidth("Concepto",500);
		
		try{
			Brw.SetColumnFormat("Debe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			Brw.SetColumnFormat("Haber",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());			
		}catch(e){}
		
	}
	//Brw.AutoAdjust();	
}

function SaldoProveedor(Prov){	
	var	CargosXAplicar;
	var SProv;		
		CargosXAplicar=0;
		CargosXAplicar=LBCxP.CargosSinAplicar(Prov);				
		SProv=LBCxP.SaldoProveedor(Prov);
		return("Saldo: " + eBasic.eFormat(CargosXAplicar+SProv,CuentasXPagar.FormatoMontos) + "  (Importe por aplicar: "+ eBasic.eFormat(CargosXAplicar,CuentasXPagar.FormatoMontos) + ")");//"=Saldo final: $" +  (SDocs -(SDocs-SProv)) );
		
}

function SaldoMovimientos(Brw){
	var Prov=Brw.sqlCommand.Parameter("PKProv").Value;	
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
		Debe=LBCxP.DebeProveedor(Prov,TodosMeses,FUltima);
		Haber=LBCxP.HaberProveedor(Prov,TodosMeses,FUltima);
		SInicial=LBCxP.SaldoAl(Prov,FUltima);
		Saldo=SInicial+Haber-Debe;
		return("Saldo inicial= "+eBasic.eFormat(SInicial,CuentasXPagar.FormatoMontos)+"        Debe= "+ eBasic.eFormat(Debe,CuentasXPagar.FormatoMontos) + "        Haber= "+ eBasic.eFormat(Haber,CuentasXPagar.FormatoMontos) + "        Saldo= " +eBasic.eFormat(Saldo,CuentasXPagar.FormatoMontos));

}


function OpcEdoCuentaAgregar(){
	var ask;
	var Brw;
	var opc;
	ask=Application.NewAsk();
	ask.SetOption(10,"Bonificaciones","Seleccione ésta opción para realizar una bonificación al documento seleccionado.");
	ask.SetOption(20,"Aplicar abonos","Elija ésta opción para aplicar los abonos hechos al proveedor en una o más cuentas por pagar.");
	ask.SetOption(30,"Alta de documento por pagar","Elija ésta opción para crear un nuevo documento por pagar.");
	ask.SetOption(40,"Financiar capital","Realizar financiamiento de un monto determinado creando pagarés por el número total de periodos indicados.");
	ask.SetOption(50,"Recibo","Seleccione ésta opción si desea crear un recibo.");
	ask.SetOption(60,"Nota de crédito","Elija ésta opción para crear una nota de crédito.");
	ask.SetOption(70,"Nota de cargo","Elija ésta opción para crear una nota de cargo.");
	
	
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
			AltaDxP(null,Brw);break;
		case 40:
			FinanciarCapital(null,Brw);break;
		case 50:
			Recibo(null,Brw);break;
		case 60:
			NotaCredito(null,Brw);break;
		case 70:
			NotaCargo(null,Brw);
	}
	
	ask=null;
}

function OpcEdoCuentaModificar(){
	var ask;
	var Brw;
	var opc;
	ask=Application.NewAsk();
	ask.SetOption(10,"Pagar documento","Seleccione ésta opción para realizar el pago del documento seleccionado.");
	ask.SetOption(20,"Financiar documento","Elija ésta opción para financiar el documento seleccionado creando pagarés por el número total de periodos indicados.");
	
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
			PagarDocumento(null,Brw);break;			
		case 20:
			FinanciarDocumento(null,Brw);break;
	}
	
	ask=null;
}

function OpcCompras(A){
	var ask;
	var Proveedor;
	Proveedor=A.Context.ActiveWindow.PrimaryKeyValue;
	if(Proveedor==null){
		Log("Seleccione un Proveedor.");
		return 0;
	}
	
	ask=Application.NewAsk();	
	ask.SetOption(10,"Pedido","Elija ésta opción para registrar un nuevo pedido al proveedor seleccionado.");
	ask.SetOption(20,"Remisión","Seleccione ésta opción para crear una nueva remisión.");
	ask.SetOption(30,"Factura","Seleccione ésta opción para crear una nueva factura.");
	ask.SetOption(40,"Nota de crédito","Elija ésta opción para realizar una nota de crédito.");
		
	//Proveedor=parseInt(A.Context.TagData);
	switch(ask.Ask())
	{		
		case 10:
			UICompras.CrearPedido(null,Proveedor);break;
		case 20:
			UICompras.CrearRemision(null,Proveedor);break;
		case 30:
			UICompras.CrearFactura(null,Proveedor);break;
		case 40:
			UICompras.CrearNotaC(null,Proveedor);
	}
	
	ask=null;
}

function AplicarInteresesMoratorios(A){
	var Prov;
	
	if (eBasic.eMsgbox("Se aplicarán los intereses moratorios al proveedor seleccionado. ¿Desea continuar?", 4)==7)
		return 0;
		
	Application.MouseHourglass();	
	
	Prov=A.Context.ActiveWindow.Parameter("PKProv").Value;	
	if (CuentasXPagar.Blogic.GenerarInteresesMoratorios(Prov,Application.CurrentDate(),FXConfig.DiasInteresesMoratorios())){
		Application.MouseHourglass();
		Poliza.PolizaIntMoratoriosCXP(CuentasXPagar.Blogic.ResultadoLGCXP);
		Application.MouseDefault();
		eBasic.eMsgbox("¡Los intereses se han aplicado correctamente!",6);
		A.Context.ActiveWindow.RefreshRst();
	}else{
		eBasic.eMsgbox("Error los intereses no fueron aplicados.",6);
		Log(CuentasXPagar.Blogic.LastErrorDescrip);
	}
	
	Application.MouseDefault();
}

function OpcionesAgregar(A){
var ask;

	ask=Application.NewAsk();	
	ask.SetOption(1,"Agregar Proveedor","Use esta opción para agregar un nuevo proveedor.");
	ask.SetOption(2,"Agregar Tipo de proveedor","Seleccione esta opción para crear un nuevo tipo de proveedor.");
	ask.SetOption(3,"Nuevo documento por pagar","Permite registrar un nuevo documento por pagar.");
	ask.SetOption(4,"Nuevo Recibo","Seleccione esta opción para registrar un recibo.");
	ask.SetOption(5,"Catálogo de tipos de proveedores","Use esta opción para administrar el catálogo de tipos de proveedores.");
	
	switch(ask.Ask())
	{
		case 1:
			return AgregarProveedor();break;	
		case 2:
			return AgregarTipoProveedor();break;
		case 3:
			return AltaDxP(A);break;
		case 4:
			return Recibo(A);break;
		case 5:
			return CatalogoTiposProveedor();break;
	}
	ask=null;
}

function AutoAplicarTodo(){
	CuentasXPagar.AutoAplicarTodo();
	ActualizarProveedor();
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

