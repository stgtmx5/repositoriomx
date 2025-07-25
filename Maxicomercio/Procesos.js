//v 2.0.0.0

var CMDBloqueado="SELECT Venta.Sys_PK,Venta.Referencia,Venta.Fecha,Cliente.Nombre AS Cliente, Venta.Sys_Info AS TERMINAL FROM Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK WHERE Venta.StatusAdministrativo<>99 AND Venta.StatusAdministrativo<>3 AND Venta.Sys_Info<>''";

function AgregarAccion(){
	Application.UIShortCuts.CreateAction("PROC_A01","Desbloquear",0,"","","","Procesos.Desbloquear",0,"","","",0);
}
function qTicektsBloqueados(){
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser("qTicektsBloqueados");
	if (Brw==null){
		if(!Application.UIUsers.CheckItem("FX1-80-12-001"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qTicektsBloqueados");
		Brw.Caption="Tickets bloqueados";
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.CmdSQL=CMDBloqueado;
		Brw.KeyField = "Sys_PK";
		//Brw.CmdAfterRetriveFields="Desbloquear.RedimensionarColumnas";
		Brw.SubTitle2="";
		
		Brw.ShowToolBar();
		Brw.AddButton("Desbloquear","PROC_A01");
		Brw.HideFields("Sys_PK");		
		Brw.ShowFindBar();	
		Brw.RefreshRst();
	}else
		Brw.Zorder();	
}

function RedimensionarColumnas(BrwName){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser(BrwName);	
	if (Brw!=null){		
		Brw.SetColumnWidth("Referencia",130);
		Brw.SetColumnWidth("Fecha",130);
		Brw.SetColumnWidth("Cliente",250);
		Brw.SetColumnWidth("TERMINAL",150);
	}
}

function Desbloquear(A){
	var PK;
	
	if(!Application.UIUsers.CheckItem("FX1-80-12-002"))  //PERMITIR ACCESO
			return 0;
	
	PK=Application.ActiveWindow().PrimaryKeyValue;
	if(PK==null){
		eBasic.eMsgbox("Seleccione un elemento.",6);
		return 0;
	}
	if(eBasic.eMsgbox("Es posible que el ticket se encuentre en uso.¿Está seguro que desea desbloquearlo.",4)==7)
		return 0;
	Application.adocnn.execute("UPDATE Venta SET Sys_Info=NULL WHERE Sys_PK="+PK);
	Application.ActiveWindow().RefreshRst();
	eBasic.eMsgbox("El ticket se ha desbloqueado correctamente.",6);
}