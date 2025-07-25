var RegAppName = "Maxicomercio";

var CodDivisa;
var DescDivisa;
var divisaPago;
var tipoCambioDivisaPago;

function ticket(SysTicket, Referencia, Cambio, Efectivo, Cheque, Tarjeta, Vale, Deposito, Credito, IsReprint) {
	//	if (eBasic.eMsgbox("�Imprimir ticket?",4)==7)return 0;
	if (SysTicket == null) return 0;

	pos_support.ConfigImpresora();

	ImprimirEncabezado();

	ImprimirPrincipal(SysTicket, Referencia, IsReprint);
	ImprimirDetalle(SysTicket, Cambio, Efectivo, Cheque, Tarjeta, Vale, Deposito, Credito, IsReprint);
	ImprimirPie();
	PrintCodeKiosco(SysTicket);
	Impresora.Terminar();

	return 0;
}

function ImprimirEncabezado() {
	var stCad = "";
	stCad = AppVars.GetTextVar("FXCA112", "");

	if (stCad == "") {
		Impresora.Texto(Impresora.SetChr(30, "=")); //Imprime 30 veces el caracter "-"
		return 0;
	}

	//Descomponer la cadena en Lineas.
	stCad = eBasic.ReplaceStrChars(stCad, String.fromCharCode(10), "");
	Impresora.MTexto(stCad, String.fromCharCode(13), 30, 2);
	//Impresora.Texto(" ");
	Impresora.Texto(Impresora.SetChr(30, "=")); //Imprime 30 veces el caracter "-"
	return 0;

}

function ImprimirPrincipal(PKTicket, Referencia, IsReprint) {

	var rcst;
	var descaja = "";
	var nomcliente = "";
	var nomcajero = "";
	var Corte;
	var ErrDesc = "Error al imprimir ticket";
	var Buscar;
	var R2;
	var sql;

	sql = "SELECT Venta.Sys_DTCreated,Venta.Fecha,Venta.ICorte, Agente.Codigo As CodAgente, Agente.Nombre As NomAgente, ";
	sql = sql + " Divisa.Codigo As CodDivisa, Divisa.Descripcion As DescDivisa, Cliente.Codigo As Cliente, ";
	sql = sql + "Cliente.Nombre As NomCliente, Cliente.RFC As rfc, Caja.Codigo As Caja, Caja.Descripcion As DescCaja ";
	sql = sql + ", (select d.Codigo from movcaja mc inner join divisa d on (mc.IDivisa = d.Sys_PK) inner join venta v on (v.IMovCaja = mc.Sys_PK) where v.Sys_PK = " + PKTicket + ") as monedapago, (select round(d.TCambio,2) from movcaja mc inner join divisa d on (mc.IDivisa = d.Sys_PK) inner join venta v on (v.IMovCaja = mc.Sys_PK) where v.Sys_PK = " + PKTicket + ") as tipocambio";
	sql = sql + " FROM (((Venta inner join Cliente On Venta.ICliente=Cliente.Sys_PK) inner join Divisa";
	sql = sql + "  On Venta.IDivisa=Divisa.Sys_PK) inner join Caja On Venta.ICaja=Caja.Sys_PK)";
	sql = sql + " left join Agente On Venta.IAgente=Agente.Sys_PK where Venta.Sys_PK=" + PKTicket;

	try {
		rcst = pos_support.OpenRecordset(sql, Application.AdoCnn);
	} catch (e) {
		eBasic.eMsgbox(ErrDesc + "(Sin acceso a base de datos)");
		return 0;
	}

	if (rcst == null) { eBasic.eMsgbox(ErrDesc + "(Sin acceso a base de datos)"); return 0; }


	Impresora.Texto(pos_support.Fecha(rcst("Fecha").Value) + "  " + pos_support.Hora(rcst("Sys_DTCreated").Value));

	nomcliente = rcst("NomCliente").Value;

	// ********** Asignar Codigo y descripcion de Divisa  a variables globales para su uso en detalle de ticket

	CodDivisa = rcst("CodDivisa").Value;
	DescDivisa = rcst("DescDivisa").Value;

	divisaPago = rcst("monedapago").Value;
	tipoCambioDivisaPago = rcst("tipocambio").Value;

	Buscar = false;

	try {
		// Previene error al utilizar prn_ticket desde el backOffice, MainForm no tiece CorteActual.
		Corte = Application.MainForm.CorteActual();
	} catch (e) {
		Corte = null;
		Buscar = true;
	}

	if (Corte != null) {
		if (Corte.Sys_PK == rcst("ICorte").Value) {
			descaja = Corte.ICaja.Descripcion;
			nomcajero = Corte.ICajero.Nombre;
		} else {
			Buscar = true;
		}
	}

	if (Buscar) {

		sql = "SELECT Corte.Sys_PK, Caja.Codigo AS CodCaja, Caja.Descripcion AS DescCaja, Cajero.Codigo AS CodCajero, Cajero.Nombre AS NombreCajero FROM Cajero INNER JOIN (Caja INNER JOIN Corte ON Caja.Sys_PK = Corte.ICaja) ON Cajero.Sys_PK = Corte.ICajero WHERE Corte.Sys_PK=" + rcst("ICorte").Value;

		R2 = pos_support.OpenRecordset(sql, Application.Adocnn);

		if (R2 != null) {
			descaja = R2("DescCaja").Value;
			nomcajero = R2("NombreCajero").Value;
			R2 = null;
		}
	}

	Impresora.Texto(Impresora.AligTextInStr("Ticket: " + Referencia, 30, 0, " "));
	Impresora.Texto(Impresora.AligTextInStr("Cajero: " + nomcajero, 30, 0, " "));
	Impresora.Texto(Impresora.AligTextInStr("Caja: " + descaja, 30, 0, " "));
	Impresora.Texto(Impresora.AligTextInStr("Cliente: " + nomcliente, 30, 0, " "));
	if (IsReprint) Impresora.Texto(Impresora.AligTextInStr("** REIMPRESION **", 30, 2, " "));
	//Impresora.Texto(" ");

	//Imprimir Titulos de columnas
	ImprimirColumnas();
	Impresora.Texto(" ");

}

function ImprimirDetalle(SysPK, Cambio, Efectivo, Cheque, Tarjeta, Vale, Deposito, Credito, IsReprint) {
	
	var Rst;
	var Precio;
	var sDetalle;
	var cStr;
	var bIva;
	var Desc;
	var DesPar;
	var Imp;
	var SumPrecio;
	var Total = 0;
	var entero;
	var Letras;
	var PrecioTotalXProducto = 0;
	var DescuentoIncluido;
	var X;
	var CantidadProd = 0;
	var iva = 0;
	var ieps = 0;

	if (Cambio == null) Cambio = 0;
	if (Efectivo == null) Efectivo = 0;
	if (Cheque == null) Cheque = 0;
	if (Tarjeta == null) Tarjeta = 0;
	if (Vale == null) Vale = 0;
	if (Deposito == null) Deposito = 0;
	if (Credito == null) Credito = 0;


	bIva = false;
	if (NodeVars.EGetSetting(RegAppName, "NodeVars", "FXCT119", 0) == -1)
		bIva = true; // Determina si se desglosa los impuestos. True: Dezglosar

//	sql="Select Precio,Descuentos,Impuestos,Cantidad,Unidad,Codigo,Descripcion,notas,SUBSTR(notas,1,15) as Tel,SUBSTR(notas, length(substring_index(notas,' ',1)) +2, length(substring_index(notas,' ',2)) - length(substring_index(notas,' ',1))  ) as Aut ,SUBSTR(notas, length(substring_index(notas,' ',2)) + 2 , length(notas) - length(substring_index(notas,' ',2))) as fol ";
//	sql = sql + ", Impuesto1 as ieps,Impuesto3 as iva ";
//	sql = sql + "From qryDetalleTicket Where Venta=" + SysPK;
	

	//Rst = pos_support.OpenRecordset(sql, Application.Adocnn);
	// La vista se convierte a procedimiento para reducir tiempo
	Rst = ThisCnn.execute("CALL stgt_sp_detalle_ticket(" + SysPK + ")");

	if (Rst == null) return 0;

	Desc = 0;
	Imp = 0;
	SumPrecio = 0;
	Precio = 0;
	DesPar = 0;

	while (!Rst.EOF) {
		PrecioTotalXProducto = 0;
		CantidadProd = Impresora.Redondear(Rst("Cantidad").Value, 4);
		Precio = Rst("Precio").Value * CantidadProd;
		SumPrecio = SumPrecio + Precio;
		DesPar = Impresora.Redondear(Rst("Descuentos").Value);
		Desc = Desc + DesPar;
		iva = iva + Impresora.Redondear(Rst("Impuesto3").Value);
		ieps = ieps + Impresora.Redondear(Rst("Impuesto1").Value);

		Total = Total + Impresora.Redondear((Precio - Rst("Descuentos").Value) + Rst("Impuestos").Value);

		if (bIva)
			PrecioTotalXProducto = Precio;
		else
			PrecioTotalXProducto = (Precio - Rst("Descuentos").Value) + Rst("Impuestos").Value;

		PrecioTotalXProducto = Impresora.Redondear(PrecioTotalXProducto);

		sDetalle = "";
		// ************************************************
		cStr = "";
		cStr = Rst("Descripcion").Value;
		cStr = Impresora.AligTextInStr(cStr, 30, 0, " ");
		Impresora.Texto(cStr);


		cStr = CantidadProd + "";
		cStr = Impresora.AligTextInStr(cStr, 13, 1, " ");
		sDetalle = cStr;

		cStr = Rst("Unidad").Value + "";
		cStr = Impresora.AligTextInStr(cStr, 5, 1, " ");
		sDetalle = sDetalle + cStr;

		cStr = Impresora.FormatoDinero(PrecioTotalXProducto);
		cStr = Impresora.AligTextInStr(cStr, 12, 1, " ");
		sDetalle = sDetalle + cStr;

		Impresora.Texto(sDetalle);

		//************************************************
		if(Rst("notas").Value!=null)
		{
			cStr2 = "";
			cStr2 = Rst("Tel").Value;
			cStr2 = Impresora.AligTextInStr(cStr2, 30, 0, " ");
			Impresora.Texto(cStr2);

			cStr3 = "";
			cStr3 = Rst("Aut").Value;
			cStr3 = Impresora.AligTextInStr(cStr3, 30, 0, " ");
			Impresora.Texto(cStr3);
			
			cStr4 = "";
			cStr4 = Rst("fol").Value;
			cStr4 = Impresora.AligTextInStr(cStr4, 30, 0, " ");
			Impresora.Texto(cStr4);
		}
		Rst.MoveNext();
	}

	SumPrecio = Impresora.Redondear(SumPrecio);
	Desc = Impresora.Redondear(Desc);
	iva = Impresora.Redondear(iva);
	ieps = Impresora.Redondear(ieps);

	Rst.Close();
	Impresora.Texto(Impresora.SetChr(30, "="));
	//Impresora.Texto (" ");

	//  ***************  totales  *********	
	Total = Impresora.Redondear(Total);
	if (bIva)
		Impresora.Texto(Impresora.AligTextInStr("Subtotal:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(SumPrecio), 12, 1, " "));
	if (Desc != 0) {
		if (bIva) {
			Impresora.Texto(Impresora.AligTextInStr("Descuento:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Desc), 12, 1, " "));
		} else {
			//calcular descuentos que incluye el total con impuestos.			
			DescuentoIncluido = 0;
			X = 1 - (Desc / SumPrecio)
			DescuentoIncluido = (Total / X) - Total;
			DescuentoIncluido = Impresora.Redondear(DescuentoIncluido);
			Impresora.Texto(Impresora.AligTextInStr("Descuento:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(DescuentoIncluido), 12, 1, " "));
		}
	}
	if (bIva) {
		Impresora.Texto(Impresora.AligTextInStr("IVA:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(iva), 12, 1, " "));
		Impresora.Texto(Impresora.AligTextInStr("IEPS:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(ieps), 12, 1, " "));
	}

	Impresora.Texto(Impresora.AligTextInStr("Total:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Total), 12, 1, " "));
	//********************************
	//entero = eBasic.IntVal(Total);
	//if (CodDivisa.toLowerCase() == "pmx") {
	//	CodDivisa = "M.N.";
	//}
	Impresora.Texto(" ");
	//Letras = eBasic.NumbersToWords(entero) + " " + DescDivisa + " " + eBasic.eFormat((Total - entero) * 100, "00") + "/100 " + CodDivisa;
	Letras= NumeroALetras (Total);
	Letras = Impresora.getTextMultiLine(Letras, 30, 0);
	Impresora.Texto(Letras);

	// Si el ticket se trata de una reimpresión, se omite el detalle de pago
	if (IsReprint) return 0;

	// Detalle de pago
	Impresora.Texto(" ");
	Impresora.Texto(Impresora.AligTextInStr("-Forma de Pago-", 30, 2, " "));
	//Impresora.Texto(" ");

	if (Efectivo + Cheque + Tarjeta + Vale + Deposito + Credito + Cambio == 0)
		Impresora.Texto("*NO ES UN COMPROBANTE DE PAGO*");


	if (Efectivo > 0) {
		if (divisaPago != "MXN") {
			Impresora.Texto(Impresora.AligTextInStr("Efectivo:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Efectivo) + " " + divisaPago, 12, 1, " "));
			Impresora.Texto(Impresora.AligTextInStr("Tipo de Cambio:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(tipoCambioDivisaPago), 12, 1, " "));
		}
		else
			Impresora.Texto(Impresora.AligTextInStr("Efectivo:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Efectivo), 12, 1, " "));
	}

	if (Tarjeta > 0) Impresora.Texto(Impresora.AligTextInStr("Tarjeta:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Tarjeta), 12, 1, " "));

	if (Vale > 0) Impresora.Texto(Impresora.AligTextInStr("Vale:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Vale), 12, 1, " "));

	if (Cheque > 0) Impresora.Texto(Impresora.AligTextInStr("Cheque:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Cheque), 12, 1, " "));

	if (Deposito > 0) Impresora.Texto(Impresora.AligTextInStr("Dep�sito:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Deposito), 12, 1, " "));

	if (Credito > 0) Impresora.Texto(Impresora.AligTextInStr("Cr�dito:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Credito), 12, 1, " "));

	if (Cambio != 0) {
		if (divisaPago != "MXN") {
			Impresora.Texto(Impresora.AligTextInStr("Cambio en " + divisaPago + ":", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Cambio) + " " + divisaPago, 12, 1, " "));
			Impresora.Texto(Impresora.AligTextInStr("Cambio en MXN:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Cambio * tipoCambioDivisaPago), 12, 1, " "));
		}
		else
			Impresora.Texto(Impresora.AligTextInStr("Cambio:", 18, 1, " ") + Impresora.AligTextInStr(Impresora.FormatoDinero(Cambio), 12, 1, " "));
	}

	//Impresora.Texto(" ");
	return 0;
}

function PrintCodeKiosco(Ticket) {
	try {
		CodeTicket = eBasic.eCreateObject("r5.ToolsFunctions.Main");
		if (CodeTicket != null) {
			var sql = "select Fecha,Sys_DTCreated from venta where StatusAdministrativo=3 and StatusFinanciero=2 and sys_pk=" + Ticket;
			data = pos_support.OpenRecordset(sql, Application.AdoCnn);
			if (data != null) {
				var sCode = CodeTicket.GenCodeTicket(data("Fecha").Value, data("Sys_DTCreated").Value, Ticket);
				if (sCode != "") {
					Impresora.Texto("Folio de Facturacion");
					Impresora.Texto("# " + sCode);
					Impresora.Texto(" ");
					//Printer.DrawImage("qr_facturacion_csp.bmp");
					//ShellExecute("cmd.exe", "/C copy /b c:\\comercial\\maxicomercio\\qr_facturacion_escpos.bin > PRN", "", "", 0);
					Application.MainForm.ExecInConsole("cmd.exe /C copy /b C:\comercial\qr_facturacion_escpos.bin > PRN");


					//var datosQR = gFunciones.LeerArchivoBinario("qr_facturacion_escpos.bin");
					//Impresora.EnviarBinario(datosQR);
				}
			}
		}
		else
			eBasic.eMsgbox("No se creo: r5.ToolsFunctions.Main");
	} catch (ex) { eBasic.eMsgbox("PrintCodeKiosco: " + ex.message); }
}

function ImprimirPie() {
	var stCad;
	stCad = AppVars.GetTextVar("FXCA113", ""); //pide de ticket
	if (stCad == "") {
		//Impresora.Texto (Impresora.SetChr(30,"=")); //Imprime 30 veces el caracter "-"
		return 0;
	}
	//Descomponer la cadena en Lineas.
	stCad = eBasic.ReplaceStrChars(stCad, String.fromCharCode(10), "");
	Impresora.Texto(" ");
	Impresora.MTexto(stCad, String.fromCharCode(13), 30, 2);
	Impresora.Texto(Impresora.AligTextInStr("STGT 2025", 30, 2, " "));
	Impresora.Texto(" ");
	return 0;
}

/* Funciones de Soporte */
function ImprimirColumnas() {
	var stCad;

	stCad = "- DETALLE DE SU COMPRA-  ";
	Impresora.Texto(Impresora.AligTextInStr(stCad, 30, 2, " "));
	stCad = Impresora.SetChr(30, "=");
	Impresora.Texto(stCad);
	Impresora.Texto("DESCRIP CANT  UNID     IMPORTE");
}

function ImprimirPromociones(PKTicket) {

	var contenedor;
	var nombre;
	var stCad;
	var salida;

	//sql = " SELECT Sys_PK,Descripcion,Referencia,ICategoria, DocVenta  FROM" ;
	//sql = sql + " cardex Where ICategoria=3 and DocVenta=" + PKTicket;

	//sql = "SELECT cardex.Sys_PK,cardex.Descripcion,cardex.Referencia,cardex.ICategoria,cardex.DocVenta,dcardex.Salidas as Salidas,producto.Descripcion as Nombre FROM cardex INNER JOIN dcardex ON cardex.Sys_PK= dcardex.FK_Cardex_Movimientos inner join producto on producto.Sys_PK = dcardex.IProducto Where cardex.ICategoria=3 and cardex.DocVenta=" + PKTicket;
	sql = "SELECT Cardex.Sys_PK, Cardex.Descripcion, Cardex.Referencia, Cardex.ICategoria, Cardex.DocVenta, DCardex.Salidas, Producto.Descripcion AS Nombre FROM Producto INNER JOIN (Cardex INNER JOIN DCardex ON Cardex.Sys_PK = DCardex.FK_Cardex_Movimientos) ON Producto.Sys_PK = DCardex.IProducto WHERE (((Cardex.ICategoria)=3) AND ((Cardex.DocVenta)=" + PKTicket + "))";
	Rst = pos_support.OpenRecordset(sql, Application.Adocnn);

	if (Rst == null) return 0;

	if (!Rst.EOf) {
		contendor = "";
		nombre = Rst("Nombre").Value;
		salida = Rst("Salidas").Value;
		stCad = "-PRODUCTO EN PROMOCI�N -";
		stnombre = "Del producto : " + nombre;
		stSalida = "Cantidad entregada por la promoci�n :" + salida;

		contenedor = stCad + "\r\n" + stnombre + "\r\n" + stSalida;
		contenedor = Impresora.getTextMultiLine(contenedor, 26, 2);
		Impresora.Texto(contenedor);
	}
}

function NumeroALetras(numero) {
    var unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    var especiales = ["diez", "once", "doce", "trece", "catorce", "quince"];
    var decenas = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    var centenas = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    function quitarEspacios(texto) {
        while (texto.indexOf("  ") !== -1) texto = texto.replace("  ", " ");
        while (texto.charAt(0) === " ") texto = texto.substring(1);
        while (texto.charAt(texto.length - 1) === " ") texto = texto.substring(0, texto.length - 1);
        return texto;
    }

    function convertirMenor1000(n) {
        var salida = "";
        var cent = Math.floor(n / 100);
        var resto = n % 100;

        if (n === 100) return "cien";
        if (cent > 0) salida += centenas[cent] + " ";

        if (resto < 10) salida += unidades[resto];
        else if (resto >= 10 && resto < 16) salida += especiales[resto - 10];
        else if (resto < 20) salida += "dieci" + unidades[resto - 10];
        else if (resto === 20) salida += "veinte";
        else if (resto < 30) salida += "veinti" + unidades[resto - 20];
        else {
            var dec = Math.floor(resto / 10);
            var uni = resto % 10;
            salida += decenas[dec];
            if (uni > 0) salida += " y " + unidades[uni];
        }

        return quitarEspacios(salida);
    }

    function seccion(n, divisor, nombre) {
        var cientos = Math.floor(n / divisor);
        var resto = n - cientos * divisor;
        var letras = "";

        if (cientos > 0) {
            if (cientos === 1)
                letras = nombre;
            else
                letras = NumeroALetras(cientos) + " " + nombre + "es";
        }

        if (resto > 0) letras += " " + NumeroALetras(resto);
        return quitarEspacios(letras);
    }

    // Tomar parte entera y los dos dígitos después del punto como texto
    var strNumero = numero.toString();
    var partes = strNumero.split(".");
    var parteEntera = parseInt(partes[0], 10);
    var textoCentavos = "00";

    if (partes.length > 1) {
        var decimales = partes[1];
        if (decimales.length === 1) {
            textoCentavos = decimales + "0";
        } else {
            textoCentavos = decimales.substring(0, 2);
        }
    }

    var resultado = "";

    if (parteEntera === 0) {
        resultado = "cero";
    } else {
        if (parteEntera >= 1000000)
            resultado += seccion(parteEntera, 1000000, "millón");
        else if (parteEntera >= 1000)
            resultado += seccion(parteEntera, 1000, "mil");
        else
            resultado += convertirMenor1000(parteEntera);
    }

    resultado = quitarEspacios(resultado);

    // Cambiar "uno" al final por "un"
    if (resultado.substring(resultado.length - 3) === "uno") {
        resultado = resultado.substring(0, resultado.length - 3) + "un";
    }

    var textoMoneda = (parteEntera === 1) ? " PESO " : " PESOS ";
    var textoFinal = textoCentavos + "/100 M.N.";

    return (resultado + textoMoneda + textoFinal).toUpperCase();
}
