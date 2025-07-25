var ArqueTotal1;
var ArqueTotal2;

/*
	Variables creada para personalizar el Detall de Corte
*/

var cPrintTitle=true;  // Imprimir Encabezado
var DetailsCZ=true; // Imprimir Corte Z
var LineSales=true; // Detalle x Linea
var DepSales=true; 	// Detalle x Departamento
var cDesgIVA =true;  //Desglozar IVA
var cPrintSeller=true; // Imprimir Vendedore;
var cAvSales=true; // Venta Promedio 
var cNoSales=true; // y Número de operaciones
var cVentaXHora=true; //ventas por hora
var cImprimirRecargas = true; //Imprimir totales de venta de Tiempo Aire por compañia

function arqueo(PKCorte){

	var ErrDesc="Error al imprimir arqueo";
	var R;
	var Estado,FA,HA,FC,HC;
	var Cerrado=false;
	var PKCaja=0;
	var S;
	var DivisaPred;
	var FltSaldoI=0;
	var sql;
	
	
	if(PKCorte==null)
	{ 
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)",6);
		return 0;
	}
	
	if(PKCorte==0)
	{ 
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)",6);
		return 0;
	}
	
	GetConfigTicket();

	sql= "SELECT Corte.FApertura, Corte.FCierre, Corte.HApertura, Corte.HCierre, Corte.Cerrado,Caja.Sys_PK AS PKCaja,";
	sql = sql+ "Caja.Codigo AS CodCaja, Caja.Descripcion AS DescCaja, Cajero.Codigo AS CodCajero, Cajero.Nombre AS NombreCajero";
	sql = sql+ " FROM Cajero INNER JOIN (Caja INNER JOIN Corte ON Caja.Sys_PK = Corte.ICaja) ON Cajero.Sys_PK = Corte.ICajero ";
	sql = sql+ " WHERE Corte.Sys_PK=" + PKCorte ;
	
	if(PKCorte>0){
		
		R = pos_support.OpenRecordset(sql,Application.ADOCnn);
		if(R==null)
		{
			eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los datos del corte)",6);
			return 0;
		}
		
		if(!R("Cerrado").Value)
		{
			Estado="ABIERTO";
			Cerrado=false;
		}else{
			Estado="CERRADO";				
			Cerrado=true;
		}
		
		FA=R("FApertura").Value;
		FC=R("FCierre").Value;
		HA=R("HApertura").Value;
		HC=R("HCierre").Value;
		
		PKCaja=R("PKCaja").Value;
	}else{
		eBasic.eMsgbox(ErrDesc + "(No se pudo acceder al corte)",6);
		return 0;
	}
	
	
	pos_support.ConfigImpresora();
	
	
	if (Cerrado)
		Impresora.Texto(Impresora.AligTextInStr("- CORTE DE CAJA -",30,2," "));
	else
		Impresora.Texto(Impresora.AligTextInStr("- ARQUEO DE CAJA -",30,2," "));
		
	
	Impresora.Texto(" ");
	Impresora.Texto(Impresora.SetChr(30,"="))
	
	//Imprimir Titulo
	if (cPrintTitle) ImprimirEncabezado();
		
	Impresora.Texto(" ");
		
	// ********************	
		
	Impresora.Texto("CORTE #:" + PKCorte + " " + Estado);
	Impresora.Texto("DEL:" + pos_support.Fecha(FA) + "  " + pos_support.Hora(HA));
	
	if(Cerrado)
		Impresora.Texto("AL :" + pos_support.Fecha(FC) + "  " + pos_support.Hora(HC));
	else
		Impresora.Texto("AL :" + pos_support.Fecha() + "  " + pos_support.Hora());
		
	S="CAJA: " + R("CodCaja").Value + " " + R("DescCaja").Value;
	S=Impresora.AligTextInStr(S,30,0," ");
	Impresora.Texto(S);
	
	S= "CAJERO: " + R("CodCajero").Value + " " + R("NombreCajero").Value;
	S=Impresora.AligTextInStr(S,30,0," ");
	Impresora.Texto(S);
	
	Impresora.Texto( pos_support.Fecha() + "  " + pos_support.Hora());	
	S= Impresora.SetChr(30,"=");
	Impresora.Texto(S);
	
	if (ImprimirTicketsDelCorte(PKCorte,ErrDesc)==0)
		return 0;
	
	DivisaPred=0;
	
	DivisaPred=AppVars.GetTextVar("FXCA013",0);
	
	sql = "SELECT DISTINCT Divisa.Descripcion,MovCaja.IDivisa, MovCaja.TipoCambio";
	sql = sql + " FROM Divisa INNER JOIN MovCaja ON Divisa.Sys_PK = MovCaja.IDivisa";
	sql = sql + " WHERE MovCaja.ICorte=" + PKCorte + " GROUP BY Divisa.Descripcion,MovCaja.IDivisa,MovCaja.TipoCambio;";
	
	
	R = pos_support.OpenRecordset(sql,Application.Adocnn);
	
	
	if(R==null)
	{
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron divisas del corte)");
		return 0;
	}
	
	while(!R.EOF)
	{
		S= Impresora.SetChr(30,"-");
		Impresora.Texto(S);		
		S=Impresora.AligTextInStr(R("Descripcion").Value,30,0," ");	//DIVISA
		Impresora.Texto(S);
		S= Impresora.SetChr(30,"-");
		Impresora.Texto(S);
		Impresora.Texto("");
		
		ArqueTotal1=null;
		ArqueTotal2=null;
		
		S=Impresora.AligTextInStr("- INGRESOS -",30,2," ");
		Impresora.Texto(S);
		Impresora.Texto("");
		FltSaldoI=0;
		FltSaldoI=SaldoInicial(PKCorte,PKCaja,R("IDivisa").Value,ErrDesc);
		Impresora.Texto("");
		
		if (ImprimirIngresosXCategoria(PKCorte,PKCaja,R("IDivisa").Value,R("TipoCambio").Value,DivisaPred,ErrDesc)==0)
			return 0;
		Impresora.Texto("");
		
		if (ImprimirIngresosXFormaPago(PKCorte,R("IDivisa").Value,R("TipoCambio").Value,DivisaPred,ErrDesc)==0)
			return 0;
		Impresora.Texto("");

		S=Impresora.AligTextInStr("- EGRESOS -",30,2," ");
		Impresora.Texto(S);
		Impresora.Texto("");	
		
		if (ImprimirEgresosXCategoria(PKCorte,PKCaja,R("IDivisa").Value,R("TipoCambio").Value,DivisaPred,ErrDesc)==0)
			return 0;		
		
		Impresora.Texto("");
		S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		Impresora.Texto(S);
		S=Impresora.AligTextInStr(" TOTAL NETO",16,0," ");
		//ArqueTotal2 son egresos y estan en negativo
		S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(FltSaldoI+ArqueTotal1+ArqueTotal2),14,1," ");		
		Impresora.Texto(S);		
				
		Impresora.Texto("");
		R.MoveNext();
	}
	R.Close();
	
		
	// BY JFrank -> 03 Sept 09 - Validar si se desea imprimir facturas
	if(ImprimirFacturasDelCorte(PKCorte,ErrDesc)==0)
		return 0;
	
	/*****************
		BY Jfrank -> 02 Sept 09
		Imprimir Detalle de Ticket (Corte Z)
	*/
	
	
	if (DetailsCZ) ImprimirCorteZ(PKCorte);		
	
	if (LineSales) ImprimirDLineas(PKCorte);
	
	if(DepSales) ImprimirDDepartamentos(PKCorte);
	
	if (cPrintSeller) ImprimirDVendedores(PKCorte);
	
	if (cAvSales || cNoSales) ImprimirVNTPromedioOper(PKCorte);
	
	if (cDesgIVA) ImprimirDesgloseIVA(PKCorte);
	
	//falta agregar configuracion en POS
	//ImprimirAbono(PKCorte, ErrDesc); // 26/01/2010
	
	if(cVentaXHora) ImprimirVentasxHora(PKCorte, ErrDesc);//26/06/2012
	if(cImprimirRecargas) ImprimirRecargasTAE(PKCorte);//11/02/2013
	
	ImprimirBoletos(PKCorte);
	
	Impresora.Terminar();
}

function ImprimirDLineas(PKCorte){

var cStr="";
var sql="";
var R;
var R2;
var sDetalle;
var TotalDetalle;
var sql2="";

		Impresora.Texto("");
		cStr=Impresora.AligTextInStr("- LINEAS -",30,2," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
	
	//jv 17/07/2013 - cambio de consulta para tomar en cuenta devoluciones parciales		
	//sql = "Select Linea.Descripcion as Linea,Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) as Monto FROM  (DVenta INNER JOIN (PRODUCTO INNER JOIN Linea ON Producto.ILinea=Linea.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Producto.Ilinea<>60 AND Producto.Ilinea<>61 AND Venta.ICorte =" + PKCorte + " Group BY Linea.Descripcion";
	sql = "Select Linea.Descripcion as Linea,(Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4)) - isnull((Sum((x.Cantidad * x.Precio)-x.Descuentos + x.Impuestos)),0) as Monto FROM ((DVenta INNER JOIN (PRODUCTO INNER JOIN Linea ON Producto.ILinea=Linea.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK) left join  qryDevVentasTicket x on Venta.Sys_PK = x.VentaOrigen and Producto.Sys_PK = x.PKProducto Where (Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Producto.Ilinea<>60 AND Producto.Ilinea<>61 AND Venta.ICorte =" + PKCorte + ") Group BY Linea.Descripcion";
	//sql = "Select Linea.Descripcion as Linea,Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) as Monto FROM  (DVenta INNER JOIN (PRODUCTO INNER JOIN Linea ON Producto.ILinea=Linea.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " Group BY Linea.Descripcion";
	sql2 = "Select Linea.Descripcion as Linea,Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) as Monto FROM  (DVenta INNER JOIN (PRODUCTO INNER JOIN Linea ON Producto.ILinea=Linea.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK Where  Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND (Producto.Ilinea=60 OR Producto.Ilinea=61)  AND Venta.ICorte =" + PKCorte + " Group BY Linea.Descripcion";
	
	R=ThisCnn.execute(sql);
	R2=ThisCnn.execute(sql2);

	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los productos del corte)");
		return 0;
	}
		TotalDetalle=0;
		while(!R.EOF){
			sDetalle ="";
			cStr="";
			
			cStr = R("Linea").Value;
			cStr = Impresora.AligTextInStr(cStr,16,0," ");
			sDetalle = cStr;	
					
			cStr = Impresora.FormatoDinero(R("Monto").Value);
			cStr = Impresora.AligTextInStr(cStr,14,1," ");
			sDetalle=sDetalle+cStr;
			
			TotalDetalle= TotalDetalle +  R("Monto").Value;
			Impresora.Texto (sDetalle);
		//***************
		R.MoveNext();
	
		}
	
		// Total de LInea
		cStr=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		Impresora.Texto(cStr);
		
		cStr=Impresora.AligTextInStr(" TOTAL: ",12,0," ");
		cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(TotalDetalle),18,1," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");

	

Impresora.Texto("");
		cStr=Impresora.AligTextInStr("- LINEAS TARJETAS Y RECARGAS -",30,2," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
	
	if(R2==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los productos del corte)");
		return 0;
	}
		TotalDetalle=0;
		while(!R2.EOF){
			sDetalle ="";
			cStr="";
			
			cStr = R2("Linea").Value;
			cStr = Impresora.AligTextInStr(cStr,16,0," ");
			sDetalle = cStr;	
					
			cStr = Impresora.FormatoDinero(R2("Monto").Value);
			cStr = Impresora.AligTextInStr(cStr,14,1," ");
			sDetalle=sDetalle+cStr;
			
			TotalDetalle= TotalDetalle +  R2("Monto").Value;
			Impresora.Texto (sDetalle);
		//***************
		R2.MoveNext();
	
		}
	
		// Total de LInea
		cStr=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		Impresora.Texto(cStr);
		
		cStr=Impresora.AligTextInStr(" TOTAL: ",12,0," ");
		cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(TotalDetalle),18,1," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
}

function ImprimirDDepartamentos(PKCorte){

var cStr="";
var sql="";
var R;
var sDetalle;
var TotalDetalle;


	     cStr=Impresora.AligTextInStr("- DEPARTAMENTOS -",30,2," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
		
		//jv 17/07/2013 - cambio de consulta para tomar en cuenta descuentos parciales
		//sql="Select Departamento.Descripcion as Departamento,Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) as Monto FROM  (DVenta INNER JOIN (PRODUCTO LEFT JOIN Departamento ON Producto.IDepartamento=Departamento.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " Group BY Departamento.Descripcion Order BY Departamento.Descripcion DESC";
		sql="Select Departamento.Descripcion as Departamento,Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) - isnull(Sum((z.Precio*z.cantidad)-z.Descuentos+z.Impuestos),0) as Monto FROM  ((DVenta INNER JOIN (PRODUCTO LEFT JOIN Departamento ON Producto.IDepartamento=Departamento.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK) left join qryDevVentasTicket z on Venta.Sys_PK = z.VentaOrigen and Producto.Sys_PK = z.PKProducto Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " Group BY Departamento.Descripcion Order BY Departamento.Descripcion DESC";
		
	R=ThisCnn.execute(sql);

	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los departamentos del corte)");
		return 0;
	}
		TotalDetalle=0;
		while(!R.EOF){
			sDetalle ="";
			cStr="";
			
			cStr = R("Departamento").Value;
			if (R("Departamento").Value==null) cStr="NO CLASIFICADOS";
			cStr = Impresora.AligTextInStr(cStr,16,0," ");
					
			sDetalle = cStr;	
			cStr = Impresora.FormatoDinero(R("Monto").Value);
			cStr = Impresora.AligTextInStr(cStr,14,1," ");
			sDetalle=sDetalle+cStr;
			
			TotalDetalle= TotalDetalle +  R("Monto").Value;
			Impresora.Texto (sDetalle);
		//***************
		R.MoveNext();
	
		}
	
		// Total de DEpartamento
		cStr=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		Impresora.Texto(cStr);
		
		cStr=Impresora.AligTextInStr(" TOTAL: ",12,0," ");
		cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(TotalDetalle),18,1," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
	
}

function ImprimirDVendedores(PKCorte){

var cStr="";
var sql="";
var R;
var sDetalle;
var TotalDetalle;

		cStr=Impresora.AligTextInStr("- VENDEDORES -",30,2," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
		
		//17/04/2013 - cambio de consulta para tomar en cuenta devoluciones
		//sql="Select Agente.Nombre as Agente, Sum(Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS MONTO,COUNT(*) as TVentas FROM Venta LEFT JOIN Agente ON Venta.Iagente=Agente.Sys_PK WHERE Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte=" + PKCorte + " GROUP BY Agente.Nombre;"
		sql="Select z.Agente, sum(z.Monto) as MONTO, COUNT(*) as TVentas from qryTicketDVendedores z where z.ICorte =" + PKCorte + " GROUP BY z.Agente";

	R=ThisCnn.execute(sql);

	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los vendedores del corte)");
		return 0;
	}
		TotalDetalle=0;
		while(!R.EOF){
			sDetalle ="";
			cStr="";
			
			cStr = R("Agente").Value;
			if (R("Agente").Value==null) cStr="VENDEDOR NO ASIGNADO";
			cStr = Impresora.AligTextInStr(cStr,30,0," ");
			Impresora.Texto(cStr);		
			
			cStr =  R("TVentas").Value;
			cStr = Impresora.AligTextInStr(cStr,13,1," ");
			sDetalle=cStr;
			
			cStr = "VNT";
			cStr = Impresora.AligTextInStr(cStr,5,1," ");
			sDetalle=sDetalle+cStr;
					
			cStr = Impresora.FormatoDinero(R("Monto").Value);
			cStr = Impresora.AligTextInStr(cStr,12,1," ");
			sDetalle=sDetalle+cStr;
			
			TotalDetalle= TotalDetalle +  R("Monto").Value;
			Impresora.Texto (sDetalle);
		//***************
		R.MoveNext();
	
		}
	
		// Total de Vendedores
		cStr=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		Impresora.Texto(cStr);
		
		cStr=Impresora.AligTextInStr(" TOTAL: ",12,0," ");
		cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(TotalDetalle),18,1," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
}

function ImprimirDesgloseIVA(PKCorte){

var cStr="";
var sqli="";
var sqlE="";
var sql0="";
var sqlt="";
var R;
var RE;
var R0;
var RT;
var SubTotal=0;
var Impuesto=0;
var ImpuestoE=0;
var Impuesto0=0;
var ImpuestoT=0;
var Total=0;
var ImpuestoTasa16=0;
var Datos0=0;
var SubTotalIVA=0;
var ImpuestoTasa16Tarjetas=0;

	

	cStr=Impresora.AligTextInStr("== DESGLOSE DE IMPUESTOS ==",30,2," ");		
	Impresora.Texto(cStr);
	Impresora.Texto("");
	
	
	
	//Modificación para tomar en cuenta devoluciones parciales
	//sqli="Select Sum(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4) AS ProductosIVA, Sum(Dventa.Cantidad*Precio) As ProductosTasa FROM ((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Producto.Ilinea<>60 AND Producto.Ilinea<>61 AND Venta.ICorte =" + PKCorte + " AND Producto.Impuestos=1 "
	sqli="Select Sum(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4) - isnull(Sum(z.Impuestos),0) AS ProductosIVA, Sum(Dventa.Cantidad*Dventa.Precio) - isnull(Sum(z.Cantidad*z.Precio),0) As ProductosTasa FROM (((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK) left join qryDevVentasTicket z on Venta.Sys_PK = z.VentaOrigen and Producto.Sys_PK = z.PKProducto Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Producto.Ilinea<>60 AND Producto.Ilinea<>61 AND Venta.ICorte =" + PKCorte + " AND Producto.Impuestos=1 "
	
	//sql0="Select Sum((Dventa.Cantidad*Precio)+(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4)) AS ProductosIVACero FROM ((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" +PKCorte +  " AND Producto.Impuestos=2";
	sql0="Select Sum((Dventa.Cantidad*Dventa.Precio)+(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4)) - isnull(Sum((z.Cantidad*z.Precio)+(z.Impuestos)),0) AS ProductosIVACero from (((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK) left join qryDevVentasTicket z on Venta.Sys_PK = z.VentaOrigen and Producto.Sys_PK = z.PKProducto Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" +PKCorte + " AND Producto.Impuestos=2";
	
	//sqlE="Select Sum((Dventa.Cantidad*Precio)+(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4)) AS ProductosExento FROM ((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " AND Producto.Impuestos=3 ";
	sqlE="Select Sum((Dventa.Cantidad*Dventa.Precio)+(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4)) - isnull(Sum((z.Cantidad*z.Precio)+(z.Impuestos)),0) AS ProductosExento FROM (((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK) left join qryDevVentasTicket z on Venta.Sys_PK = z.VentaOrigen and Producto.Sys_PK = z.PKProducto Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " AND Producto.Impuestos=3 ";
	
	sqlt="Select Sum(Dventa.Impuesto1+Dventa.Impuesto2+Dventa.Impuesto3+Dventa.Impuesto4) AS ProductosIVATarjetas, Sum(Dventa.Cantidad*Precio) As ProductosTasaTarjetas FROM ((Venta Inner Join Dventa ON Venta.sys_PK=Dventa.FK_Venta_Detalle) Inner Join Producto ON Dventa.Iproducto=Producto.Sys_PK) Inner Join cfgimpuesto ON Producto.Impuestos=Cfgimpuesto.Sys_PK Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND (Producto.Ilinea=60 OR Producto.Ilinea=61) AND Venta.ICorte =" + PKCorte + " AND Producto.Impuestos=1 "

	R=ThisCnn.execute(sqli);
	RE=ThisCnn.execute(sqlE);
	R0=ThisCnn.execute(sql0);
	RT=ThisCnn.execute(sqlt);

	if(RE==null && R==null && R0==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los impuestos del corte)");
		return 0;
	}
	
	
	if (R.EOF && R.BOF && (RE.EOF && RE.BOF) && (R0.EOF && R0.BOF)){			
			eBasic.eMsgbox(ErrDesc +"(No se encontró el corte indicado con clave"+ PKCorte +")",6);
			return 0;
	}
	
	//SubTotal=R("Subtotal").Value;
	Impuesto=R("ProductosIVA").Value;
	ImpuestoTasa16=R("ProductosTasa").Value;
	ImpuestoE=RE("ProductosExento").Value;
	Impuesto0=R0("ProductosIVACero").Value;
	ImpuestoT=RT("ProductosIVATarjetas").Value;
	ImpuestoTasa16Tarjetas=RT("ProductosTasaTarjetas").Value;
	SubTotalIVA=Impuesto+ImpuestoTasa16;
	Total= Impuesto + ImpuestoTasa16 + ImpuestoE + Impuesto0 + ImpuestoTasa16Tarjetas+ImpuestoT;
	
	//cStr=Impresora.AligTextInStr(" SUBTOTAL: ",12,0," ");
	//cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(SubTotal),18,1," ");		
	//Impresora.Texto(cStr);

	cStr=Impresora.AligTextInStr(" Tasa    16 %   : ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(ImpuestoTasa16),12,1," ");		
	Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(" IVA     16 %   : ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(Impuesto),12,1," ");		
	Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(Impresora.SetChr(13,"="),30,1," ");		
	Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(" Total IVA 16 % : ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(SubTotalIVA),12,1," ");		
	Impresora.Texto(cStr);
	
	if(ImpuestoE==null) ImpuestoE=0;
	cStr=Impresora.AligTextInStr(" Tasa     Exento: ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(ImpuestoE),12,1," ");		
	Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(" IVA      Exento: ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(Datos0),12,1," ");		
	Impresora.Texto(cStr);
	
	if(Impuesto0==null) Impuesto0=0;
	cStr=Impresora.AligTextInStr(" Tasa    IVA 0 %: ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(Impuesto0),12,1," ");		
	Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(" IVA         0 %: ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(Datos0),12,1," ");		
	Impresora.Texto(cStr);
	
	
	cStr=Impresora.AligTextInStr(" Tasa IVA T/R 16%: ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(ImpuestoTasa16Tarjetas),12,1," ");		
	Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(" IVA  T/R  16 % : ",18,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(ImpuestoT),12,1," ");		
	Impresora.Texto(cStr);
	
	Impresora.Texto (Impresora.AligTextInStr("=============",30,1," "));
	cStr=Impresora.AligTextInStr(" TOTAL: ",12,0," ");
	cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(Total),18,1," ");		
	Impresora.Texto(cStr);
	Impresora.Texto("");
	
}

function ImprimirVNTPromedioOper(PKCorte){


var cStr="";
var sql="";
var R;
var Count=0;
var Total=0;

	//jv 15/07/2013 - Cambio de consulta para mostrar devoluciones
	//sql="Select Count(*) As Operaciones,SUM(Subtotal-Descuento1-Descuento2 + Impuesto1+Impuesto2+Impuesto3+Impuesto4) as Total FROM Venta Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte;
	sql = "Select Count(z.Sys_PK) as Operaciones, SUM(z.total) as Total from qryTicketVNTPromedioOper z where z.icorte = " + PKCorte;
	//cAvSales
	//cNoSales
	if (cAvSales && cNoSales){
		cStr=Impresora.AligTextInStr("=VNT PROMEDIO/No. OPERACIONES=",30,2," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
	}
	else{
	
		cStr=Impresora.AligTextInStr(Impresora.SetChr(30,"-"),30,1," ");		
		Impresora.Texto(cStr);
	}
	
	
	R=ThisCnn.execute(sql);

	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron las ventas del corte)");
		return 0;
	}
	
	
	if (R.EOF && R.BOF){			
			eBasic.eMsgbox(ErrDesc +"(No se encontró el corte indicado con clave"+ PKCorte +")",6);
			return 0;
	}
	
	
	Total=R("Total").Value;
	Count=R("Operaciones").Value;
	
	
	
	Total = Total/Count;
	Total = Impresora.Redondear(Total,2);
	
	
	if (cAvSales){
		cStr=Impresora.AligTextInStr("VENTA PROMEDIO: ",16,0," ");
		cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(Total),14,1," ");		
		Impresora.Texto(cStr);
		Impresora.Texto(" ");
	}
	
	if (cNoSales){
		cStr=Impresora.AligTextInStr("No. OPERACIONES: ",16,0," ");
		cStr=cStr+Impresora.AligTextInStr(Count,14,1," ");		
		Impresora.Texto(cStr)
		Impresora.Texto(" ");;
	}

}

function ImprimirCorteZ(PKCorte){
// by JFrank -> 03 Sept 09
var sql;
var R;
var sDetalle;
var cStr;

var SumTotal;
var Impuestos;
var SubTotal;
var TotalDetalle;
var SumTotalProductos;
var TotalDetalleProducto;

//jv 15/07/2013
//Cambio de consulta para reconocer devoluciones
sql="Select Producto.Descripcion as Descripcion,DVenta.TipoCambio,DVenta.Unidad,Sum(DVenta.Cantidad) as TVentas,Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) as Monto  FROM  (DVenta INNER JOIN Producto ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK  Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " Group BY Producto.Descripcion,DVenta.TipoCambio,DVenta.Unidad";
//sql="Select Producto.Descripcion as Descripcion,DVenta.TipoCambio,DVenta.Unidad,((Sum(DVenta.Cantidad)) - isnull((Sum(z.Cantidad)),0))as TVentas, ((Sum((DVenta.Precio*DVenta.cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4)) - isnull((Sum((z.Cantidad * z.Precio)- z.Descuentos+z.Impuestos)),0)) as Monto  FROM  ((DVenta INNER JOIN Producto ON DVenta.IProducto=Producto.Sys_PK) INNER JOIN  VENTA ON DVenta.FK_Venta_Detalle=Venta.Sys_PK) left join qryDevVentasTicket z on Venta.Sys_PK = z.VentaOrigen and DVenta.IProducto = z.PKProducto Where Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte =" + PKCorte + " Group BY Producto.Descripcion,DVenta.TipoCambio,DVenta.Unidad order by Producto.Descripcion";

R=ThisCnn.execute(sql);

	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los productos del corte)");
		return 0;
	}

	SumTotal=0;
	SumTotalProductos=0;
	Impresora.Texto("");
	cStr= Impresora.SetChr(30,"-");
	Impresora.Texto(cStr);
	Impresora.Texto(Impresora.AligTextInStr("- DETALLE DE CORTE -",30,2," ") );
	cStr= Impresora.SetChr(30,"-");
	Impresora.Texto(cStr);
	
	// Imprimir detalle de Productos.
	//************************************************
	TotalDetalle=0;
	TotalDetalleProducto=0;
	while(!R.EOF){
		sDetalle ="";
		cStr="";
		
		cStr = R("Descripcion").Value;
		cStr = Impresora.AligTextInStr(cStr,30,0," ");
		Impresora.Texto(cStr);		
		
		cStr =  R("TVentas").Value;
		cStr = Impresora.AligTextInStr(cStr,13,1," ");
		sDetalle=cStr;
		
		cStr = R("Unidad").Value+"";
		cStr = Impresora.AligTextInStr(cStr,5,1," ");
		sDetalle=sDetalle+cStr;
		
		cStr = Impresora.FormatoDinero(R("Monto").Value);
		cStr = Impresora.AligTextInStr(cStr,12,1," ");
		sDetalle=sDetalle+cStr;
		
		SumTotalProductos = SumTotalProductos + R("TVentas").Value;
		TotalDetalleProducto= TotalDetalleProducto +  R("TVentas").Value;
		
		SumTotal = SumTotal + R("Monto").Value;
		TotalDetalle= TotalDetalle +  R("Monto").Value;
		Impresora.Texto (sDetalle);
		//***************
		R.MoveNext();
	}
	
	// Imprimir Total de Productos
	cStr=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		Impresora.Texto(cStr);
	
	cStr=Impresora.AligTextInStr(" TOTALES: ",10,0," ");
		cStr=cStr+Impresora.AligTextInStr(TotalDetalleProducto,3,1," ");		
		//Impresora.Texto(cStr);
		cStr=cStr+Impresora.AligTextInStr(Impresora.FormatoDinero(TotalDetalle),17,1," ");		
		Impresora.Texto(cStr);
		Impresora.Texto("");
		
		
		// Imprimir Total de Productos vendidos
	//cStr=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");		
		//Impresora.Texto(cStr);
	
	//cStr=Impresora.AligTextInStr(" TOTAL P: ",12,0," ");
		//cStr=cStr+Impresora.AligTextInStr(TotalDetalleProducto,5,1," ");		
		//Impresora.Texto(cStr);
				
}

function ImprimirFacturasDelCorte(PKCorte,ErrDesc){
	var R;	
	var S;	
	var Facturado=0;	
	var XFacturar=0;
	var sImporte;
	var Val=0;
	var sql ;
	
	if(ErrDesc==null)
		ErrDesc="";
	
	//sql = "SELECT Venta.Referencia,Venta.StatusFacturacion,((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) AS Total ";
	//sql = sql + " FROM Venta WHERE Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte="+PKCorte;
	//sql = sql + " ORDER BY Venta.Sys_PK";
	
	/*Javier 15/07/2013 - Corrección para tomar en cuenta las devoluciones.*/
	sql = "SELECT Venta.Referencia,Venta.StatusFacturacion,((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) - isnull(sum((z.Subtotal-z.Descuentos)+z.Impuestos),0) AS Total ";
	sql = sql + " FROM Venta left join qryDevVentasTicketDetalle z on Venta.Sys_PK = z.VentaOrigen WHERE Venta.Documento=6 AND Venta.StatusAdministrativo=3 AND Venta.ICorte="+PKCorte;
	sql = sql + " GROUP BY Venta.Sys_PK, Venta.Referencia, Venta.FormaPago,Venta.StatusFacturacion,Venta.StatusAdministrativo, ((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) ORDER BY Venta.Sys_PK";
	R=pos_support.OpenRecordset(sql,Application.Adocnn);
	
	if(R==null)
	{
		eBasic.eMsgbox(ErrDesc + "(No se pudieron obtener las ventas facturadas del corte indicado)");
		return 0;
	}
	
	S=Impresora.AligTextInStr("- FACTURAS -",30,2," ");		
	Impresora.Texto(S);
	Facturado=0;
	XFacturar=0;
	
	while(!R.EOF)
	{		
		Val=Impresora.Redondear(R("Total").Value);
		if(R("StatusFacturacion").Value==3){
			S=Impresora.AligTextInStr(R("Referencia").Value,16,0," ");			
			sImporte=Impresora.FormatoDinero(Val);
			sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
			Impresora.Texto(S+sImporte);
			Facturado=Facturado+Val;
		}else{
			XFacturar=XFacturar+Val;
		}
		R.MoveNext();
	}
	R.Close();
	//TOTAL	
	//S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
	//Impresora.Texto(S);
	S=Impresora.AligTextInStr("FACTURADO",16,0," ");
	sImporte=Impresora.FormatoDinero(Facturado);
	S=S+Impresora.AligTextInStr(sImporte,14,1," "); //se suma un espacio al total para que coincida con los datos anterios donde se coloco F o C
	Impresora.Texto(S);	
		
	//POR FACTURAR
	S=Impresora.AligTextInStr("POR FACTURAR",16,0," ");
	sImporte=Impresora.FormatoDinero(XFacturar);
	S=S+Impresora.AligTextInStr(sImporte,14,1," ");		
	Impresora.Texto(S);
	S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
	Impresora.Texto(S);
	//TOTAL
	S=Impresora.AligTextInStr("TOTAL",16,0," ");
	sImporte=Impresora.FormatoDinero(Facturado+XFacturar);
	S=S+Impresora.AligTextInStr(sImporte,14,1," ");
	Impresora.Texto(S);
	Impresora.Texto("");
	
	return -1;
}

function SaldoInicial(PKCorte,PKCaja,Divisa,ErrDesc){
	//SALDO INICIAL
	var R;
	var S;
	var sImporte;
	var Saldo=0;
	var sql;
	if(ErrDesc==null)
		ErrDesc="";
	sql = "SELECT SUM(MovCaja.Cheques+MovCaja.Depositos+MovCaja.Efectivo+MovCaja.Tarjetas+MovCaja.Vales) AS Saldo ";
	sql = sql + " FROM Corte INNER JOIN MovCaja ON Corte.Sys_PK = MovCaja.ICorte WHERE MovCaja.ICorte<" +PKCorte ; 
	sql = sql + " AND Corte.ICaja=" + PKCaja + " AND MovCaja.IDivisa=" + Divisa + ";";
	
	R=pos_support.OpenRecordset(sql,Application.AdoCnn);
	
	if(R==null)
	{
		eBasic.eMsgbox(ErrDesc + "(Error al obtener saldo inicial del corte)");
		return 0;
	}
	
	Saldo=0;
					
	S=Impresora.AligTextInStr(" SALDO INICIAL",16,0," ");
	if(R("Saldo").Value==null)
	{
		sImporte=Impresora.FormatoDinero(0);
	}else
	{
		Saldo=Impresora.Redondear(R("Saldo").Value);
		sImporte=Impresora.FormatoDinero(Saldo);
	}
	
	sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
	Impresora.Texto(S+sImporte);		
	
	R.Close();
	
	return Saldo;
	
}

function ImprimirIngresosXCategoria(PKCorte,PKCaja,Divisa,TCambio,DivisaPred,ErrDesc){
	var SQL;
	SQL="SELECT Categoria.Descripcion AS MovCategoria, SUM(MovCaja.Cheques+MovCaja.Depositos+MovCaja.Efectivo+ MovCaja.Tarjetas + MovCaja.Vales) AS Total FROM Categoria INNER JOIN MovCaja ON Categoria.Sys_PK = MovCaja.ICategoria WHERE MovCaja.ICorte=" + PKCorte + " AND MovCaja.IDivisa=" + Divisa + " AND (MovCaja.Cheques>=0 AND  MovCaja.Depositos>=0 AND MovCaja.Efectivo>=0 AND MovCaja.Tarjetas>=0 AND MovCaja.Vales>=0) GROUP BY Categoria.Descripcion;";
	return IngresosEgresosXCartegoria(SQL,PKCorte,PKCaja,Divisa,TCambio,DivisaPred,ErrDesc+"(Error al obtener ingresos del corte)"); 
}

function IngresosEgresosXCartegoria(SQL,PKCorte,PKCaja,Divisa,TCambio,DivisaPred,ErrDesc){
 	var R;	
	var S;
	var sImporte;
	var SumTotal=0;
	var Val=0;
	
	if(ErrDesc==null)
		ErrDesc="";
		
	R=ThisCnn.execute(SQL);
	if(R==null){
		eBasic.eMsgbox(ErrDesc,6);
		return 0;
	}
	
	//DETALLE DE INGRESOS POR CATEGORIA
	SumTotal=0;
	while(!R.EOF){		
		S=Impresora.AligTextInStr(" "+R("MovCategoria").Value,16,0," ");
		Val=Impresora.Redondear(R("Total").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		SumTotal=SumTotal+Val;
		R.MoveNext();
	}
	R.Close();
	S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
	Impresora.Texto(S);
	//TOTAL	
	S=Impresora.AligTextInStr(" TOTAL",16,0," ");
	sImporte=Impresora.FormatoDinero(SumTotal);
	sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
	Impresora.Texto(S+sImporte);
	//SI NO ES DIVISA PREDETERMINADA MULTIPLICAR POR TIPO DE CAMBIO
	if(Divisa!=DivisaPred){
		S=Impresora.AligTextInStr(" X TCambio",16,1," ");
		sImporte=Impresora.FormatoDinero(TCambio);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//SUMATORIA
		S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
		Impresora.Texto(S);
		S=Impresora.AligTextInStr(" TOTAL",16,0," ");		
		sImporte=Impresora.FormatoDinero(Impresora.Redondear(SumTotal*TCambio));
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		
		if(ArqueTotal1==null)	
			ArqueTotal1=Impresora.Redondear(SumTotal*TCambio); //PRIMERO INGRESOS
		else
			ArqueTotal2=Impresora.Redondear(SumTotal*TCambio); //SEGUNDA LLAMASA EGRESOS		
	}else{
		if(ArqueTotal1==null)	
			ArqueTotal1=Impresora.Redondear(SumTotal*TCambio); //PRIMERO INGRESOS
		else
			ArqueTotal2=Impresora.Redondear(SumTotal*TCambio); //SEGUNDA LLAMASA EGRESOS		
	} 
		
	return -1;
}

function ImprimirEgresosXCategoria(PKCorte,PKCaja,Divisa,TCambio,DivisaPred,ErrDesc){
	var SQL;
	SQL="SELECT Categoria.Descripcion AS MovCategoria, SUM(MovCaja.Cheques+MovCaja.Depositos+MovCaja.Efectivo+ MovCaja.Tarjetas + MovCaja.Vales) AS Total FROM Categoria INNER JOIN MovCaja ON Categoria.Sys_PK = MovCaja.ICategoria WHERE MovCaja.ICorte=" + PKCorte + " AND MovCaja.IDivisa=" + Divisa + " AND (MovCaja.Cheques<=0 AND  MovCaja.Depositos<=0 AND MovCaja.Efectivo<=0 AND MovCaja.Tarjetas<=0 AND MovCaja.Vales<=0) GROUP BY Categoria.Descripcion;";
	return IngresosEgresosXCartegoria(SQL,PKCorte,PKCaja,Divisa,TCambio,DivisaPred,ErrDesc+"(Error al obtener egresos del corte)");
}

function ImprimirIngresosXFormaPago(PKCorte,Divisa,TCambio,DivisaPred,ErrDesc){
	var R;
	var S;
	var sImporte;
	var SumTotal=0;
	var Val=0;
	
	if(ErrDesc==null)
		ErrDesc="";
	
	R=ThisCnn.execute("SELECT SUM(MovCaja.Cheques) AS Cheques, SUM(MovCaja.Depositos) AS Depositos, SUM(MovCaja.Efectivo) AS Efectivo, SUM(MovCaja.Tarjetas) AS Tarjetas, SUM( MovCaja.Vales) AS Vales FROM MovCaja WHERE MovCaja.ICorte="+PKCorte+" AND MovCaja.IDivisa="+Divisa+" AND (MovCaja.Cheques>=0 AND  MovCaja.Depositos>=0 AND MovCaja.Efectivo>=0 AND MovCaja.Tarjetas>=0 AND MovCaja.Vales>=0);");
	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Error al obtener ingresos por tipo del corte)");
		return 0;
	}
			
	//DETALLE DE INGRESOS POR FORMA DE PAGO
	SumTotal=0;
	if(!(R.EOF && R.BOF)){
		//EFECTIVO
		S=Impresora.AligTextInStr(" BILLETES",16,0," ");
		Val=Impresora.Redondear(R("Efectivo").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//TARJETAS
		S=Impresora.AligTextInStr(" TARJETAS",16,0," ");
		Val=Impresora.Redondear(R("Tarjetas").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//CHEQUES
		S=Impresora.AligTextInStr(" CHEQUES",16,0," ");
		Val=Impresora.Redondear(R("Cheques").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//DEPOSITOS
		S=Impresora.AligTextInStr(" DEPOSITOS",16,0," ");
		Val=Impresora.Redondear(R("Depositos").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//VALES
		S=Impresora.AligTextInStr(" VALES",16,0," ");
		Val=Impresora.Redondear(R("Vales").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//SUMA TOTAL
		SumTotal=R("Efectivo").Value+R("Tarjetas").Value+R("Cheques").Value+R("Depositos").Value+R("Vales").Value	
		SumTotal=Impresora.Redondear(SumTotal);
	}
	R.Close();
	S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
	Impresora.Texto(S);
	//TOTAL	
	S=Impresora.AligTextInStr(" TOTAL",16,0," ");
	sImporte=Impresora.FormatoDinero(SumTotal);
	sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
	Impresora.Texto(S+sImporte);
	
	//SI NO ES DIVISA PREDETERMINADA MULTIPLICAR POR TIPO DE CAMBIO
	if(Divisa!=DivisaPred){
		S=Impresora.AligTextInStr(" X TCambio",16,1," ");
		sImporte=Impresora.FormatoDinero(TCambio);
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
		//SUMATORIA
		S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
		Impresora.Texto(S);
		S=Impresora.AligTextInStr(" TOTAL",16,0," ");
		sImporte=Impresora.FormatoDinero(Impresora.Redondear(SumTotal*TCambio));
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);
	}
	
}

function GetConfigTicket(){

 // Imprimir Encabezado
if (NodeVars.EGetSetting(RegAppName, "POSVAR", "cPrintTitle", 0)==1) cPrintTitle=true;
else cPrintTitle=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "DetailsCZ", 0)==1) DetailsCZ=true;
else DetailsCZ=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "LineSales", 0)==1) LineSales=true;
else LineSales=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "DepSales", 0)==1) DepSales=true;
else DepSales=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "cDesgIVA", 0)==1) cDesgIVA=true;
else cDesgIVA=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "cPrintSeller", 0)==1) cPrintSeller=true;
else cPrintSeller=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "cAvSales", 0)==1) cAvSales=true;
else cAvSales=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "cNoSales", 0)==1) cNoSales=true;
else cNoSales=false;

if (NodeVars.EGetSetting(RegAppName, "POSVAR", "cVentaXHora", 0)==1) cVentaXHora=true;
else cVentaXHora=false;



}

function ImprimirEncabezado(){
	var stCad="";
	stCad = AppVars.GetTextVar("FXCA112", "");
	
	if (stCad=="") {
		Impresora.Texto(Impresora.SetChr(30,"=")); //Imprime 30 veces el caracter "-"
		return 0;
	}
	
	//Descomponer la cadena en Lineas.
	stCad = eBasic.ReplaceStrChars(stCad, String.fromCharCode(10), "");
	Impresora.MTexto(stCad,String.fromCharCode(13),30,2);
	Impresora.Texto(" ");
	Impresora.Texto(Impresora.SetChr(30,"=")); //Imprime 30 veces el caracter "-"
	return 0;
	
}

function ImprimirTicketsDelCorte(PKCorte,ErrDesc){
	var R;
	var Contado=0;
	var Credito=0;
	var S;
	var sImporte;
	var Tag;
	var Val=0;
	var sql;
	
	if(ErrDesc==null)
		ErrDesc="";

	//17/07/2013 - cambio de consultas para tomar en cuenta devoluciones
	//sql = "SELECT Venta.Referencia, Venta.FormaPago,Venta.StatusFacturacion,Venta.StatusAdministrativo,";
	//sql = sql + " ((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) AS Total ";
	//sql = sql + " FROM Venta WHERE Venta.Documento=6 AND Venta.ICorte=" + PKCorte + " ORDER BY Venta.Sys_PK";
	
	sql = "SELECT Venta.Referencia, Venta.FormaPago,Venta.StatusFacturacion,Venta.StatusAdministrativo,";
	sql = sql + "((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+Venta.Impuesto4) - isnull(sum(z.Subtotal-z.Descuentos+z.Impuestos),0) AS Total  ";
	sql = sql + " FROM Venta left join qryDevVentasTicketDetalle z on Venta.Sys_PK = z.VentaOrigen WHERE Venta.Documento=6 AND Venta.ICorte=" + PKCorte + " GROUP BY Venta.Sys_PK, Venta.Referencia, Venta.FormaPago,Venta.StatusFacturacion,Venta.StatusAdministrativo, ((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+ Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) ORDER BY Venta.Sys_PK";
	R=pos_support.OpenRecordset(sql,Application.Adocnn);
	
	if(R==null)
	{
		eBasic.eMsgbox(ErrDesc + "(No se pudieron obtener las ventas del corte indicado)");
		return 0;
	}
	
	S=Impresora.AligTextInStr("- VENTAS -",30,2," ");		
	Impresora.Texto(S);
	
	while(!R.EOF){		
		S=Impresora.AligTextInStr(R("Referencia").Value,16,0," ");
		Tag="";
		switch(R("StatusAdministrativo").Value)
		{
			case 1:
				sImporte="-ABIERTO-";break;
			case 2:
				sImporte="-CERRADO-";break;
			case 3:
				Val=Impresora.Redondear(R("Total").Value);						
				sImporte=Impresora.FormatoDinero(Val);
				if(R("StatusFacturacion").Value==3)
				{ //facturado				
					Tag="F";
				}
				switch(R("FormaPago").Value){
					case 1: //Contado
						Contado=Contado+Val;
						if(Tag=="")
							Tag=" ";
						break;
					case 2: //Crédito
						Credito=Credito+Val;
						Tag=Tag+"C";
				}
				sImporte=sImporte+Tag;
				break;
			case 99: 
				sImporte="-CANCELADO-";
		}
					
		sImporte=Impresora.AligTextInStr(sImporte,14,1," ");		
		Impresora.Texto(S+sImporte);				
		R.MoveNext();
	}
	R.Close();
	//TOTAL	
		
	S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
	Impresora.Texto(S);
	
	S=Impresora.AligTextInStr("TOTAL",16,0," ");
	sImporte=Impresora.FormatoDinero(Contado+Credito);
	S=S+Impresora.AligTextInStr(sImporte+" ",14,1," "); //se suma un espacio al total para que coincida con los datos anterios donde se coloco F o C
	Impresora.Texto(S);
	
	//CREDITO
	Impresora.Texto("");
	S=Impresora.AligTextInStr("CRÉDITO",16,0," ");
	sImporte=Impresora.FormatoDinero(Credito);
	S=S+Impresora.AligTextInStr(sImporte,14,1," ");		
	Impresora.Texto(S);
	
	//CONTADO
	S=Impresora.AligTextInStr("CONTADO",16,0," ");
	sImporte=Impresora.FormatoDinero(Contado);
	S=S+Impresora.AligTextInStr(sImporte,14,1," ");		
	Impresora.Texto(S);
	S=Impresora.AligTextInStr(Impresora.SetChr(12,"="),30,1," ");
	Impresora.Texto(S);
	
	//TOTAL
	S=Impresora.AligTextInStr("TOTAL",16,0," ");
	sImporte=Impresora.FormatoDinero(Contado+Credito);
	S=S+Impresora.AligTextInStr(sImporte,14,1," ");
	Impresora.Texto(S);
	Impresora.Texto("");	
	
	return -1;
}

// CREADO: 		18/02/2009 Inicio --> Imprimir Detalle de Abonos
// AGREGADO:	26/01/2010
//********************************************************
function ImprimirAbono(PKCorte, ErrDesc){
	var SQ;
	var R;
	var Val=0;
	var sumAbonos=0;
	var sImporte;
	
	if(ErrDesc==null)
		ErrDesc="";
	
	Impresora.Texto(""); // 18/02/2009 Adal
	Impresora.Texto(Impresora.AligTextInStr("- ABONOS A CLIENTES -",30,2," ")); // 18/02/2009 Adal
	Impresora.Texto(""); // 18/02/2009 Adal
	
	SQ="SELECT DCxC.Referencia AS Referencia, MovCaja.Cheques+MovCaja.Depositos+MovCaja.Efectivo+MovCaja.Tarjetas+MovCaja.Vales AS Abonos, Cliente.Nombre AS Cliente, Categoria.Descripcion AS MovCategoria FROM Categoria INNER JOIN (Cliente INNER JOIN (MovCaja INNER JOIN DCxC ON MovCaja.Sys_PK = DCxC.IMovCaja) ON Cliente.Sys_PK = DCxC.ICliente) ON Categoria.Sys_PK = MovCaja.ICategoria WHERE MovCaja.ICorte=" + PKCorte +";";
	R=ThisCnn.execute(SQ);
	
	if(R==null){
		eBasic.eMsgbox(ErrDesc,6);
		return 0;
	}
	
	sumAbonos=0;
	
	while(!R.EOF){		
		Val=Impresora.Redondear(R("Abonos").Value);
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,21,1," ");		
		sumAbonos+=Val;
		Impresora.Texto (Impresora.AligTextInStr(R("Cliente"),30,0," "));
		//Impresora.Texto( Impresora.AligTextInStr(sImporte,30,1, " "));
		Impresora.Texto( Impresora.AligTextInStr(R("Referencia")+sImporte,30,1, " "));
		R.MoveNext();
	}
	R.Close();
	Impresora.Texto (Impresora.AligTextInStr("=============",30,1," "));
	Impresora.Texto (Impresora.AligTextInStr(Impresora.FormatoDinero(sumAbonos),30,1," "));
	Impresora.Texto("");
}

function ImprimirVentasxHora(PKCorte,ErrDesc){
	var SQ;
	var SQ2;
	var R, R1;
	var R2;
	var Val=0;
	var sumVentas=0;
	var sImporte;
	var str=0;
	var nHour=0;
	var S;
	var Totaldeventas=0;
	var PorcentajeVentas=0;
	var SumCNT=0;
	var Cnt=0;
	
	//jv 18/04/2013 - Variables y obtenciòn de categorias
	var catDevoluciones = NodeVars.EGetSetting("Maxicomercio", "NodeVars", "FXCT115", "0");
	var sql_cat;
	var stWhere = "";
	var catVentas = 0;
	
	sql_cat = "Select VarValue from GlobalVar where VarName = 'FXCA026'";
	R1=ThisCnn.execute(sql_cat);
	
	if(R1!=null)
	{
		catVentas = R1("VarValue").Value;
		R1.Close();
	}
	
	if(catDevoluciones != 0 && catVentas != 0)
		stWhere = " And (ICategoria = " + catDevoluciones + " or ICategoria = " + catVentas + ")";
		
	R1 = null;
	sql_cat = "";
	
	//********************************
	
	if(ErrDesc==null)
		ErrDesc="";
	
	Impresora.Texto(""); 
	Impresora.Texto(Impresora.AligTextInStr("- VENTAS POR HORA -",30,2," ")); 
	Impresora.Texto(""); 
	
	//SQ="SELECT DATEPART(Hh,Movcaja.Sys_TimeStamp) AS Hora, Sum(MovCaja.Cheques+MovCaja.Depositos+MovCaja.Efectivo+MovCaja.Tarjetas+MovCaja.Vales) AS ImpVentas, Count(*) AS CNT FROM MovCaja  WHERE MovCaja.ICorte=" + PKCorte +" Group by DATEPART(Hh,Movcaja.Sys_TimeStamp)";
	SQ="SELECT DATEPART(Hh,Movcaja.Sys_TimeStamp) AS Hora, Sum(MovCaja.Cheques+MovCaja.Depositos+MovCaja.Efectivo+MovCaja.Tarjetas+MovCaja.Vales) AS ImpVentas, Count(*) AS CNT FROM MovCaja  WHERE MovCaja.ICorte=" + PKCorte + stWhere +" Group by DATEPART(Hh,Movcaja.Sys_TimeStamp)";
	
	//SQ2="SELECT Icorte, Sum(Cheques+Depositos+Efectivo+Tarjetas+Vales) AS TotalVentas FROM MovCaja  WHERE  ICorte="+ PKCorte +" Group by ICorte;" 	
	SQ2="SELECT Icorte, Sum(Cheques+Depositos+Efectivo+Tarjetas+Vales) AS TotalVentas FROM MovCaja  WHERE ICorte="+ PKCorte + stWhere + " Group by ICorte;" 	
	
	
	R2=ThisCnn.execute(SQ2);
	R=ThisCnn.execute(SQ);
	
	if(R==null && R2==null){
		eBasic.eMsgbox(ErrDesc,6);
		return 0;
	}
	
	sumVentas=0;
	Totaldeventas=R2("TotalVentas").Value;
	
	while(!R.EOF){		
		Val=Impresora.Redondear(R("ImpVentas").Value);
		Cnt=R("CNT").Value;
		sImporte=Impresora.FormatoDinero(Val);
		sImporte=Impresora.AligTextInStr(sImporte,21,1," ");
		sumVentas+=Val;
		SumCNT=SumCNT+Cnt;
		
		str=(Impresora.AligTextInStr(R("Hora"),30,0," "));
		nHour=eBasic.eFormat(str,"00");
		Impresora.Texto(nHour+":00 "+"- "+nHour+":59");
		
		S=Impresora.AligTextInStr("IMP. VENTAS ",16,0, " ");
		sImporte=Impresora.FormatoDinero(Val);
		S=S+Impresora.AligTextInStr(sImporte,14,1, " ")
		Impresora.Texto(S);
				
		S=Impresora.AligTextInStr("TRANSACCIONES ",16,0, " ");
		S=S+Impresora.AligTextInStr(R("CNT"),14,1, " ");
		Impresora.Texto(S);
		sImporte=Val*100;
		PorcentajeVentas= sImporte/Totaldeventas;
		PorcentajeVentas=Impresora.Redondear(PorcentajeVentas);
		S=Impresora.AligTextInStr("% Ventas ",16,0, " ");
		S=S+Impresora.AligTextInStr((PorcentajeVentas+"%"),14,1, " ");
		Impresora.Texto(S);
		Impresora.Texto("");	
		
		R.MoveNext();
	}
	R.Close();
	Impresora.Texto (Impresora.AligTextInStr("=============",30,1," "));
	S=Impresora.AligTextInStr("TOTAL TRANSACCIONES ",20,0, " ");
	S=S+Impresora.AligTextInStr(SumCNT,10,1, " ");
	Impresora.Texto(S);
	S=Impresora.AligTextInStr("TOTAL VENTAS ",16,0, " ");
	S=S+(Impresora.AligTextInStr(Impresora.FormatoDinero(sumVentas),14,1," "));
	Impresora.Texto(S);
	Impresora.Texto("");	
	
}

//********************************************************
//		RECARGAS TIEMPO AIRE
function ImprimirRecargasTAE(PKCorte){
	Impresora.Texto(Impresora.AligTextInStr("- RECARGAS TAE -",30,2," ")); 
	var R;
	var Total=0;
	/*
	R=ThisCnn.execute("SELECT SUM((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) AS Ventas, ut_TAE_Compania.Descripcion AS Compania FROM Venta INNER JOIN (DVenta INNER JOIN (ut_TAE_Producto INNER JOIN ut_TAE_Compania ON ut_TAE_Producto.ICompania = ut_TAE_Compania.ID) ON ut_TAE_Producto.SKU = DVenta.uf_Recarga_SKU )ON Venta.Sys_PK = DVenta.FK_Venta_Detalle WHERE Venta.ICorte = "+PKCorte+" GROUP BY ut_TAE_Compania.Descripcion ;");
	*/
	R=ThisCnn.execute("SELECT SUM((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) AS Ventas, ut_TAE_Compania.Descripcion AS Compania FROM (Venta INNER JOIN ut_LogRecargas ON ut_LogRecargas.FK_Venta = Venta.Sys_PK) INNER JOIN (ut_TAE_Producto INNER JOIN ut_TAE_Compania ON ut_TAE_Producto.ICompania = ut_TAE_Compania.ID) ON ut_TAE_Producto.SKU = ut_LogRecargas.uf_Recarga_SKU WHERE Venta.ICorte = "+PKCorte+" GROUP BY ut_TAE_Compania.Descripcion ");
	while(!R.EOF){
		S=Impresora.AligTextInStr(R("Compania").Value,16,0, " ");
		Total += R("Ventas").Value
		S=S+(Impresora.AligTextInStr(Impresora.FormatoDinero(R("Ventas").Value),14,1," "));
		Impresora.Texto(S);
		//Impresora.Redondear(R("ImpVentas").Value);
		R.MoveNext();
	}
	Impresora.Texto (Impresora.AligTextInStr("=============",30,1," "));
	S=Impresora.AligTextInStr("TOTAL ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(Total),10,1, " ");
	Impresora.Texto(S);
}

//Boletos cobrados...
function ImprimirBoletos(PKCorte){
	Impresora.Texto("");
	Impresora.Texto(Impresora.AligTextInStr("- Cobro de Estacionamiento -",30,2," "));
	var R;
	var Total=0;
	var sTotal=0;
	var Impuestos=0;
	var NBC= 0;
	var SQLSelect = "SELECT (ut_plumainfo.ID + ut_boleto.folio) AS Boleto, ISNULL(ut_RelVta_Boleto.Importe,0) AS Importe, ISNULL(ut_RelVta_Boleto.Notas,'') AS Notas, ISNULL(ut_Boleto.Cortesia,0) AS Cortesia FROM ut_RelVta_Boleto INNER JOIN (ut_Boleto INNER JOIN ut_PlumaInfo ON ut_Boleto.Emisor = ut_PlumaInfo.Sys_PK) ON ut_RelVta_Boleto.IBoleto = ut_Boleto.Sys_PK WHERE ut_RelVta_Boleto.ICorte = " + PKCorte +";";
	
	R = Application.ADOCnn.Execute(SQLSelect);
	
	while(!R.EOF)
	{
		var Importe = R("Importe").Value;		
		var sd = R("Notas").Value;
		var ImporteSI = (Importe / 1.16);

		
		if(R("Cortesia").Value == 1)
		{
			Importe = 0;
		}
		
		Total += Importe;
		sTotal += ImporteSI;
		Impuestos += (ImporteSI * 0.16);
		
		S=Impresora.AligTextInStr(R("Boleto").Value + " " + sd,16,0," ");
		S=S+(Impresora.AligTextInStr(Impresora.FormatoDinero(Importe),14,1," "));
		Impresora.Texto(S);
		NBC += 1;
		R.MoveNext();
	}
	
	Impresora.Texto (Impresora.AligTextInStr("=============",30,1," "));
	S=Impresora.AligTextInStr("TOTAL ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(Total),10,1, " ");
	Impresora.Texto(S);
	Impresora.Texto(" ");
	Impresora.Texto (Impresora.AligTextInStr("=============",30,1," "));
	S=Impresora.AligTextInStr("SUBTOTAL ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(sTotal),10,1, " ");
	Impresora.Texto(S);
	S=Impresora.AligTextInStr("IMPUESTOS ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(Impuestos),10,1, " ");
	Impresora.Texto(S);
	S=Impresora.AligTextInStr("TOTAL ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(Total),10,1, " ");
	Impresora.Texto(S);
	Impresora.Texto(Impresora.AligTextInStr("- Boletos Cobrados: " + NBC,30,2," "));
	Impresora.Texto(" ");
	Impresora.Texto(" ");
	Impresora.Terminar();
	PrintTotales(PKCorte, sTotal, Impuestos, Total);
}

function PrintTotales(PKCorte, SubTotal, IVA, Total){
	pos_support.ConfigImpresora();
	var S;
	
	//Declaraciones.....
	
	var ErrDesc="Error al imprimir arqueo";
	var R;
	var Estado,FA,HA,FC,HC;
	var Cerrado=false;
	var PKCaja=0;
	var DivisaPred;
	var FltSaldoI=0;
	var sql;
	
	
	if(PKCorte==null)
	{ 
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)",6);
		return 0;
	}
	
	if(PKCorte==0)
	{ 
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)",6);
		return 0;
	}
	
	GetConfigTicket();

	sql= "SELECT Corte.FApertura, Corte.FCierre, Corte.HApertura, Corte.HCierre, Corte.Cerrado,Caja.Sys_PK AS PKCaja,";
	sql = sql+ "Caja.Codigo AS CodCaja, Caja.Descripcion AS DescCaja, Cajero.Codigo AS CodCajero, Cajero.Nombre AS NombreCajero";
	sql = sql+ " FROM Cajero INNER JOIN (Caja INNER JOIN Corte ON Caja.Sys_PK = Corte.ICaja) ON Cajero.Sys_PK = Corte.ICajero ";
	sql = sql+ " WHERE Corte.Sys_PK=" + PKCorte ;
	
	if(PKCorte>0){
		
		R = pos_support.OpenRecordset(sql,Application.ADOCnn);
		if(R==null)
		{
			eBasic.eMsgbox(ErrDesc + "(Error al acceder a la base de datos no se obtuvieron los datos del corte)",6);
			return 0;
		}
		
		if(!R("Cerrado").Value)
		{
			Estado="ABIERTO";
			Cerrado=false;
		}else{
			Estado="CERRADO";				
			Cerrado=true;
		}
		
		FA=R("FApertura").Value;
		FC=R("FCierre").Value;
		HA=R("HApertura").Value;
		HC=R("HCierre").Value;
		
		PKCaja=R("PKCaja").Value;
	}else{
		eBasic.eMsgbox(ErrDesc + "(No se pudo acceder al corte)",6);
		return 0;
	}
		
	
	Impresora.Texto(" ");
	Impresora.Texto(Impresora.SetChr(30,"="))
	Impresora.Texto("DEL:" + pos_support.Fecha(FA) + "  " + pos_support.Hora(HA));
	
	if(Cerrado)
		Impresora.Texto("AL :" + pos_support.Fecha(FC) + "  " + pos_support.Hora(HC));
	else
		Impresora.Texto("AL :" + pos_support.Fecha() + "  " + pos_support.Hora());
		
	S="CAJA: " + R("CodCaja").Value + " " + R("DescCaja").Value;
	S=Impresora.AligTextInStr(S,30,0," ");
	Impresora.Texto(S);
	
	S= "CAJERO: " + R("CodCajero").Value + " " + R("NombreCajero").Value;
	S=Impresora.AligTextInStr(S,30,0," ");
	Impresora.Texto(S);
	
	Impresora.Texto( pos_support.Fecha() + "  " + pos_support.Hora());	
	
	//Declaraciones.....
	
	Impresora.Texto(" ");
	Impresora.Texto("==============================");
	Impresora.Texto(" ");
	Impresora.Texto("- Cobro de Estacionamiento -");
	S=Impresora.AligTextInStr("SUBTOTAL ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(SubTotal),10,1, " ");
	Impresora.Texto(S);
	S=Impresora.AligTextInStr("IMPUESTOS ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(IVA),10,1, " ");
	Impresora.Texto(S);
	S=Impresora.AligTextInStr("TOTAL ",20,0, " ");
	S=S+Impresora.AligTextInStr(Impresora.FormatoDinero(Total),10,1, " ");
	Impresora.Texto(S);
	Impresora.Texto(" ");
	Impresora.Texto("==============================");
	Impresora.Terminar();
}