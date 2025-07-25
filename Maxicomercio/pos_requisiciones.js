function dlgbrowser() {
	try {
		// Validar ping con lógica completa
		// Crear objetos después de validar ping
		UIRequisiciones.createObjects();

		// Ejecutar flujo principal
		UIRequisiciones.uiDocFlujo.ModoEjecucion = 2;
		var oAction = UIRequisiciones.uiDocFlujo.dlgBrowserDocumentosFlujo();

		if (!oAction || oAction.Sys_PK <= 0) {
			return 0;
		}

		if (oAction.Action == 1) {
			imprimirRequisicion(oAction.Sys_PK);
		} else if (oAction.Action == 3) {
			imprimirDiferencia(oAction.Sys_PK);
		}
	} catch (e) {
		try {
			eBasic.eMsgbox("Error en dlgbrowser: " + e.message);
		} catch (e2) {
			alert("Error en dlgbrowser.");
		}
	}
}

/*
function dlgbrowser()
{
	UIRequisiciones.uiDocFlujo.ModoEjecucion = 2;
	var oAction;
	oAction= UIRequisiciones.uiDocFlujo.dlgBrowserDocumentosFlujo();
	
	if(oAction == null)	
	{
		return 0;
	}
	
	if(oAction != null)
	{
		if(oAction.Sys_PK > 0 && oAction.Action == 1)
		{
			imprimirRequisicion(oAction.Sys_PK);
		}
	}
	
	if(oAction != null)
	{
		if(oAction.Sys_PK > 0 && oAction.Action == 3)
		{
			imprimirDiferencia(oAction.Sys_PK);
		}
	}
}
*/
function imprimirRequisicion(pkDoc)
{
	var dbtotal=0;
	var dbSubtotalLinea=0;
	var R,sql,sql2,sql3,inbandera=0;
	var R2=null;
	var R3=null;
	var fech;
	var forma=0.00;
	var entero;
	var Letras;
	var chr="";
	var CodDivisa;
	var DescDivisa;
	var almacenorigen,almacendestino;
	
	sql="select linea.Sys_pk as lsys_pk, linea.Descripcion as ldescripcion, FoliosDocumentos.Folio as Folio, BlockDocumentos.Serie as Serie, docf_Documento.IAlmacen, docf_Documento.IAlmacen_Destino, docf_Documento.sys_dtcreated, docf_DDocumento.Cantidad,docf_DDocumento.Unidad, Producto.Codigo, producto.Descripcion as pdescripcion from (((docf_Documento inner join (docf_DDocumento inner join (Producto inner join linea on producto.ilinea=linea.sys_pk) on docf_DDocumento.IProducto=Producto.Sys_PK) on docf_Documento.sys_pk=docf_DDocumento.IDocumento) inner join Foliosdocumentos on docf_Documento.IFolio = FoliosDocumentos.Sys_PK) inner join BlockDocumentos on FoliosDocumentos.Block = BlockDocumentos.Sys_PK) where docf_documento.sys_pk="+pkDoc+" GROUP BY linea.Sys_pk, linea.Descripcion, docf_Documento.IAlmacen, docf_Documento.IAlmacen_Destino, docf_Documento.sys_dtcreated, docf_DDocumento.Cantidad,docf_DDocumento.Unidad, Producto.Codigo, producto.Descripcion, FoliosDocumentos.Folio, BlockDocumentos.Serie ORDER BY Linea.Descripcion, Producto.Descripcion;"; 
	

	try
	{
		R=pos_support.OpenRecordset(sql,Application.AdoCnn);
		if(R==null)
		{
			eBasic.eMsgbox("No hay requisiciones nuevas");
			Impresora.Terminar();
			return 0;			
		}
		almacenorigen=R("IAlmacen");
		almacendestino=R("IAlmacen_Destino");
		sql2="select Almacen.Descripcion from Almacen where Almacen.Sys_pk="+almacenorigen+";";
		sql3="select Almacen.Descripcion from Almacen where Almacen.Sys_pk="+almacendestino+";";
		R2=pos_support.OpenRecordset(sql2,Application.AdoCnn);		
		R3=pos_support.OpenRecordset(sql3,Application.AdoCnn);
		pos_support.ConfigImpresora();
				
		Letras=AppVars.GetTextVar("FXCA108"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Letras=AppVars.GetTextVar("FXCA109"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Letras=AppVars.GetTextVar("FXCA110"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Impresora.Texto(Impresora.SetChr(30,"="));
		Impresora.Texto(Impresora.AligTextInStr("REQUISICIÓN" ,30,2," "));
		Impresora.Texto(Impresora.SetChr(30,"="));
		fech=eBasic.eFormat(R("sys_dtcreated").Value,"DD-MM-YYYY");
		Impresora.Texto(Impresora.AligTextInStr("Fecha: "+fech,30,0," "));
		Impresora.Texto(Impresora.getTextMultiLine("Referencia: " + R("Serie") + eBasic.eFormat (R("Folio"), "000000"),30,0));
		
		Impresora.Texto(Impresora.getTextMultiLine("Almacén que solicita: "+R2("Descripcion"),30,0));
		if(R3==null)
		{
			Impresora.Texto(Impresora.getTextMultiLine("Almacén que surte: ",30,0));
		}
		else
		{
			Impresora.Texto(Impresora.getTextMultiLine("Almacén que surte: "+R3("Descripcion"),30,0));
		}
		
		
		Impresora.Texto(Impresora.SetChr(30,"="));
		Impresora.Texto(" ");
		
		while(!R.EOF)
		{
			if(R("lsys_pk").Value!=inbandera)
			{
				inbandera=R("lsys_pk").Value;
				Impresora.Texto(Impresora.AligTextInStr("-LINEA: "+R("ldescripcion")+"-",30,2,"-"));
				chr=Impresora.aligTextInStr("CANTIDAD: ",11,0," ");
				chr=chr+Impresora.aligTextInStr("UNIDAD: ",8,0," ");
				chr=chr+Impresora.aligTextInStr("CÓDIGO: ",11,0," ");
				Impresora.Texto(chr);
				Impresora.Texto(Impresora.aligTextInStr("DESCRIPCIÓN: ",30,0," "));
				Impresora.Texto(" ");
			}
			else
			{
				chr="";
				entero=eBasic.eFormat(R("Cantidad").Value,"#.000");
				chr=Impresora.aligTextInStr(entero,11,0," ");
				chr=chr+Impresora.aligTextInStr(R("Unidad"),8,0," ");
				chr=chr+Impresora.aligTextInStr(R("Codigo"),11,0," ");
				Impresora.Texto(chr);
				Impresora.Texto(Impresora.aligTextInStr(R("pdescripcion"),30,0," "));
				Impresora.Texto(" ");
				R.MoveNext();
			}			
		}
		Letras=Application.UIUsers.CurrentUser.UserID;
		Impresora.Texto(Impresora.AligTextInStr("Usuario: "+Letras,30,2," "));
			var Fecha_a,hora_a,x;
		Fecha_a=pos_support.Fecha();
		hora_a=pos_support.Hora();
		x=Fecha_a+"  "+hora_a;
		Impresora.Texto(x);
		Letras=AppVars.GetTextVar("FXCA111"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Impresora.Terminar();
		
	}
	catch(ex)
	{
		eBasic.eMsgbox("Error: "+ex.description);
		Impresora.Terminar();
	}
}

function imprimirDiferencia(pkDoc)
{
	var dbtotal=0;
	var dbSubtotalLinea=0;
	var R,sql,sql2,sql3,inbandera=0;
	var R2=null;
	var R3=null;
	var fech;
	var forma=0.00;
	var entero, ejercido;
	var Letras;
	var chr="";
	var CodDivisa;
	var DescDivisa;
	var almacenorigen,almacendestino;
	
	sql="select linea.Sys_PK as lsys_pk, linea.Descripcion as ldescripcion, docf_Documento.IAlmacen, docf_Documento.IAlmacen_Destino, docf_Documento.sys_dtcreated, docf_DDocumento.Cantidad, docf_DDocumento.Unidad, Producto.Codigo, producto.Descripcion as pdescripcion, BlockDocumentos.Serie,FoliosDocumentos.Folio,docf_DDocumento.Ejercido  from (docf_Documento inner join (docf_DDocumento inner join (Producto inner join linea on producto.ilinea=linea.sys_pk) on docf_DDocumento.IProducto=Producto.Sys_PK) on docf_Documento.sys_pk=docf_DDocumento.IDocumento)INNER JOIN (FoliosDocumentos INNER JOIN BlockDocumentos on FoliosDocumentos.Block=BlockDocumentos.sys_pk) ON docf_Documento.Ifolio=FoliosDocumentos.sys_pk where (docf_documento.sys_pk="+pkDoc+") AND (docf_DDocumento.Cantidad>docf_DDocumento.Ejercido)"; 
	

	try
	{
		R=pos_support.OpenRecordset(sql,Application.AdoCnn);
		if(R==null)
		{
			eBasic.eMsgbox("Documento surtido correctamente.",6);
			Impresora.Terminar();
			return 0;			
		}
		
		almacenorigen=R("IAlmacen");
		almacendestino=R("IAlmacen_Destino");
		sql2="select Almacen.Descripcion from Almacen where Almacen.Sys_pk="+almacenorigen+";";
		sql3="select Almacen.Descripcion from Almacen where Almacen.Sys_pk="+almacendestino+";";
		R2=pos_support.OpenRecordset(sql2,Application.AdoCnn);		
		R3=pos_support.OpenRecordset(sql3,Application.AdoCnn);
		pos_support.ConfigImpresora();
				
		Letras=AppVars.GetTextVar("FXCA108"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Letras=AppVars.GetTextVar("FXCA109"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Letras=AppVars.GetTextVar("FXCA110"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Impresora.Texto(Impresora.SetChr(30,"="));
		Impresora.Texto(Impresora.AligTextInStr("REQUISICIÓN" ,30,2," "));
		Impresora.Texto(Impresora.SetChr(30,"="));
		fech=eBasic.eFormat(R("sys_dtcreated").Value,"DD-MM-YYYY");
		Impresora.Texto(Impresora.AligTextInStr("Fecha: "+fech,30,0," "));
		Impresora.Texto(Impresora.getTextMultiLine("Referencia: " + R("Serie") + eBasic.eFormat (R("Folio"), "000000"),30,0));
		
		Impresora.Texto(Impresora.getTextMultiLine("Almacén que solicita: "+R2("Descripcion"),30,0));
		if(R3==null)
		{
			Impresora.Texto(Impresora.getTextMultiLine("Almacén que surte: ",30,0));
		}
		else
		{
			Impresora.Texto(Impresora.getTextMultiLine("Almacén que surte: "+R3("Descripcion"),30,0));
		}
		
		
		Impresora.Texto(Impresora.SetChr(30,"="));
		Impresora.Texto(" ");
		
		while(!R.EOF)
		{
			if(R("lsys_pk").Value!=inbandera)
			{
				inbandera=R("lsys_pk").Value;
				Impresora.Texto(Impresora.AligTextInStr("-LINEA: "+R("ldescripcion")+"-",30,2,"-"));
				chr=Impresora.aligTextInStr("CÓDIGO: ",11,0," ");
				chr=chr+Impresora.aligTextInStr("UNIDAD: ",18,0," ");
				Impresora.Texto(chr);
				Impresora.Texto(Impresora.aligTextInStr("DESCRIPCIÓN: ",30,0," "));
				chr=Impresora.aligTextInStr("CANTIDAD: ",11,0," ");
				chr=chr+Impresora.aligTextInStr("EJERCIDO: ",11,0," ");
				Impresora.Texto(chr);
				Impresora.Texto(" ");
			}
			else
			{
				chr="";
				entero=eBasic.eFormat(R("Cantidad").Value,"#.000");
				ejercido=eBasic.eFormat(R("Ejercido").Value,"#.000");
				chr=Impresora.aligTextInStr(R("Codigo"),11,0," ");
				chr=chr+Impresora.aligTextInStr(R("Unidad"),18,0," ");
				//chr=chr+Impresora.aligTextInStr(,11,0," ");
				Impresora.Texto(chr);
				Impresora.Texto(Impresora.aligTextInStr(R("pdescripcion"),30,0," "));
				chr=Impresora.aligTextInStr(entero,11,0, " ");
				chr=chr+Impresora.aligTextInStr(ejercido,11,0, " ");
				Impresora.Texto(chr);
				Impresora.Texto(" ");
				R.MoveNext();
			}			
		}
		Letras=Application.UIUsers.CurrentUser.UserID;
		Impresora.Texto(Impresora.AligTextInStr("Usuario: "+Letras,30,2," "));
			var Fecha_a,hora_a,x;
		Fecha_a=pos_support.Fecha();
		hora_a=pos_support.Hora();
		x=Fecha_a+"  "+hora_a;
		Impresora.Texto(x);
		Letras=AppVars.GetTextVar("FXCA111"," ");
		Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		Impresora.Terminar();
		
	}
	catch(ex)
	{
		eBasic.eMsgbox("Error: "+ex.description);
		Impresora.Terminar();
	}
}



