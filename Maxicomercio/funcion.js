function ComisionVendedor(Costo,Util,Precio,PrecioVenta,PKVendedor)
{
var UtilReal=0;
var UtilDinero=0;
var UtilEsperada=0;
var ComVendedor =0;

var DismUtil=0;
var ComReal;

	UtilReal =  1 - (Costo/PrecioVenta);
	UtilDinero = PrecioVenta * UtilReal;
	UtilEsperada = Precio * Util;
	
	// Obtener Comision del Vendedor
	ComVendedor = 5;
	// Porcentaje de disminucion de la utilidad
	DismUtil = 1 -(UtilDinero/UtilEsperada);
		
	ComReal = (1-DismUtil)*ComVendedor;
	
	return ComReal;
}


function DineroComision(Costo,Util,Precio,PrecioVenta,PKVendedor,Cantidad,Descuentos)
{
var com=0;
var DCom;
	com = ComisionVendedor(Costo,Util,Precio,PrecioVenta,PKVendedor,Descuentos);
	com = com/100;
	
	DCom = com *( (Precio * Cant) - Descuentos);

		return DCom;
}