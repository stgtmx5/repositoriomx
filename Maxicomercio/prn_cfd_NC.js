var FacturaCFD="";
//GlobalVar:
//FXCA102b=Sys_PK de dirección del emisor
//FXCA100=Nombre fiscal del emisor
//FXCA101=RFC del emisor

function ImprimirFactura(PKFactura){
/*
var reporte;
	//reporte=AppVars.GetTextVar("FXCA032",""); //FORMATO NORMAL	
	reporte=cfd.loadTextFromGlobalVar("FXCA303x","$AppReportsPath$\\Ventas\\facturaelectronica.xpd");
	reporte=cfd.uiCFD.ReplaceMacros(reporte,"$AppReportsPath$",cfd.uiCFD.AppReportsPath);
	if(!Impresora.PrintReport(reporte,PKFactura)){
        eBasic.eMsgBox("Error al imprimir factura.");
    }	
*/
}

function ImprimirCFD(PKFactura,sRutaDestino)
{
var sArchivo;
	FacturaCFD="";
	
	if(PKFactura==null) PKFactura=0;
	if(PKFactura==0) return 0;	
	if(sRutaDestino==null) sRutaDestino="";
	if(sRutaDestino=="") return 0;
	
	FacturaCFD="\r\n";
	
	ImprimirEncabezado();
	
	ImprimirPrincipal(PKFactura);
	
	ImprimirDetalle(PKFactura);
	
	ImprimirTotales(PKFactura);
	
	ImprimirPie(PKFactura);	
			
	if(FacturaCFD!=""){
		eBasic.SaveStrToFile(sRutaDestino,FacturaCFD);
		return 1;
	}else{
		return 0;
	}
}

function ImprimirEncabezado(PKFactura)
{
	//INFORMACION DEL EMISOR
	
	var nombre=AppVars.GetTextVar("FXCA100","");
	var rfc=AppVars.GetTextVar("FXCA101","");	
	var pkDom=AppVars.GetTextVar("FXCA102b","");	
	
	var r;
	r=OpenRecordset("SELECT Domicilio.Direccion,Domicilio.Colonia,Domicilio.CodPos,Domicilio.Telefonos,Ciudad.Nombre AS Ciudad,EdoProv.Nombre AS Estado,Pais.Nombre AS Pais FROM Domicilio INNER JOIN (Ciudad INNER JOIN (EdoProv INNER JOIN Pais ON EdoProv.IPais=Pais.Sys_PK) ON Ciudad.Estado=EdoProv.Sys_PK) ON Domicilio.ICiudad=Ciudad.Sys_PK WHERE Domicilio.Sys_PK="+pkDom,Application.AdoCnn);
	if(r==null) return 0;
	
	var dir="";
	var col="";
	var cp="";
	
	if(cfd.direccionDetallada(stringValue(r("Direccion").Value))){
		dir=cfd.direccionDividir(stringValue(r("Direccion").Value),1);//calle 
		dir+= " "+cfd.direccionDividir(stringValue(r("Direccion").Value),2);//no ext
		dir+= " "+cfd.direccionDividir(stringValue(r("Direccion").Value),3);//no int
	}else{
		dir=stringValue(r("Direccion").Value);
	}
	
	col=stringValue(r("Colonia").Value);
	cp=stringValue(r("CodPos").Value);
	if(col!="")	dir+=", Col:"+col;
	if(cp!="")	dir+=" C.P:"+cp;
	
	dir+=", "+stringValue(r("Estado").Value);
	dir+=", "+stringValue(r("Pais").Value)+".";
	
	FacturaCFD += Impresora.getTextMultiLine(nombre,30,2) + "\r\n";
	FacturaCFD += Impresora.getTextMultiLine(dir,30,2) + "\r\n";
	FacturaCFD += Impresora.AligTextInStr("Telefonos: "+stringValue(r("Telefonos").Value),30,2," ") + "\r\n";		
	FacturaCFD += Impresora.AligTextInStr("R.F.C.: " +rfc,30,2," ") + "\r\n";
	
	/*Regimen fiscal*/
	regimen = OpenRecordset("SELECT regimen FROM regimenEmisor");
	Impresora.Texto (Impresora.AligTextInStr("Régimen Fiscal: ",30,0," "));
	while(!Rst.EOF){
		regF="";
		regF = Rst("regimen").Value;
		regF = Impresora.AligTextInStr(cStr,30,0," ");
		FacturaCFD= cStr + "\n";	
	}
	
	FacturaCFD +=Impresora.SetChr(30,"=") + "\r\n";//Imprime 30 veces el caracter "-"	
	
	return -1;	
}


function ImprimirPrincipal(PKFacturaCFD)
{

var rcst;
var descaja="";
var nomcliente="";
var nomcajero="";
var Corte;
var ErrDesc="Error al imprimir ticket";
var Buscar;
var R2;
var sql;



sql ="SELECT Venta.Fecha, Venta.Referencia, Cliente.Nombre AS NombreCliente, Domicilio.Direccion,Domicilio.Colonia, Ciudad.Nombre AS NombreCiudad, Domicilio.CodPos,EdoProv.Nombre AS Estado,Pais.Nombre AS Pais, Cliente.RFC, Venta.uf_FechaCFD FROM ((((Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) INNER JOIN Divisa ON Divisa.Sys_PK = Venta.IDivisa) INNER JOIN (ut_CFD INNER JOIN (ut_CFDFolio INNER JOIN ut_CFDInfo ON ut_CFDFolio.uf_CFDInfo=ut_CFDInfo.Sys_PK) ON ut_CFD.uf_CFDFolio=ut_CFDFolio.Sys_PK) ON Venta.Sys_PK=ut_CFD.uf_IVenta) LEFT JOIN (Domicilio LEFT JOIN (Ciudad LEFT JOIN (EdoProv LEFT JOIN Pais ON EdoProv.IPais=Pais.Sys_PK) ON Ciudad.Estado=EdoProv.Sys_PK) ON Ciudad.Sys_PK = Domicilio.ICiudad) ON Domicilio.Sys_PK = Cliente.Domicilio1) WHERE Venta.Sys_Pk=" + PKFacturaCFD + " AND venta.documento=5;";


	try
	{
	rcst = OpenRecordset(sql,Application.AdoCnn);
	}catch(e){
		eBasic.eMsgbox(ErrDesc+"(Sin acceso a base de datos)");
		return 0;
	}
	
	if (rcst==null){ eBasic.eMsgbox(ErrDesc+"(Sin acceso a base de datos)"); return 0;}

	var dir="";
	if(cfd.direccionDetallada(stringValue(rcst("Direccion").Value))){
		dir=cfd.direccionDividir(stringValue(rcst("Direccion").Value),1);//calle 
		dir+= " "+cfd.direccionDividir(stringValue(rcst("Direccion").Value),2);//no ext
		dir+= " "+cfd.direccionDividir(stringValue(rcst("Direccion").Value),3);//no int
	}else{
		dir=stringValue(rcst("Direccion").Value);
	}
	
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("Fecha:"+stringValue(Fecha(rcst("uf_FechaCFD").Value)),30,0," ") + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("Folio:"+stringValue(rcst("Referencia").Value),30,0," ") + "\r\n\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine("Cliente: " +stringValue(rcst("NombreCliente").Value),30,0) + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine("Dirección: " +dir,30,0) + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine("Colonia: "+stringValue(rcst("Colonia").Value),30,0) + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine("Ciudad: "+stringValue(rcst("NombreCiudad").Value),30,0)+"\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine("Estado: "+stringValue(rcst("Estado").Value)+", "+stringValue(rcst("Pais").Value),30,0) + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("C.P.: " +stringValue(rcst("CodPos").Value),30,0," ") + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("R.F.C.: " +stringValue(rcst("RFC").Value),30,0," ") + "\r\n";
	
	//Imprimir Titulos de columnas
	ImprimirColumnas();
	FacturaCFD = FacturaCFD + "\r\n";
	
}


function ImprimirDetalle(PKFacturaCFD){

var Rst;
var Precio;
var sDetalle; 
var cStr;
var bIva;
var Desc;
var Imp;
var SumPrecio;
var Total=0;
var entero;
var Letras;	
var PrecioTotalXProducto=0;
var DescuentoIncluido;	
var X;
var CantidadProd=0;

	
	//sql = "SELECT SUM(DVenta.Cantidad) AS Cantidad, Producto.Descripcion AS Descripcion, DVenta.Unidad AS Unidad, DVenta.Precio AS Precio FROM (Producto INNER JOIN DVenta ON Producto.Sys_PK = DVenta.IProducto) WHERE DVenta.FK_Venta_Detalle=" + PKFacturaCFD + " GROUP BY Producto.Descripcion, DVenta.Unidad, DVenta.Precio";
	
	sql = "SELECT * FROM qryDatosDetalleFactura WHERE pkvnt=" + PKFacturaCFD;
	
	Rst = OpenRecordset(sql,Application.Adocnn);
	
	if (Rst==null) return 0;
	
	Desc=0;
	Imp=0;
	SumPrecio=0;
	Precio=0;
	
	while(!Rst.EOF)
	{
		
		PrecioTotalXProducto=0;
		CantidadProd=Impresora.Redondear(Rst("Cantidad").Value,4);
		Precio = Rst("Precio").Value;
		
		PrecioTotalXProducto=Precio*CantidadProd;		
		PrecioTotalXProducto=Impresora.Redondear(PrecioTotalXProducto);
			
		sDetalle ="";
		// ************************************************
		cStr="";
		cStr = Rst("Descripcion").Value;
		cStr = Impresora.AligTextInStr(cStr,30,0," ");
		FacturaCFD=FacturaCFD + cStr + "\r\n";
		
		
		cStr = CantidadProd+"";
		cStr = Impresora.AligTextInStr(cStr,13,1," ");
		sDetalle=cStr;
		
		cStr = Rst("Unidad").Value+"";
		cStr = Impresora.AligTextInStr(cStr,5,1," ");
		sDetalle=sDetalle+cStr;
		
		cStr = Rst("NumDocAduana").Value+""; //Num doc aduana
		cStr = Impresora.AligTextInStr(cStr,5,1," ");
		sDetalle=sDetalle+cStr;
		
		cStr = Rst("FechaDocAduana").Value+"";// Fecha doc aduana
		cStr = Impresora.AligTextInStr(cStr,5,1," ");
		sDetalle=sDetalle+cStr;
		
		cStr = Impresora.FormatoDinero(Rst("Precio").Value+"");// Precio U
		cStr = Impresora.AligTextInStr(cStr,5,1," ");
		sDetalle=sDetalle+cStr;
		
		cStr = Impresora.FormatoDinero(PrecioTotalXProducto);
		cStr = Impresora.AligTextInStr(cStr,12,1," ");
		sDetalle=sDetalle+cStr;
		
		FacturaCFD=FacturaCFD + sDetalle + "\r\n";
		
		//************************************************
		
	Rst.MoveNext();
	}
	
	Rst.Close();
	return 0;
}
	
function ImprimirTotales(PKFacturaCFD){
var sql;
var Rst;
var Letras;
var entero;
var Total;
var SubTotal;
var Descuentos;
var IVA;
var CodDivisa;
var DescDivisa;

	//sql = "SELECT Venta.Subtotal, (Venta.Descuento1+Venta.Descuento2) AS Descuentos, (Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Impuestos,((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Total, Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DescDivisa FROM Divisa INNER JOIN (Ciudad RIGHT JOIN (Domicilio RIGHT JOIN (Cliente INNER JOIN (Venta INNER JOIN (ut_CFD INNER JOIN (ut_CFDFolio INNER JOIN ut_CFDInfo ON ut_CFDFolio.uf_CFDInfo=ut_CFDInfo.Sys_PK) ON ut_CFD.uf_CFDFolio=ut_CFDFolio.Sys_PK) ON Venta.Sys_PK=ut_CFD.uf_IVenta) ON Cliente.Sys_PK = Venta.ICliente) ON Domicilio.Sys_PK = Cliente.Domicilio1) ON Ciudad.Sys_PK = Domicilio.ICiudad) ON Divisa.Sys_PK = Venta.IDivisa WHERE Venta.Sys_Pk=" + PKFacturaCFD + " AND venta.documento=4;";
	
	sql = "SELECT Venta.Subtotal, (Venta.Descuento1+Venta.Descuento2) AS Descuentos, (Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Impuestos,((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Total, Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DescDivisa,  venta.xmlFormaPago AS fpContraprestacion, venta.xmlCondicionesPago AS condicionPago, venta.xmlMetodoPago AS metodoPago, venta.xmlNumeroCuentaPago AS numCta  FROM Divisa INNER JOIN (Ciudad RIGHT JOIN (Domicilio RIGHT JOIN (Cliente INNER JOIN (Venta INNER JOIN (ut_CFD INNER JOIN (ut_CFDFolio INNER JOIN ut_CFDInfo ON ut_CFDFolio.uf_CFDInfo=ut_CFDInfo.Sys_PK) ON ut_CFD.uf_CFDFolio=ut_CFDFolio.Sys_PK) ON Venta.Sys_PK=ut_CFD.uf_IVenta) ON Cliente.Sys_PK = Venta.ICliente) ON Domicilio.Sys_PK = Cliente.Domicilio1) ON Ciudad.Sys_PK = Domicilio.ICiudad) ON Divisa.Sys_PK = Venta.IDivisa WHERE Venta.Sys_Pk=" + PKFacturaCFD + " AND venta.documento=4;";
			
	Rst = OpenRecordset(sql,Application.Adocnn);
	
	if (Rst==null) return 0;
	FacturaCFD=FacturaCFD + Impresora.SetChr(30,"=") + "\r\n";//Imprime 30 veces el caracter "="	
	FacturaCFD=FacturaCFD + "\r\n";
	CodDivisa=Rst("CodDivisa").Value;
	DescDivisa=Rst("DescDivisa").Value;
	SubTotal=Rst("Subtotal").Value;
	Descuentos=Rst("Descuentos").Value;
	IVA=Rst("Impuestos");
	Total=Rst("Total");
	
	fPagoC = Rst("fpContraprestacion");
	metPago = Rst("metodoPago");
	numCta = Rst("numCta");
	metodoP = metPago + " " + numCta;

	FacturaCFD=FacturaCFD + Impresora.AligTextInStr("Subtotal:",18,1," ") + Impresora.AligTextInStr(Impresora.FormatoDinero(SubTotal),12,1," ") + "\r\n";
	
	FacturaCFD=FacturaCFD + Impresora.AligTextInStr("Descuentos:",18,1," ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Descuentos),12,1," ") + "\r\n";
	
	FacturaCFD=FacturaCFD + Impresora.AligTextInStr("IVA:",18,1," ") + Impresora.AligTextInStr(Impresora.FormatoDinero(IVA),12,1," ") + "\r\n";
	
	FacturaCFD=FacturaCFD + Impresora.AligTextInStr("Total:",18,1," ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Total),12,1," ") + "\r\n";
	
	FacturaCFD=FacturaCFD + Impresora.AligTextInStr("Forma de pago:",18,1," ") + Impresora.AligTextInStr(fPagoC,12,1," ") + "\r\n";
	FacturaCFD=FacturaCFD + Impresora.AligTextInStr("Método de pago:",18,1," ") + Impresora.AligTextInStr(metodoP,12,1," ") + "\r\n";

	entero = eBasic.IntVal(Total);		
	if(CodDivisa.toLowerCase()=="pmx"){
		CodDivisa="M.N.";
	}
	FacturaCFD = FacturaCFD  + "\r\n";	
	Letras=eBasic.NumbersToWords(entero) +" "+ DescDivisa +" "+ eBasic.eFormat((Total-entero)*100,"00") + "/100 "+CodDivisa;
	Letras=Impresora.getTextMultiLine(Letras,30,0);
	FacturaCFD=FacturaCFD + Letras + "\r\n";
	FacturaCFD=FacturaCFD + "\r\n";		
	FacturaCFD=FacturaCFD + Impresora.SetChr(30,"=") + "\r\n\r\n";//Imprime 30 veces el caracter "="	
}



function ImprimirPie(PKFacturaCFD)
{
var sql;
var Rst;
var CadenaOriginal;
var SelloDigital;

	sql = "SELECT ut_CFD.uf_CadenaOriginal AS CadenaOriginal, ut_CFD.uf_SelloDigital AS SelloDigital,ut_CFDInfo.uf_noCertificado AS noCertificado,ut_CFDFolio.uf_noAprobacion AS noAprobacion,ut_CFDFolio.uf_anoAprobacion AS anioAprobacion,Venta.uf_FechaCFD FROM Divisa INNER JOIN (Ciudad RIGHT JOIN (Domicilio RIGHT JOIN (Cliente INNER JOIN (Venta INNER JOIN (ut_CFD INNER JOIN (ut_CFDFolio INNER JOIN ut_CFDInfo ON ut_CFDFolio.uf_CFDInfo=ut_CFDInfo.Sys_PK) ON ut_CFD.uf_CFDFolio=ut_CFDFolio.Sys_PK) ON Venta.Sys_PK=ut_CFD.uf_IVenta) ON Cliente.Sys_PK = Venta.ICliente) ON Domicilio.Sys_PK = Cliente.Domicilio1) ON Ciudad.Sys_PK = Domicilio.ICiudad) ON Divisa.Sys_PK = Venta.IDivisa WHERE Venta.Sys_Pk=" + PKFacturaCFD + " AND venta.documento=4;";
		
	Rst = OpenRecordset(sql,Application.Adocnn);
	
	if (Rst==null) return 0;
	
	CadenaOriginal=Rst("CadenaOriginal").Value;
	SelloDigital=Rst("SelloDigital").Value;
	
	FacturaCFD=FacturaCFD + "Cadena original:" + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine(CadenaOriginal,30,0) + "\r\n";
	FacturaCFD=FacturaCFD + "\r\n";
	FacturaCFD=FacturaCFD + "Sello digital:" + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine(SelloDigital,30,0) + "\r\n";
	FacturaCFD=FacturaCFD + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("No. Certificado:",30,0," ") +"\r\n"+Impresora.AligTextInStr(Rst("noCertificado").Value,30,1," ") + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("Año de aprobación:",18,0," ") + Impresora.AligTextInStr(Rst("anioAprobacion").Value,12,1," ") + "\r\n";
	FacturaCFD = FacturaCFD + Impresora.AligTextInStr("No. de aprobación:",18,0," ") + Impresora.AligTextInStr(Rst("noAprobacion").Value,12,1," ") + "\r\n";	
	FacturaCFD=FacturaCFD + Impresora.SetChr(30,"=") + "\r\n";//Imprime 30 veces el caracter "="		
	FacturaCFD = FacturaCFD + Impresora.getTextMultiLine("Este documento es una  impresión de un comprobante fiscal digital",30,0) + "\r\n";
	FacturaCFD=FacturaCFD + Impresora.SetChr(30,"=") + "\r\n";//Imprime 30 veces el caracter "="	
	
	return 0;
}



/* Funciones de Soporte */

function ImprimirColumnas(){
var stCad;	
	stCad = Impresora.SetChr(30,"=")+"\r\n";
	FacturaCFD=FacturaCFD + stCad;
	FacturaCFD=FacturaCFD + "Desc Cant Unidad  Num. doc Aduana Fecha doc. aduana  Precio Importe" + "\r\n";	
}


function stringValue(v){
	if(v!=null)
		return v;
	else
		return "";
}

function OpenRecordset(eSQL,Cnn)
{
var R;
	try 
	{
		R = Cnn.Execute(eSQL);
		
		if (R==null) return null;
		if (R.EOF && R.BOF) return null;
		
		return R;
	}catch(e){
		eBasic.eMsgbox("Error al intentar acceder a la información de la Base de datos");
	}

}

function Fecha(F){	
	var SFecha="";	
	if(F!=null)
		F=new Date(F);
	else
		F=new Date();
	SFecha=eBasic.eFormat(F.getDate(), "00") + "/" + eBasic.eFormat(F.getMonth()+1, "00") + "/" + F.getYear();
	return SFecha;
}

function Hora(H){	
	var SHora="";
	if(H!=null)
		H=new Date(H);
	else
		H=new Date();
	SHora=eBasic.eFormat(H.getHours(), "00")+ ":" + eBasic.eFormat(H.getMinutes(),"00") + ":" + eBasic.eFormat(H.getSeconds(),"00");
	return SHora;
}