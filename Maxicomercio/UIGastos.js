//Versión: 1.0

var sqlGastos="Select ut_Gasto.Sys_PK,ut_Gasto.Sys_GUID,Categoria.Descripcion AS Categoria, ut_Gasto.Referencia, ut_Gasto.Fecha,ut_Gasto.Vencimiento,Proveedor.Nombre AS Proveedor,ut_Gasto.Concepto,ut_Gasto.Subtotal,ut_Gasto.IVA,ut_Gasto.RetIVA,ut_Gasto.RetISR,ut_Gasto.Total,Divisa.Codigo AS Divisa,ut_Gasto.TipoCambio,cStatusAdministrativos.ID AS StatusAdministrativoID, cStatusAdministrativos.Const AS StatusAdministrativo,cFormasPago.ID AS FormaPagoID,cFormasPago.Const AS FormaPago, (((DCxP.Haber+DCxP.IntMoratorios-DCxP.Bonificaciones-DCxP.Pagos)*DCxP.TipoCambio)/ut_Gasto.TipoCambio) AS Saldo, ut_Gasto.uf_Color FROM ((((((ut_Gasto INNER JOIN Proveedor ON ut_Gasto.IProveedor=Proveedor.Sys_PK) INNER JOIN Divisa ON ut_Gasto.IDivisa=Divisa.Sys_PK) INNER JOIN Categoria ON ut_Gasto.ICategoria=Categoria.Sys_PK) INNER JOIN cStatusAdministrativos ON ut_Gasto.StatusAdministrativo=cStatusAdministrativos.ID) INNER JOIN cFormasPago ON ut_Gasto.FormaPago=cFormasPago.ID) LEFT JOIN DCxP ON (ut_Gasto.Sys_PK=DCxP.uf_IGasto AND DCxP.Documento=7)) WHERE (ut_Gasto.StatusAdministrativo=3 OR ut_Gasto.StatusAdministrativo=1) AND Year(ut_Gasto.Fecha)=@Anio ";

var sqlQGastosTodos=sqlGastos + "ORDER BY ut_Gasto.Vencimiento,ut_Gasto.Referencia";
var sqlQGastos=sqlGastos + " AND Month(ut_Gasto.Fecha)=@Mes ORDER BY ut_Gasto.Vencimiento,ut_Gasto.Referencia";;
//var Gasto; //objeto de tipo: UIGastos.cMain //se crea en el script Main.js
var Diot; //Variable para almacenar el objeto para la DIOT	
function CrearPanel(){
	Application.UIShortCuts.CreateAction("P_Gastos_A01","Agregar",0,"","","","UIGastos.AgregarGasto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Gastos_A02","Editar",0,"","","","UIGastos.EditarGasto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Gastos_A03","Cancelar",0,"","","","UIGastos.CancelarGasto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Gastos_A04","Procesar",0,"","","","UIGastos.ProcesarGasto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Gastos_A05","Archivos adjuntos",0,"","","","UIGastos.ArchivosAdjuntos",0,"","","",0);			
	Application.UIShortCuts.CreateAction("P_Gastos_A06","Pagar gasto a crédito",0,"","","","UIGastos.PagarGastoCredito",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("N_Gastos_001","Datos generales DIOT",0,"","","","UIGastos.DIOT",0,"","","",0);
	
	}

function qGastos(){
var Brw;

Brw=null;
Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-20-20-701"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qGastos");
		Brw.Caption="Gastos";
		Brw.sqlCommand.CmdType=1;				
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));				
		Brw.KeyField = "Sys_PK";
		Brw.sqlCommand.CmdSQL=sqlQGastos;	
		Brw.CmdAfterRetriveFields="UIGastos.RedimensionarColumnas";
		
		Brw.CmdAddNew="UIGastos.AgregarGasto";
		Brw.CmdEdit="UIGastos.EditarGasto";
		Brw.CmdDelete = "UIGastos.CancelarGasto";
		Brw.CmdRowChanged = "UIGastos.TituloGasto";
		Brw.CmdDblClick=Brw.CmdEdit;
		
		AsignarCarpetaRepotes(Brw);
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Agregar","P_Gastos_A01");
		Brw.AddButton("Editar","P_Gastos_A02");
		Brw.AddButton("Cancelar","P_Gastos_A03");
		Brw.AddButton("Procesar","P_Gastos_A04");
		Brw.AddButton("Pagar","P_Gastos_A06");
		Brw.AddButton("Archivos adjuntos","P_Gastos_A05");
		
		//jv 06/02/2014 - Boton para cargar datos de la DIOT
		Brw.AddButton("Datos generales DIOT","N_Gastos_001");
				
		Brw.BottomTabParameter="Mes";		
		Brw.CmdBottomTabClick="UIGastos.ConfigurarConsulta";
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
		
		
		
		Brw.ShowBottomTabsBar();
		Brw.ShowBottomCombo();		
		Brw.BottomComboParameter="Anio";		
		UIDef.FillComboYears(Brw,false,true,true);					
		//Ocultar columnas		
		//Asignar nombre de Columna

		
		Brw.HideFields("Sys_PK;Sys_GUID;StatusAdministrativoID;FormaPagoID;uf_Color");

		//Funcionalidad del Panel de detalle
		//Brw.DetailFunction="UICompras.Detail";
		//Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);
		
		//Brw.ColorFieldName="uf_Color";
		//Brw.ColorTableName="ut_Gasto";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="ut_Gastos";
		Brw.SetGroup("Categoria");
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="ut_Gasto";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="ut_Gasto";	
		
		try
		{
			Diot=eBasic.eCreateObject("Diot.cMain");
			if(Diot==null)
			{
				eBasic.eMsgbox("Error al crear componentes de la DIOT.", 6);
				return -1;
			}
			Diot.SetObjects(DataAccess);	
		}
		catch(e)
		{
		
		}
		
	}
	else
		Brw.Zorder();
		
		
	TituloGasto(Brw.PrimaryKeyValue);
	MostrarSaldo();
}

function ConfigurarConsulta(Tab){	
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw!=null){
		if (Tab==0) //Todos los meses
			Brw.sqlCommand.CmdSQL=sqlQGastosTodos;
		else //por mes
			Brw.sqlCommand.CmdSQL=sqlQGastos;
		
		MostrarSaldo();
	}else{
		Log("Error al asignar consulta");
	}	
}
function TituloGasto(pk){
var Brw,titulo,pk,saldo;
Brw=null;
titulo="Gasto";

Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw!=null){
		Brw.SetTitle(titulo);
		pk=Brw.PrimaryKeyValue;
		if(pk==null) return 0;
		if(pk==0) return 0;
		
		Brw.GetButtonByIDAction("P_Gastos_A04").Enabled=false; //procesar
		Brw.GetButtonByIDAction("P_Gastos_A06").Enabled=false; //pagar saldo
		
		if(Brw.GetFieldValue("StatusAdministrativoID")==3){
			titulo="Gasto procesado";
			if(Brw.GetFieldValue("FormaPagoID")==1){
				titulo=titulo+" de contado";
			}else{
				if(Brw.GetFieldValue("FormaPagoID")==2){
					saldo=Brw.GetFieldValue("Saldo");
					if(saldo==null) saldo=0;
					if(saldo<=LBCxP.MontoMinimo){
						titulo=titulo+" a crédito (liquidado)";
					}else{
						titulo=titulo+" a crédito (por pagar)";
						Brw.GetButtonByIDAction("P_Gastos_A06").Enabled=true;
					}										
				}
			}
		}else{
			titulo="Gasto pendiente por procesar y pagar.";
			Brw.GetButtonByIDAction("P_Gastos_A04").Enabled=true; //procesar		
		}
		Brw.SetTitle(titulo);						
	}
	
}

function MostrarSaldo(){
	var Brw,mes,anio,total,pendiente,saldo;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw!=null){
		mes=Brw.sqlCommand.Parameter("Mes").Value;
		anio=Brw.sqlCommand.Parameter("Anio").Value;
		
		total=Gasto.ImporteTotal(mes,anio);
		pendiente=Gasto.ImportePendiente(mes,anio);
		saldo=Gasto.SaldoAl(mes,anio);
				
		Brw.SubTitle2="Total="+eBasic.eFormat(total,FXConfig.FormatoMonto())+" Pendiente="+eBasic.eFormat(pendiente,FXConfig.FormatoMonto())+ " Saldo=" +eBasic.eFormat(saldo,FXConfig.FormatoMonto());
	}
}

function RedimensionarColumnas(){
var Brw;
	Brw=null;

	Brw=Application.Browsers.GetBrowser("qGastos");	
	if (Brw!=null){				
		Brw.SetColumnWidth("Categoria",180);
		Brw.SetColumnWidth("Referencia",100);
		Brw.SetColumnWidth("Fecha",70);		
		Brw.SetColumnWidth("Vencimiento",70);
		Brw.SetColumnWidth("Proveedor",190);
		Brw.SetColumnWidth("Concepto",250);
		Brw.SetColumnWidth("Divisa",60);
		Brw.SetColumnWidth("TipoCambio",85);
		Brw.SetColumnWidth("Subtotal",90);
		Brw.SetColumnWidth("IVA",90);
		Brw.SetColumnWidth("RetIVA",90);
		Brw.SetColumnWidth("RetISR",90);
		Brw.SetColumnWidth("Total",90);
		Brw.SetColumnWidth("FormaPago",100);
		Brw.SetColumnWidth("StatusAdministrativo",150);
		Brw.SetColumnWidth("Saldo",90);
		
		Brw.SetCaptionByFieldName("TipoCambio","Tipo de cambio");
		Brw.SetCaptionByFieldName("FormaPago","Forma de Pago");
		Brw.SetCaptionByFieldName("StatusAdministrativo","Estado Administrativo");
		
		try{
			Brw.SetColumnFormat("Subtotal",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());					
			Brw.SetColumnFormat("IVA",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());					
			Brw.SetColumnFormat("RetIVA",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());					
			Brw.SetColumnFormat("RetISR",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());					
			Brw.SetColumnFormat("Total",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());					
			Brw.SetColumnFormat("Saldo",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());		
		}catch(e){}
				
		Brw.SetGroup("Categoria");
		Brw.SetTitle(" ");
		TituloGasto(Brw.PrimaryKeyValue);
	}		
}

function AsignarCarpetaRepotes(Window){
	Window.ReportsFolder=Reportes.CarpetaCompras;
	Window.ObjectTypeName="Compra";	
}

function AgregarGasto(objAction){
var Brw;
pkgasto=Gasto.AgregarGasto();

	if(pkgasto>0){		
		Poliza.PolizaPorGasto(pkgasto);
		Brw=Application.Browsers.GetBrowser("qGastos");
		if (Brw!=null) Brw.RefreshRst();
		return -1;
	}else
		return 0;
}

function EditarGasto(){
	var Brw;
	var pk;
	
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null) return 0;
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk<1){
		Log("Seleccione un registro.");
		return 0;
	}
	if(Gasto.EditarGasto(pk)){		
		Brw.RefreshRst();
		return -1;
	}else
		return 0;
}

function CancelarGasto(objAction){	
	var Brw;
	var pk;
	
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null) return 0;
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk<1){
		Log("Seleccione un registro.");
		return 0;
	}
	if(Gasto.CancelarGasto(pk)){
		eBasic.eMsgbox("El documento se canceló correctamente.",6);
		Brw.RefreshRst();
		return -1;
	}else{
		Log(Gasto.LastErrorDescript);
		return 0;
	}
}

function ProcesarGasto(objAction){	
	var Brw;
	var pk;
	
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null) return 0;
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk<1){
		Log("Seleccione un registro.");
		return 0;
	}
	if(Gasto.PagarPorSys_PK(pk)){
		Brw.RefreshRst();
		return -1;
	}else{
		Log(Gasto.LastErrorDescript);
		return 0;
	}
	
}

function PagarGastoCredito(objAction){
	var Brw;
	var pk,saldo,pkCxP;
	
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null) return 0;
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk<1){
		Log("Seleccione un registro.");
		return 0;
	}
	if(Brw.GetFieldValue("StatusAdministrativoID")==1){
		Log("El documento debe estar procesado.");
		return 0;
	}
	
	saldo=Brw.GetFieldValue("Saldo");
	if(saldo==null) saldo=0;
	if(saldo<=LBCxP.MontoMinimo){
		Log("El documento se encuentra liquidado.");
		return 0;
	}
	
	pkCxP=Gasto.ObtenerCXP(pk);
	if(pkCxP<1){
		Log("No se pudo obtener el registro relacionado.");
		return 0;
	}
	
	if(CuentasXPagar.PagarDocumento(pkCxP)){						
		Application.MouseHourglass();
		Poliza.PolizaPagoCXP(CuentasXPagar.ResultadoCXP);
		Application.MouseDefault();
		Brw.RefreshRst();
	}else{
		Log(CuentasXPagar.LastErrorDescrip);				
	}
}


function ArchivosAdjuntos(objAction){
	var Brw;
	var pk;
	
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null) return 0;
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk<1){
		Log("Seleccione un registro.");
		return 0;
	}
	Gasto.MostrarDocumetosAdjuntos(Brw.GetFieldValue("Sys_GUID"),Brw.GetFieldValue("Referencia"));	
}



function CatalogoAduanas()
{
	if (!ModuleLoaded("us_brw_aduana"))
	{
		if (!Application.LoadScript("us_brw_aduana.js")) 
		{
			eBasic.eMsgbox("El sub-programa no pudo cargarse");
			return 0;
		}
	}
	Application.Eval("us_brw_aduana.ShowBrowser()");
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

//Implementación de nuevos métodos 2014
//Autor: Jv
//Fecha: 06/02/2014

function DIOT()
{
	var Brw;
	var pk;
	
	Brw=Application.Browsers.GetBrowser("qGastos");
	if (Brw==null) return 0;
	pk=Brw.PrimaryKeyValue;
	if(pk==null) pk=0;
	if(pk<1){
		Log("Seleccione un registro.");
		return 0;
	}
	
	Diot.EditByPrimary(pk, "IGasto");
}