var CRNet=null;
var NC;
var engineType = 1;
var Acceso;

onLoad();

function onLoad()
{
	if(CRNet==null)
	{	
		try
		{
			CRNet = eBasic.eCreateObject("induxsoft.Applications.Contrarrecibos.UInterface.cMain");
			
			if(CRNet==null)
			{
				eBasic.eMsgbox("Error al crear el objeto MCPagoProveedor.cMain",6);
				return;
			}
			
			if(!CRNet.Initialize(Application.GetQName())) throw new Error(CRNet.LastError);
			CRNet.SetObjects(Application.UIUsers);
			return;
		}
		catch(e)
		{
			eBasic.eMsgbox("Error: al cargar el modulo Pago a proveedor: "+e.message,6);
		}
	}	
}

function NuevoContrarrecibo()
{
	var CR;
	var st;
	var DC;
	var R;
	try
	{
		CR=CRNet.AgregarContrarrecibo();
		if(CR>0)
		{
			st=CRNet.ValidaStatus(CR);
			if(st==2)
			{			
				DC=CRNet.PagarContrarreciboPK(CR);
				if(DC==null)
				{
					return CR;
				}
				Pagar(DC, true);
			}
			else
			{
				if(CRNet.LastError!="")
				{
					eBasic.eMsgbox(CRNet.LastError,6);
					return;
				}
			}
			return CR;
		}
		else
		{
			if(CRNet.LastError!="")
			{
				eBasic.eMsgbox(CRNet.LastError,6);
				return;
			}
		}
	}
	catch(e)
	{		
		eBasic.eMsgbox("Error: "+e.message,6);		
	}
}

function EditarContrarrecibo(Sys_PK)
{
	try
	{
		var CR;
		CR=CRNet.EditarContrarrecibo(Sys_PK);
		if(CR==false)
		{
			if(CRNet.LastError!="")
			{
				eBasic.eMsgbox(CRNet.LastError,6);
			}
		}
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al editar contra recibo. "+e.message,6);
	}
}

function CancelarContrarrecibo(PK)
{
	try
	{
		var CR;
		CR=CRNet.CancelarContrarrecibo(PK);
		if(CR==false)
		{
			if(CRNet.LastError!="")
			{
				eBasic.eMsgbox(CRNet.LastError,6);
			}
		}		
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al cancelar contra recibo. "+e.message,6);
	}
}

function PagarContrarrecibo(PK)
{
	try
	{
		var DC;
		var MovCuenta;
		var Mov=new Array();
		DC=CRNet.PagarContrarreciboPK(PK);
		if(DC==null)
		{
			if(CRNet.LastError!="")
			{
				eBasic.eMsgbox(CRNet.LastError, 6);
			}
			return false;
		}	
		MovCuenta = Pagar(DC, true);
		if(MovCuenta != null){
			Mov.push(MovCuenta.Sys_PK);
			Reportes.EjecutarReporte("$AppReportsPath$\\Cuentas por pagar\\Multicheque.xpd",1,Mov.length, true,null,"Mov","["+Mov+"]");
		}
		
		//return 
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al pagar contra recibo. "+e.message,6);
		return false;
	}
}

function PagarVariosContrarrecibos()
{
	try
	{
		var DC;
		var crs;
		DC=CRNet.PagarVariosContrarrecibos();
		if(DC==null)
		{
			if(CRNet.LastError!="")
			{
				eBasic.eMsgbox(CRNet.LastError, 6);
			}
		}
		if(DC<1)
		{
			if(CRNet.LastError!="")
			{
				eBasic.eMsgbox(CRNet.LastError, 6);
			}
		}
		if(DC>0)
		{
			var MCInfo;
			var MovCuenta;
			var Mov=new Array();
			DataAccess.BeginTrans();
			for(var x=0; x<DC; x++)
			{
				MCInfo=CRNet.getMovCuentaInfo(x);
				
				MovCuenta = Pagar(MCInfo, true);
				if(MovCuenta==null)
				{
					DataAccess.RollbackTrans();
					eBasic.eMsgbox("Error al pagar varios contra recibos", 6);
					if(Mov.length > 0){
						Reportes.EjecutarReporte("$AppReportsPath$\\Cuentas por pagar\\Multicheque.xpd",1,Mov.length, true,null,"Mov","["+Mov+"]");
					}
					return;
				}
				
				Mov.push(MovCuenta.Sys_PK);
			}
			DataAccess.CommitTrans();
			Reportes.EjecutarReporte("$AppReportsPath$\\Cuentas por pagar\\Multicheque.xpd",1,Mov.length, true,null,"Mov","["+Mov+"]");
		}
	}
	catch(e)
	{
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al pagar varios contra recibos. "+e.message, 6);
	}
}

function Pagar(MCInfo,WithTrans)
{
	try
	{
		var MC;
		var R;
		var IContrarrecibo = new Array();
		if(WithTrans==true)
		{
			//eBasic.eMsgbox("Iniciando transaccion.");
			DataAccess.BeginTrans();
		}
		//
		crCount = MCInfo.CantidadContrarrecibos
		//eBasic.eMsgbox(crCount);
		for(ix = 0; ix < crCount; ix++){
			crs = CRNet.getMovCuentaInfoContraRecibo(MCInfo, ix);
			IContrarrecibo.push(crs);
			//eBasic.eMsgbox(crs);
		}
		//eBasic.eMsgbox(cr_syspk.join(" OR Sys_PK = "));
		//return;
		//
		
		var Cat;
		Cat=Application.NewObject("EDOFx.Categoria");
		if(Cat==null)
		{
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			MCInfo=null;
			eBasic.eMsgbox("Error al cargar la categoría",6);
			return null;
		}
		if(!Cat.LoadFromADOConnection(MCInfo.ICategoria,"",Application.adoCnn,2))
		{
			MCInfo=null;
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			eBasic.eMsgbox(Cat.lastErrDescrip,6);
			Cat=null;
			return null;
		}		
		//public virtual EDOFx.MovCuenta Cheque([int PKChequera = 0], [EDOFx.Categoria ICategoria = null], [string Beneficiario = ""], [string Referencia = ""], [string Notas = ""], [decimal Importe = 0m], [bool NoDialog = false], [bool ValidarSaldo = false], [ref bool WithTrans = true], [ref System.DateTime FechaAplicacion = default(System.DateTime)], [ref int TipoDocumentoEgreso = 66], [ref int PKProveedor = 0])
		MC=LBEfectivo.Cheque(MCInfo.Chequera, Cat, MCInfo.Beneficiario, MCInfo.Referencia, "Cheque por concepto de pago de contra recibo.",MCInfo.Importe, true, true, false, MCInfo.Fecha, MCInfo.TipoDocumentoEgreso, MCInfo.Proveedor);		
		if(MC==null)
		{
			MCInfo=null;
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			eBasic.eMsgbox("Error al generar cheque"+LBEfectivo.LastErrorDescrip,6);
			return null;
		}
		//public virtual EDOFx.DCxP Recibo(ref int PKProveedor, ref System.DateTime Fecha, ref string Referencia, ref string Notas, ref decimal Importe, ref double TCambio, [ref EDOFx.EnumcDocumentos Documento = EDOFx.EnumcDocumentos.cRecibo], [ref bool WithTrans = true], [ref int PKMovCuenta = 0], [ref int PKMovCaja = 0])
		R = LBCxP.Recibo(MCInfo.Proveedor, MC.Fecha, MC.Referencia, "Recibo por pago a proveedor del contra recibo. Referencia del egreso:" + MC.Referencia, MC.Egreso, MC.ICuenta.IDivisa.TCambio, 19, false, MC.Sys_PK);
		if (R==null)
		{
			MC = null;
			MCInfo=null;
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			eBasic.eMsgbox("No se pudo crear el recibo en la cuenta del proveedor." + LBCxP.LastErrorDescrip,6);
			return null;
		}
		var Rec;
		Rec=DataAccess.CreateRecordset();
		if(Rec==null)
		{
			MCInfo=null;
			MC = null;
			R=null;
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			eBasic.eMsgbox("Error al crear objeto ADODB.Recordset",6);
			return null;
		}
		//+MCInfo.Sys_PK;
		where_DContrarrecibo = IContrarrecibo.join(" OR FK_Contrarrecibo = ");
		select_DContrarrecibo = "SELECT ut_DContrarrecibo.IDCxP FROM ut_DContrarrecibo WHERE ut_DContrarrecibo.FK_Contrarrecibo=" + where_DContrarrecibo;
		//eBasic.eMsgbox(select_DContrarrecibo);
		//return;
		Rec.Source = select_DContrarrecibo;
		DataAccess.OpenRecordset(Rec, DataAccess.ADOCnn);
		if(Rec.State!=1)
		{
			Rec=null;
			MC = null;
			MCInfo=null;
			R=null;		
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			eBasic.eMsgbox("Error al seleccionar las facturas",6);
			return null;
		}
		while(!Rec.EOF)
		{
			var DCXP;
			DCXP=Application.NewObject("EDOFx.DCXP");
			if(DCXP==null){
				MC = null;
				MCInfo=null;
				R=null;
				Rec=null;
				if(WithTrans==true)
				{
					DataAccess.RollbackTrans();
				}
				eBasic.eMsgbox("Error al crear objeto DCXP",6);
				return null;
			}
			if(!DCXP.LoadFromADOConnection(Rec("IDCxP").Value,"",Application.adoCnn,2)){
				MC = null;
				MCInfo=null;
				R=null;
				Rec=null;
				if(WithTrans==true)
				{
					DataAccess.RollbackTrans();
				}
				eBasic.eMsgbox("Error al cargar objeto DCxP. "+DCXP.lastErrDescrip,6);
				return null;
			}
			var Aplicado=LBCxP.AplicarPago(R, DCXP, DCXP.Haber + DCXP.IntMoratorios - DCXP.Pagos - DCXP.Bonificaciones, MC.Fecha, false);
			if(Aplicado==false)
			{
				MC = null;
				MCInfo=null;
				R=null;
				Rec=null;
				DCXP=null;
				if(WithTrans==true)
				{
					DataAccess.RollbackTrans();
				}
				eBasic.eMsgbox("Error al aplicar el pago. "+LBCxP.LastErrorDescrip,6);
				return null;
			}
			Rec.MoveNext();
		}
		Rec.Close;
		var tmp;
		where_Update = IContrarrecibo.join(" OR Sys_PK = ");
		update_CR = "update ut_Contrarrecibo set ut_contrarrecibo.IMovCuenta="+MC.Sys_PK+", ut_contrarrecibo.IStatus= (select ut_cStatusContrarrecibo.sys_pk from ut_cStatusContrarrecibo where ut_cStatusContrarrecibo.ID=2) where ut_Contrarrecibo.sys_pk="+where_Update;
		//eBasic.eMsgbox(update_CR);
		tmp=DataAccess.ADOCnn.execute(update_CR);
		if(tmp==null)
		{
			MC = null;
			MCInfo=null;
			R=null;
			Rec=null;
			if(WithTrans==true)
			{
				DataAccess.RollbackTrans();
			}
			eBasic.eMsgbox("Error al actualizar el status del contra recibo",6);
			return null;
		}
		if(WithTrans==true)
		{
			DataAccess.CommitTrans();
		}
		Poliza.PolizaReciboCXP(R.Sys_PK);
		R = null;
		return MC;
	}
	catch(e)
	{
		if(WithTrans)
		{
			DataAccess.RollbackTrans();
		}
		eBasic.eMsgbox("Error al pagar contrar-recibo:"+e.message,6);
	}
}