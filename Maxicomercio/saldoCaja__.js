var fastCount;
var corte;
var montoTotal;
var mDiff;

function corteCajaTerminal(){
	//eBasic.eMsgbox("Iniciando...");
	/*
	*		Return -1 = OK
	*		Return -2 = ERROR
	*
	*/
	
	
	
	if (!checkHabilitado())
		return 0;	
	
	var catEgreso;
	var catIngreso;
	var catEgresoCorte;
	var cajaEfectivo;
	var cajaTarjetas;
	var saldoInicial;
	var saldoFinal;
	var caja;
	var movCaja;
	var eHKCurUser;
	
	var importeEfectivo = 0;
	var importeTarjetas = 0;
	try
	{
		
		
		eHKCurUser = eBasic.eCreateObject("geRunTime.eHKCurUser");
		if(eHKCurUser==null){
			eBasic.eMsgbox("No se pudo crear el objeto eHKCurUser");
			return -2;
		}

		catEgresoCorte=parseInt(eHKCurUser.EGetSetting("Maxicomercio", "Config", "lvar_catEgresoXCorte_tp", "0"));
		catEgreso=parseInt(eHKCurUser.EGetSetting("Maxicomercio", "Config", "lvar_catEgresoXFaltante_tp", "0"));
		catIngreso=parseInt(eHKCurUser.EGetSetting("Maxicomercio", "Config", "lvar_catIngresoXSobrante_tp", "0"));

		if(catEgreso==0||catIngreso==0||catEgresoCorte==0){
			eBasic.eMsgbox("No se encontro categoria predeterminada para Egreso por Faltante, Ingreso por Sobrante o Egreso por corte de caja automatico\nPara configurarlo, dirijase al BackOffice, Panel de control, opciones",1);
			return -2;
		}

		corte = Application.MainForm.CorteActual();	
		caja = corte.ICaja;
		fastCount = eBasic.eCreateObject("CountFastInv.cMain");
		if(fastCount==null){
			eBasic.eMsgbox("No se pudo cargar CountFastInv");
			return -2;
		}
		if(DataAccess==null || Inventario==null) {
			eBasic.eMsgbox("No existe el objeto");
		}
		
		fastCount.SetObjects(DataAccess,Inventario, Application.UIUsers);
		fastCount.CC = caja.CentroConsumo.Sys_PK;
		fastCount.Corte= corte.Sys_PK;
		if(MainForm ==null){
			eBasic.eMsgbox("MainForm no está definido");
		}
		if(Application.MainForm==null){
			eBasic.eMsgbox("Application.MainForm no está definido");
		}
		if(Application.MainForm.CorteActual()==null){
			eBasic.eMsgbox("Application.MainForm.CorteActual no está definido");
		}
		if(LBEfectivo == null){
			eBasic.eMsgbox("LBEfectivo no está definido");
			try{
				LBEfectivo=Application.InternalObject("LBEfectivo");
			}catch(e){
				eBasic.eMsgbox("No se pudo cargar LBEfectivo:\n"+e.message);
				return -2;
			}
		}
		if(gFunciones==null){
			eBasic.eMsgbox("gFunciones no está definido");
		}
		
		cajaEfectivo=LBEfectivo.saldoCaja(caja.Sys_PK,1);
		cajaTarjetas=LBEfectivo.saldoCaja(caja.Sys_PK,3);
		saldoInicial= LBEfectivo.SaldoIncial(corte.Sys_PK, caja.Sys_PK);
		saldoFinal = LBEfectivo.SaldoFinal(corte.Sys_PK);
		
		/*
		/*
		*	COMPARAR CON MONTO CAPTURADO
		*/
		//Aldo 13/02/13
		var montoInicial=getSaldoInicial();
		
		if(montoInicial < 1)
		{
			fastCount=null;
			return -2;
		}
		//Aldo 13/02/13
		
		// Obteniendo total en efectivo sin Monto de Boletos...
		montoTotal = fastCount.CapturarEfectivo();
		var TotalCobradoDeBoletos = TotalCobroBoletos(corte.Sys_PK);
		var montoEfectivo = fastCount.montoefectivo;
		var montoTarjetas = fastCount.cDetCorte.dbtargetas;
		mDiff = TotalCobradoDeBoletos;
		
		if(montoTotal == 0){
			return -2;
		}
		DataAccess.BeginTrans();
		//Egreso de Saldo Inicial
		
		if(montoInicial>0)
		{
			var MC;
			MC=LBEfectivo.ValeEgreso(corte, gFunciones.ReferenciaAleatoria(), "Egreso del fondo inicial", 0, montoInicial, catEgresoCorte, true, true, false);
			if(MC==null){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("No se realizó el egreso del fondo inicial: \n"+LBEfectivo.LastErrorDescrip);
				fastCount=null;
				return -2;
			}
			if(Egreso(MC.Sys_PK)!=-1){
				DataAccess.RollbackTrans();
				fastCount=null;
				return -2;
			}
			cajaEfectivo-=montoInicial;
		}
		//Ingreso  por sobrante
		if(montoEfectivo > cajaEfectivo){
			importeEfectivo = montoEfectivo - cajaEfectivo;
			movCaja=LBEfectivo.ValeIngreso(corte, gFunciones.ReferenciaAleatoria()/*Referencia*/, "Sobrante en efectivo"/*Notas*/, 0, importeEfectivo, catIngreso,true, false );
			if(movCaja==null){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("No se realizo el ingreso por sobrante en efectivo: \n"+LBEfectivo.LastErrorDescrip);
				fastCount=null;
				return -2;
			}
			//eBasic.eMsgbox(movCaja.Sys_PK);
			if(Ingreso(movCaja.Sys_PK)!=-1){
				//return -1;
				DataAccess.RollbackTrans();
				fastCount=null;
				return -2;
			}
		//Egreso por faltante;
		}else if(montoEfectivo < cajaEfectivo){
			importeEfectivo = cajaEfectivo - montoEfectivo;
			movCaja=LBEfectivo.ValeEgreso(corte, gFunciones.ReferenciaAleatoria(), "Faltante en efectivo", 0, importeEfectivo, catEgreso, true, true, false);
			if(movCaja==null){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("No se realizo el egreso por sobrante en efectivo: \n"+LBEfectivo.LastErrorDescrip);
				fastCount=null;
				return -2;
			}
			if(Egreso(movCaja.Sys_PK)!=-1){
				//return -1;
				DataAccess.RollbackTrans();
				fastCount=null;
				return -2;
			}
			importeEfectivo *=-1; 
		}

		// ============================================================================================================
		// ::::::::::::::::::::::::::::::::::::::::::::: T A R J E T A S ::::::::::::::::::::::::::::::::::::::::::::::
		// ============================================================================================================

		//Ingreso  por sobrante
		if(montoTarjetas > cajaTarjetas){
			importeTarjetas = montoTarjetas - cajaTarjetas;
			movCaja=LBEfectivo.ValeIngreso(corte, gFunciones.ReferenciaAleatoria()/*Referencia*/, "Sobrante en tarjeta"/*Notas*/, 0, importeTarjetas, catIngreso,true, false, 2);
			if(movCaja==null){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("No se realizo el ingreso por sobrante: \n"+LBEfectivo.LastErrorDescrip);
				fastCount=null;
				return -2;
			}
			//eBasic.eMsgbox(movCaja.Sys_PK);
			if(Ingreso(movCaja.Sys_PK)!=-1){
				//return -1;
				DataAccess.RollbackTrans();
				fastCount=null;
				return -2;
			}
		//Egreso por faltante;
		}else if(montoTarjetas < cajaTarjetas){
			importeTarjetas = cajaTarjetas - montoTarjetas;
			movCaja=LBEfectivo.Vale_Egreso(corte, gFunciones.ReferenciaAleatoria(), "Faltante en tarjeta", 0, importeTarjetas, catEgreso, true, true, false, 2);
			if(movCaja==null){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("No se realizo el egreso por sobrante: \n"+LBEfectivo.LastErrorDescrip);
				fastCount=null;
				return -2;
			}
			if(Egreso(movCaja.Sys_PK)!=-1){
				//return -1;
				DataAccess.RollbackTrans();
				fastCount=null;
				return -2;
			}
			importeTarjetas *=-1; 
		}

		// ============================================================================================================
		// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		// ============================================================================================================
		
		//Egreso del total en efectivo de la caja
		movCaja = LBEfectivo.ValeEgreso(corte, gFunciones.ReferenciaAleatoria(), "Cierre de caja en efectivo", 0, cajaEfectivo + importeEfectivo, catEgresoCorte, true, true, false);
		if(movCaja==null){
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("No se realizo el egreso del saldo final en efectivo:\n"+LBEfectivo.LastErrorDescrip);
			fastCount=null;
			return -2;
		}
		if(Egreso(movCaja.Sys_PK)!=-1){
			DataAccess.RollbackTrans();
			fastCount=null;
			return -2;
		}
		//Egreso del total en tarjetas de la caja
		if (cajaTarjetas + importeTarjetas > 0)
		{
			movCaja = LBEfectivo.Vale_Egreso(corte, gFunciones.ReferenciaAleatoria(), "Cierre de caja en tarjetas", 0, cajaTarjetas + importeTarjetas, catEgresoCorte, true, true, false, 2);
			if(movCaja==null){
				DataAccess.RollbackTrans();
				eBasic.eMsgbox("No se realizo el egreso del saldo final en tarjetas:\n"+LBEfectivo.LastErrorDescrip);
				fastCount=null;
				return -2;
			}
			if(Egreso(movCaja.Sys_PK)!=-1){
				DataAccess.RollbackTrans();
				fastCount=null;
				return -2;
			}
		}
	}catch(e){
		DataAccess.RollbackTrans();
		eBasic.eMsgbox(e.message);
		fastCount=null;
		return -2;
	}
	
	DataAccess.CommitTrans();
	/*if(fastCount.Contar()){
		if(fastCount.CdxEntrada>0){
			mov_inventario.imprimirValeEntrada(fastCount.CdxEntrada);
		}
		
		if(fastCount.CdxSalida>0){
			mov_inventario.imprimirValeSalida(fastCount.CdxSalida);
		}
	}*/
	//jv 23/04/2013
	//*************************
	imprimirDetalleCorte();
	//*************************
	fastCount=null;
	
	return -1;
}

function configurarConteoRapido(){
	corte = Application.MainForm.CorteActual();
	caja = corte.ICaja;
	fastCount = eBasic.eCreateObject("CountFastInv.cMain");
	fastCount.SetObjects(DataAccess,Inventario, Application.UIUsers);
	fastCount.CC = caja.CentroConsumo.Sys_PK;
	fastCount.Corte= corte.Sys_PK;
	fastCount.Config();
	fastCount=null;	
}

function getSaldoInicial(){
	try
	{
		var Ok;
		var fondo;
		var montoInicial=0;
		var form = eBasic.eCreateObject("ge_sdk_uidlg.UIDlg");
		var obj = form.CreateParamDialog("Establecer fondo inicial de la caja");
		obj.SetHeight(2000);
		obj.Setwidth(4000);
		fondo = obj.CreateNumber("cFondoInicial","Fondo inicial de la caja: ",2500);
		fondo.ControlObject.Buttons(0).Visible=false;
		obj.Controls("cFondoInicial").Value=0;
		//obj.Controls("cSaldoInicial").Value=gettiempo;		
		Ok=obj.ShowDialog();
		if(!Ok)
		{
			return -1;
		}
		else
		{
			return obj.GetValue("cFondoInicial");
		}
	}
	catch(e)
	{
		eBasic.eMsgbox("Error: "+e.message);
		return -1;
	}
}

//dma 04/02/2014
function TotalCobroBoletos(PKCorte){
	return 0;
	/*try{
		var SQLSelect = "SELECT ISNULL(ut_RelVta_Boleto.Importe,0) AS Importe, ISNULL(ut_Boleto.Cortesia,0) AS Cortesia FROM ut_RelVta_Boleto INNER JOIN ut_Boleto ON ut_RelVta_Boleto.IBoleto = ut_Boleto.Sys_PK WHERE ut_RelVta_Boleto.ICorte = " + PKCorte + ";";
		var oRs = Application.ADOCnn.Execute(SQLSelect);
		var Total = 0;

		while(!oRs.EOF)
		{
			if(oRs("Cortesia").Value == 0)
			{
				Total += oRs("Importe").Value;
			}
			oRs.MoveNext();
		}
		
		return Total;
	}
	catch(ex)
	{
		eBasic.eMsgbox(ex.message);
		return 0;
	}*/
}

function checkHabilitado(){
	
	var eHKCurUser;
	var importe = 0;
	var CorteCiego=0;
	
	eHKCurUser = eBasic.eCreateObject("geRunTime.eHKCurUser");
	if(eHKCurUser==null){
		eBasic.eMsgbox("No se pudo crear el objeto eHKCurUser");
		return -2;
	}
	
	CorteCiego=parseInt(eHKCurUser.EGetSetting("Deminus", "Config", "lvar_CorteCiego", "0"));
	if(CorteCiego==0){
		CorteCiego=parseInt(eHKCurUser.EGetSetting("Maxicomercio", "Config", "lvar_CorteCiego", "0"));
	}
	
	if(CorteCiego>0)
		return true;				
	
	return false;
}

//jv 23/04/2013
function imprimirDetalleCorte(){
	try
	{
		var S;
		var sImporte;
		var Letras;
		var stCad="";
		var sql;
		var R;
		var cajero;
		var DivisaPred;
		var DivisaDesc;
		var DivisaCod;
		var caja;
		var user;
		
		DivisaPred=0;
	
		DivisaPred=AppVars.GetTextVar("FXCA013",0);
		
		sql = "Select codigo, descripcion from divisa where sys_PK = " + DivisaPred;
		R = pos_support.OpenRecordset(sql,Application.Adocnn);
		if(R!=null){
			if(!(R.BOF && R.EOF)){
				DivisaDesc = R("descripcion").Value; 
				DivisaCod = R("codigo").Value;
			}
			R=null;
		}

		if(DivisaCod.toLowerCase()=="pmx"){
			DivisaCod="M.N.";
		}
		
		R = null;
		sql = "";
		
		sql = "select Caja.Descripcion as Caja, Cajero.Nombre from (corte inner join Cajero on corte.ICajero = cajero.Sys_PK) inner join caja on corte.icaja = caja.Sys_PK where corte.sys_PK = " + corte.Sys_PK;
		R = pos_support.OpenRecordset(sql,Application.Adocnn);
		if(R!=null){
			if(!(R.BOF && R.EOF)){
				cajero = R("nombre").Value; 
				caja = R("Caja").Value;
			}
			R=null;
		}
		
		stCad = AppVars.GetTextVar("FXCA112", "");
		
		if (stCad=="") {
			Impresora.Texto(Impresora.SetChr(30,"=")); //Imprime 30 veces el caracter "-"
			return;
		}
		
		//Descomponer la cadena en Lineas.
		stCad = eBasic.ReplaceStrChars(stCad, String.fromCharCode(10), "");
		Impresora.MTexto(stCad,String.fromCharCode(13),30,2);
		Impresora.Texto(" ");
				
		R = null;
		sql = "";
		
		sql = "select UserID as usuario from TUser where Sys_PK = " + Application.UIUsers.CurrentUser.Sys_PK;
		R = pos_support.OpenRecordset(sql,Application.Adocnn);
		if(R!=null){
			if(!(R.BOF && R.EOF)){
				user = R("usuario").Value;
			}
			R=null;
		}
		
		S = Impresora.AligTextInStr(" Usuario: " + user,30,0," ");
		Impresora.Texto(S);
		
		S = Impresora.AligTextInStr(" Caja: " + caja,30,0," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" Cajero: " + cajero,30,0," ");
		Impresora.Texto(S);
		
		Impresora.Texto(Impresora.SetChr(30,"=")); //Imprime 30 veces el caracter "-"
		
		Impresora.Texto(" ");
		S=Impresora.AligTextInStr(" Descripci\u00f3n",20,0," ");
		S= S + Impresora.AligTextInStr("Cantidad",10,1," ");
		Impresora.Texto(S);
		Impresora.Texto(" ");
		
		S=Impresora.AligTextInStr(" " + fastCount.cDetCorte.stmoneda50,20,0," ");
		S= S + Impresora.AligTextInStr(fastCount.cDetCorte.dbmoneda50,10,1," ");
		Impresora.Texto(S);
		S=Impresora.AligTextInStr(" " + fastCount.cDetCorte.stmoneda1,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbmoneda1,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stmoneda2,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbmoneda2,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stmoneda5,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbmoneda5,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stmoneda10,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbmoneda10,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stbillete20,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbbillete20,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stbillete50,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbbillete50,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stbillete100,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbbillete100,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stbillete200,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbbillete200,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stbillete500,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbbillete500,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" " + fastCount.cDetCorte.stbillete1000,20,0," ");
		S = S + Impresora.AligTextInStr(fastCount.cDetCorte.dbbillete1000,10,1," ");
		Impresora.Texto(S);

		// -----------------------------------------------------------------------------
		// Fabian 03/05/2024 - Mostrar el detalle de targetas, depositos, etc.
		Impresora.Texto(" ");
		S=Impresora.AligTextInStr(" Otros",20,0," ");
		S= S + Impresora.AligTextInStr("Monto",10,1," ");
		Impresora.Texto(S);
		Impresora.Texto(" ");
		
		S = Impresora.AligTextInStr(" Tarjetas",20,0," ");
		S = S + Impresora.AligTextInStr("$" + fastCount.cDetCorte.dbtargetas,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" Dep\u00f3sitos",20,0," ");
		S = S + Impresora.AligTextInStr("$" + fastCount.cDetCorte.dbdepositos,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" Cheques",20,0," ");
		S = S + Impresora.AligTextInStr("$" + fastCount.cDetCorte.dbcheques,10,1," ");
		Impresora.Texto(S);
		S = Impresora.AligTextInStr(" Vales",20,0," ");
		S = S + Impresora.AligTextInStr("$" + fastCount.cDetCorte.dbvales,10,1," ");
		Impresora.Texto(S);
		// -----------------------------------------------------------------------------
		
		Impresora.Texto(" ");
		
		Impresora.Texto(Impresora.SetChr(30,"=")); //Imprime 30 veces el caracter "-"
		Impresora.Texto(" ");
		S = Impresora.AligTextInStr("     Total: ", 16,0," ");
		sImporte=Impresora.FormatoDinero(montoTotal + mDiff);
		S = S + Impresora.AligTextInStr(sImporte,14,1," ");
		Impresora.Texto(S);
		
		Impresora.Texto(" ");
		
		Letras=eBasic.NumbersToWords(montoTotal + mDiff) + " " + DivisaDesc + " " + "00" + "/100 " + DivisaCod;
		Letras=Impresora.getTextMultiLine(Letras,30,0);
		Impresora.Texto(Letras);
		Impresora.Texto(" ");
		Impresora.Texto(" ");
		
		Impresora.Texto(Impresora.AligTextInStr("Firma", 30, 2, " "));
		Impresora.Texto(" ");
		Impresora.Texto(" ");
		S = Impresora.AligTextInStr(Impresora.SetChr(12,"_"),30,2," ");
		Impresora.Texto(S);
		Impresora.Texto(Impresora.AligTextInStr(cajero, 30,2, " "));

		Impresora.Texto(" ");
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.AligTextInStr("Autoriz\u00f3", 30, 2, " " ));
		Impresora.Texto(" ");
		Impresora.Texto(" ");
		S = Impresora.AligTextInStr(Impresora.SetChr(12,"_"),30,2," ");
		Impresora.Texto(S);
		Impresora.Texto(Impresora.AligTextInStr("Nombre y firma", 30, 2 , " "));
		
		Impresora.Terminar();
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al imprimir detalle de corte. " + e.description);

	}
}