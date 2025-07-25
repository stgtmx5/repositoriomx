//var netconnection;
var uiCCgestion;
var Acceso;
var engineType=0; //1=SQLServer 2008 R2, 2=MySQL 5.0+
var XMLGestionPoliza = "";

function configurar(){
	//eBasic.eMsgbox("Configurando poliza")
	try{
		uiCCgestion= eBasic.eCreateObject("induxsoft.Application.UserIntefaces.uiCCgestionPoliza.cMain");
		if(uiCCgestion==null){
			eBasic.eMsgbox("Error al crear el objeto uiCCgestionPoliza");
			return 0;
		}
		
		
		ObtenerMotor();
		//engineType=AppEngine.inDataBaseType;
		switch(engineType)
		{
			case 1:
				XMLGestionPoliza=eBasic.AddSlashPath(GetRepository())+"SQLSvrRequisiciones.xml";
				break;
			case 2:
				XMLGestionPoliza=eBasic.AddSlashPath(GetRepository())+"MySQLRequisiciones.xml";
				break;
			case 3:
				XMLGestionPoliza=eBasic.AddSlashPath(GetRepository())+"MSAccessRequisiciones.xml";
				break;
			default:
				return 0;
		}
				
		if(engineType == -1)
		{
			Log("No se ha podido determinar el motor de la base de datos.");
			return -1;
		}
		
		
		if(!uiCCgestion.Initialize(Application.GetQName())) throw new Error(uiCCgestion.lastErrorDescription);
		if(!uiCCgestion.LoadDiccionarioSQL(XMLGestionPoliza)) throw new Error(uiCCgestion.lastErrorDescription);
		
		try
		{
			var R = eBasic.eCreateObject("ADODB.Recordset");
			if(R==null)
			{
				eBasic.eMsgbox("Error al crear objeto ADODB.Recordset");
				return 0;
			}
		
			R.ActiveConnection = Application.adoCnn;
			R.CursorLocation = 3;
			R.Source = " SELECT * FROM ut_Prorrateo";
			R.Open();
			
			R.Close();	
			R = null;
		}
		catch(e)
		{
			if(R.State == 1){
				R.Close();
			}
			uiCCgestion.createSchema();
			R = null;
		}
		Application.UIShortCuts.CreateAction("P_Fin_PRO","Pólizas",0,"","","","gestion_poliza.Prorratear",0,"","","",0);
	}
	catch (e)
	{
		eBasic.eMsgbox("Error: "+e.description );
	}
}

configurar();

function ObtenerCContableConocida(CodigoCuenta){
	return uiCCgestion.obtenerCuentaConocida(CodigoCuenta);
}

function abrirConfiguracionCuentasConocidas(){
	uiCCgestion.DefinirPolizasConocidas();
}
//VJNV 
function abrirConfiguracionCuentasdeIngreso()
{
	uiCCgestion.CCPolizaIngresoVentas();
}
//VJNV 
function AsignacionAutomaticoProductosPorGrupo()
{
	uiCCgestion.AsignacionAutomaticaDeProductos();
}

function abrirConfiguracionProrrateo()
{
	uiCCgestion.ConfigurarProrrateoCCDepartamental();
}

function Prorratear(A){
	var dlg;
	var FormPoliza;
	var Poliza;
	var NuevaPoliza;
	//eBasic.eMsgbox(Poliza);
	dlg=Application.AXForms.AXForm(A.Context.TagData);
	if (dlg!=null){
		FormPoliza=dlg.GetAXObject();
		Poliza = FormPoliza.ObtenerPlantilla();
		NuevaPoliza = uiCCgestion.ProrrateoEnPolizaManual(Poliza);
		if(NuevaPoliza!=""){
			FormPoliza.UsarPlantilla(NuevaPoliza);
		}
	}
}

function GetRepository(){
var sp="";
	try{
		sp=Application.ScrAdmin.GetPath(0);
	}catch(e){
		sp=Application.SourceAdmin.GetPath(0);
	}
	return sp;
}

function CancelarMC(PK)
{
	var CatPredIngresoXCancelacion=LBEfectivo.CatPredIngreso;
	var R;
	var CMD;
	if(!Application.UIUsers.CheckItem("FX1-72-11-000"))
	{
		Log("No tiene los permisos para cancelar el movimiento de la cuenta");
		return 0;
	}	
	if(eBasic.eMsgbox("¿Realmente desea cancelar este movimiento?",4)!= 6)
	{
		return 0;
	}
	try
	{		
		DataAccess.BeginTrans();
		R=Application.Database.OpenRecordset("SELECT Cancelado, Contabilizado,Referencia,Egreso,Ingreso,ICuenta,Poliza FROM MovCuenta WHERE SYS_PK="+PK,Application.ADOCnn);
		if(R==null)
		{
			DataAccess.RollbackTrans();
			Log("No se pudo crear el objeto RecordSet");
			return 0;
		}
		if(R.EOF && R.BOF)
		{
			DataAccess.RollbackTrans();
			Log("La cuenta que proporcionó no tiene ningún movimiento o no existe");
			return 0;
		}
		if(R("Cancelado").Value==1)
		{
			DataAccess.RollbackTrans();
			Log("El movimiento ya se encuentra cancelado");
			return 0;
		}
		//Cancelar MovCuenta
		CMD=eBasic.eCreateObject("ADODB.Command");
		CMD.ActiveConnection=DataAccess.ADOCnn;
		CMD.CommandType=4; //adCmdStoredProc
		CMD.CommandText="UpdCancelarMovCuenta";
		var P=CMD.CreateParameter("PK",3,1,0,PK);
		CMD.Parameters.Append(P);
		CMD.Execute;
		//Crear nota de cargo del recibo, si es que existe
		var f=new Date();
		var Z=Application.Database.OpenRecordset("SELECT Sys_PK,Debe,IProveedor,TipoCambio FROM DCxP WHERE Documento=19 AND IMovChequera="+PK,Application.ADOCnn);
		if(Z==null)
		{
			DataAccess.RollbackTrans();
			Log("Error al buscar recibo relacionado con cuentas por pagar");
			return 0;
		}
		if(!(Z.EOF && Z.BOF))
		{
			//Existe el Recibo			
			var tmp=LBCxP.NotaCargo(Z("IProveedor").Value, Application.CurrentDate(), Application.CurrentDate(), "Por cancelación de movimiento "+R("Referencia").Value+" en cuentas de cheques", Z("Debe").Value, Z("TipoCambio").Value, gFunciones.ReferenciaAleatoria(), 17, 0, 0, false,true);			
			if(tmp==null)
			{
				DataAccess.RollbackTrans();
				Log("Error al crear Nota de cargo. "+LBCxP.LastErrorDescrip);
				return 0;
			}
		}		
		try
		{
			DataAccess.ADOCnn.Execute("UPDATE MovCuenta SET uf_fechacancelacion=NOW() WHERE Sys_PK="+PK);
		}
		catch(a)
		{
			DataAccess.ADOCnn.Execute("UPDATE MovCuenta SET uf_fechacancelacion=GETDATE() WHERE Sys_PK="+PK);
		}
		//Generamos un MovCuenta
		var Rec;
		var MovCuenta;		
		/*
		if(Rec==null)
		{
			DataAccess.RollbackTrans();
			Log("Error al obtener el nombre del proveedor asignado al movimiento");
			return 0;
		}
		if(Rec.EOF && Rec.BOF)
		{
			DataAccess.RollbackTrans();
			Log("Error al obtener el nombre del proveedor asignado al movimiento");
			return 0;
		}
		*/
		MovCuenta=Application.NewObject("EDOFx.MovCuenta");
		if(MovCuenta==null)
		{
			DataAccess.RollbackTrans();
			Log("Error al crear el objeto movcuenta");
			return 0;
		}
		var Cat=Application.NewObject("EDOFx.Categoria");
		if(Cat==null)
		{
			DataAccess.RollbackTrans();
			Log("Error al crear el objeto EDOFx.Categoria");
			return 0;
		}		
		if(!Cat.LoadFromADOConnection(CatPredIngresoXCancelacion, "", Application.ADOCnn))
		{
			DataAccess.RollbackTrans();
			Log("No hay categoría predeterminada de ingreso por cancelación o esa categoría no existe.");
			return 0;
		}
		var Chequera=Application.NewObject("EDOFx.Chequera");
		if(Chequera==null)
		{
			DataAccess.RollbackTrans();
			Log("Error al crear el objeto EDOFx.Chequera");
			return 0;
		}
		if(!Chequera.LoadFromADOConnection(R("ICuenta").Value, "", Application.ADOCnn))
		{
			DataAccess.RollbackTrans();
			Log("Error al cargar la chequera.");
			return 0;
		}		
		MovCuenta.AddNew();
		MovCuenta.ADOCnn=Application.ADOCnn;
		MovCuenta.Conciliado=false;
		MovCuenta.Contabilizado=false;
		MovCuenta.Cancelado=false;
		MovCuenta.Aplicacion=Application.CurrentDate();				
		MovCuenta.Egreso=R("Ingreso").Value;
		MovCuenta.Ingreso=R("Egreso").Value;
		MovCuenta.Fecha=Application.CurrentDate();		
		MovCuenta.Referencia=gFunciones.ReferenciaAleatoria();		
		MovCuenta.ICategoria=Cat;
		MovCuenta.ICuenta=Chequera;
		Rec=Application.Database.OpenRecordset("SELECT Proveedor.Nombre FROM DCxP inner join proveedor on DCxP.IProveedor=Proveedor.Sys_PK WHERE IMovChequera="+PK, Application.ADOCnn);
		if(Rec!=null)
		{
			if(!(Rec.EOF && Rec.BOF))
			{
				MovCuenta.Beneficiario=Rec("Nombre").Value;
			}
		}
		if(MovCuenta.Egreso>0)
		{
			MovCuenta.Notas="Egreso de efectivo por cancelación de "+R("Referencia").Value;
			MovCuenta.Tipo=34;
		}
		else
		{
			MovCuenta.Notas="Ingreso de efectivo por cancelación de "+R("Referencia").Value;
			MovCuenta.Tipo=33;
		}
		if(!MovCuenta.Update())
		{
			DataAccess.RollbackTrans();
			Log("No se pudo guardar el movimiento");
			return 0;
		}
		DataAccess.CommitTrans();
		Poliza.PolizaInvertida(R("Poliza").Value, MovCuenta.Sys_PK);
		return -1;
	}
	catch(e)
	{
		DataAccess.RollbackTrans();
		Log(e.message);
	}
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function ObtenerMotor()
{
	var sql;
	var R = eBasic.eCreateObject("ADODB.Recordset");
	engineType = -1;
	if(R==null)
	{
		eBasic.eMsgbox("Error al crear objeto ADODB.Recordset");
		return -1;
	}
		
	/*Consulta para MySQL*/
	try
	{
		sql = "select UUID();";
		R.ActiveConnection = Application.adoCnn;
		R.CursorLocation = 3;
		R.Source = sql;
		R.Open;
		R.Close;
		//MySQL
		
		engineType = 2;
		XMLRequisiciones = "MySQLRequisiciones.xml";
		return;
	}
	catch(e)
	{
		//Siguiente motor...
	}
	
	//Consulta SQLServer
	try
	{
		sql = "select NEWID();";
		R.ActiveConnection = Application.adoCnn;
		R.CursorLocation = 3;
		R.Source = sql;
		R.Open;
		R.Close;
		//SQLServer
		engineType = 1;
		XMLRequisiciones = "SQLSvrRequisiciones.xml";
		return;
	}
	catch(e)
	{
		//Siguiente motor...
	}
	
	//Consulta Access
	try
	{
		sql = "Select cbool(-1) as Valor;";
		R.ActiveConnection = Application.adoCnn;
		R.CursorLocation = 3;
		R.Source = sql;
		R.Open;
		R.Close;
		//Access
		engineType = 3;
		XMLRequisiciones = "MSAccessRequisiciones.xml";
		return;
	}
	catch(e)
	{
		//Finaliza
	}
}