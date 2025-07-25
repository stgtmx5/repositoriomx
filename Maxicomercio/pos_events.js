var cEstacionamiento;
var engineType = 1;
var netConnection;

function evAntesProducto(PKProducto,CodigoProducto, Cantidad)
{
	var Ret = 0;
	//Se ejecuta antes de que un producto se agregue o se modifique su cantidad con los comandos ++,+X y *X en la venta actual
	//Si la función retorna 1 el producto no se agregará o modificará
	/*if(ValidarProducto(PKProducto))
	{
		Ret = 1;
		pos_estacionamiento.Cobrar();
	}*/
	return Ret;
}

function evAntesQuitarProducto(PKProducto)
{
	//Se ejecuta antes de quitarse un producto
	//Si la función retorna 1 el producto no se quitará
	return 0;
}

function evAlAgregarProducto(PKProducto, CodigoProducto,Cantidad)
{
	//Se ejecuta cuando el producto se ha agregado por primera vez
}

function evAntesProcesarVenta(PKVenta)
{
	//Si la función devuelve 1 la venta no se procesará
	return 0;
}

function evAlGuardarCotizacion(PKVenta)
{
	//Se ejecuta al guardarse una cotización
}

function evAlProcesarVenta(PKVenta)
{
	//Se ejecuta cuando la venta ha sido procesada (contado, crédito o facturada)
	//Application.Eval("pos_events.evAlProcesarVenta(");
	//Probar si esta sintaxis funciona:	pos_events.eVAlProcesarVenta();
}

function evAlCrearVenta(PKVenta)
{
	//Se ejecuta cuando se crea una venta
}

function evAlSeleccionarVenta(PKVenta)
{
	//Se ejecuta cuando se selecciona una venta que estaba retenida
}


function evAXInput(NomControl, IDEvento,Valor)
{
	//Responde al mensaje enviado por un control ActiveX acoplado
	//eBasic.eMsgbox("Control:"+NomControl+"\rEvento:"+IDEvento+"\rValor:"+Valor);
}

//nuevos eventos abril-2011

function evAlRecuperarVenta(PKVenta){
//Antes de cobrar, Al guardar venta

	//devolver cero para continuar con la operacion
	//devolver diferente de cero para cancelar la venta
	return 0;
}

function evAlCancelarTicketTotal(PKVenta)
{
	//se ejecuta despues de cancelar un ticket totalmente en un solo paso.
	//no tiene que devolver ningún valor
}


function evAlCancelarTicketParcial(PKVenta,PKNCredito)
{
	//se ejecuta al hacer devoluciones parciales del ticket a traves de una nota de crédito
	//no tiene que devolver ningún valor	
}

function evAlLiberarTicket(PKVenta)
{
	//se ejecuta al liberar una venta
	//no tiene que devolver ningún valor	
}

function ValidarProducto(PKProducto)
{
	/*var ADOCnn = Application.ADOCnn;
	var SQLQuery = "SELECT IProducto FROM UT_CfgEstacionamiento;";
	var IProducto = 0;
	var oRs = ADOCnn.Execute(SQLQuery);
	IProducto = oRs("IProducto").Value;
	
	if(IProducto = 0 || oRs == null || IProducto != PKProducto)
	{
		return false;
	}
	else
	{
		return true;
	}*/
}

/* Funcionalidad del estacionamiento */

function Init(PKCorte)
{
	netConnection = eBasic.eCreateObject("geAccess.getAccess");
	cEstacionamiento=eBasic.eCreateObject("uiEstacionamiento.uiMain");
	
	if(netConnection==null)
	{
		eBasic.eMsgBox("Error al obtener el objeto Access.",6);
		return false;
	}
	
	if(cEstacionamiento==null)
	{
		eBasic.eMsgBox("Error al crear el objeto cEstacionamiento.",6);
		return false;
	}
	
	if(netConnection.connect(Application.adoCnn,eBasic.AddSlashPath(GetRepository())+"sqlEstacionamiento.xml", engineType))
	{
		try
		{
			if(!cEstacionamiento.SetObject(netConnection.access, Application.ADOCnn, Application.UIUsers, PKCorte))
			{
				eBasic.eMsgBox("Error al inicializar los objetos en cEstacionamiento: ('" + cEstacionamiento.LastError + "')");
				return false;
			}
			return true;
		}
		catch(ex)
		{
			eBasic.eMsgBox("Error al inicializar los objetos: ('" + ex.message + "').");
			return false;
		}		
	}
	else
	{
		eBasic.eMsgBox("Error de conexión: ('" + netConnection.LastErrorDescription + "')");
		return false;
	}
}

function Configurar()
{
	cEstacionamiento.runConfiguration();
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

function Cobrar(PKCorte)
{
		/*if(Init(PKCorte))
		{
			cEstacionamiento.Begin();
			if(cEstacionamiento.PKVenta == -1)
			{
				eBasic.eMsgBox(cEstacionamiento.LastError,6);
				return -1;
			}
			else
			{
				if(cEstacionamiento.PKVenta != 0){
					var pPrimaryKey = cEstacionamiento.PKVenta;
					var pBarCode = cEstacionamiento.CodigoBarras;
					//Reportes.EjecutarReporte(ReportPath, 2, pPrimaryKey, true, null, "pBarCode", pBarCode);
					var sArchivo="$AppReportsPath$\\Ventas\\Boleto.xpd";
					Impresora.PrintReport(sArchivo,pPrimaryKey,true,"pBarCode",pBarCode, false,"");
				}
			}
		}*/
}