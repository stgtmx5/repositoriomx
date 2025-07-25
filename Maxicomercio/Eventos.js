//Versión=1.0

//****************** EVENTOS MAXICOMERCIO 2008 ***********************

//Al iniciar sesión
function EvInicioSesion(){
	var sql;
	try{
		UIRequisiciones.createObjects();
		try
		{
			Contrarrecibo.onLoad();
		}
		catch(a)
		{}
		gestion_poliza.configurar();

		/*sql = "DELETE FROM ut_cnn_tuser WHERE CnnID = @@SPID AND Host=HOST_NAME()";
		Application.ADOCnn.Execute(sql);
		sql = "INSERT INTO ut_cnn_tuser (Sys_DTCreated, Sys_GUID, CnnID, Host, IUser) VALUES (GETDATE(), REPLACE(NEWID(),'-',''), @@SPID, HOST_NAME(),"+ Application.UIUsers.CurrentUser.Sys_PK+")";
		Application.ADOCnn.Execute(sql);*/
	}catch(e){
		eBasic.eMsgbox(e.message,4);
	}
}
//Antes de  finalizar sesión 
function EvFinSesion(){
	//Devolver verdadero para finalizar sesión.
	//Devolver falso para cancelar y continuar conectado.	
	
	return true;	
}
//Antes de guardar venta
function EvAntesVenta(ObjVenta){		
	//Devolver verdadero para gurdar la venta.
	//Devolver falso para cancelar.	
	
	return true;	
}
//Despues de guardar venta
function EvDespuesVenta(ObjVenta){
	
}
//Antes de guardar compra
function EvAntesCompra(ObjCompra){
	//Devolver verdadero para gurdar la compra.
	//Devolver falso para cancelar.		
	
	return true;	
}
//Despues de guardar compra
function EvDespuesCompra(ObjCompra){
	
}
//Depues de guardar póliza
function EvDespuesPoliza(ObjPoliza){
	
}
//Despues de guardar un movimiento en chequera (retiro,depósito,traspaso,cheque)
function EvDespuesMovChequera(objMovCuenta){
	
}
//Después de hacer una trasferencia entre cuentas.
function EvDespuesTrasferenciaChequera(SysPK_Retiro,SysPK_Deposito){
	//SysPK_Retiro=Clave primaria de la chequera de donde se hizo el retiro
	//SysPK_Retiro=Clave primaria de la chequera en donde se hizo el depósito.
}

//INTERFAZ DE USUARIO 

//Al iniciar interfaz de usuario
function AIIU(){
	brw_cr.CrearPanel();
}
//Al iniciar AxForm ( ventanas: crear Venta, crear Compra, página de inicio <Mi empresa> y crear póliza)
function AIAxForm(Ax){
	
}
//Al iniciar Browser ( Todas las ventanas que contiene un lista de registos de base de datos pr ejemplo: inventario.
function AIBrowser(Brw){
	
}