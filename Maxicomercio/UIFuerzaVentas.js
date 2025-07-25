// Módulo: Fuerza de ventas.

function Load()
{
	pid=Application.NewObject("geFrontApplication.AxFormControl");
	pid.Class="geCRMExclusive.CtrDncontacts";
	pid.TemplateName="DnContacts";
	Application.cAppInfo.AxFormControls.Add(pid);
}

function FuerzaVentas()
{
var Frm;
var User;	
var Admin;
var PKAgente;
	
Frm=null;
Frm=Application.AXForms.AXForm("FuerzaVtas");
	if (Frm==null)
	{
		Frm=Application.AXForms.CreateForm("DnContacts","FuerzaVtas");		
		if (Frm==null)
		{
			eBasic.eMsgbox("Error al cargar control AxtiveX.",6);
			return 0;
		}		
		User=Application.UIUsers.CurrentUser.UserID;
		
		PKAgente=GetField("Select Agente.Sys_PK FROM Agente INNER JOIN TUser ON Agente.uf_iuser = TUser.Sys_PK WHERE TUser.UserID = '"+User+"'");
		
		if(PKAgente==null) PKAgente=0;
		
		//eBasic.eMsgbox(PKAgente + "  asdasd Tuser " + User );//QUITAR
		
		Admin=false;		
		//Admin=Application.UIUsers.CheckItem("FX1-20-10-40-001",false,false);
		Admin=Application.UIUsers.CheckItem("FX1-90-00-001", false, false);
		if(Admin==null) Admin=false;		
		
		Frm.Caption="Fuerza de ventas";	
		//Frm.CmdRefreshRst="UIMiEmpresa.RefreshData";
		var Cnn = Application.Adocnn;
		Frm.GetAxObject().SetObjects(Cnn, PKAgente, Admin, User);
		Frm.GetAxObject().InitUICRM(Configuracion.RutaXML, Paises);
		Frm.GetAxObject().RefreshData();
	}
	else
		Frm.Zorder();	
}

function GetField(sql)
{
	var R;
	try{
		R=Application.adocnn.Execute(sql);
		if(R==null) return 0;
		if(!(R.BOF && R.EOF)){
			return R.Fields(0).Value;
		}
	}catch(e){
		eBasic.eMsgbox(e.description,6);
	}
	return 0;
}

function RefreshData()
{
	var f;
	f=Application.ActiveWindow().GetAxObject();
	f.RefreshData();
	f=null;
}

Load();