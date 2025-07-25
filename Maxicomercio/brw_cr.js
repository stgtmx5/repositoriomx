/*Archivo de sub-programa generado automáticamente
05/10/2012 05:41:12 p.m.

***********************************************
*/


/*var sqlCMD =  "SELECT * FROM qryCRecibos WHERE YEAR(qryCRecibos.Fecha)=@Anio"
var sqlCRTodos =  sqlCMD + " ORDER BY qryCRecibos.Fecha, qryCRecibos.Folio, qryCRecibos.Proveedor";
var sqlCR = "SELECT * FROM qryCRecibos WHERE YEAR(qryCRecibos.Fecha)=@Anio AND MONTH(qryCRecibos.Fecha)=@Mes ORDER BY qryCRecibos.Fecha, qryCRecibos.Folio, qryCRecibos.Proveedor";*/

var sqlCMD = "SELECT ut_Contrarrecibo.Sys_PK, Proveedor.Nombre, ut_cStatusContrarrecibo.Const AS Status, FoliosDocumentos.Folio, ut_Contrarrecibo.Fecha, ut_Contrarrecibo.FechaVencimiento, ut_Contrarrecibo.ImporteTotal AS Importe FROM ((ut_Contrarrecibo INNER JOIN ut_cStatusContrarrecibo ON IStatus = ut_cStatusContrarrecibo.Sys_PK) INNER JOIN FoliosDocumentos ON ut_Contrarrecibo.Folio = FoliosDocumentos.Sys_PK) INNER JOIN Proveedor ON Proveedor.Sys_PK = ut_Contrarrecibo.IProveedor WHERE YEAR(ut_Contrarrecibo.Fecha)=@Anio"

var sqlCRTodos = sqlCMD + " ORDER BY ut_Contrarrecibo.Fecha, FoliosDocumentos.Folio, Proveedor.Nombre";

var sqlCR = sqlCMD + " AND MONTH(ut_Contrarrecibo.Fecha)=@Mes ORDER BY ut_Contrarrecibo.Fecha, FoliosDocumentos.Folio, Proveedor.Nombre";

function CrearPanel(){
	//Application.UIShortCuts.CreatePane("P_CR","Contrarrecibos","","","ICON_VENTAS","",0);
	try{
		Application.UIShortCuts.CreateAction("P_CR_01","Agregar",0,"","","","brw_cr.AddNew",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_CR_02","Editar",0,"","","","brw_cr.Edit",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_CR_03","Cancelar",0,"","","","brw_cr.Delete",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_CR_04","Pagar",0,"","","","brw_cr.Pagar",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_CR_05","Pagar múltiples",0,"","","","brw_cr.PagarMultiple",0,"","","",0);
		Application.UIShortCuts.CreateAction("P_CR_06","Vista Previa", 0, "", "", "", "brw_cr.Imprimir", 0, "","","",0);
		Application.UIShortCuts.CreateAction("P_CR_07","Configurar",0,"", "" ,"" , "brw_cr.Configurar", 0, "", "","", 0);
	}
	catch(e)
	{
		Log(e.message);
	}
}

function ShowBrowser()
{
//CrearPanel();
var Brw;
var BrwName="contrarrecibos";
var BrwPKField="Sys_PK";
var BrwTitle="Contra recibos";
var Function_AddNew="brw_cr.AddNew";
var Function_Edit="brw_cr.Edit";
var Function_Delete="brw_cr.Delete";
var Function_Pagar="brw_cr.Pagar";

Brw=null;

Brw=Application.Browsers.GetBrowser(BrwName);
if (Brw==null)
	{
		//Habilite esta sección de código para controlar el acceso por permisos
		if(!Application.UIUsers.CheckItem("MCR-00-00-005")) 
			return 0;
		

		Application.MouseHourglass();

		Brw=Application.Browsers.CreateBrowser(BrwName);
		Brw.Caption=BrwTitle;
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));	
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.CmdSQL=sqlCR;
		Brw.KeyField = BrwPKField;
		
		//Brw.ObjectTypeName="Nombre_Tipo_de_Entidad";		
		Brw.CmdAddNew=Function_AddNew;
		Brw.CmdEdit=Function_Edit;
		Brw.CmdDelete = Function_Delete;
		Brw.CmdDblClick=Function_Edit;
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Agregar","P_CR_01");
		Brw.AddButton("Editar","P_CR_02");
		Brw.AddButton("Cancelar","P_CR_03");
		Brw.AddButton("Pagar","P_CR_04");
		Brw.AddButton("Pagar múltiples","P_CR_05");
		Brw.AddButton("Vista Previa", "P_CR_06");
		Brw.AddButton("Configurar", "P_CR_07");
		
		Brw.BottomTabParameter="Mes";		
		Brw.CmdBottomTabClick="brw_cr.ConfigurarConsulta";
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
		
		Brw.RefreshRst();
		
		//Ocultar columnas
		Brw.HideFields("Sys_PK;Sys_TimeStamp;Sys_GUID;Sys_DTCreated;Sys_User;Sys_LastUser;Sys_Exported;Sys_DTExported;Sys_Info");
		Brw.CmdAfterRetriveFields="brw_cr.RedimensionarColumnas";	
		RedimensionarColumnas(BrwName);
		Application.MouseDefault();
	}
	else
		Brw.Zorder();
}

function AddNew(Obj)
{
	//eBasic.eMsgbox("Agregando");
	var PK = 0;
	try{
		PK = Contrarrecibo.NuevoContrarrecibo("CR");
		var Bw=Application.Browsers.GetBrowser("contrarrecibos");
		if(PK > 0){
			if (eBasic.eMsgbox("¿Desea imprimir el contrarrecibo?", 4)==6){
				Reportes.EjecutarReporte("$AppReportsPath$\\Cuentas por pagar\\Contrarrecibo.xpd",1,PK,true);
			}
			Bw.RefreshRst();
		}
	}catch(e){
		Log(e.message);
		eBasic.eMsgbox("AddNew: "+e.message);
	}
}

function Edit(Sys_PK)
{
	var pk;
	try{
		var Bw=Application.Browsers.GetBrowser("contrarrecibos");
		if(Bw == null){
			return;
		}
		pk=Bw.PrimaryKeyValue;
		if(pk==null){
			pk=0;
		}
		if(pk<1){
			Log("Seleccione un registro.");
			return 0;
		}
		Contrarrecibo.EditarContrarrecibo(Sys_PK);
		Bw.RefreshRst();
	}catch(e){
		eBasic.eMsgbox(e.message);
	}
}

function Delete(Sys_PK)
{
	var pk;
	try
	{
		var Bw=Application.Browsers.GetBrowser("contrarrecibos");
		if(Bw == null){
			return;
		}
		pk=Bw.PrimaryKeyValue;
		if(pk==null){
			pk=0;
		}
		if(pk<1){
			Log("Seleccione un registro.");
			return 0;
		}
		if (eBasic.eMsgbox("¿Desea cancelar el contrarrecibo?", 4)==6)
		{
			Contrarrecibo.CancelarContrarrecibo(Sys_PK);
			Bw.RefreshRst();
		}
	}
	catch(e)
	{
		eBasic.eMsgbox(e.message);
	}
}

function Pagar(Sys_PK)
{
	var pk;
	try
	{
		var Bw=Application.Browsers.GetBrowser("contrarrecibos");
		if(Bw == null){
			return;
		}
		pk=Bw.PrimaryKeyValue;
		if(pk==null){
			pk=0;
		}
		if(pk<1){
			Log("Seleccione un registro.");
			return 0;
		}
		var PK=Bw.PrimaryKeyValue;
		if(PK==null)
		{
			return 0;
		}
		Contrarrecibo.PagarContrarrecibo(PK);
		Bw.RefreshRst();
	}
	catch(e)
	{
		eBasic.eMsgbox(e.message);
	}
}

function PagarMultiple()
{
	Contrarrecibo.PagarVariosContrarrecibos();
}

function Imprimir(PK)
{
	var pk;

	try
	{
		var Bw=Application.Browsers.GetBrowser("contrarrecibos");
		var PK=Bw.PrimaryKeyValue;
		if(PK==null)
		{
			Log("Seleccione un registro");
			return 0;
		}
		if(PK > 0){
		//	if (eBasic.eMsgbox("¿Desea imprimir el contrarrecibo?", 4)==6){
				Reportes.EjecutarReporte("$AppReportsPath$\\Cuentas por pagar\\Contrarrecibo.xpd",1,PK,true);
		//	}
		}
	}
	catch(e)
	{
		eBasic.eMsgbox(e.message);
	}
}

function Configurar()
{
	Contrarrecibo.CRNet.Configurar();
}

function ConfigurarConsulta(Tab)
{
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser("contrarrecibos");
	if (Brw!=null){
		if (Tab==0) //Todos los meses
			Brw.sqlCommand.CmdSQL=sqlCRTodos;
		else //por mes
			Brw.sqlCommand.CmdSQL=sqlCR;
	}
	else
	{
		Log("Error al asignar consulta");
	}	
}

function RedimensionarColumnas(BrwName)
{
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);
	//eBasic.eMsgbox(BrwName);
	if (Brw!=null){
		Brw.SetColumnWidth("Fecha",80);
		Brw.SetColumnWidth("Folio",100);
		Brw.SetColumnWidth("Proveedor",300);
		Brw.SetColumnWidth("Status",80);
		Brw.SetColumnWidth("FechaVencimiento",120);
		Brw.SetColumnWidth("Importe",100);
		
		
		Brw.SetCaptionByFieldName("FechaVencimiento","Fecha de vencimiento");
		try{
			Brw.SetColumnFormat("Importe",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());
			//eBasic.eMsgbox("Importe");
		}catch(e){
			Log(e.message);
		}
	}
}

function Log(Error)
{
	if (Error!="")
		Application.FireEventLog(Error);
}