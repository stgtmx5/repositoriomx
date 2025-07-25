//funciones de soporte utilizadas en el punto de venta. by Jfrank 16 Nov 09

var RegAppName="Maxicomercio";

function OpenRecordset(eSQL,Cnn)
{
var R;
	try 
	{
		var str = eSQL;
		/*var file = "C:\\Users\\ITR-DESARROLLO\\Desktop\\LastQuery.sql";
		eBasic.SaveStrToFile(file,str);*/
		
		R = Cnn.Execute(eSQL);
		
		if (R==null) return null;
		if (R.EOF && R.BOF) return null;
		
		return R;
	}catch(e){
		eBasic.eMsgbox("Error al intentar acceder a la información de la Base de datos: " + e.message);
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
	var H;
	var SHora="";
	if(H!=null)
		H=new Date(H);
	else
		H=new Date();
	SHora=eBasic.eFormat(H.getHours(), "00")+ ":" + eBasic.eFormat(H.getMinutes(),"00") + ":" + eBasic.eFormat(H.getSeconds(),"00");
	return SHora;
}


function loadScript(sName,Err)
{

	try
	{
		if (!ModuleLoaded(sName))
		{
			if (!Application.LoadScript(sName+".js"))
			{
				eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
				return false;
			}
		}
	}catch(e)
	{
		eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
		return false;
	}	
	return true;
}

function ReciboCliente(PKDCxC)
{
	var R;
	var ErrDesc="Error al imprimir recibo";
	var S;
	var sql;
	
	
	if(PKDCxC==null){ 
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)");
		return 0;
	}
	
	sql = "SELECT DCxC.Sys_DTCreated,DCxC.Fecha, DCxC.Haber, DCxC.Notas, DCxC.Referencia, Cliente.Nombre FROM ";
	sql = sql + " Cliente INNER JOIN DCxC ON Cliente.Sys_PK = DCxC.ICliente WHERE DCxC.Sys_PK=" + PKDCxC;
	
	
	R = OpenRecordset(sql,Application.Adocnn);
	
	if(R==null){
		eBasic.eMsgbox(ErrDesc + "(Sin acceso a base de datos)");
		return 0;
	}
	
	
	ConfigImpresora();
	
	Impresora.Texto(Impresora.AligTextInStr("RECIBO",30,2," "));
	S= Impresora.SetChr(30,"=");
	Impresora.Texto(S);
	Impresora.Texto("Fecha:"+Fecha(R("Fecha").Value)+"  "+Hora(R("Sys_DTCreated").Value));
	Impresora.Texto(Impresora.AligTextInStr("Referencia: "+R("Referencia").Value,30,0," "));
	Impresora.Texto("");
	Impresora.Texto("Recibí de:");
	S=Impresora.getTextMultiLine(R("Nombre").Value,30,0);
	Impresora.Texto(S);
	Impresora.Texto("");
	S=Impresora.FormatoDinero(Impresora.Redondear(R("Haber").Value));
	S=Impresora.AligTextInStr("La cantidad de: "+S,30,1," ");
	Impresora.Texto(S);
	Impresora.Texto("");
	Impresora.Texto("Concepto:");
	S=Impresora.getTextMultiLine(R("Notas").Value,30,0);
	Impresora.Texto(S);	
	Impresora.Terminar();
	
}

function ReciboProveedor(PKDCxP)
{
	var ErrDesc="Error al imprimir recibo";
	var R;
	var sql;
	
	if(PKDCxP==null)
	{ 
		eBasic.eMsgbox(ErrDesc + "(No se ha indicado la clave principal)");
		return 0;
	}
	sql = "SELECT IMovCaja FROM DCxP WHERE Sys_PK="+PKDCxP;
	R=OpenRecordset(sql,Application.AdoCnn);
	
	if(R==null)
	{
		eBasic.eMsgbox(ErrDesc + "(Sin acceso a base de datos)");
		return 0;
	}
	
	if ( loadScript("prn_vale","Subprograma de impresión de vales") )
		return prn_vale.ImprimirVale(R("IMovCaja").Value,"PAGO A PROVEEDOR",ErrDesc);	
	else
		return 0;
}


function ConfigImpresora(){
//Configurar los parametros de la impresora que requiera
	Impresora.NombreFuente ("Courier New");
	Impresora.TamFuente (10);

	try{
		Impresora.SetPrinter(NodeVars.EGetSetting(RegAppName,"POSVAR","PRINTER",""));
	}catch(e){
		eBasic.eMsgbox(e.description);
	}
} 