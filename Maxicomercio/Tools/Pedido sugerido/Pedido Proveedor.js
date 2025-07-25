PedidoProveedor();

function PedidoProveedor(){
	var T;	
	var cnn;
	
	T=eBasic.eCreateObject("MBI_Inv.MBIInvLogic");
	if(T==null){
		eBasic.eMsgbox("Error al crear objecto MBI_Inv.MBIInvLogic.",6);
		return 0;
	}
	
	/*
	var mODBC="sdv_Pedido_Central";
	cnn=eBasic.eCreateObject("ADODB.Connection");
	cnn.open("Provider=MSDASQL.1;Persist Security Info=False;Data Source="+mODBC);
	if(cnn.State != 1){
		cnn=null;
		eBasic.eMsgbox("No se pudo conectar a la base de datos...",6);
		return 0;
	}
	T.Conexion(cnn);
	*/	
	cnn=Application.ADOCnn;
	T.Conexion(cnn);
	T.Form_Gen_PedidoProveedor();
}