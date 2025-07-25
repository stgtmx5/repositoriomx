//versión: 9.0.1
//Conceptos para pólizas
var cVentaFactura="Facturación con referencia: ";
var cVentaDevolucionNC="Devolución por nota de crédito con referencia: ";
var cVentaCancelacionFactura="Cancelación de la factura: ";
var cIntMoratoriosCXC="Intereses moratorios al cliente: ";
var cIntFinancierosCXC="Intereses financieros al cliente: ";
var cNotaCreditoCXC="Nota de crédito aplicada al cliente: ";
var cCobro="Cobro del documento: ";
var cNuevoDCXC="Alta de documento por cobrar con referencia: ";
var cNotaCargoCXC="Nota de cargo aplicada al cliente: ";
var cCompraFactura="Facturación con referencia: ";
var cCompraDevolucionNC="Devolución por nota de crédito con referencia: ";
var cCompraCancelacionFactura="Cancelación de la factura: ";
var cIntMoratoriosCXP="Intereses moratorios al proveedor: ";
var cIntFinancierosCXP="Intereses financieros al proveedor: ";
var cNotaCreditoCXP="Nota de crédito aplicada al proveedor: ";
var cPago="Pago del documento: ";
var cNuevoDCXP="Alta de documento por pagar con referencia: ";
var cNotaCargoCXP="Nota de cargo aplicada al proveedor: ";
var cRecibo="Abono";
var cBonificacion="Bonificación al documento: ";
var cNotas="Póliza creada automáticamente";
var cCheque="Cheque a nombre de ";
var cRetiro="Retiro a nombre de ";
var cDeposito="Depósito a la cuenta ";
var cTraspaso="Trasferencia entre cuentas";
var cGasto="Gasto";
//jv - Crear objeto para POS
var tempconta = null;
//BY JFrank: Se agrego parametro Global (true,false) para determinar si proviene de una factura global

//************* VENTAS *****************************
function PolizaVentaFacturacion(Factura,Global){
	if(!Generar()) return -1;
	
	var Poliza;
	var DPoliza;	
	var CC;				
	var Impuesto;
	var Costo;		
	var Divisa;
	var Relacionada; //Indica si la factura está relacionado con otros documentos
	
	//30/06/2010 GJG
	//=================================================
	try{
		if(Factura.FormaPago==2 || Factura.FormaPago==3){
			//si crédito o financiado
			PolizaPorAnticipo(Factura.Sys_PK);
		}
	}catch(e){
	
	}
	//=================================================
			
	Relacionada=false;
	Relacionada=LBVenta.IncluyeOtrosDocumentos(Factura.Sys_PK,3); //Buscar remisiones relacionadas	
	
	Divisa=Factura.IDivisa.Sys_PK;	
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS
	Poliza.Periodo=AsignarPeriodo();
	Poliza.Concepto=cVentaFactura+Factura.Referencia;
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	//***** PARTIDA 1: CLIENTE O CAJA********** Edit By Frank -> 21/Agosto/09
			
	if(Global==null) Global=false; //25-01-2010
	
	if (!Global){
	DPoliza=null;
	DPoliza=DPolizaFormaPago(Poliza,Factura,false);	
	if(DPoliza==null){
		if(!Relacionada)	
			return 0;	
	}else{
		DPoliza.Debe=Factura.Subtotal-Factura.Descuento1-Factura.Descuento2+Factura.Impuesto1+Factura.Impuesto2+Factura.Impuesto3+Factura.Impuesto4;
		DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DPoliza.Debe,Divisa,1); //EN DIVISA PREDETERMINADA	
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;	
	}
	}else{
		//By jFrank: 21/Agosto/09
		//Agregado para generar polizas a facturaras globales
		var Rst=null;
		var sqlQuery="";
		// La Consulta retorna las ventas de diferentes cuentas
		sqlQuery="select Venta.Sys_PK,sum(SubTotal-Descuento1-Descuento2+Impuesto1+Impuesto2+Impuesto3+Impuesto4) as Debe,ICaja,CodCuenta  from venta INNER JOIN Caja ON Venta.ICaja=Caja.Sys_PK where AplicadoA=" + Factura.Sys_PK + " Group BY Venta.ICaja;"
		Rst =Poliza.ADOCnn.Execute(sqlQuery);
		if (Rst==null){
			Log("Error al intentar obtener datos origen de la factura");
			return 0;
		}
	
		while(!Rst.EOF){
			DPoliza=null;
				DPoliza=DPolizaGlobal(Poliza,Rst("CodCuenta").Value);
				DPoliza.Debe= Rst("Debe").Value;
				DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DPoliza.Debe,Divisa,1); //EN DIVISA PREDETERMINADA	
				Poliza.Debe=Poliza.Debe+DPoliza.Debe;
			Rst.MoveNext();
		}
	}
			
	//PARTIDA 2: INGRESOS POR VENTAS
	if(!CC.LoadFromADOConnection(FXConfig.CuentaIngresoXVentas(),"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	DPoliza.Haber=Factura.Subtotal-Factura.Descuento1-Factura.Descuento2;
	DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,DPoliza.Haber,Divisa,1); //EN DIVISA PREDETERMINADA		
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	//PARTIDA 3: IMPUESTO POR PAGAR	
	Impuesto=0;
	Impuesto=Factura.Impuesto1+Factura.Impuesto2+Factura.Impuesto3+Factura.Impuesto4;
			
	if(Impuesto>0){
		Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Divisa,1); //EN DIVISA PREDETERMINADA				
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXPagar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Haber=Impuesto;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
	//PARTIDA 4:COSTO DE VENTAS	
		
	Costo=LBInventario.CostoVenta(Factura);//Es Costo lo devuelve en la divisa predeterminada
	if(LBInventario.LastErrorCode>0){//si ocurrión un error en costoVenta()		
		Log(LBInventario.LastErrorDescrip);
		return 0;
	}
	if(Costo>0){
		if(!CC.LoadFromADOConnection(FXConfig.CuentaCostoVenta(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		
		if (EsDepartamental(CC)) return 0;
		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Debe=Costo;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
		//PARTIDA 5: INVENTARIO
		DPoliza=null;
		DPoliza=DPolizaInventario(Poliza,Factura.ICConsumo.FK_IAlmacen);
		if(DPoliza==null) return 0;
		DPoliza.Haber=Costo;	
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;	
	}
		
	//GUARDAR PÓLIZA	
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
			
	//ACTUALIZAR VENTA
	Factura.Poliza=Poliza.Sys_GUID;
	Factura.Contabilizado=true;
	if(!Factura.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con la factura.",6);
		return 0;
	}	
	
	//ACTUALIZAR MOVIMIENTO DE CAJA
	if(Factura.FormaPago==1){
		if(Factura.IMovCaja.Sys_PK>0){
			if(!ActualizarMovCaja(Factura.IMovCaja.Sys_PK,Poliza.Sys_GUID)){
				DataAccess.RollbackTrans();
				return 0;
			}
		}
	}else{
		//SI LA FACTURA SE HIZO EN PARCIALIDADES ENTONCES CREAR POLIZA INTERESES FINANCIEROS
		if(!Relacionada){
			if(Factura.FormaPago==3){		
				if(PolizaIntFinancierosCXC(CuentasXCobrar.Blogic.ResultadoLGCXC,false)==0){
					Log("No se pudo crear la póliza por intereses de financiamiento");
					//DataAccess.RollbackTrans();
					//return 0;
				}
			}
		}
	}
	DataAccess.CommitTrans();
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if(Relacionada){ 
		Log("La póliza se guardó pero no se pudo aplicar porque no se obtuvieron los datos necesarios ya que la factura está relacionada con una remisión");
		return -1;
	}
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	return -1;
	
}

function ActualizarMovCaja(PKMovCaja,GUIDPoliza){
var MovCaja;
	MovCaja=Application.NewObject("EDOFx.MovCaja");
	if(MovCaja==null){
		Log("Error al crear objeto MovCaja");
		return false;
	}
	if(!MovCaja.LoadFromADOConnection(PKMovCaja,"",Application.adoCnn)){
		Log(MovCaja.lastErrDescrip);
		return false;
	}
	
	MovCaja.Poliza=GUIDPoliza;
	MovCaja.Contabilizado=true;
	if(!MovCaja.Update()){
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el movimiento de caja.",6);
		return false;
	}
	return true;
}

function DPolizaGlobal(Poliza,sCodCuenta){
var DPoliza;
var TmpCodigo;
var CC;
	// Obtner Codigo de Cuenta
	TmpCodigo=sCodCuenta
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return null;
	}
	if(!CC.LoadFromADOCByCodigo(TmpCodigo,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return null;
	}
	
	if (EsDepartamental(CC)) return null;		
	DPoliza=Poliza.Detalle.NewElement();
	if(DPoliza==null){
		Log("Error al crear detalle de póliza");
		return null;
	}

	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	return DPoliza;
}

function DPolizaFormaPago(Poliza,DocVenta,SoloCliente){
var DPoliza;
var TmpCodigo;
var CC;
		
	if(DocVenta.FormaPago==1 && SoloCliente==false){ //se realizó de contado.
		
		TmpCodigo=CodigoCuentaMovCaja(DocVenta.IMovCaja);
		if(TmpCodigo==""){
			Log("Error al crear póliza: no se encontró la cuenta asignada a la caja");
			return null;
		}
	}else{
		//=================================================================================================================================================
		if(DocVenta.FormaPago==0 && SoloCliente==false) //Aldo 17/06/2014 Modificación realizada para que la factura tome la forma de pago del ticket
		{
			var sqlQuery="select Sys_PK from Venta where AplicadoA=" + DocVenta.Sys_PK + ";";
			var Rst = Poliza.ADOCnn.Execute(sqlQuery);
			if (Rst==null){
				Log("Error al intentar obtener datos origen de la factura");
				return null;
			}		
			if(!(Rst.EOF && Rst.BOF)){
				var Ticket = eBasic.eCreateObject("EDOFx.Venta");
				if(Ticket==null)
				{
					Log("Error al obtener el crear el objeto tipo Venta");
					return null;
				}
				if(!Ticket.LoadFromADOConnection(Rst("Sys_PK"),"",Application.adoCnn))
				{
					Log(Ticket.lastErrDescrip);
					return null;
				}
				return DPolizaFormaPago(Poliza, Ticket, SoloCliente);
			}
		}//=================================================================================================================================================
		else
		{
			TmpCodigo=DocVenta.ICliente.CodCuenta;
			if(TmpCodigo==""){
				Log("Error al crear póliza: no se encontró la cuenta asignada al cliente "+DocVenta.ICliente.Nombre);
				return null;
			}
		}
	}
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return null;
	}
	if(!CC.LoadFromADOCByCodigo(TmpCodigo,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return null;
	}
	
	if (EsDepartamental(CC)) return null;		
	DPoliza=Poliza.Detalle.NewElement();
	if(DPoliza==null){
		Log("Error al crear detalle de póliza");
		return null;
	}
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	return DPoliza;
}

function CodigoCuentaMovCaja(MovCaja){
var Corte;
//MovCaja es de tipo M_MovCaja
	if(MovCaja==null)
		return "";

	if(MovCaja.Sys_PK<1){
		Log("Error al crear póliza: el documento no tiene asignado un movimiento de caja.");
		return "";
	}
	if(MovCaja.CurrentAction!=2){//SI NO ESTA EDITANDO
		if(!MovCaja.LoadFromADOConnection(MovCaja.Sys_PK,"",Application.adoCnn)){
			Log(MovCaja.lastErrDescrip);
			return "";
		}
	}
	Corte=Application.NewObject("EDOFx.Corte");
	if(Corte==null){
		Log("Error al crear objeto Corte");
		return "";
	}
	if(!Corte.LoadFromADOConnection(MovCaja.FK_ICorte,"",Application.adoCnn,2)){
		Log(Corte.lastErrDescrip);
		return "";
	}
	return Corte.ICaja.CodCuenta;
}

function MovimientoCuenta(PKMovChequera){
//IMovChequera es de tipo M_MovCuenta
var MovCuenta;

	MovCuenta=Application.NewObject("EDOFx.MovCuenta");
	if(MovCuenta==null){
		Log("Error al crear objeto MovCuenta");
		return null;
	}
	if(!MovCuenta.LoadFromADOConnection(PKMovChequera,"",Application.adoCnn,2)){
		Log(MovCuenta.lastErrDescrip);
		return null;
	}				
	return MovCuenta;	
}
// function DivisaMovCuenta(MovCuenta){
	// var Divisa;

	// Divisa=Application.NewObject("EDOFx.Divisa");
	// if(Divisa==null){
		// Log("Error al crear objeto Divisa");
		// return null;
	// }
	// if(!Divisa.LoadFromADOConnection(MovCuenta.ICuenta.IDivisa.Sys_PK,"",Application.adoCnn)){
		// Log(MovCuenta.lastErrDescrip);
		// return null;
	// }			
// }

//function DPolizaInventario(Poliza,PKCategoria){
function DPolizaInventario(Poliza,PKAlmacen){
//var Categoria;
var CC;
var DPoliza;
var Almacen;
var CuentaAlmacen;
	
	CuentaAlmacen="";
	if(PKAlmacen==null) PKAlmacen=0;
	
	if(PKAlmacen<=0){
		Log("No se encontró la cuenta contable de almacén");
		return null;
	}
	Almacen=Application.NewObject("EDOFx.M_Almacen");
	if(Almacen==null){
		Log("Error al crear objeto M_Almacen");
		return null;
	}
	if(!Almacen.LoadFromADOConnection(PKAlmacen,"",Application.adoCnn)){
		Log(Almacen.lastErrDescrip);
		return null;
	}		
	CuentaAlmacen=Almacen.CodCuenta;	
	if(CuentaAlmacen==""){
		Log("No se encontró la cuenta contable de almacén");
		return null;	
	}
	
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return null;
	}
	/*
	if(!CC.LoadFromADOCByCodigo(Categoria.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return null;
	}
	*/
	if(!CC.LoadFromADOCByCodigo(CuentaAlmacen,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return null;
	}
	if (EsDepartamental(CC)) return null;	
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	return DPoliza;
}

//FUNCION UTILIZADA POR DEVOLUCIÓN POR NOTA DE CRÉDITO Y CANCELACIÓN DE FACTURA
function PolizaDevolucionVenta(DocVenta,Forma){
	if(!Generar()) return -1;
	
	var Poliza;
	var DPoliza;	
	var CC;				
	var Impuesto;
	var Costo;
	var Divisa;
	var Relacionada;
	Relacionada=false;
	
	
	Divisa=DocVenta.IDivisa.Sys_PK;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS
	Poliza.Periodo=AsignarPeriodo();
	if(Forma==1){//POR NOTA DE CRÉDITO
		Poliza.Concepto=cVentaDevolucionNC+DocVenta.Referencia;		
	}else{//POR CANCELACIÓN DE FACTURA			
		Relacionada=LBVenta.IncluyeOtrosDocumentos(DocVenta.Sys_PK,3); //Buscar remisiones relacionadas	
		
		Poliza.Concepto=cVentaCancelacionFactura+DocVenta.Referencia;		
	}
	Poliza.Notas=cNotas;	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
		
	//***** PARTIDA 1: CLIENTE O CAJA**********
	DPoliza=null;
	if(Forma==1){//POR NOTA DE CRÉDITO		
		DPoliza=DPolizaFormaPago(Poliza,DocVenta,true);	
	}else{//POR CANCELACIÓN DE FACTURA
		DPoliza=DPolizaFormaPago(Poliza,DocVenta,false);
	}		
	if(DPoliza==null){
		if(!Relacionada)
			return 0;
	}else{
		DPoliza.Haber=DocVenta.Subtotal-DocVenta.Descuento1-DocVenta.Descuento2+DocVenta.Impuesto1+DocVenta.Impuesto2+DocVenta.Impuesto3+DocVenta.Impuesto4;
		DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,DPoliza.Haber,Divisa,1); //EN DIVISA PREDETERMINADA		
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;	
	}
	//PARTIDA 2: DEVOLUCIONES SOBRE VENTAS
	if(!CC.LoadFromADOConnection(FXConfig.CuentaDevolucionesSobreVentas(),"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	DPoliza.Debe=DocVenta.Subtotal-DocVenta.Descuento1-DocVenta.Descuento2;
	DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DPoliza.Debe,Divisa,1); //EN DIVISA PREDETERMINADA			
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	//PARTIDA 3: IMPUESTO POR PAGAR	
	Impuesto=0;
	Impuesto=DocVenta.Impuesto1+DocVenta.Impuesto2+DocVenta.Impuesto3+DocVenta.Impuesto4;
	if(Impuesto>0){
		Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Divisa,1); //EN DIVISA PREDETERMINADA			
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXPagar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Debe=Impuesto;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
	
	//PARTIDA 4:COSTO DE VENTAS	
	Costo=LBInventario.CostoVenta(DocVenta); //ESTA EN DIVISA PREDETERMINADA
	if(LBInventario.LastErrorCode>0){//si ocurrión un error en costoVenta()		
		Log(LBInventario.LastErrorDescrip);
		return 0;
	}
	if(Costo>0){
		if(!CC.LoadFromADOConnection(FXConfig.CuentaCostoVenta(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Haber=Costo;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
		//PARTIDA 5: INVENTARIO
		DPoliza=null;
		DPoliza=DPolizaInventario(Poliza,DocVenta.ICConsumo.FK_IAlmacen);
		if(DPoliza==null) return 0;
		DPoliza.Debe=Costo;	
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;	
	}
	
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
				
	//ACTUALIZAR MOVIMIENTO DE CAJA
	if(Forma==2){//POR CANCELACION DE FACTURA
		if(DocVenta.FormaPago==1){
			if(LBVenta.MovCajaCancelacion>0){
				if(!ActualizarMovCaja(LBVenta.MovCajaCancelacion,Poliza.Sys_GUID)){
					DataAccess.RollbackTrans();
					Log("No se pudo relacionar el movimiento de caja con la póliza.");
					return 0;
				}
			}				
		}
	}
	DataAccess.CommitTrans();
	if(!Aplicar()) return -1;
	if(Relacionada){ 
		Log("La póliza se guardó pero no se pudo aplicar porque no se obtuvieron los datos necesarios ya que la factura está relacionada con una remisión");
		return -1;
	}
	
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	return -1;
}
function PolizaVentaDevolucionXNotaCredito(NCredito){
	if(!Generar()) return -1;
	
	return PolizaDevolucionVenta(NCredito,1);
}
function PolizaVentaCancelacionFactura(Factura){
	if(!Generar()) return -1;
	
	return PolizaDevolucionVenta(Factura,2);
}

function PolizaAbonosCXC(DCXC,Tipo,Resultado){
if(!Generar()) return -1;
	//Tipo=1 -> Recibo
	//Tipo!=1->Cobro
	//Resultado=propiedades como pk del documento,PKdel recibo,PKDel Notacrèdito por descuento
	var Poliza;
	var DPoliza;	
	var CC;	
	var Cobro;
	var Total;
	var Descuento;
	var CodCuenta;
	var NotaCredito;	
	var DivisaCliente;
	
	DivisaCliente=DCXC.ICliente.FK_IDivisa;
	NotaCredito=null;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS
	Poliza.Periodo=AsignarPeriodo();
	if(Tipo==1)//RECIBO
		Poliza.Concepto=cRecibo+" al cliente "+DCXC.ICliente.Codigo+"-"+DCXC.ICliente.Nombre;
	else //COBRO 
		Poliza.Concepto=cCobro+LBCXC.RefereciaDocumento(CuentasXCobrar.Resultado(Resultado,1));
	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** PARTIDA 1: CLIENTE**********		
	if(DCXC.ICliente.CodCuenta==""){
		Log("El cliente "+DCXC.ICliente.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}	
	if(!CC.LoadFromADOCByCodigo(DCXC.ICliente.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	Cobro=gFunciones.CambioDivisa(DataAccess,DCXC.Haber,DivisaCliente,1); //EN DIVISA PREDETERMINADA
	Total=Cobro;
	Descuento=0;
	if(Tipo!=1){ //COBRO DE DOCUMENTO
		if(CuentasXCobrar.Resultado(Resultado,3)>0){ //TIENE DESCUENTO					
			NotaCredito=Application.NewObject("EDOFx.DCXC");
			if(NotaCredito==null){
				Log("Error al crear objeto DCXC");
				return 0;
			}
			if(!NotaCredito.LoadFromADOConnection(CuentasXCobrar.Resultado(Resultado,3),"",Application.adoCnn)){
				Log(NotaCredito.lastErrDescrip);
				return 0;
			}
			Descuento=gFunciones.CambioDivisa(DataAccess,NotaCredito.Haber,DivisaCliente,1);
			Total=Cobro+Descuento;
		}
	}		
	DPoliza.Haber=Total;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	if(Descuento>0){
		//PARTIDA 2:  NOTACREDITO POR DESCUENTOS	
		if(!CC.LoadFromADOConnection(FXConfig.CuentaBonificacionesSobreVentas(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Concepto="Descuento";
		DPoliza.Debe=Descuento;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
		
	//***** PARTIDA 5: CAJA**********	
	
	CodCuenta=CodigoCuentaMovCaja(DCXC.IMovCaja);
	if(CodCuenta=="")
		return 0;
		
	if(!CC.LoadFromADOCByCodigo(CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	DPoliza.Debe=Cobro;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
			
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);				
		return 0;
	}
		
	//ACTUALIZAR DOCUMENTO
	DCXC.Poliza=Poliza.Sys_GUID;
	DCXC.Contabilizado=true;
	if(!DCXC.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
		return 0;
	}
	//ACTUALIZAR MOVIMIENTO DE CAJA
	if(DCXC.IMovCaja.Sys_PK>0){
		if (!ActualizarMovCaja(DCXC.IMovCaja.Sys_PK,Poliza.Sys_GUID)){
			DataAccess.RollbackTrans();
			return 0;
		}
	}
		
	if(Tipo!=1){ //COBRO DE DOCUMENTO
		//ACTUALIZAR NOTA DE CRÉDITO POR DESCUENTO
		if(NotaCredito!=null){
			NotaCredito.Poliza=Poliza.Sys_GUID;
			NotaCredito.Contabilizado=true;
			if(!NotaCredito.Update()){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con la nota de crédito por descuento.",6);
				return 0;
			}
		}		
		//ACTUALIZAR DOCUMENTO COBRADO
		if(ActualizarDocumentoDCXC(CuentasXCobrar.Resultado(Resultado,1),Poliza.Sys_GUID)==0){
			DataAccess.RollbackTrans();
			return 0;
		}
	}
	DataAccess.CommitTrans();
	
	if(!Aplicar()) return -1;	
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
		
	return -1;	
}

function PolizaReciboCXC(PKRecibo){
	if(!Generar()) return -1;
	
	var DCXC;
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}
	if(!DCXC.LoadFromADOConnection(PKRecibo,"",Application.adoCnn,2)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}
	
	return PolizaAbonosCXC(DCXC,1);
}
function PolizaCobroCXC(ResultadoCXC){
if(!Generar()) return -1;

	var DCXC;
	var Tipo;
	Tipo=CuentasXCobrar.Resultado(ResultadoCXC,0);
	if(Tipo==-99 || Tipo!=0){ //Tipo =ninguno Tipo!=cobro
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}
		
	//CARGAR EL RECIBO CREADO
	if(!DCXC.LoadFromADOConnection(CuentasXCobrar.Resultado(ResultadoCXC,2),"",Application.adoCnn,2)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}
	
	return PolizaAbonosCXC(DCXC,2,ResultadoCXC);
}

function ActualizarDocumentoDCXC(PK,GUIDPoliza){
//actualiza un documento colocando la guid de la póliza y  contibilizado en true.
	var DCXC;
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}
	if(!DCXC.LoadFromADOConnection(PK,"",Application.adoCnn,1)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}
	DCXC.Poliza=GUIDPoliza;
	DCXC.Contabilizado=true;
	if(!DCXC.Update()){
		Log(DCXC.lastErrDescrip);
		return 0;
	}
	return -1;
}

function ActualizarDocumentoDCXP(PK,GUIDPoliza){
//actualiza un documento colocando la guid de la póliza y  contibilizado en true.
	var DCXP;
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}
	if(!DCXP.LoadFromADOConnection(PK,"",Application.adoCnn,1)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}
	DCXP.Poliza=GUIDPoliza;
	DCXP.Contabilizado=true;
	if(!DCXP.Update()){
		Log(DCXP.lastErrDescrip);
		return 0;
	}
	return -1;
}

function PolizaBonificacionNCreditoCXC(DCXC,Tipo,Resultado){
if(!Generar()) return -1;
	//Tipo=1 -> Bonificacion
	//Tipo!=1->Por NotaCredito
	//Resultado=propiedades como pldel documento,PKdel recibo,PKDel Notacrèdito
	var Poliza;
	var DPoliza;
	var CC;	
	var Bonificacion;
	var Total;
	var Impuestos;
	var DivisaCliente;
	
	DivisaCliente=DCXC.ICliente.FK_IDivisa;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS
	Poliza.Periodo=AsignarPeriodo();
	if(Tipo==1)//BONIFICACION
		Poliza.Concepto=cBonificacion+LBCXC.RefereciaDocumento(CuentasXCobrar.Resultado(Resultado,1));
	else //NOTA DE CREDITO
		Poliza.Concepto=cNotaCreditoCXC+DCXC.ICliente.Codigo+"-"+DCXC.ICliente.Nombre;
	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** PARTIDA 1: CLIENTE**********		
	if(DCXC.ICliente.CodCuenta==""){
		Log("El cliente "+DCXC.ICliente.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}	
	if(!CC.LoadFromADOCByCodigo(DCXC.ICliente.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	Total=gFunciones.CambioDivisa(DataAccess,DCXC.Haber,DivisaCliente,1); //EN DIVISA PREDETERMINADA
	DPoliza.Haber=Total;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	Bonificacion=Total;	
	Impuestos=0;
	if(Tipo!=1){ //NOTA DE CREDITO
		if(CuentasXCobrar.Resultado(Resultado,4)>0){ //TIENE IMPUESTOS					
			Impuestos=gFunciones.CambioDivisa(DataAccess,CuentasXCobrar.Resultado(Resultado,4),DivisaCliente,1); //EN DIVISA PREDETERMINADA
			Bonificacion=Total-Impuestos;
		}
	}
	if(Impuestos>0){
		//PARTIDA 2:  IMPUESTOS POR PAGAR
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXPagar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Debe=Impuestos;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
		
	//***** PARTIDA 3: BONIFICACIONES SOBRE VENTAS **********		
	if(!CC.LoadFromADOConnection(FXConfig.CuentaBonificacionesSobreVentas(),"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	DPoliza.Debe=Bonificacion;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
			
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();	
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}	
	//ACTUALIZAR DOCUMENTO
	DCXC.Poliza=Poliza.Sys_GUID;
	DCXC.Contabilizado=true;
	if(!DCXC.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al crear póliza no fue posible relacionarla con el documento.",6);
		return 0;
	}
	DataAccess.CommitTrans();	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	return -1;
}
function PolizaBonificacionCXC(ResultadoCXC){
	if(!Generar()) return -1;

	var DCXC;
	var Tipo;
	Tipo=CuentasXCobrar.Resultado(ResultadoCXC,0);
	if(Tipo==-99 || Tipo!=1){ //Tipo =ninguno Tipo!=bonificación
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}	
	//CARGAR NOTA DE CREDITO POR BINIFICACIÓN
	if(!DCXC.LoadFromADOConnection(CuentasXCobrar.Resultado(ResultadoCXC,3),"",Application.adoCnn,2)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}	
	
	return PolizaBonificacionNCreditoCXC(DCXC,1,ResultadoCXC);
}
function PolizaNotaCreditoCXC(ResultadoCXC){
	if(!Generar()) return -1;
	
	var DCXC;
	var Tipo;
	Tipo=CuentasXCobrar.Resultado(ResultadoCXC,0);
	if(Tipo==-99 || Tipo!=2){ //Tipo =ninguno Tipo!=nota credito
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}		
	if(!DCXC.LoadFromADOConnection(CuentasXCobrar.Resultado(ResultadoCXC,3),"",Application.adoCnn,2)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}	
	
	return PolizaBonificacionNCreditoCXC(DCXC,2,ResultadoCXC);
}

function PolizaInteresesCXC(Resultado,WithTrans){
	if(!Generar()) return -1;
	//UTILIZADO PARA  FINANCIEROS: FINACIAR CAPITAL O FINANCIAR DOCUMENTO
	//E INTERESES MORATORIOS
	var Poliza;
	var DPoliza;
	var PKCliente;
	var Cliente;
	var CC;
	var Importe;
	var Impuesto;
	var DCXC;
	var PKCuenta;
	var I;
	var Nota;
	DCXC=null;
	PKCliente=0;
	
	if(WithTrans==null)
		WithTrans=true;
	
	if(LBCXC.Resultado(Resultado,0)==2) //SI ES APLICAR INTERESER MORATORIOS
		if(LBCXC.Resultado(Resultado,6,0)==0) //NO HAY INTERESES
			return 0;
	
	PKCliente=LBCXC.Resultado(Resultado,2);
		
	if(PKCliente<1){
		Log("Error falta clave del cliente");
		return 0;
	}	
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}		
	Cliente=Application.NewObject("EDOFx.M_Cliente");
	if(Cliente==null){
		Log("Error al crear objeto M_Cliente");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	if(!Cliente.LoadFromADOConnection(PKCliente,"",Application.adoCnn)){
		Log(Cliente.lastErrDescrip);
		return 0;
	}
	
	Importe=LBCXC.Resultado(Resultado,3); //INTERESES APLICADOS +IMPUESTOS
	if(Importe==0){				
		return -999; //no hay importe no se crea la póliza... No se incluyò in porcentaje de int financieros
	}	
	Importe=gFunciones.CambioDivisa(DataAccess,Importe,Cliente.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	Impuesto=LBCXC.Resultado(Resultado,4);//IMPUESTOS POR INTERESES
	Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Cliente.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	
	
	if(LBCXC.Resultado(Resultado,0)==1){//FINANCIAR DOCUMENTO
		DCXC=Application.NewObject("EDOFx.DCXC");
		if(DCXC==null){
			Log("Error al crear objeto DCXC");
			return 0;
		}	
		if(!DCXC.LoadFromADOConnection(LBCXC.Resultado(Resultado,1),"",Application.adoCnn,2)){
			Log(DCXC.lastErrDescrip);
			return 0;
		}
	}else
		DCXC=null;
	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS	
	Poliza.Periodo=AsignarPeriodo();	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();	
	if(LBCXC.Resultado(Resultado,0)==2){//APLICAR INTERESES MORATORIOS
		Poliza.Concepto=cIntMoratoriosCXC+Cliente.Codigo+"-"+Cliente.Nombre;
		Poliza.Notas=cNotas+" al aplicar intereses moratorios.";
	}else{//FINANCIAR CAPITAL O DOCUMENTO
		Poliza.Concepto=cIntFinancierosCXC+Cliente.Codigo+"-"+Cliente.Nombre;		
		if(DCXC!=null)
			Poliza.Notas=cNotas+" por financiamiento del documento con referencia:"+DCXC.Referencia;
		else
			Poliza.Notas=cNotas+" por financiamiento de capital.";
	}
	//***** PARTIDA 1: CLIENTE**********		
	if(Cliente.CodCuenta==""){
		Log("El cliente "+Cliente.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}
	if(!CC.LoadFromADOCByCodigo(Cliente.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Debe=Importe;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	PKCuenta=0;
	if(LBCXC.Resultado(Resultado,0)==2) //APLICAR INTERESES MORATORIOS
		PKCuenta=FXConfig.CuentaInteresesMoratoriosClientes();
	else
		PKCuenta=FXConfig.CuentaInteresesFinancierosClientes();
		
	//***** PARTIDA 2: INTERESES**********		
	if(!CC.LoadFromADOConnection(PKCuenta,"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Haber=Importe-Impuesto;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	//***** PARTIDA 3: IMPUESTOS  POR PAGAR**********	
	if(Impuesto>0){
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXPagar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
		DPoliza.Haber=Impuesto;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
	
	//GUARDAR PÓLIZA
	if(WithTrans)
		DataAccess.BeginTrans();
	if(!Poliza.Update()){
		if(WithTrans)
			DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
		
	//ACTUALIZAR DOCUMENTO FINANCIADO
	if(DCXC!=null){
		DCXC.Poliza=Poliza.Sys_GUID;
		DCXC.Contabilizado=true;
		if(!DCXC.Update()){
			if(WithTrans)
				DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
			return 0;
		}
	}	
	
	if(LBCXC.Resultado(Resultado,0)==2){ //APLICAR INTERESES MORATORIOS
		//ACTUALIZAR NOTAS DE CARGO GENERADAS
		I=0;		
		DCXC=Application.NewObject("EDOFx.DCXC");
		if(DCXC==null){
			if(WithTrans)
				DataAccess.RollbackTrans();
			Log("Error al crear objeto DCXC");
			return 0;
		}
		do{
			Nota=LBCXC.Resultado(Resultado,6,I);
			if(Nota>0){				
				if(!DCXC.LoadFromADOConnection(Nota,"",Application.adoCnn)){
					if(WithTrans)
						DataAccess.RollbackTrans();
					Log(DCXC.lastErrDescrip);
					return 0;
				}
				DCXC.Poliza=Poliza.Sys_GUID;
				DCXC.Contabilizado=true;
				if(!DCXC.Update()){
					if(WithTrans)
						DataAccess.RollbackTrans();
					eBasic.eMsgbox("Error al crear póliza, no se pudo relacionar con la nota de cargo "+DCXC.Referencia,6);
					return 0;
				}	
			}
			I=I+1;
		}while(Nota>0);
	}
	
	if(WithTrans)
		DataAccess.CommitTrans();
			
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK,WithTrans)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}	
	
	return -1;	
}

function PolizaIntMoratoriosCXC(Resultado){
	if(!Generar()) return -1;
	
	var Tipo;
	Tipo=LBCXC.Resultado(Resultado,0);
	if(Tipo==-99 || Tipo!=2){ //Tipo =ninguno ó Tipo<>aplicarIntMoratorios
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	return PolizaInteresesCXC(Resultado,true);
}
function PolizaIntFinancierosCXC(Resultado,WithTrans){
	if(!Generar()) return -1;
	var Tipo;
	
	Tipo=LBCXC.Resultado(Resultado,0);
	if(Tipo==-99 || (Tipo!=0 && Tipo!=1)){ //Tipo =ninguno ò no es financiar doc-financiar capital
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}		
	if(WithTrans==null)
		WithTrans=true;
		
	return PolizaInteresesCXC(Resultado,WithTrans);
}

//*********************************************************************************************************
//***********  COMPRAS ***********************************************************************************

function PolizaCompraFacturacion(Factura){
	if(!Generar()) return -1;

	var Poliza;
	var DPoliza;	
	var CC;				
	var Impuesto;
	var Costo;
	var Divisa;
	var Relacionada; //Indica si la factura está relacionado con otros documentos
	Relacionada=false;
	Relacionada=LBCompra.IncluyeOtrosDocumentos(Factura.Sys_PK,3); //Buscar remisiones relacionadas	
			
	Divisa=Factura.IDivisa.Sys_PK;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();
	Poliza.Concepto=cCompraFactura+Factura.Referencia;
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	//***** PARTIDA 1: PROVEEDOR O CHEQUERA**********	
	if(!DPolizaFormaPagoCompra(Poliza,Factura,false,true))	
		if(!Relacionada)
			return 0;
		
	//PARTIDA 2: INVENTARIOS	
	DPoliza=null;
	DPoliza=DPolizaInventario(Poliza,Factura.IAlmacen.Sys_PK);//LBCompra.Categoria_SysPK);
	if(DPoliza==null) return 0;	
	DPoliza.Debe=Factura.Subtotal-Factura.Descuento1-Factura.Descuento2;
	DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DPoliza.Debe,Divisa,1); //EN DIVISA PREDETERMINADA		
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	//PARTIDA 3: IMPUESTO POR ACREDITAR
	Impuesto=0;
	Impuesto=Factura.Impuesto1+Factura.Impuesto2+Factura.Impuesto3+Factura.Impuesto4;
	if(Impuesto>0){
		Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Divisa,1); //EN DIVISA PREDETERMINADA		
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXAcreditar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Debe=Impuesto;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
		
	//GUARDAR PÓLIZA	
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
	
	//ACTUALIZAR COMPRA
	Factura.Poliza=Poliza.Sys_GUID;
	Factura.Contabilizado=true;
	if(!Factura.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con la factura.",6);
		return 0;
	}
	
	//ACTUALIZAR MOVIMIENTO DE CAJA Y CUENTA
	if(Factura.FormaPago==1){
		if(Factura.IMovCaja.Sys_PK>0){
			if(!ActualizarMovCaja(Factura.IMovCaja.Sys_PK,Poliza.Sys_GUID)){
				DataAccess.RollbackTrans();
				return 0;
			}
			
		}
		if(Factura.IMovChequera.Sys_PK>0){
			if(!ActualizarMovCuenta(Factura.IMovChequera.Sys_PK,Poliza.Sys_GUID)){
				DataAccess.RollbackTrans();
				return 0;
			}
		}
	}else{
		//SI LA FACTURA SE HIZO EN PARCIALIDADES ENTONCES CREAR POLIZA INTERESES FINANCIEROS
		if(!Relacionada){ 
			if(Factura.FormaPago==3)		
				if(PolizaIntFinancierosCXP(CuentasXPagar.Blogic.ResultadoLGCXP,false)==0){
					DataAccess.RollbackTrans();
					return 0;
				}
		}
	}
	
	DataAccess.CommitTrans();
	
	if(!Aplicar()) return -1;
	
	if(Relacionada){ 
		Log("La póliza se guardó pero no se pudo aplicar porque no se obtuvieron los datos necesarios ya que la factura está relacionada con una remisión");
		return -1;
	}
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}	
	
	return -1;
}

function ActualizarMovCuenta(PKMovCuenta,GUIDPoliza){
var MovCuenta;
	MovCuenta=MovimientoCuenta(PKMovCuenta);
	if(MovCuenta==null) 
		 return false;
	
	MovCuenta.Poliza=GUIDPoliza;
	MovCuenta.Contabilizado=true;
	if(!MovCuenta.Update()){
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el movimiento de cuenta.",6);
		return false;
	}
	return true;
}

function DPolizaFormaPagoCompra(Poliza,DocCompra,SoloProveedor,Haber){
var DPoliza;
var CC;
var MontoTotal;
var MovCuenta;
var MontoCheque;
var MontoCaja;
var CodCuenta;

	MontoTotal=DocCompra.Subtotal-DocCompra.Descuento1-DocCompra.Descuento2+DocCompra.Impuesto1+DocCompra.Impuesto2+DocCompra.Impuesto3+DocCompra.Impuesto4;
	MontoTotal=gFunciones.CambioDivisa(DataAccess,MontoTotal,DocCompra.IDivisa.Sys_PK,1); //EN DIVISA PREDETERMINADA	
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return false;
	}
	
	if(DocCompra.FormaPago==1 && SoloProveedor==false){ //se realizó de contado.
		MontoCheque=0;
		if(DocCompra.IMovChequera.Sys_PK>0){ //PAGO CON CHEQUERA				
			MovCuenta=MovimientoCuenta(DocCompra.IMovChequera.Sys_PK);		
			if(MovCuenta==null)
				return false;			
			
			MontoCheque=MovCuenta.Egreso;
			MontoCheque=gFunciones.CambioDivisa(DataAccess,MontoCheque,MovCuenta.ICuenta.IDivisa.Sys_PK,1); //EN DIVISA PREDETERMINADA	
			
			if(MovCuenta.ICuenta.CodCuenta==""){
				Log("No se pudo crear la póliza porque la chequera " + MovCuenta.ICuenta.Nombre+" no tiene asignada una cuenta contable.");
				return false;
			}
			if(!CC.LoadFromADOCByCodigo(MovCuenta.ICuenta.CodCuenta,Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return false;
			}				
			if (EsDepartamental(CC)) return false;		
			DPoliza=Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
			DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
			if(Haber){
				DPoliza.Haber=MontoCheque;
				Poliza.Haber=Poliza.Haber+DPoliza.Haber;				
			}else{
				DPoliza.Debe=MontoCheque;
				Poliza.Debe=Poliza.Debe+DPoliza.Debe;				
			}
			
		}
		
		MontoCaja=MontoTotal-MontoCheque;
		
		if(DocCompra.IMovCaja.Sys_PK>0 && MontoCaja>0){			
			CodCuenta=CodigoCuentaMovCaja(DocCompra.IMovCaja);
			if(CodCuenta=="")
				return false;
			if(!CC.LoadFromADOCByCodigo(CodCuenta,Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return false;
			}				
			if (EsDepartamental(CC)) return false;		
			DPoliza=Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
			DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
			if(Haber){
				DPoliza.Haber=MontoCaja;
				Poliza.Haber=Poliza.Haber+DPoliza.Haber;		
			}else{
				DPoliza.Debe=MontoCaja;
				Poliza.Debe=Poliza.Debe+DPoliza.Debe;		
			}
		}		
	}else{		
		if(DocCompra.IProveedor.CodCuenta==""){
			Log("No se encontró la cuenta asignada al proveedor "+DocCompra.IProveedor.Nombre);
			return false;
		}
		if(!CC.LoadFromADOCByCodigo(DocCompra.IProveedor.CodCuenta,Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return false;
		}		
		if (EsDepartamental(CC)) return false;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		if(Haber){
			DPoliza.Haber=MontoTotal;
			Poliza.Haber=Poliza.Haber+DPoliza.Haber;
		}else{
			DPoliza.Debe=MontoTotal;
			Poliza.Debe=Poliza.Debe+DPoliza.Debe;
		}
	}
	
	return true;
}



function PolizaDevolucionCompra(DocCompra,Forma){
	if(!Generar()) return -1;
	
	var Poliza;
	var DPoliza;	
	var CC;				
	var Impuesto;
	var Divisa;
	var Relacionada;
	Relacionada=false;
	
	Divisa=DocCompra.IDivisa.Sys_PK;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();
	if(Forma==1){//POR NOTA DE CRÉDITO
		Poliza.Concepto=cCompraDevolucionNC+DocCompra.Referencia;		
	}else{//POR CANCELACIÓN DE FACTURA		
		Relacionada=LBCompra.IncluyeOtrosDocumentos(DocCompra.Sys_PK,3); //Buscar remisiones relacionadas	
		
		Poliza.Concepto=cCompraCancelacionFactura+DocCompra.Referencia;		
	}
	Poliza.Notas=cNotas;	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
		
	//***** PARTIDA 1: PROVEEDOR O CHEQUERA**********
	DPoliza=null;
	if(Forma==1){//POR NOTA DE CRÉDITO		
		if(!DPolizaFormaPagoCompra(Poliza,DocCompra,true,false))
			return 0;
	}else{//POR CANCELACIÓN DE FACTURA
		if(!DPolizaFormaPagoCompra(Poliza,DocCompra,false,false))
			if(!Relacionada)
				return 0;
	}
	
	//PARTIDA 2: INVENTARIOS
	DPoliza=null;
	DPoliza=DPolizaInventario(Poliza,DocCompra.IAlmacen.Sys_PK);
	if(DPoliza==null) return 0;
	DPoliza.Haber=DocCompra.Subtotal-DocCompra.Descuento1-DocCompra.Descuento2;
	DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,DPoliza.Haber,Divisa,1); //EN DIVISA PREDETERMINADA			
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	//PARTIDA 3: IMPUESTO POR ACREDITAR
	Impuesto=0;
	Impuesto=DocCompra.Impuesto1+DocCompra.Impuesto2+DocCompra.Impuesto3+DocCompra.Impuesto4;
	if(Impuesto>0){
		Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Divisa,1); //EN DIVISA PREDETERMINADA			
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXAcreditar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Haber=Impuesto;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
			
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
				
	//ACTUALIZAR MOVIMIENTO DE CAJA Y CUENTA
	if(Forma==2){//POR CANCELACION DE FACTURA
		if(DocCompra.FormaPago==1){
			if(LBCompra.MovCajaCancelacion>0){
				if(!ActualizarMovCaja(LBCompra.MovCajaCancelacion,Poliza.Sys_GUID)){
					DataAccess.RollbackTrans();
					Log("No se pudo relacionar el movimiento de caja con la póliza.");
					return 0;
				}
			}
		}
	}
	DataAccess.CommitTrans();
	if(!Aplicar()) return -1;
	
	if(Relacionada){ 
		Log("La póliza se guardó pero no se pudo aplicar porque no se obtuvieron los datos necesarios ya que la factura está relacionada con una remisión");
		return -1;
	}
	
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}	
	return -1;
}
function PolizaCompraDevolucionXNotaCredito(NCredito){
	if(!Generar()) return -1;
	
	return PolizaDevolucionCompra(NCredito,1)
}
function PolizaCompraCancelacionFactura(Factura){
	if(!Generar()) return -1;
	
	return PolizaDevolucionCompra(Factura,2);
}
function PolizaAbonosCXP(DCXP,Tipo,Resultado){
if(!Generar()) return -1;
	//Tipo=1 -> Recibo
	//Tipo!=1->Cobro
	//Resultado=propiedades como pk del documento,PKdel recibo,PKDel Notacrèdito por descuento
	var Poliza;
	var DPoliza;	
	var CC;	
	var Pago;
	var Total;
	var MovCuenta;
	var Descuento;
	var CodCuenta;
	var PagoCaja;
	var NotaCredito
	var DivisaProv;
	DivisaProv=DCXP.IProveedor.FK_IDivisa;
	
	NotaCredito=null;
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();
	if(Tipo==1)//RECIBO
		Poliza.Concepto=cRecibo+" al proveedor "+DCXP.IProveedor.Codigo+"-"+DCXP.IProveedor.Nombre;
	else //COBRO 
		Poliza.Concepto=cPago+LBCxP.RefereciaDocumento(CuentasXPagar.Resultado(Resultado,1));
	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** PARTIDA 1: PROVEEDOR**********
	if(DCXP.IProveedor.CodCuenta==""){
		Log("El Proveedor "+DCXP.IProveedor.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}
	if(!CC.LoadFromADOCByCodigo(DCXP.IProveedor.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	Pago=gFunciones.CambioDivisa(DataAccess,DCXP.Debe,DivisaProv,1); //EN DIVISA PREDETERMINADA
	Total=Pago;
	Descuento=0;
	if(Tipo!=1){ //PAGO DE DOCUMENTO
		if(CuentasXPagar.Resultado(Resultado,3)>0){ //TIENE DESCUENTO		
			NotaCredito=Application.NewObject("EDOFx.DCXP");
			if(NotaCredito==null){
				Log("Error al crear objeto DCXP");
				return 0;
			}
			if(!NotaCredito.LoadFromADOConnection(CuentasXPagar.Resultado(Resultado,3),"",Application.adoCnn)){
				Log(NotaCredito.lastErrDescrip);
				return 0;
			}
			Descuento=gFunciones.CambioDivisa(DataAccess,NotaCredito.Debe,DivisaProv,1); //EN DIVISA PREDETERMINADA
			Total=Pago+Descuento;
		}
	}		
	DPoliza.Debe=Total;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	if(Descuento>0){
		//PARTIDA 2:  NOTACREDITO POR DESCUENTOS	
		if(!CC.LoadFromADOConnection(FXConfig.CuentaBonificacionesSobreCompras(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Concepto="Descuento";
		DPoliza.Haber=Descuento;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
		
	//***** PARTIDA 5: CAJA O CHEQUERA**********		
	PagoCaja=Pago;
	//MOVIMIENTO DE CUENTA	
	if(DCXP.IMovChequera.Sys_PK>0){			
		MovCuenta=MovimientoCuenta(DCXP.IMovChequera.Sys_PK);
		if(MovCuenta==null)
			return 0;
				
		if(MovCuenta.ICuenta.CodCuenta==""){
			Log("Error no se creó la póliza porque la chequera "+MovCuenta.ICuenta.Nombre+" no tiene asignada una cuenta contable.");
			return 0;
		}
		if(!CC.LoadFromADOCByCodigo(MovCuenta.ICuenta.CodCuenta,Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);			
		DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,MovCuenta.Egreso,MovCuenta.ICuenta.IDivisa.Sys_PK,1); //EN DIVISA PREDETERMINADA
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
		
		PagoCaja=Pago-DPoliza.Haber;//-MovCuenta.Egreso;
	}
	//MOVIMIENTO DE CAJA
	if(DCXP.IMovCaja.Sys_PK>0){
		CodCuenta=CodigoCuentaMovCaja(DCXP.IMovCaja);
		if(CodCuenta=="")
			return 0;
		if(!CC.LoadFromADOCByCodigo(CodCuenta,Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Haber=PagoCaja;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
				
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);				
		return 0;
	}
		
	//ACTUALIZAR DOCUMENTO
	DCXP.Poliza=Poliza.Sys_GUID;
	DCXP.Contabilizado=true;
	if(!DCXP.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
		return 0;
	}
	//ACTUALIZAR MOV DE CAJA Y CUENTA
	if(DCXP.IMovCaja.Sys_PK>0)
		if(!ActualizarMovCaja(DCXP.IMovCaja.Sys_PK,Poliza.Sys_GUID)){
			DataAccess.RollbackTrans();
			return 0;
		}
		
	if(DCXP.IMovChequera.Sys_PK>0)
		if(!ActualizarMovCuenta(DCXP.IMovChequera.Sys_PK,Poliza.Sys_GUID)){
			DataAccess.RollbackTrans();
			return 0;
		}

	if(Tipo!=1){ //PAGO DE DOCUMENTO		
		//ACTUALIZAR NOTA DE CRÉDITO POR DESCUENTO
		if(NotaCredito!=null){
			NotaCredito.Poliza=Poliza.Sys_GUID;
			NotaCredito.Contabilizado=true;
			if(!NotaCredito.Update()){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con la nota de crédito por descuento.",6);
				return 0;
			}
		}		
		//ACTUALIZAR DOCUMENTO PAGADO
		if(ActualizarDocumentoDCXP(CuentasXPagar.Resultado(Resultado,1),Poliza.Sys_GUID)==0){
			DataAccess.RollbackTrans();
			return 0;
		}
			
	}
	
	DataAccess.CommitTrans();
	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA	
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	
	return -1;		
}
function PolizaReciboCXP(PKRecibo){
	if(!Generar()) return -1;
	
	var DCXP;
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}
	if(!DCXP.LoadFromADOConnection(PKRecibo,"",Application.adoCnn,2)){
		Log(DCXP.lastErrDescrip);
		return 0;
	}
	
	return PolizaAbonosCXP(DCXP,1);
}
function PolizaPagoCXP(ResultadoCXP){
	if(!Generar()) return -1;
	
	var DCXP;
	var Tipo;
	Tipo=CuentasXPagar.Resultado(ResultadoCXP,0);
	if(Tipo==-99 || Tipo!=0){ //Tipo =ninguno Tipo!=cobro
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}		
	if(!DCXP.LoadFromADOConnection(CuentasXPagar.Resultado(ResultadoCXP,2),"",Application.adoCnn,2)){
		Log("Error al cargar documento. " +DCXP.lastErrDescrip);		
		return 0;
	}
	
	return PolizaAbonosCXP(DCXP,2,ResultadoCXP);
}
function PolizaBonificacionNCreditoCXP(DCXP,Tipo,Resultado){
	if(!Generar()) return -1;
	//Tipo=1 -> Bonificacion
	//Tipo!=1->Por NotaCredito
	//Resultado=propiedades como pk del documento,PKdel recibo,PKDel Notacrédito
	var Poliza;
	var DPoliza;
	var CC;
	var Bonificacion;
	var Total;
	var Impuestos;
	var DivisaProv;
	DivisaProv=DCXP.IProveedor.FK_IDivisa;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();
	if(Tipo==1)//BONIFICACION
		Poliza.Concepto=cBonificacion+LBCxP.RefereciaDocumento(CuentasXPagar.Resultado(Resultado,1));
	else //NOTA DE CREDITO
		Poliza.Concepto=cNotaCreditoCXP+DCXP.IProveedor.Codigo+"-"+DCXP.IProveedor.Nombre;
	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** PARTIDA 1: PROVEEDOR**********		
	if(DCXP.IProveedor.CodCuenta==""){
		Log("El cliente "+DCXP.IProveedor.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}	
	if(!CC.LoadFromADOCByCodigo(DCXP.IProveedor.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	Total=gFunciones.CambioDivisa(DataAccess,DCXP.Debe,DivisaProv,1); //EN DIVISA PREDETERMINADA
	DPoliza.Debe=Total;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	Bonificacion=Total;	
	Impuestos=0;
	if(Tipo!=1){ //NOTA DE CREDITO
		if(CuentasXPagar.Resultado(Resultado,4)>0){ //TIENE IMPUESTOS					
			Impuestos=gFunciones.CambioDivisa(DataAccess,CuentasXPagar.Resultado(Resultado,4),DivisaProv,1); //EN DIVISA PREDETERMINADA
			Bonificacion=Total-Impuestos;
		}
	}
	if(Impuestos>0){
		//PARTIDA 2:  IMPUESTOS POR ACREDITAR
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXAcreditar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Haber=Impuestos;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
		
	//***** PARTIDA 3: BONIFICACIONES SOBRE COMPRAS **********		
	if(!CC.LoadFromADOConnection(FXConfig.CuentaBonificacionesSobreCompras(),"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	DPoliza.Haber=Bonificacion;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
			
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
	
	//ACTUALIZAR DOCUMENTO
	DCXP.Poliza=Poliza.Sys_GUID;
	DCXP.Contabilizado=true;
	if(!DCXP.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al crear póliza no fue posible relacionarla con el documento.",6);		
		return 0;
	}
	DataAccess.CommitTrans();
	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	
	return -1;
}
function PolizaBonificacionCXP(ResultadoCXP){
if(!Generar()) return -1;

	var DCXP;
	var Tipo;
	Tipo=CuentasXPagar.Resultado(ResultadoCXP,0);
	if(Tipo==-99 || Tipo!=1){ //Tipo =ninguno Tipo!=bonificación
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}	
	if(!DCXP.LoadFromADOConnection(CuentasXPagar.Resultado(ResultadoCXP,3),"",Application.adoCnn,2)){
		Log(DCXP.lastErrDescrip);
		return 0;
	}	
	
	return PolizaBonificacionNCreditoCXP(DCXP,1,ResultadoCXP);
}
function PolizaNotaCreditoCXP(ResultadoCXP){
	if(!Generar()) return -1;
	
	var DCXP;
	var Tipo;
	Tipo=CuentasXPagar.Resultado(ResultadoCXP,0);
	if(Tipo==-99 || Tipo!=2){ //Tipo =ninguno Tipo!=nota credito
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}		
	if(!DCXP.LoadFromADOConnection(CuentasXPagar.Resultado(ResultadoCXP,3),"",Application.adoCnn,2)){
		Log(DCXP.lastErrDescrip);
		return 0;
	}
	
	return PolizaBonificacionNCreditoCXP(DCXP,2,ResultadoCXP);
}

function PolizaInteresesCXP(Resultado,WithTrans){
	if(!Generar()) return -1;
	//UTILIZADO PARA  FINANCIEROS: FINACIAR CAPITAL O FINANCIAR DOCUMENTO
	//E INTERESES MORATORIOS
	var Poliza;
	var DPoliza;
	var PKProveedor;
	var Proveedor;
	var CC;
	var Importe;
	var Impuesto;
	var DCXP;
	var PKCuenta;
	var I;
	var Nota;
	
	if(WithTrans==null)
		WithTrans=true;
	DCXP=null;
	PKProveedor=0;
	
	if(LBCxP.Resultado(Resultado,0)==2) //SI ES APLICAR INTERESER MORATORIOS
		if(LBCxP.Resultado(Resultado,6,0)==0) //NO HAY INTERESES
			return 0;

	PKProveedor=LBCxP.Resultado(Resultado,2);	
	if(PKProveedor<1){
		Log("Error falta clave del proveedor");
		return 0;
	}	
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}		
	Proveedor=Application.NewObject("EDOFx.M_Proveedor");
	if(Proveedor==null){
		Log("Error al crear objeto M_Proveedor");
		return 0;
	}
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	if(!Proveedor.LoadFromADOConnection(PKProveedor,"",Application.adoCnn)){
		Log(Proveedor.lastErrDescrip);
		return 0;
	}
	
	Importe=LBCxP.Resultado(Resultado,3); //INTERESES APLICADOS + IMPUESTOS
	if(Importe==0)
		return 0; //No hay importa para crear la pòliza ..- no se incluyò in porcentaje de int financieros
	
	Importe=gFunciones.CambioDivisa(DataAccess,Importe,Proveedor.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	
	Impuesto=LBCxP.Resultado(Resultado,4); //IMPUESTOS POR INTERESES
	Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Proveedor.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	
	if(LBCxP.Resultado(Resultado,0)==1){//FINANCIAR DOCUMENTO
		DCXP=Application.NewObject("EDOFx.DCXP");
		if(DCXP==null){
			Log("Error al crear objeto DCXP");
			return 0;
		}	
		if(!DCXP.LoadFromADOConnection(LBCxP.Resultado(Resultado,1),"",Application.adoCnn,2)){
			Log(DCXP.lastErrDescrip);
			return 0;
		}
	}else
		DCXP=null;
	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();	
	if(LBCxP.Resultado(Resultado,0)==2){//APLICAR INTERESES MORATORIOS
		Poliza.Concepto=cIntMoratoriosCXP+Proveedor.Codigo+"-"+Proveedor.Nombre;
		Poliza.Notas=cNotas+" al aplicar intereses moratorios.";
	}else{//FINANCIAR CAPITAL O DOCUMENTO
		Poliza.Concepto=cIntFinancierosCXP+Proveedor.Codigo+"-"+Proveedor.Nombre;		
		if(DCXP!=null)
			Poliza.Notas=cNotas+" por financiamiento del documento con referencia:"+DCXP.Referencia;
		else
			Poliza.Notas=cNotas+" por financiamiento de capital.";
	}
	//***** PARTIDA 1: PROVEEDOR**********
	if(Proveedor.CodCuenta==""){
		Log("El proveedor "+Proveedor.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}
	if(!CC.LoadFromADOCByCodigo(Proveedor.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Haber=Importe;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	PKCuenta=0;
	if(LBCxP.Resultado(Resultado,0)==2) //APLICAR INTERESES MORATORIOS
		PKCuenta=FXConfig.CuentaInteresesMoratoriosProveedores();
	else
		PKCuenta=FXConfig.CuentaInteresesFinancierosProveedores();
		
	//***** PARTIDA 2: INTERESES**********		
	if(!CC.LoadFromADOConnection(PKCuenta,"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Debe=Importe-Impuesto;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	//***** PARTIDA 3: IMPUESTOS  POR ACREDITAR**********	
	if(Impuesto>0){
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXAcreditar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
		DPoliza.Debe=Impuesto;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
	
	//GUARDAR PÓLIZA
	if(WithTrans)
		DataAccess.BeginTrans();
	
		
	if(!Poliza.Update()){
		if(WithTrans)
			DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
	
	//ACTUALIZAR DOCUMENTO FINANCIADO
	if(DCXP!=null){
		DCXP.Poliza=Poliza.Sys_GUID;
		DCXP.Contabilizado=true;
		if(!DCXP.Update()){
			if(WithTrans)
				DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
			return 0;
		}
	}	
	
	if(LBCxP.Resultado(Resultado,0)==2){ //APLICAR INTERESES MORATORIOS
		//ACTUALIZAR NOTAS DE CARGO GENERADAS
		I=0;		
		DCXP=Application.NewObject("EDOFx.DCXP");
		if(DCXP==null){
			if(WithTrans)
				DataAccess.RollbackTrans();
			Log("Error al crear objeto DCXP");
			return 0;
		}
		do{
			Nota=LBCxP.Resultado(Resultado,6,I);
			if(Nota>0){				
				if(!DCXP.LoadFromADOConnection(Nota,"",Application.adoCnn)){
					if(WithTrans)
						DataAccess.RollbackTrans();
					Log(DCXP.lastErrDescrip);
					return 0;
				}
				DCXP.Poliza=Poliza.Sys_GUID;
				DCXP.Contabilizado=true;
				if(!DCXP.Update()){
					if(WithTrans)
						DataAccess.RollbackTrans();
					eBasic.eMsgbox("Error al crear póliza, no se pudo relacionar con la nota de cargo "+DCXP.Referencia,6);
					return 0;
				}	
			}
			I=I+1;
		}while(Nota>0);
	}
	if(WithTrans)
			DataAccess.CommitTrans();
	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK,WithTrans)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}	
	return -1;	
}


function PolizaIntMoratoriosCXP(Resultado){
	if(!Generar()) return -1;
	
	var Tipo;
	Tipo=LBCxP.Resultado(Resultado,0);
	if(Tipo==-99 || Tipo!=2){ //Tipo =ninguno ó Tipo<>aplicarIntMoratorios
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	return PolizaInteresesCXP(Resultado,true);
}
function PolizaIntFinancierosCXP(Resultado,WithTrans){
	if(!Generar()) return -1;
	
	var Tipo;
	Tipo=LBCxP.Resultado(Resultado,0);
	if(Tipo==-99 || (Tipo!=0 && Tipo!=1)){ //Tipo =ninguno ò no es financiar doc-financiar capital
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}		
	
	if(WithTrans==null)
		WithTrans=true;
	return PolizaInteresesCXP(Resultado,WithTrans);
}


function PolizaDocumentoXCobrar(Resultado){

if(!Generar()) return -1;
	
	var Poliza;
	var DPoliza;	
	var CC;	
	var Impuesto;	
	var DCXC;
			
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}	
	//CARGAR NOTA DE CREDITO POR BINIFICACIÓN
	if(!DCXC.LoadFromADOConnection(CuentasXCobrar.Resultado(Resultado,1),"",Application.adoCnn,2)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}	
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}		
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS
	Poliza.Periodo=AsignarPeriodo();
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();		
	Poliza.Concepto=cNuevoDCXC+DCXC.Referencia;
	Poliza.Notas=cNotas+" por alta de nuevo documento por cobrar al cliente "+DCXC.ICliente.Nombre;

	//***** PARTIDA 1: CLIENTE**********	
	if(DCXC.ICliente.CodCuenta==""){
		Log("El cliente "+DCXC.ICliente.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}
	if(!CC.LoadFromADOCByCodigo(DCXC.ICliente.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DCXC.Debe,DCXC.ICliente.FK_IDivisa,1); //EN DIVISA PREDETERMINADA;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
				
	//***** PARTIDA 2: IMPUESTOS**********	
	Impuesto=CuentasXCobrar.Resultado(Resultado,4);//IMPUESTOS POR INTERESES
	Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,DCXC.ICliente.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	if(Impuesto>0){
			if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXPagar(),"",Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return 0;
			}
			if (EsDepartamental(CC)) return 0;		
			DPoliza=Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
			DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
			DPoliza.Haber=Impuesto;
			Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
		
	//ACTUALIZAR DOCUMENTO	
	DCXC.Poliza=Poliza.Sys_GUID;
	DCXC.Contabilizado=true;
	if(!DCXC.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
		return 0;
	}
	DataAccess.CommitTrans();	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	//LA POLIZA NO SE APLICA PORQUE NO SE SABE DE DONDE SE OBTUVO EL DINERO PARA CREAR EL NUEVO DCXC
	eBasic.eMsgbox("La póliza se ha creado correctamente y se encuentra pendiente por aplicar.",6);	
	// if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		// eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		// return 0;
	// }	
	
	return -1;	

}


function PolizaDocumentoXPagar(Resultado){

if(!Generar()) return -1;
	
	var Poliza;
	var DPoliza;	
	var CC;	
	var Impuesto;	
	var DCXP;
			
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}	
	//CARGAR NOTA DE CREDITO POR BINIFICACIÓN
	if(!DCXP.LoadFromADOConnection(CuentasXPagar.Resultado(Resultado,1),"",Application.adoCnn,2)){
		Log(DCXP.lastErrDescrip);
		return 0;
	}	
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}		
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();		
	Poliza.Concepto=cNuevoDCXP+DCXP.Referencia;
	Poliza.Notas=cNotas+" por alta de nuevo documento por pagar al proveedor "+DCXP.IProveedor.Nombre;

	//***** PARTIDA 1: CLIENTE**********	
	if(DCXP.IProveedor.CodCuenta==""){
		Log("El proveedor "+DCXP.IProveedor.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}
	if(!CC.LoadFromADOCByCodigo(DCXP.IProveedor.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,DCXP.Haber,DCXP.IProveedor.FK_IDivisa,1); //EN DIVISA PREDETERMINADA;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
				
	//***** PARTIDA 2: IMPUESTOS**********	
	Impuesto=CuentasXPagar.Resultado(Resultado,4);//IMPUESTOS POR INTERESES
	Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,DCXP.IProveedor.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	
	if(Impuesto>0){
			if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXAcreditar(),"",Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return 0;
			}
			if (EsDepartamental(CC)) return 0;		
			DPoliza=Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
			DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
			DPoliza.Debe=Impuesto;
			Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
		
	//ACTUALIZAR DOCUMENTO	
	DCXP.Poliza=Poliza.Sys_GUID;
	DCXP.Contabilizado=true;
	if(!DCXP.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
		return 0;
	}
	DataAccess.CommitTrans();	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	//LA POLIZA NO SE APLICA PORQUE NO SE SABE DE DONDE SE OBTUVO EL DINERO PARA CREAR EL NUEVO DCXP
	eBasic.eMsgbox("La póliza se ha creado correctamente y se encuentra pendiente por aplicar.",6);	
	// if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		// eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		// return 0;
	// }	
	
	return -1;	

}


//**************** BANCO ********************************************************************************************
function PolizaMovimientoCuenta(MovCuenta,Tipo,MovCuenta2){
	if(!Generar()) return -1;
//Tipo=1 Cheque
//Tipo=2 Retiro
//MovCuenta= cheque o retiro

//Tipo=3=Deposito
//Tipo=4 Traspaso
//MovCuenta2=Deposito en la cuenta simple o al hacer traspaso

	var Poliza;
	var DPoliza;	
	var CC;	
			
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	if(MovCuenta.ICuenta.CurrentAction!=2){	//NO ESTA EDITANDO-NO ESTA CARGADA
		if(!MovCuenta.ICuenta.LoadFromADOConnection(MovCuenta.ICuenta.Sys_PK,"",Application.adoCnn)){
			Log(MovCuenta.ICuenta.lastErrDescrip);
			return 0;
		}
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Periodo=AsignarPeriodo();
	switch(Tipo){
		case 1://EGRESOS: CHEQUE-RETIRO
		case 2:
			Poliza.Tipo=1;//EGRESO
			Poliza.Notas=cNotas+". Movimiento realizado en la chequera "+ MovCuenta.ICuenta.Nombre;
			if(Tipo==1){
				Poliza.Concepto=cCheque+MovCuenta.Beneficiario;
			}else
				Poliza.Concepto=cRetiro+MovCuenta.Beneficiario;
			break;
		case 3:
		case 4:			
			if(Tipo==3){
				Poliza.Tipo=0;//INGRESO
				Poliza.Concepto=cDeposito+MovCuenta.ICuenta.Nombre;
				Poliza.Notas=cNotas;
			}else{
				Poliza.Tipo=2;//DIARIO
				Poliza.Concepto=cTraspaso;
				Poliza.Notas=cNotas+". Retiro de la cuenta "+MovCuenta.ICuenta.Nombre;
			}
			
	}
		
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();		
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** ** PARTIDA 1: CHEQUERA**********		
	
	if(MovCuenta.ICuenta.CodCuenta==""){
		Log("Error al crear póliza la chequera "+MovCuenta.ICuenta.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}	
	if(!CC.LoadFromADOCByCodigo(MovCuenta.ICuenta.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	if(Tipo==1 || Tipo==2 || Tipo==4){ //CHEUQUE O RETIRO (SIMPLE O EN TRASPASO)
		DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,MovCuenta.Egreso,MovCuenta.ICuenta.IDivisa.Sys_PK,1); //EN DIVISA PREDETERMINADA					
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}else{//DEPOSITO
		DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,MovCuenta.Ingreso,MovCuenta.ICuenta.IDivisa.Sys_PK,1); //EN DIVISA PREDETERMINADA							
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
	if(MovCuenta2!=null && Tipo==4 ){ //Deposito por traspaso
		if(MovCuenta2.ICuenta.CurrentAction!=2){	//NO ESTA EDITANDO-NO ESTA CARGADA
			if(!MovCuenta2.ICuenta.LoadFromADOConnection(MovCuenta2.ICuenta.Sys_PK,"",Application.adoCnn)){
				Log(MovCuenta2.ICuenta.lastErrDescrip);
				return 0;
			}
		}
		Poliza.Notas=Poliza.Notas+", depósito a la cuenta "+MovCuenta2.ICuenta.Nombre;
		if(MovCuenta2.ICuenta.CodCuenta==""){
			Log("Error al crear póliza la chequera "+MovCuenta2.ICuenta.Nombre+" no tiene asignada una cuenta contable.");
			return 0;
		}	
		if(!CC.LoadFromADOCByCodigo(MovCuenta2.ICuenta.CodCuenta,Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,MovCuenta2.Ingreso,MovCuenta2.ICuenta.IDivisa.Sys_PK,1); //EN DIVISA PREDETERMINADA									
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
	
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
	if(MovCuenta!=null){
		MovCuenta.Contabilizado=true;
		MovCuenta.Poliza=Poliza.Sys_GUID;	
		if(!MovCuenta.Update()){
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el movimiento de cuenta.",6);
			return 0;
		}
	}
	if(MovCuenta2!=null){
		MovCuenta2.Contabilizado=true;
		MovCuenta2.Poliza=Poliza.Sys_GUID;	
		if(!MovCuenta2.Update()){
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el movimiento de cuenta.",6);
			return 0;
		}
	}
	DataAccess.CommitTrans();
	
	if(Tipo==4){ //TRASPASO
		
		if(!Aplicar()) return -1;
		//APLICAR POLIZA
		if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
			eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
			return 0;
		}	
	}
	
	return -1;
}
function PolizaCheque(MovCuenta){
	if(!Generar()) return -1;
	
	return PolizaMovimientoCuenta(MovCuenta,1);
}
function PolizaRetiro(MovCuenta){
	if(!Generar()) return -1;
	
	return PolizaMovimientoCuenta(MovCuenta,2);
}

function PolizaIngresoDeposito(MovCuenta){		
	if(!Generar()) return -1;
	
	return PolizaMovimientoCuenta(MovCuenta,3);
}
function PolizaTraspaso(PKRetiro,PKDeposito){
	if(!Generar()) return -1;
	
var R;
var D;
	R=Application.NewObject("EDOFx.MovCuenta");
	if(R==null){
		Log("Error al crear objeto MovCuenta");
		return 0;
	}
	D=Application.NewObject("EDOFx.MovCuenta");
	if(D==null){
		Log("Error al crear objeto MovCuenta");
		return 0;
	}
	if(!R.LoadFromADOConnection(PKRetiro,"",Application.adoCnn,2)){
		Log(R.lastErrDescrip);
		return 0;
	}		
	if(!D.LoadFromADOConnection(PKDeposito,"",Application.adoCnn,2)){
		Log(D.lastErrDescrip);
		return 0;
	}	
	//RETIRO -DEPOSITO
	return PolizaMovimientoCuenta(R,4,D);
}




function PolizaNotaCargoCXC(Resultado){
if(!Generar()) return -1;
	//Tipo=1 -> Bonificacion
	//Tipo!=1->Por NotaCredito
	//Resultado=propiedades como pldel documento,PKdel recibo,PKDel Notacrèdito
	var Poliza;
	var DPoliza;
	var CC;	
	var Cargo;
	var Total;
	var Impuestos;
	var DivisaCliente;
	
	var DCXC;
	var Tipo;
	Tipo=CuentasXCobrar.Resultado(Resultado,0);
	if(Tipo==-99 || Tipo!=3){ //Tipo =ninguno Tipo!=nota cargo
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXC=Application.NewObject("EDOFx.DCXC");
	if(DCXC==null){
		Log("Error al crear objeto DCXC");
		return 0;
	}		
	if(!DCXC.LoadFromADOConnection(CuentasXCobrar.Resultado(Resultado,3),"",Application.adoCnn,2)){
		Log(DCXC.lastErrDescrip);
		return 0;
	}	
	
	DivisaCliente=DCXC.ICliente.FK_IDivisa;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS	
	Poliza.Periodo=AsignarPeriodo();
	//NOTA DE CREDITO
	Poliza.Concepto=cNotaCargoCXC+DCXC.ICliente.Codigo+"-"+DCXC.ICliente.Nombre;	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** PARTIDA 1: CLIENTE**********		
	if(DCXC.ICliente.CodCuenta==""){
		Log("El cliente "+DCXC.ICliente.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}	
	if(!CC.LoadFromADOCByCodigo(DCXC.ICliente.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	Total=gFunciones.CambioDivisa(DataAccess,DCXC.Debe,DivisaCliente,1); //EN DIVISA PREDETERMINADA
	DPoliza.Debe=Total;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	Cargos=Total;	
	Impuestos=0;
	
	if(CuentasXCobrar.Resultado(Resultado,4)>0){ //TIENE IMPUESTOS					
		Impuestos=gFunciones.CambioDivisa(DataAccess,CuentasXCobrar.Resultado(Resultado,4),DivisaCliente,1); //EN DIVISA PREDETERMINADA
		Cargos=Total-Impuestos;
	}
	
	if(Impuestos>0){
		//PARTIDA 2:  IMPUESTOS POR PAGAR
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXPagar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Haber=Impuestos;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
		
	//***** PARTIDA 3: OTROS CARGOS **********		
	if(!CC.LoadFromADOConnection(FXConfig.CuentaOtrosCargosCXC(),"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	DPoliza.Haber=Cargos;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
			
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();	
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}	
	//ACTUALIZAR DOCUMENTO
	DCXC.Poliza=Poliza.Sys_GUID;
	DCXC.Contabilizado=true;
	if(!DCXC.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error no fue posible relacionar la póliza con la nota de cargo.",6);
		return 0;
	}
	DataAccess.CommitTrans();	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	return -1;
}


function PolizaNotaCargoCXP(Resultado){
	if(!Generar()) return -1;
	//Tipo=1 -> Bonificacion
	//Tipo!=1->Por NotaCredito
	//Resultado=propiedades como pk del documento,PKdel recibo,PKDel Notacrédito
	var Poliza;
	var DPoliza;
	var CC;
	var Cargos;
	var Total;
	var Impuestos;
	var DivisaProv;
	
	var DCXP;
	var Tipo;
	Tipo=CuentasXPagar.Resultado(Resultado,0);
	if(Tipo==-99 || Tipo!=3){ //Tipo =ninguno Tipo!=nota credito
		Log("No se pudo obtener la información necesaria para generar la póliza");
		return 0;
	}
	
	DCXP=Application.NewObject("EDOFx.DCXP");
	if(DCXP==null){
		Log("Error al crear objeto DCXP");
		return 0;
	}		
	if(!DCXP.LoadFromADOConnection(CuentasXPagar.Resultado(Resultado,3),"",Application.adoCnn,2)){
		Log(DCXP.lastErrDescrip);
		return 0;
	}
	
	DivisaProv=DCXP.IProveedor.FK_IDivisa;
	
	Poliza=Application.NewObject("EDOConta.CPoliza");
	if(Poliza==null){
		Log("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=1;//EGRESOS
	Poliza.Periodo=AsignarPeriodo();
	 //NOTA DE CARGO
	Poliza.Concepto=cNotaCargoCXP+DCXP.IProveedor.Codigo+"-"+DCXP.IProveedor.Nombre;	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;
	
	CC=Application.NewObject("EDOConta.M_CContable");
	if(CC==null){
		Log("Error al crear objeto M_CContable");
		return 0;
	}
	
	//***** PARTIDA 1: PROVEEDOR**********		
	if(DCXP.IProveedor.CodCuenta==""){
		Log("El cliente "+DCXP.IProveedor.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}	
	if(!CC.LoadFromADOCByCodigo(DCXP.IProveedor.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	Total=gFunciones.CambioDivisa(DataAccess,DCXP.Haber,DivisaProv,1); //EN DIVISA PREDETERMINADA
	DPoliza.Haber=Total;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	Cargos=Total;	
	Impuestos=0;
	
	if(CuentasXPagar.Resultado(Resultado,4)>0){ //TIENE IMPUESTOS					
		Impuestos=gFunciones.CambioDivisa(DataAccess,CuentasXPagar.Resultado(Resultado,4),DivisaProv,1); //EN DIVISA PREDETERMINADA
		Cargos=Total-Impuestos;
	}
	
	if(Impuestos>0){
		//PARTIDA 2:  IMPUESTOS POR ACREDITAR
		if(!CC.LoadFromADOConnection(FXConfig.CuentaImpuestosXAcreditar(),"",Application.adoCnn)){
			Log(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
		DPoliza.Debe=Impuestos;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	}
		
	//***** PARTIDA 3: BONIFICACIONES SOBRE COMPRAS **********		
	if(!CC.LoadFromADOConnection(FXConfig.CuentaOtrosCargosCXP(),"",Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
	DPoliza.Debe=Cargos;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
			
	//GUARDAR PÓLIZA
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
	
	//ACTUALIZAR DOCUMENTO
	DCXP.Poliza=Poliza.Sys_GUID;
	DCXP.Contabilizado=true;
	if(!DCXP.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al crear póliza no fue posible relacionarla con la nota de cargo.",6);		
		return 0;
	}
	DataAccess.CommitTrans();
	
	if(!Aplicar()) return -1;
	//APLICAR POLIZA
	if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	
	return -1;
}


function Generar(){
	return FXConfig.GenerarPolizasAutomaticamente();
}
function Aplicar(){
	return FXConfig.AplicarPolizasAutomaticamente();
}

function EsDepartamental(Cuenta){
	if(Cuenta==null) 
		return true;
	if(Cuenta.Departamental){
		Log("No se pudo crear la póliza porque la cuenta:" + Cuenta.Descripcion +" es departamental.");
	    return true;
	}else
		return false;
}

function AsignarPeriodo(){
	var D;
	D=new Date();
	return D.getMonth()+1;
}


//**************** ADICIONALES ***********************//

function PolizaPorAnticipo(PKFactura){		
	var r;
	var pkrecibo=0;
	
	try{
		if(PKFactura==null) PKFactura=0;
		if(PKFactura<1) return 0;
		
		r=Application.DataBase.OpenRecordset("SELECT Z.Sys_PK AS PKRecibo FROM Venta INNER JOIN(DCXC INNER JOIN (AplCXC INNER JOIN DCXC Z ON Z.Sys_PK=AplCXC.FK_DCXC_AplicadoA) ON DCXC.Sys_PK=AplCXC.AplicadoA) ON Venta.Sys_PK=DCXC.IVenta WHERE Venta.Sys_PK="+PKFactura+" AND Z.Documento=19");
		if(r==null){
			Log("Error al obtener recibo aplicado como anticipo o enganche. (Pólizas automáticas)");
			return 0;
		}
		if(!(r.BOF && r.EOF)){
			pkrecibo=r.Fields("PKRecibo").Value;		
			if(pkrecibo<1){
				Log("No se pudo obtener clave de recibo (anticipo o enganche)");
				return 0;
			}
			PolizaReciboCXC(pkrecibo);
		}
	}catch(e){
		Log("Error al crear póliza por anticipo o enganche.");
		throw(e);
	}
}

//**************Log***********************
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}
//------------- POLIZA DE GASTO-----------------//

function PolizaPorGasto(PKGasto){
	if(!GastoTieneFormaPago(PKGasto))
	{
		Log("Error con la forma de pago.");
		return -1;
	}	
	
	if(!Generar()) 	
	{
		Log("Error: La opción de generar polizas automaticamente en el sistema debe estar activada.");
		return -1;
	}
	
	Log("Generando pólizas por gasto");
	
	try{
		var Poliza;
		var DPoliza;
		var CC;
		var Gasto;
		var R;
		var FormaPago;
		var Proveedor;
		var CodigoProveedor;
		var DivisaProv;
		var CodCuentaIVA;
		
		Poliza=Application.NewObject("EDOConta.CPoliza");
			Poliza=Application.NewObject("EDOConta.CPoliza");
		if(Poliza==null){
			Log("Error al crear objeto CPoliza");
			return 0;
		}
		CC=Application.NewObject("EDOConta.M_CContable");
		if(CC==null){
			Log("Error al crear objeto M_CContable");
			return 0;
		}
		Poliza.AddNew();
		Poliza.ADOCnn=Application.adoCnn;
		Poliza.Tipo=1;//EGRESOS
		Poliza.Periodo=AsignarPeriodo();
		 //NOTA DE CARGO
		Poliza.Concepto=cGasto;// +DCXP.IProveedor.Codigo+"-"+DCXP.IProveedor.Nombre;	
		Poliza.Referencia=gFunciones.ReferenciaAleatoria();
		Poliza.Notas=cNotas;
		
		R = Application.DataBase.OpenRecordset("SELECT ut_gasto.Referencia, ut_gasto.IProveedor, ut_gasto.IDivisa AS DivisaGasto, ut_gasto.TipoCambio, ut_gasto.IMovCaja, MovCaja.Efectivo, ut_gasto.IMovChequera, MovCuenta.Egreso, ut_gasto.Subtotal, ut_gasto.IVA, ut_gasto.RetIVA, ut_gasto.RetISR, ut_gasto.Total, ut_gasto.Deducibilidad, ut_gasto.FormaPago, ut_gasto.StatusAdministrativo, Proveedor.Nombre, proveedor.CodCuenta AS CuentaProveedor, Proveedor.IDivisa AS DivisaProveedor, Categoria.CodCuenta AS CuentaCategoria, Categoria.Descripcion AS NombreCategoria, Caja.CodCuenta AS CuentaCaja, Caja.Descripcion AS NombreCaja, Chequera.CodCuenta AS CuentaChequera, Chequera.Nombre AS NombreChequera, Categoria.Sys_PK as PKCategoria FROM (((ut_gasto LEFT JOIN ((MovCaja INNER JOIN Corte ON MovCaja.ICorte = Corte.Sys_PK) INNER JOIN Caja ON Corte.ICaja = Caja.Sys_PK) ON ut_gasto.IMovCaja = MovCaja.Sys_PK) LEFT JOIN (MovCuenta INNER JOIN Chequera ON Chequera.Sys_PK = MovCuenta.ICuenta) ON  MovCuenta.Sys_PK = ut_gasto.IMovChequera) INNER JOIN Proveedor ON Proveedor.Sys_PK = ut_gasto.IProveedor) INNER JOIN Categoria ON Categoria.Sys_PK = ut_gasto.ICategoria WHERE ut_gasto.Sys_PK = "+PKGasto);
		
		if(R==null){
			Log("Error al obtener información del gasto. (Pólizas automáticas)");
			return 0;
		}
		if(!(R.BOF && R.EOF)){
			FormaPago=R.Fields("FormaPago").Value;		
			if(FormaPago<1){
				Log("No se pudo obtener la forma de pago del gasto.");
				return 0;
			}
		}
		Proveedor = R.Fields("Nombre").Value;
		Haber = R.Fields("Total").Value;
		Subtotal = R.Fields("Subtotal").Value;
		Divisa = R.Fields("DivisaGasto").Value;
		
		//---PARTIDA 1 Proveedor o Caja/Chequera
		if(FormaPago == 2){				//VENTA A CREDITO
			tipoIVA = "POR ACREDITAR";
			//CodCuentaIVA = gestion_poliza.ObtenerCContableConocida("IVA-XACRE-001");
			CodCuentaIVA=FXConfig.CuentaImpuestosXPagar();
			CodCuenta = R.Fields("CuentaProveedor").Value;
			if(CodCuenta=="" || CodCuenta==null){
				Log("El Proveedor "+Proveedor+" no tiene asignada una cuenta contable.");
				return 0;
			}
			if(!CC.LoadFromADOCByCodigo(CodCuenta,Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return 0;
			}
			DPoliza=Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
			DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
			Total=gFunciones.CambioDivisa(DataAccess,Haber,Divisa,1); //EN DIVISA PREDETERMINADA
			DPoliza.Haber=Total;
			DPoliza.Concepto="Proveedor";
			Poliza.Haber=Poliza.Haber+DPoliza.Haber;
			
			//-- PARTIDA DE LA CHEQUERA
		}else if(FormaPago == 1){//VENTA DE CONTADO
			tipoIVA="ACREDITABLE";
			//CodCuentaIVA = gestion_poliza.ObtenerCContableConocida("IVA-ACRED-001");
			CodCuentaIVA=FXConfig.CuentaImpuestosXAcreditar();
			if(R.Fields("IMovChequera").Value!=null){
				CodCuenta = R.Fields("CuentaChequera").Value;
				NombreChequera = R.Fields("NombreChequera").Value;
				Importe = R.Fields("Egreso").Value;
				if(CodCuenta=="" || CodCuenta==null){
					Log("La chequera "+NombreChequera+" no tiene asignada una cuenta contable.");
					return 0;
				}
				
				if(!CC.LoadFromADOCByCodigo(CodCuenta,Application.adoCnn)){
					Log(CC.lastErrDescrip);
					return 0;
				}
				DPoliza=Poliza.Detalle.NewElement();
				DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
				DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
				Total=gFunciones.CambioDivisa(DataAccess,Importe,Divisa,1); //EN DIVISA PREDETERMINADA
				DPoliza.Haber=Total;
				DPoliza.Concepto="Contado";
				Poliza.Haber=Poliza.Haber+DPoliza.Haber;
			}
			
			//--PARTIDA DE LA CAJA
			
			if(R.Fields("IMovCaja").Value!=null){	
				CodCuenta = R.Fields("CuentaCaja").Value;
				NombreCaja = R.Fields("NombreCaja").Value;
				Importe = R.Fields("Efectivo").Value;
				if(CodCuenta=="" || CodCuenta==null){
					Log("La caja "+NombreCaja+" no tiene asignada una cuenta contable.");
					return 0;
				}
				
				if(!CC.LoadFromADOCByCodigo(CodCuenta,Application.adoCnn)){
					Log(CC.lastErrDescrip);
					return 0;
				}
				DPoliza=Poliza.Detalle.NewElement();
				DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
				DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);	
				Total=gFunciones.CambioDivisa(DataAccess,Importe*-1,Divisa,1); //EN DIVISA PREDETERMINADA
				DPoliza.Haber=Total;
				DPoliza.Concepto="Caja";
				Poliza.Haber=Poliza.Haber+DPoliza.Haber;
			}
		}
		//---PARTIDA 2 (CATEGORÍA)
		CodCuentaCategoria = R.Fields("CuentaCategoria").Value;
		NombreCategoria = R.Fields("NombreCategoria").Value;
		
		if(CodCuentaCategoria == "" || CodCuentaCategoria==null){
			Log("La categoría "+NombreCategoria+" no tiene asignada una cuenta contable.");
			return 0;
		}
		if(!CC.LoadFromADOCByCodigo(CodCuentaCategoria,Application.adoCnn)){
			Log("Error al cargar la categoría. "+CC.lastErrDescrip);
			return 0;
		}
		
		if (CC.Departamental)
		{
			/*
			if(!obtenerProrrateo(Poliza, CC, gFunciones.CambioDivisa(DataAccess, Subtotal, Divisa,1), 1, R.Fields("PKCategoria").Value))  //1.- Debe 2.- Haber
			{
				Log("Error al crear la póliza de gasto.");
				return 0;
			}*/

			// Se añadiera solo si el cliente lo necesita mediante una solicitud <By LEONARDOCM 03-DIC-2013>			
			Log("Error al crear la póliza no se ha definido como obtener el Prorrateo");
			return 0;
		}
		else
		{
			DPoliza=Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
			DPoliza.TCambio = gFunciones.TipoCambio(DataAccess, CC.FK_IDivisa);
			DPoliza.Debe = gFunciones.CambioDivisa(DataAccess, Subtotal, Divisa,1);
			DPoliza.Concepto
			Poliza.Debe=Poliza.Debe+DPoliza.Debe;
		}
		
		//---PARTIDA 3 (IVA)
		if(CodCuentaIVA == null || CodCuentaIVA==""){
			Log("IVA "+tipoIVA+" no tiene asignada una cuenta contable.");
			return 0;
		}
		IVA = R.Fields("IVA").Value;
		if(IVA > 0){
			if(!CC.LoadFromADOConnection(CodCuentaIVA, "", Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return 0;
			}
			DPoliza = Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
			DPoliza.TCambio = gFunciones.TipoCambio(DataAccess, CC.FK_IDivisa);
			DPoliza.Debe = gFunciones.CambioDivisa(DataAccess, IVA, Divisa,1);
			Poliza.Debe=Poliza.Debe+DPoliza.Debe;
		}
		//---PARTIDA 4 (IVA RETENIDO)
		IvaRet = R.Fields("RetIVA");
		if(IvaRet > 0){
			//CodCuentaIVARET = gestion_poliza.ObtenerCContableConocida("IVA-RETEN-001");
			CodCuentaIVARET=FXConfig.CuentaIvaRetenido();
			if(CodCuentaIVARET == null || CodCuentaIVARET==""){
				Log("IVA RETENIDO A PROVEEDOR no tiene asignada una cuenta contable.");
				return 0;
			}
			if(!CC.LoadFromADOConnection(CodCuentaIVARET, "", Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return 0;
			}
			
			DPoliza = Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
			DPoliza.TCambio = gFunciones.TipoCambio(DataAccess, CC.FK_IDivisa);
			DPoliza.Haber = gFunciones.CambioDivisa(DataAccess, IvaRet, Divisa,1);
			Poliza.Haber=Poliza.Haber+DPoliza.Haber;
		}
		//---PARTIDA 5 (ISR RETENIDO)	
		IsrRet = R.Fields("RetISR").Value;
		if(IsrRet > 0){ 
			//CodCuentaISRRET = gestion_poliza.ObtenerCContableConocida("ISR-RETEN-001");
			CodCuentaISRRET=FXConfig.CuentaISRRetenido();
			if(CodCuentaISRRET == null || CodCuentaISRRET==""){
				Log("ISR RETENIDO A PROVEEDOR no tiene asignada una cuenta contable.");
				return 0;
			}
			if(!CC.LoadFromADOConnection(CodCuentaISRRET, "", Application.adoCnn)){
				Log(CC.lastErrDescrip);
				return 0;
			}
			DPoliza = Poliza.Detalle.NewElement();
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);
			DPoliza.TCambio = gFunciones.TipoCambio(DataAccess, CC.FK_IDivisa);
			DPoliza.Haber = gFunciones.CambioDivisa(DataAccess, IsrRet, Divisa,1);
			Poliza.Haber=Poliza.Haber+DPoliza.Haber;
		}
		DataAccess.BeginTrans();

		if(!Poliza.Update()){
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);
			return 0;
		}
		//Application.ADOCnn.Execute("UPDATE ut_gasto SET uf_IPoliza = '"+Poliza.Sys_GUID+"' WHERE ut_gasto.Sys_PK ="+PKGasto);
		actualizarContabilizado(PKGasto, Poliza.Sys_GUID, "ut_gasto", "Poliza");
		
		DataAccess.CommitTrans();
		Log("Póliza guardada correctamente");
		
		if(!Aplicar())
		{
			Log("Aplicar Póliza : FALSE");
			return -1;
		}
		
		//APLICAR POLIZA
		if (!Contabilidad.BLogic.AplicarPoliza(Poliza.Sys_PK)){
			eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
			return 0;
		}
		Log("Póliza se ha aplicado correctamente");
	}
	catch(e){
		DataAccess.RollbackTrans();
		Log(e.message);
	}
}

/**
*	
*/
function actualizarContabilizado(pkRegistro, poliza,tabla, campo){
	try{
		Application.ADOCnn.Execute("UPDATE "+tabla+" SET "+campo+" = '"+poliza+"', contabilizado = 1 WHERE Sys_PK="+pkRegistro);
	}catch(e){
		Application.ADOCnn.Execute("UPDATE "+tabla+" SET "+campo+" = '"+poliza+"', contabilizado = -1 WHERE Sys_PK="+pkRegistro)
	}
}

function GastoTieneFormaPago(PKGasto)
{
	try
	{
		var R = Application.DataBase.OpenRecordset("SELECT ut_gasto.FormaPago from ut_Gasto WHERE ut_gasto.Sys_PK = "+ PKGasto);
		
		if(R==null){
			return false;
		}
		var FormaPago=R.Fields("FormaPago").Value;		
		if(FormaPago<1){
			return false;
		}
		return true;
	}
	catch(e)
	{
		return false;
	}
}

function POSPoliza(PKVenta)
{
	try
	{
		var oFactura;
		oFactura = eBasic.eCreateObject("EDOFx.Venta");
		if(oFactura==null)
		{
			eBasic.eMsgbox("Error al crear objeto venta. Intente desde el BackOffice.");
			return -1;
		}
		if (!oFactura.LoadFromADOConnection(PKVenta,"",Application.adoCnn,3))
		{
			eBasic.eMsgbox("Error al cargar venta. Intente desde el BackOffice.");
			return -1;
		}
		
		POSPolizaVentaFacturacion(oFactura)
		
		return 1;
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al crear póliza." + e.description);
		return -1;
	}
}

function POSPolizaVentaFacturacion(Factura, Global){
	if(!POSGenerar()) return -1;
	
	iniciarconta();
	
	var Poliza;
	var DPoliza;	
	var CC;				
	var Impuesto;
	var Costo;		
	var Divisa;
	var Relacionada; //Indica si la factura está relacionado con otros documentos
			
	//=================================================
	try{
		if(Factura.FormaPago==2 || Factura.FormaPago==3){
			//si crédito o financiado
			PolizaPorAnticipo(Factura.Sys_PK);
		}
	}catch(e){
	
	}
	//=================================================
	
	//2 jv
	Relacionada=false;
	Relacionada=LBVenta.IncluyeOtrosDocumentos(Factura.Sys_PK,3); //Buscar remisiones relacionadas	
	
	Divisa=Factura.IDivisa.Sys_PK;	
	
	Poliza=eBasic.eCreateObject("EDOConta.CPoliza");
	if(Poliza==null){
		eBasic.eMsgbox("Error al crear objeto CPoliza");
		return 0;
	}	
	CC=eBasic.eCreateObject("EDOConta.M_CContable");
	if(CC==null){
		eBasic.eMsgbox("Error al crear objeto M_CContable");
		return 0;
	}	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS
	Poliza.Periodo=AsignarPeriodo();
	Poliza.Concepto=cVentaFactura+Factura.Referencia;
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();
	Poliza.Notas=cNotas;

	//***** PARTIDA 1: CLIENTE O CAJA********** Edit By Frank -> 21/Agosto/09
	//Para punto de venta será para la caja... 23/12/2013
	
	//1 jv
	//if(Global==null) Global=false; //25-01-2010
	
	if (!Global){
	DPoliza=null;
	DPoliza=POSDPolizaFormaPago(Poliza,Factura,false);	
	if(DPoliza==null){
		if(!Relacionada)	
		{	
			return 0;	
		}
	}else{
		DPoliza.Debe=Factura.Subtotal-Factura.Descuento1-Factura.Descuento2+Factura.Impuesto1+Factura.Impuesto2+Factura.Impuesto3+Factura.Impuesto4;
		DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DPoliza.Debe,Divisa,1); //EN DIVISA PREDETERMINADA	
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;	
	}
	}else{
		//By jFrank: 21/Agosto/09
		//Agregado para generar polizas a facturaras globales
		var Rst=null;
		var sqlQuery="";
		// La Consulta retorna las ventas de diferentes cuentas
		sqlQuery="select Venta.Sys_PK,sum(SubTotal-Descuento1-Descuento2+Impuesto1+Impuesto2+Impuesto3+Impuesto4) as Debe,ICaja,CodCuenta  from venta INNER JOIN Caja ON Venta.ICaja=Caja.Sys_PK where AplicadoA=" + Factura.Sys_PK + " Group BY Venta.ICaja;"
		Rst =Poliza.ADOCnn.Execute(sqlQuery);
		if (Rst==null){
			eBasic.eMsgbox("Error al intentar obtener datos origen de la factura");
			return 0;
		}
	
		while(!Rst.EOF){
			DPoliza=null;
				DPoliza=DPolizaGlobal(Poliza,Rst("CodCuenta").Value);
				DPoliza.Debe= Rst("Debe").Value;
				DPoliza.Debe=gFunciones.CambioDivisa(DataAccess,DPoliza.Debe,Divisa,1); //EN DIVISA PREDETERMINADA	
				Poliza.Debe=Poliza.Debe+DPoliza.Debe;
			Rst.MoveNext();
		}
	}
		
	//PARTIDA 2: INGRESOS POR VENTAS
	if(!CC.LoadFromADOConnection(AppVars.GetTextVar("FXCA064", ""),"",Application.adoCnn)){
		eBasic.eMsgbox(CC.lastErrDescrip);
		return 0;
	}

	if (EsDepartamental(CC)) return 0;
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	DPoliza.Haber=Factura.Subtotal-Factura.Descuento1-Factura.Descuento2;
	DPoliza.Haber=gFunciones.CambioDivisa(DataAccess,DPoliza.Haber,Divisa,1); //EN DIVISA PREDETERMINADA		
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	//PARTIDA 3: IMPUESTO POR PAGAR	
	Impuesto=0;

	Impuesto=Factura.Impuesto1+Factura.Impuesto2+Factura.Impuesto3+Factura.Impuesto4;		
	if(Impuesto>0){
		Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Divisa,1); //EN DIVISA PREDETERMINADA				
		if(!CC.LoadFromADOConnection(AppVars.GetTextVar("FXCA062", ""),"",Application.adoCnn)){
			eBasic.eMsgbox(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Haber=Impuesto;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}

	//PARTIDA 4:COSTO DE VENTAS	
	Costo=LBInventario.CostoVenta(Factura);//Es Costo lo devuelve en la divisa predeterminada	
	if(LBInventario.LastErrorCode>0){//si ocurrión un error en costoVenta()		
		eBasic.eMsgbox(LBInventario.LastErrorDescrip);
		return 0;
	}
	if(Costo>0){
		if(!CC.LoadFromADOConnection(AppVars.GetTextVar("FXCA065", ""),"",Application.adoCnn)){
			eBasic.eMsgbox(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;
		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
		DPoliza.Debe=Costo;
		Poliza.Debe=Poliza.Debe+DPoliza.Debe;
		//PARTIDA 5: INVENTARIO
		DPoliza=null;
		DPoliza=POSDPolizaInventario(Poliza,Factura.ICConsumo.FK_IAlmacen);
		if(DPoliza==null) return 0;
		DPoliza.Haber=Costo;	
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;	
	}
	//GUARDAR PÓLIZA	
	DataAccess.BeginTrans();
	if(!Poliza.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
		
	//ACTUALIZAR VENTA
	Factura.Poliza=Poliza.Sys_GUID;
	Factura.Contabilizado=true;
	if(!Factura.Update()){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con la factura.",6);
		return 0;
	}

	//ACTUALIZAR MOVIMIENTO DE CAJA
	if(Factura.FormaPago==1){
		if(Factura.IMovCaja.Sys_PK>0){
			if(!POSActualizarMovCaja(Factura.IMovCaja.Sys_PK,Poliza.Sys_GUID)){
				DataAccess.RollbackTrans();
				return 0;
			}
		}
	}else{

		//SI LA FACTURA SE HIZO EN PARCIALIDADES ENTONCES CREAR POLIZA INTERESES FINANCIEROS
		if(!Relacionada){
			if(Factura.FormaPago==3){		
				if(POSPolizaInteresesCXC(CuentasXCobrar.Blogic.ResultadoLGCXC,false)==0){
					eBasic.eMsgbox("No se pudo crear la póliza por intereses de financiamiento");
					//DataAccess.RollbackTrans();
					//return 0;
				}
			}
		}
	}
	DataAccess.CommitTrans();

	if(!POSAplicar()) return -1;
	//APLICAR POLIZA
	if(Relacionada){ 
		eBasic.eMsgbox("La póliza se guardó pero no se pudo aplicar porque no se obtuvieron los datos necesarios ya que la factura está relacionada con una remisión");
		return -1;
	}
	if (!tempconta.BLogic.AplicarPoliza(Poliza.Sys_PK)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}
	return -1;
	
}

function POSDPolizaFormaPago(Poliza,DocVenta,SoloCliente){
	try
	{
		var DPoliza;
		var TmpCodigo;
		var CC;
		var Obj;
		var PKMovCaja;
	
			if(DocVenta.FormaPago==1 && SoloCliente==false){ //se realizó de contado.
			
		/*****************************************************************/
		/*****************************************************************/
		//Obtener el MovCaja del Tickets
			
		var sqlQuery="";
		sqlQuery="Select IMovCaja from Venta where AplicadoA = " + DocVenta.Sys_PK;

		Obj =Poliza.ADOCnn.Execute(sqlQuery);
		if (Obj==null){
			eBasic.eMsgbox("Error al intentar obtener datos origen de la factura");
			return 0;
		}

		while(!Obj.EOF){
			PKMovCaja = Obj("IMovCaja").Value;
			Obj.MoveNext();
		}
		
		Obj.Close;
		Obj = null;
			
		var MovCaja;
		MovCaja=eBasic.eCreateObject("EDOFx.MovCaja");
		if(MovCaja==null){
			eBasic.eMsgbox("Error al crear objeto MovCaja");
			return false;
		}
		if(!MovCaja.LoadFromADOConnection(PKMovCaja,"",Application.adoCnn, 2)){
			eBasic.eMsgbox(MovCaja.lastErrDescrip);
			return false;
		}
		
		/*****************************************************************/
		/*****************************************************************/
		TmpCodigo=POSCodigoCuentaMovCaja(MovCaja);
		//TmpCodigo=POSCodigoCuentaMovCaja(DocVenta.IMovCaja);
				if(TmpCodigo==""){
					eBasic.eMsgbox("Error al crear póliza: no se encontró la cuenta asignada a la caja");
					return null;
				}		
			}else{
				TmpCodigo=DocVenta.ICliente.CodCuenta;
				if(TmpCodigo==""){
					eBasic.eMsgbox("Error al crear póliza: no se encontró la cuenta asignada al cliente "+DocVenta.ICliente.Nombre);
					return null;
				}
			} 
			CC=eBasic.eCreateObject("EDOConta.M_CContable");
			if(CC==null){
				eBasic.eMsgbox("Error al crear objeto M_CContable");
				return null;
			}
			if(!CC.LoadFromADOCByCodigo(TmpCodigo,Application.adoCnn)){
				eBasic.eMsgbox(CC.lastErrDescrip);
				return null;
			}
			if (EsDepartamental(CC)) return null;		
			DPoliza=Poliza.Detalle.NewElement();
			if(DPoliza==null){
				eBasic.eMsgbox("Error al crear detalle de póliza");
				return null;
			}
			DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
			DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
			return DPoliza;
	}catch(e)
	{
		eBasic.eMsgbox(e.description);
	}
}

function POSCodigoCuentaMovCaja(MovCaja){
var Corte;
//MovCaja es de tipo M_MovCaja
	if(MovCaja==null)
		return "";

	if(MovCaja.Sys_PK<1){
		eBasic.eMsgbox("Error al crear póliza: el documento no tiene asignado un movimiento de caja.");
		return "";
	}

	if(MovCaja.CurrentAction!=2){//SI NO ESTA EDITANDO
		if(!MovCaja.LoadFromADOConnection(MovCaja.Sys_PK,"",Application.adoCnn, 2)){
			eBasic.eMsgbox(MovCaja.lastErrDescrip);
			return "";
		}
	}

	Corte=eBasic.eCreateObject("EDOFx.Corte");
	if(Corte==null){
		eBasic.eMsgbox("Error al crear objeto Corte");
		return "";
	}
	
	//Obtener corte de movcaja...
	//*******************************************************************************
	//*******************************************************************************
	var sqlQuery="";
	var Obj;
	var PKCorte;
	sqlQuery="Select ICorte from MovCaja where Sys_PK = " + MovCaja.Sys_PK;

	//Obj = openRecordset(sqlQuery, false);
	Obj = Application.ADOCnn.execute(sqlQuery);
	if (Obj==null){
		eBasic.eMsgbox("Error al intentar obtener datos del movimiento de caja.");
		return 0;
	}
	
	while(!Obj.EOF){
		PKCorte = Obj("ICorte").Value;
		Obj.MoveNext();
	}
	
	Obj.Close;
	Obj = null;
	//*******************************************************************************
	//*******************************************************************************
		
	if(!Corte.LoadFromADOConnection(PKCorte,"",Application.adoCnn,2)){
		eBasic.eMsgbox(Corte.lastErrDescrip);
		return "";
	}
	
	return Corte.ICaja.CodCuenta;
}

//function DPolizaInventario(Poliza,PKCategoria){
function POSDPolizaInventario(Poliza,PKAlmacen){
//var Categoria;
var CC;
var DPoliza;
var Almacen;
var CuentaAlmacen;
	
	CuentaAlmacen="";
	if(PKAlmacen==null) PKAlmacen=0;
	
	if(PKAlmacen<=0){
		eBasic.eMsgbox("No se encontró la cuenta contable de almacén");
		return null;
	}
	Almacen=eBasic.eCreateObject("EDOFx.M_Almacen");
	if(Almacen==null){
		eBasic.eMsgbox("Error al crear objeto M_Almacen");
		return null;
	}
	if(!Almacen.LoadFromADOConnection(PKAlmacen,"",Application.adoCnn)){
		eBasic.eMsgbox(Almacen.lastErrDescrip);
		return null;
	}		
	CuentaAlmacen=Almacen.CodCuenta;	
	if(CuentaAlmacen==""){
		eBasic.eMsgbox("No se encontró la cuenta contable de almacén");
		return null;	
	}
	
	
	CC=eBasic.eCreateObject("EDOConta.M_CContable");
	if(CC==null){
		eBasic.eMsgbox("Error al crear objeto M_CContable");
		return null;
	}
	/*
	if(!CC.LoadFromADOCByCodigo(Categoria.CodCuenta,Application.adoCnn)){
		Log(CC.lastErrDescrip);
		return null;
	}
	*/
	if(!CC.LoadFromADOCByCodigo(CuentaAlmacen,Application.adoCnn)){
		eBasic.eMsgbox(CC.lastErrDescrip);
		return null;
	}
	if (EsDepartamental(CC)) return null;	
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);
	return DPoliza;
}

function POSActualizarMovCaja(PKMovCaja,GUIDPoliza){
var MovCaja;
	MovCaja=eBasic.eCreateObject("EDOFx.MovCaja");
	if(MovCaja==null){
		eBasic.eMsgbox("Error al crear objeto MovCaja");
		return false;
	}
	if(!MovCaja.LoadFromADOConnection(PKMovCaja,"",Application.adoCnn)){
		eBasic.eMsgbox(MovCaja.lastErrDescrip);
		return false;
	}
	MovCaja.Poliza=GUIDPoliza;
	MovCaja.Contabilizado=true;
	if(!MovCaja.Update()){
		eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el movimiento de caja.",6);
		return false;
	}
	return true;
}

function POSPolizaInteresesCXC(Resultado,WithTrans){
	if(!Generar()) return -1;
	//UTILIZADO PARA  FINANCIEROS: FINACIAR CAPITAL O FINANCIAR DOCUMENTO
	//E INTERESES MORATORIOS
	var Poliza;
	var DPoliza;
	var PKCliente;
	var Cliente;
	var CC;
	var Importe;
	var Impuesto;
	var DCXC;
	var PKCuenta;
	var I;
	var Nota;
	DCXC=null;
	PKCliente=0;
	
	if(WithTrans==null)
		WithTrans=true;
	
	if(LBCXC.Resultado(Resultado,0)==2) //SI ES APLICAR INTERESER MORATORIOS
		if(LBCXC.Resultado(Resultado,6,0)==0) //NO HAY INTERESES
			return 0;
	
	PKCliente=LBCXC.Resultado(Resultado,2);
		
	if(PKCliente<1){
		eBasic.eMsgbox("Error falta clave del cliente");
		return 0;
	}	
	
	Poliza=eBasic.eCreateObject("EDOConta.CPoliza");
	if(Poliza==null){
		eBasic.eMsgbox("Error al crear objeto CPoliza");
		return 0;
	}		
	Cliente=eBasic.eCreateObject("EDOFx.M_Cliente");
	if(Cliente==null){
		eBasic.eMsgbox("Error al crear objeto M_Cliente");
		return 0;
	}	
	CC=eBasic.eCreateObject("EDOConta.M_CContable");
	if(CC==null){
		eBasic.eMsgbox("Error al crear objeto M_CContable");
		return 0;
	}
	
	if(!Cliente.LoadFromADOConnection(PKCliente,"",Application.adoCnn)){
		eBasic.eMsgbox(Cliente.lastErrDescrip);
		return 0;
	}
	
	Importe=LBCXC.Resultado(Resultado,3); //INTERESES APLICADOS +IMPUESTOS
	if(Importe==0){		
		return -999; //no hay importe no se crea la póliza... No se incluyò in porcentaje de int financieros
	}	
	Importe=gFunciones.CambioDivisa(DataAccess,Importe,Cliente.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	Impuesto=LBCXC.Resultado(Resultado,4);//IMPUESTOS POR INTERESES
	Impuesto=gFunciones.CambioDivisa(DataAccess,Impuesto,Cliente.FK_IDivisa,1); //EN DIVISA PREDETERMINADA
	
	
	if(LBCXC.Resultado(Resultado,0)==1){//FINANCIAR DOCUMENTO
		DCXC=eBasic.eCreateObject("EDOFx.DCXC");
		if(DCXC==null){
			eBasic.eMsgbox("Error al crear objeto DCXC");
			return 0;
		}	
		if(!DCXC.LoadFromADOConnection(LBCXC.Resultado(Resultado,1),"",Application.adoCnn,2)){
			eBasic.eMsgbox(DCXC.lastErrDescrip);
			return 0;
		}
	}else
		DCXC=null;
	
	Poliza.AddNew();
	Poliza.ADOCnn=Application.adoCnn;
	Poliza.Tipo=0;//INGRESOS	
	Poliza.Periodo=AsignarPeriodo();	
	Poliza.Referencia=gFunciones.ReferenciaAleatoria();	
	if(LBCXC.Resultado(Resultado,0)==2){//APLICAR INTERESES MORATORIOS
		Poliza.Concepto=cIntMoratoriosCXC+Cliente.Codigo+"-"+Cliente.Nombre;
		Poliza.Notas=cNotas+" al aplicar intereses moratorios.";
	}else{//FINANCIAR CAPITAL O DOCUMENTO
		Poliza.Concepto=cIntFinancierosCXC+Cliente.Codigo+"-"+Cliente.Nombre;		
		if(DCXC!=null)
			Poliza.Notas=cNotas+" por financiamiento del documento con referencia:"+DCXC.Referencia;
		else
			Poliza.Notas=cNotas+" por financiamiento de capital.";
	}
	//***** PARTIDA 1: CLIENTE**********		
	if(Cliente.CodCuenta==""){
		eBasic.eMsgbox("El cliente "+Cliente.Nombre+" no tiene asignada una cuenta contable.");
		return 0;
	}
	if(!CC.LoadFromADOCByCodigo(Cliente.CodCuenta,Application.adoCnn)){
		eBasic.eMsgbox(CC.lastErrDescrip);
		return 0;
	}	
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Debe=Importe;
	Poliza.Debe=Poliza.Debe+DPoliza.Debe;
	
	PKCuenta=0;
	if(LBCXC.Resultado(Resultado,0)==2) //APLICAR INTERESES MORATORIOS
		PKCuenta=AppVars.GetTextVar("FXCA070", "");
	else
		PKCuenta=AppVars.GetTextVar("FXCA072", "");
		
	//***** PARTIDA 2: INTERESES**********		
	if(!CC.LoadFromADOConnection(PKCuenta,"",Application.adoCnn)){
		eBasic.eMsgbox(CC.lastErrDescrip);
		return 0;
	}
	if (EsDepartamental(CC)) return 0;		
	DPoliza=Poliza.Detalle.NewElement();
	DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
	DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
	DPoliza.Haber=Importe-Impuesto;
	Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	
	//***** PARTIDA 3: IMPUESTOS  POR PAGAR**********	
	if(Impuesto>0){
		if(!CC.LoadFromADOConnection(AppVars.GetTextVar("FXCA062", ""),"",Application.adoCnn)){
			eBasic.eMsgbox(CC.lastErrDescrip);
			return 0;
		}
		if (EsDepartamental(CC)) return 0;		
		DPoliza=Poliza.Detalle.NewElement();
		DPoliza.ICuenta.SetPrimaryKey(CC.Sys_PK);	
		DPoliza.TCambio=gFunciones.TipoCambio(DataAccess,CC.FK_IDivisa);		
		DPoliza.Haber=Impuesto;
		Poliza.Haber=Poliza.Haber+DPoliza.Haber;
	}
	
	//GUARDAR PÓLIZA
	if(WithTrans)
		DataAccess.BeginTrans();
	if(!Poliza.Update()){
		if(WithTrans)
			DataAccess.RollbackTrans();
		eBasic.eMsgbox("Error al guardar póliza, "+Poliza.lastErrDescrip,6);		
		return 0;
	}
		
	//ACTUALIZAR DOCUMENTO FINANCIADO
	if(DCXC!=null){
		DCXC.Poliza=Poliza.Sys_GUID;
		DCXC.Contabilizado=true;
		if(!DCXC.Update()){
			if(WithTrans)
				DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error la póliza se creó correctamente pero no fue posible relacionarla con el documento.",6);
			return 0;
		}
	}	
	
	if(LBCXC.Resultado(Resultado,0)==2){ //APLICAR INTERESES MORATORIOS
		//ACTUALIZAR NOTAS DE CARGO GENERADAS
		I=0;		
		DCXC=eBasic.eCreateObject("EDOFx.DCXC");
		if(DCXC==null){
			if(WithTrans)
				DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error al crear objeto DCXC");
			return 0;
		}
		do{
			Nota=LBCXC.Resultado(Resultado,6,I);
			if(Nota>0){				
				if(!DCXC.LoadFromADOConnection(Nota,"",Application.adoCnn)){
					if(WithTrans)
						DataAccess.RollbackTrans();
					eBasic.eMsgbox(DCXC.lastErrDescrip);
					return 0;
				}
				DCXC.Poliza=Poliza.Sys_GUID;
				DCXC.Contabilizado=true;
				if(!DCXC.Update()){
					if(WithTrans)
						DataAccess.RollbackTrans();
					eBasic.eMsgbox("Error al crear póliza, no se pudo relacionar con la nota de cargo "+DCXC.Referencia,6);
					return 0;
				}	
			}
			I=I+1;
		}while(Nota>0);
	}
	
	if(WithTrans)
		DataAccess.CommitTrans();
			
	if(!POSAplicar()) return -1;
	//APLICAR POLIZA
	if (!tempconta.BLogic.AplicarPoliza(Poliza.Sys_PK,WithTrans)){
		eBasic.eMsgbox("La póliza("+Poliza.Referencia+") ha sido guardada pero no se pudo aplicar.",6);
		return 0;
	}	
	
	return -1;	
}

function POSGenerar(){
	var val = AppVars.GetTextVar("FXCA074", "");
	if(val=="-1")
	{
		return true;
	}
	else
	{
		return false;
	}		
}

function POSAplicar(){
	var val = AppVars.GetTextVar("FXCA075", "");
	if(val=="-1")
	{
		return true;
	}
	else
	{
		return false;
	}
}

function iniciarconta()
{
	try
	{
		if(tempconta==null)
		{
			var edoconta=eBasic.eCreateObject("EDOConta.EDO_Conta");
			edoconta.SetConnection(DataAccess.ADOCnn);		
			var blconta= eBasic.eCreateObject("lbnConta.lgConta");
			
			tempconta = eBasic.eCreateObject("UIConta.Acciones");
			tempconta.SetObjects(edoconta,blconta,Catalogos);	
			blconta.EjercicioActual=IntvarValue("FXCA076");
			tempconta.DivisaPredeterminada=IntvarValue("FXCA013");
			tempconta.DecPreMontos=IntvarValue("FXCA001");
			tempconta.FormatoMontos=IntvarValue("FXCA003");		
			return 1;
		}
	}catch(e)
	{
		eBasic.eMsgbox("Error al inciar componentes de contabilidad." + e.description);
		return -1;
	}
}

function IntvarValue(name)
{
	var R = openRecordset("Select varvalue from globalvar where varname = '"+name+"'", true);
	if(R!=null)
	{
		return R("varvalue");
	}
	return 0;
}

function openRecordset(sql,omitNoRecords){
	var r=null;
	try{
		if(omitNoRecords==null) omitNoRecords=false;
		r=eBasic.eCreateObject("ADODB.Recordset");
		if(r==null){
			eBasic.eMsgbox("Error al crear objeto ADODB.Recordset");
			return null;
		}		
		//r=Application.Database.OpenRecordset(sql,Application.ADOCnn);
			
		r.ActiveConnection=Application.ADOCnn;
		r.CursorLocation=3;
		r.Source=sql;
		r.Open();
		
		if(r.State!=1) return null;
		
		if (!(r.EOF && r.BOF)){
			return r;
		}else{
			if(omitNoRecords)
				return null;
			else
				return r;
		}
	}catch(e){
		return null;
	}
}