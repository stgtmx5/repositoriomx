function ImprimirVale(PK,Titulo,ErrDesc){
	var Corte;
	var R;	
	var S;	
	var Val=0;
	var Entero;
	var CodDivisa;
	var Letras;
	var sql;
	
//	sql = "SELECT MovCaja.Cheques, MovCaja.Depositos, MovCaja.Efectivo, MovCaja.Fecha, MovCaja.Hora, MovCaja.Notas,";
//	sql = sql + " MovCaja.Referencia, MovCaja.Tarjetas, MovCaja.Vales, Divisa.Codigo AS CodigoDivisa,";
//	sql	= sql + " Divisa.Descripcion AS DescDivisa, Categoria.Descripcion AS DescCategoria FROM "; 
//	sql = sql + " Categoria INNER JOIN (Divisa INNER JOIN MovCaja ON Divisa.Sys_PK = MovCaja.IDivisa)";
//	sql = sql + " ON Categoria.Sys_PK = MovCaja.ICategoria WHERE MovCaja.Sys_PK=" + PK;

	var sql = "SELECT MovCaja.Cheques, MovCaja.Depositos, MovCaja.Efectivo, MovCaja.Fecha, " +
          "MovCaja.Hora, MovCaja.Notas, MovCaja.Referencia, MovCaja.Tarjetas, MovCaja.Vales, " +
          "Divisa.Codigo AS CodigoDivisa, Divisa.Descripcion AS DescDivisa, " +
          "Categoria.Descripcion AS DescCategoria, Categoria.Sys_PK as pkCategoria " +
          "FROM Categoria INNER JOIN (Divisa INNER JOIN MovCaja ON Divisa.Sys_PK = MovCaja.IDivisa) " +
          "ON Categoria.Sys_PK = MovCaja.ICategoria " +
          "WHERE MovCaja.Sys_PK=" + PK;

	
	R = pos_support.OpenRecordset(sql,Application.ADOCnn);
	//R = pos_support.OpenRecordset(sql,Application.ADOCnn);
	
	if(R==null)
	{
		eBasic.eMsgbox(ErrDesc + "(Sin acceso a base de datos)");
		return 0;
	}
	if(R.EOF && R.BOF){
		eBasic.eMsgbox(ErrDesc + "(No se encontró el elemento con clave primaria= "+PK+")");
		return 0;
	}
	Categoria = R("Notas").Value
	// eBasic.eMsgbox( "Que catogoria  " + R("Notas").Value , 4);
	if (Categoria == "Fondo inicial")
	{
			icategoria = R("pkCategoria").Value
			RCategoria = NodeVars.EGetSetting("Maxicomercio", "Config", "lvar_catIngresXFondoInicial", 0);
			if (Categoria != RCategoria)
			{
				var consulta = "update MovCaja set ICategoria =  " + RCategoria + " where sys_pk = " + PK;
				 Application.ADOCnn.Execute(consulta);
				//var actualizacion = pos_support.OpenRecordset(consulta,Application.ADOCnn);
				R = pos_support.OpenRecordset(sql,Application.ADOCnn);
				//eBasic.eMsgbox( "Se actualizo categoria de Fondoinicial ", 4);
			}
			
	}

	
	pos_support.ConfigImpresora();
	
	Impresora.Texto(Impresora.AligTextInStr(Titulo,30,2," "));
	S= Impresora.SetChr(30,"=");
	Impresora.Texto(S);
	Impresora.Texto( pos_support.Fecha(R("Fecha").Value)+"  "+ pos_support.Hora(R("Hora").Value));
	
	Corte=Application.MainForm.CorteActual();
	
	if(Corte!=null){
		Impresora.Texto(Impresora.AligTextInStr("Cajero: "+Corte.ICajero.Nombre,30,0," "));	
		Impresora.Texto(Impresora.AligTextInStr("Caja: "+Corte.ICaja.Descripcion,30,0," "));	
	}
	
	Impresora.Texto(S);
	Impresora.Texto(Impresora.AligTextInStr("Referencia: "+R("Referencia").Value,30,0," "));	
	Impresora.Texto(Impresora.AligTextInStr("Categoría: "+R("DescCategoria").Value,30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Divisa: "+R("DescDivisa").Value,30,0," "));
	Impresora.Texto(" ");
	
	if(R("Efectivo").Value!=0)
	{ 
		Val=Math.abs(R("Efectivo").Value);
		Val=Impresora.Redondear(Val);
		S=Impresora.AligTextInStr(Impresora.FormatoDinero(Val),15,1," ");
		S=Impresora.AligTextInStr("Efectivo: ",15,1," ")+S;
		Impresora.Texto(S);
	}
	
	if(R("Tarjetas").Value!=0)
	{
		Val=Math.abs(R("Tarjetas").Value);
		Val=Impresora.Redondear(Val);
		S=Impresora.AligTextInStr(Impresora.FormatoDinero(Val),15,1," ");
		S=Impresora.AligTextInStr("Tarjetas: ",15,1," ")+S;
		Impresora.Texto(S);
	}		
	
	if(R("Cheques").Value!=0)
	{
		Val=Math.abs(R("Cheques").Value);
		Val=Impresora.Redondear(Val);
		S=Impresora.AligTextInStr(Impresora.FormatoDinero(Val),15,1," ");
		S=Impresora.AligTextInStr("Cheques: ",15,1," ")+S;
		Impresora.Texto(S);
	}	
	
	if(R("Depositos").Value!=0)
	{
		Val=Math.abs(R("Depositos").Value);
		Val=Impresora.Redondear(Val);
		S=Impresora.AligTextInStr(Impresora.FormatoDinero(Val),15,1," ");
		S=Impresora.AligTextInStr("Depósitos: ",15,1," ")+S;
		Impresora.Texto(S);
	} 		
	
	if(R("Vales").Value!=0){
		Val=Math.abs(R("Vales").Value);
		Val=Impresora.Redondear(Val);
		S=Impresora.AligTextInStr(Impresora.FormatoDinero(Val),15,1," ");
		S=Impresora.AligTextInStr("Vales: ",15,1," ")+S;
		Impresora.Texto(S);
	} 
	
	S=Impresora.SetChr(14,"-");
	S=Impresora.AligTextInStr(S,30,1," ");
	Impresora.Texto(S);
	//IMPRIMIR TOTAL
	
	Val=R("Efectivo").Value+R("Tarjetas").Value+R("Cheques").Value+R("Depositos").Value+R("Vales").Value;	
	Val=Math.abs(Val);
	Val=Impresora.Redondear(Val);
	S=Impresora.AligTextInStr(Impresora.FormatoDinero(Val),15,1," ");
	S=Impresora.AligTextInStr("Total: ",15,1," ")+S;
	Impresora.Texto(S);	
	//LETRAS
	Entero = eBasic.IntVal(Val);
	CodDivisa=R("CodigoDivisa").Value;
	if(CodDivisa.toLowerCase()=="pmx"){
		CodDivisa="M.N.";
	}
	
	Impresora.Texto(" ");	
	Letras=eBasic.NumbersToWords(Entero) +" "+ R("DescDivisa").Value +" "+ eBasic.eFormat((Val-Entero)*100,"00") + "/100 "+CodDivisa;
	Letras=Impresora.getTextMultiLine(Letras,30,0);
	Impresora.Texto(Letras);
	//NOTAS
	Impresora.Texto(" ");
	Impresora.Texto("Notas:");
	S=Impresora.getTextMultiLine(R("Notas").Value,30,0);
	Impresora.Texto(S);
	Impresora.Terminar();
	
	
	return -1;
}
