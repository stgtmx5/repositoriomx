
function entradaInventario()
{
	var PKCardex=0;
	PKCardex=Inventario.Entrada();	
	if(PKCardex>0){
		if (eBasic.eMsgbox("¿Desea imprimir el Vale de Entrada?", 4)==6)
					imprimirValeEntrada(PKCardex);	
		
	}else
		if(Inventario.LastErrorDescrip!="") eBasic.eMsgbox(Inventario.LastErrorDescrip);	
}

function imprimirValeEntrada(pkCardex){
	var dbtotal=0;
	var dbSubtotalLinea=0;
	var R,sql,inBandera=0;
	var fech;
	var forma=0.00;
	var entero;
	var Letras;
	var chr="";
	var CodDivisa;
	var DescDivisa;
	

	sql="SELECT Producto.Unidad AS Unidad, Producto.Codigo AS Codigo, Producto.Descripcion AS Descripcion, DCardex.Entradas AS Entradas, DCardex.FK_Cardex_Movimientos AS FK_Cardex_Movimientos, Cardex.Sys_PK AS Sys_PK, Cardex.ICategoria AS ICategoria, Cardex.Descripcion AS Cardex_Desc, Cardex.Fecha AS Fecha, Categoria.Descripcion AS CDescripcion, Almacen.Descripcion AS ADescripcion1, Almacen.Sys_PK AS Sys_PKA, Cardex.Referencia AS Referencia, Producto.ILinea AS ILinea, Linea.Descripcion AS LDescripcion1, Linea.Sys_PK AS Sys_PKL, Linea.Codigo AS LCodigo, DCardex.Cargos AS Cargos, Divisa.Codigo AS CoDivisas, Divisa.Descripcion AS DesDivisa FROM ((((((Producto INNER JOIN DCardex ON Producto.Sys_PK = DCardex.IProducto)  INNER JOIN Cardex ON DCardex.FK_Cardex_Movimientos = Cardex.Sys_PK)  INNER JOIN Categoria ON Cardex.ICategoria = Categoria.Sys_PK)  INNER JOIN Almacen ON DCardex.IAlmacen = Almacen.Sys_PK)  INNER JOIN Linea ON Producto.ILinea = Linea.Sys_PK) INNER JOIN Divisa ON Producto.IDivisa = Divisa.Sys_PK) WHERE Cardex.Sys_PK="+pkCardex+" ORDER BY Linea.Descripcion, Producto.Descripcion;";	
	  
try{	  
		
	R=pos_support.OpenRecordset(sql,Application.AdoCnn);
	
	if(R==null){
		return 0;
	}
pos_support.ConfigImpresora();
	Letras=AppVars.GetTextVar("FXCA108"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
	Letras=AppVars.GetTextVar("FXCA109"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
	Letras=AppVars.GetTextVar("FXCA110"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));	
	Impresora.Texto(Impresora.SetChr(30,"="));
	Impresora.Texto(Impresora.AligTextInStr("ENTRADAS DE INVENTARIO",30,2," "));
	Impresora.Texto(Impresora.SetChr(30,"="));
	fech=eBasic.eFormat(R("Fecha").Value,"DD-MM-YYYY");
	Impresora.Texto(Impresora.AligTextInStr("Fecha: "+fech,30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Cat: "+R("CDescripcion"),30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Referencia: "+R("Referencia"),30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("NOTAS:",30,0," "));
	if(R("Cardex_Desc")!=null)Impresora.Texto(Impresora.getTextMultiline(R("Cardex_Desc"),30,0));
	Impresora.Texto(Impresora.AligTextInStr("Almacén: "+R("ADescripcion1"),30,0," "));	
	Impresora.Texto(Impresora.SetChr(30,"="));
	Impresora.Texto(" ");
	

	while(!R.EOF){
		
			chr="";
			var s="";
			if (R("Sys_PKL").Value!=inBandera)//condicion para imprimir productos de una sola linea
			{
			inBandera=R("Sys_PKL").Value;
		
				if(dbSubtotalLinea!=0)
				{
					Impresora.Texto(" ");
					Impresora.Texto(Impresora.SetChr(30,"_"));
					chr=Impresora.FormatoDinero(dbSubtotalLinea);
					Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+chr,30,1," "));
					//Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+dbSubtotalLinea,30,2," "));
					dbSubtotalLinea=0;
					Impresora.Texto(" ");
		
				}
				else 
				{
		
				}	
		
			bandera=R("Sys_PKL").Value;
			Impresora.Texto(Impresora.AligTextInStr("-LINEA: "+R("LDescripcion1")+"-",30,2,"-"));
			chr=Impresora.AligTextInStr("CÓDIGO: ",9,0," ");
			chr=chr+Impresora.AligTextInStr("DESCRIPCIÓN:",21,0," ");
			Impresora.Texto(chr);
			chr=Impresora.AligTextInStr("CANT: ",8,0," ");
			chr=chr+Impresora.AligTextInStr("UNI: ",7,0," ");
			chr=chr+Impresora.AligTextInStr("COST: ",15,1," ");
			Impresora.Texto(chr);
			Impresora.Texto(" ");
			
		}	


			else 
			{
			chr="";
			/////////////////////////////////////////////////////////bloque de concatenacion de unidad y descripcion
			
			
			chr=Impresora.AligTextInStr(R("Codigo"),9,0," ");
			chr=chr+Impresora.AligTextInStr(R("Descripcion"),21,0,"");
			Impresora.Texto(chr);
			///////////////////////////////////////////////////////////				
			forma=eBasic.eFormat(R("Entradas").Value,"#.000");
			chr=Impresora.AligTextInStr(forma,8,0," ");
			chr=chr+Impresora.AligTextInStr(R("Unidad"),7,0," ");
			chr=chr+Impresora.AligTextInStr(Impresora.FormatoDinero(R("Cargos")),15,1," ");
			Impresora.Texto(chr);
			dbSubtotalLinea+=R("Cargos").Value;
			dbtotal=dbtotal+R("Cargos").Value;
			CodDivisa=R("CoDivisas").Value;
			DescDivisa=R("DesDivisa").Value;
			R.MoveNext();
			
			}
			
	
		//Impresora.Texto(Impresora.AligTextInStr(R("Cargos"),30,0," "));
			//dbtotal=dbtotal+dbSubtotalLinea;
		
		
	}	
	
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.SetChr(30,"_"));
		chr=Impresora.FormatoDinero(dbSubtotalLinea);
		Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+chr,30,1," "));
		//Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+dbSubtotalLinea,30,1," "));
		
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.SetChr(30,"="));
		chr=Impresora.FormatoDinero(dbtotal);
		Impresora.Texto(Impresora.AligTextInStr("Total:"+chr,30,1," "));
		//Impresora.Texto(Impresora.AligTextInStr("Total:   "+dbtotal,30,1," "));
		Impresora.Texto(" ");
		

		

	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Entregó",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Recibió",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Autorizó",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Letras=Application.UIUsers.CurrentUser.UserID;
	Impresora.Texto(Impresora.AligTextInStr("Usuario: "+Letras,30,2," "));
			var Fecha_a,hora_a,x;
		Fecha_a=pos_support.Fecha();
		hora_a=pos_support.Hora();
		x=Fecha_a+"  "+hora_a;
		Impresora.Texto(x);
	Letras=AppVars.GetTextVar("FXCA111"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		
		//------------------------------------------------------------------------------------------------------------*/

		



Impresora.Terminar();
}
catch(e){
			eBasic.eMsgbox("Error:"+e.description);
		}

}


//////////////////////////////////////////Funciôn para salidas de inventario//////////////////////////

function salidasInventario()
{
	var PKCardex=0;
	PKCardex=Inventario.Salida();	
	if(PKCardex>0){
		if (eBasic.eMsgbox("¿Desea imprimir el Vale de Salida?", 4)==6)
					imprimirValeSalida(PKCardex);	
		
	}else
		if(Inventario.LastErrorDescrip!="") eBasic.eMsgbox(Inventario.LastErrorDescrip);	
}

function imprimirValeSalida(pkCardex){
	var dbtotal=0;
	var entero;
	var Letras;
	var dbSubtotalLinea=0;
	var R,sql,inBandera=0;
	var fech;
	var forma=0.00;
	

	sql="SELECT Producto.Unidad AS Unidad, Producto.Codigo AS Codigo, Producto.Descripcion AS Descripcion, DCardex.Salidas AS Salidas, DCardex.FK_Cardex_Movimientos AS FK_Cardex_Movimientos, Cardex.Sys_PK AS Sys_PK, Cardex.ICategoria AS ICategoria, Cardex.Descripcion AS Cardex_Desc, Cardex.Fecha AS Fecha, Categoria.Descripcion AS CDescripcion, Almacen.Descripcion AS ADescripcion1, Almacen.Sys_PK AS Sys_PKA, Cardex.Referencia AS Referencia, Producto.ILinea AS ILinea, Linea.Descripcion AS LDescripcion1, Linea.Sys_PK AS Sys_PKL, Linea.Codigo AS LCodigo, DCardex.Abonos AS Abonos, Divisa.Codigo AS CoDivisas, Divisa.Descripcion AS DesDivisa FROM ((((((Producto INNER JOIN DCardex ON Producto.Sys_PK = DCardex.IProducto)  INNER JOIN Cardex ON DCardex.FK_Cardex_Movimientos = Cardex.Sys_PK)  INNER JOIN Categoria ON Cardex.ICategoria = Categoria.Sys_PK)  INNER JOIN Almacen ON DCardex.IAlmacen = Almacen.Sys_PK)  INNER JOIN Linea ON Producto.ILinea = Linea.Sys_PK) INNER JOIN Divisa ON Producto.IDivisa = Divisa.Sys_PK) WHERE Cardex.Sys_PK="+pkCardex+" ORDER BY Linea.Descripcion, Producto.Descripcion;";	
	  
try{	  
		
	R=pos_support.OpenRecordset(sql,Application.AdoCnn);
	
	if(R==null){
		return 0;
	}
pos_support.ConfigImpresora();
	Letras=AppVars.GetTextVar("FXCA108"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
	Letras=AppVars.GetTextVar("FXCA109"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
	Letras=AppVars.GetTextVar("FXCA110"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));	
	Impresora.Texto(Impresora.SetChr(30,"="));
	Impresora.Texto(Impresora.AligTextInStr("SALIDAS DE INVENTARIO",30,2," "));
	Impresora.Texto(Impresora.SetChr(30,"="));
	fech=eBasic.eFormat(R("Fecha").Value,"DD-MM-YYYY");
	Impresora.Texto(Impresora.AligTextInStr("Fecha: "+fech,30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Cat: "+R("CDescripcion"),30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Referencia: "+R("Referencia"),30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("NOTAS:",30,0," "));
	Impresora.Texto(Impresora.getTextMultiline(R("Cardex_Desc"),30,0));
	Impresora.Texto(Impresora.AligTextInStr("Almacén: "+R("ADescripcion1"),30,0," "));	
	Impresora.Texto(Impresora.SetChr(30,"="));
	Impresora.Texto(" ");
	

	while(!R.EOF){
		
			var chr="";
			var s="";
			if (R("Sys_PKL").Value!=inBandera)//condicion para imprimir productos de una sola linea
			{
			inBandera=R("Sys_PKL").Value;
		
				if(dbSubtotalLinea!=0)
				{
					Impresora.Texto(" ");
					Impresora.Texto(Impresora.SetChr(30,"_"));
					chr=Impresora.FormatoDinero(dbSubtotalLinea);
					Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+chr,30,1," "));
					//Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+dbSubtotalLinea,30,2," "));
					dbSubtotalLinea=0;
					Impresora.Texto(" ");
		
				}
				else 
				{
		
				}	
		
			bandera=R("Sys_PKL").Value;
			Impresora.Texto(Impresora.AligTextInStr("-LINEA: "+R("LDescripcion1")+"-",30,2,"-"));
			chr=Impresora.AligTextInStr("CODIGO: ",9,0," ");
			chr=chr+Impresora.AligTextInStr("DESCRIPCIÓN:",21,0," ");
			Impresora.Texto(chr);
			chr=Impresora.AligTextInStr("CANT: ",8,0," ");
			chr=chr+Impresora.AligTextInStr("UNI: ",7,0," ");
			chr=chr+Impresora.AligTextInStr("COST: ",15,1," ");
			Impresora.Texto(chr);
			Impresora.Texto(" ");
			
		}	


			else 
			{
			chr="";
			chr=Impresora.AligTextInStr(R("Codigo"),9,0," ");
			chr=chr+Impresora.AligTextInStr(R("Descripcion"),21,0,"");
			Impresora.Texto(chr);
			///////////////////////////////////////////////////////////				
			forma=eBasic.eFormat(R("Salidas").Value,"#.000");
			chr=Impresora.AligTextInStr(forma,8,0," ");
			chr=chr+Impresora.AligTextInStr(R("Unidad"),7,0," ");
			chr=chr+Impresora.AligTextInStr(Impresora.FormatoDinero(R("Abonos")),15,1," ");
			Impresora.Texto(chr);
			dbSubtotalLinea+=R("Abonos").Value;
			dbtotal=dbtotal+R("Abonos").Value;
			R.MoveNext();
		
			
			}
			
	
				
	}	
	
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.SetChr(30,"_"));
		chr=Impresora.FormatoDinero(dbSubtotalLinea);
		Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+chr,30,1," "));
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.SetChr(30,"="));
		chr=Impresora.FormatoDinero(dbtotal);
		Impresora.Texto(Impresora.AligTextInStr("Total:"+chr,30,1," "));
		Impresora.Texto(" ");
			Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Entregó",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Recibió",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr(" Autorizó",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Letras=Application.UIUsers.CurrentUser.UserID;
	Impresora.Texto(Impresora.AligTextInStr("Usuario: "+Letras,30,2," "));
		var Fecha_a,hora_a,x;
		Fecha_a=pos_support.Fecha();
		hora_a=pos_support.Hora();
		x=Fecha_a+" "+hora_a;
		Impresora.Texto(x);
	Letras=AppVars.GetTextVar("FXCA111"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));

Impresora.Terminar();
}
catch(e){
			eBasic.eMsgbox("Error:"+e.description);
		}

}

function Traspaso_producto()
{
	var Ref;
	
	try{
		Ref=gFunciones.ReferenciaAleatoria();
		if(Inventario.Traspaso(Application.CurrentDate(),Ref))
		//if(Inventario.Traspaso())
				if (eBasic.eMsgbox("¿Desea imprimir el traspaso?", 4)==6)
						imprimirTraspaso(Ref);
		}
		catch(e){
			eBasic.eMsgbox("Error:"+e.description);
		}
}
	////////////////////////////////////////////////////Funcion de traspaso

function Traspaso_producto()
{
	var Ref;
	
	try{
		Ref=gFunciones.ReferenciaAleatoria();
		if(Inventario.Traspaso(Application.CurrentDate(),Ref))
		//if(Inventario.Traspaso())
				if (eBasic.eMsgbox("¿Desea imprimir el traspaso?", 4)==6)
						imprimirTraspaso(Ref);
		}
		catch(e){
			eBasic.eMsgbox("Error:"+e.description);
		}
}
	
function imprimirTraspaso(Ref){
	var dbtotal=0;
	var dbSubtotalLinea=0;
	var R,R2,sql,sql2,inBandera=0;
	var fech;
	var forma=0.00;
	var entero;
	var Letras;
	var chr="";

	sql= "SELECT DCardex.Salidas AS DCSalidas, Producto.Unidad AS PUnidad, Producto.Codigo AS PCodigo, Producto.Descripcion AS PDescripcion, Linea.Codigo AS LCodigo, Linea.Descripcion AS LDescripcion, Cardex.Fecha AS CFecha, Categoria.Sys_PK AS CatSys_PK, Categoria.Descripcion AS CatDescripcion, DCardex.Referencia AS DCReferencia, Almacen.Descripcion AS ADescripcion, Almacen.Sys_PK AS ASys_PK, Cardex.Descripcion AS CardexDescripcion, Cardex.Referencia AS CardexReferencia, DCardex.Abonos AS Abonos FROM (((((Cardex INNER JOIN DCardex ON Cardex.Sys_PK = DCardex.FK_Cardex_Movimientos)  INNER JOIN Producto ON DCardex.IProducto = Producto.Sys_PK)  INNER JOIN Almacen ON DCardex.IAlmacen = Almacen.Sys_PK)  INNER JOIN Categoria ON Cardex.ICategoria = Categoria.Sys_PK)  INNER JOIN Linea ON Producto.ILinea = Linea.Sys_PK) where Cardex.Referencia ='"+Ref+"' ORDER BY Linea.Descripcion, Producto.Descripcion;";	
	
	sql2= "SELECT Almacen.Codigo as ALCodigo, Almacen.Descripcion as ALDescripcion FROM Almacen INNER JOIN (Cardex INNER JOIN DCardex ON Cardex.Sys_PK = DCardex.FK_Cardex_Movimientos) ON Almacen.Sys_PK = DCardex.IAlmacen WHERE Cardex.Referencia='"+Ref+"-T"+"'";
	

try{	  
	
	R=pos_support.OpenRecordset(sql,Application.AdoCnn);
	R2=pos_support.OpenRecordset(sql2,Application.AdoCnn);
	if(R==null | R2==null){
		return 0;
	}
		
	pos_support.ConfigImpresora();
	Letras=AppVars.GetTextVar("FXCA108"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
	Letras=AppVars.GetTextVar("FXCA109"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
	Letras=AppVars.GetTextVar("FXCA110"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));	
	Impresora.Texto(Impresora.SetChr(30,"="));
	Impresora.Texto(Impresora.AligTextInStr("TRASPASO",30,2," "));
	Impresora.Texto(Impresora.SetChr(30,"="));
	fech=eBasic.eFormat(R("CFecha").Value,"DD-MM-YYYY");
	Impresora.Texto(Impresora.AligTextInStr("Fecha: "+fech,30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Cat: "+R("CatDescripcion"),30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Ref Ent: "+R("CardexReferencia"),30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Ref Sal: "+R("CardexReferencia")+"-T",30,0," "));
	Impresora.Texto(Impresora.AligTextInStr("Alm Orig: "+R("ADescripcion"),30,0," "));	
	Impresora.Texto(Impresora.AligTextInStr("Alm Des: "+R2("ALDescripcion"),30,0," "));	
	Impresora.Texto(Impresora.AligTextInStr("Notas:"+R("CardexDescripcion"),30,0," "));
	Impresora.Texto(Impresora.SetChr(30,"="));
	Impresora.Texto(" ");
			
	while(!R.EOF){
		
			chr="";
			var s="";
			if (R("LDescripcion").Value!=inBandera)//condicion para imprimir productos de una sola linea
			{
			inBandera=R("LDescripcion").Value;
		
				if(dbSubtotalLinea!=0)
				{
					Impresora.Texto(" ");
					Impresora.Texto(Impresora.SetChr(30,"_"));
					chr=Impresora.FormatoDinero(dbSubtotalLinea);
					Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+chr,30,1," "));
					//Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+dbSubtotalLinea,30,2," "));
					dbSubtotalLinea=0;
					Impresora.Texto(" ");
		
				}
				else 
				{
		
				}	
			
			bandera=R("LDescripcion").Value;
			Impresora.Texto(Impresora.AligTextInStr("-LINEA: "+R("LDescripcion")+"-",30,2,"-"));
			chr=Impresora.AligTextInStr("CÓDIGO: ",9,0," ");
			chr=chr+Impresora.AligTextInStr("DESCRIPCIÓN:",21,0," ");
			Impresora.Texto(chr);
			chr=Impresora.AligTextInStr("CANT: ",8,0," ");
			chr=chr+Impresora.AligTextInStr("UNI: ",7,0," ");
			chr=chr+Impresora.AligTextInStr("COST: ",15,1," ");
			Impresora.Texto(chr);
			Impresora.Texto(" ");
				
		}	

		
			else 
			{
			chr="";
			/////////////////////////////////////////////////////////bloque de concatenacion de unidad y descripcion
			
			
			chr=Impresora.AligTextInStr(R("PCodigo"),9,0," ");
			chr=chr+Impresora.AligTextInStr(R("PDescripcion"),21,0,"");
			Impresora.Texto(chr);
			///////////////////////////////////////////////////////////				
			forma=eBasic.eFormat(R("DCSalidas").Value,"#.000");
			chr=Impresora.AligTextInStr(forma,8,0," ");
			chr=chr+Impresora.AligTextInStr(R("PUnidad"),7,0," ");
			chr=chr+Impresora.AligTextInStr(Impresora.FormatoDinero(R("Abonos")),15,1," ");
			Impresora.Texto(chr);
			dbSubtotalLinea+=R("Abonos").Value;
			dbtotal=dbtotal+R("Abonos").Value;
			R.MoveNext();
			}
			
	
		//Impresora.Texto(Impresora.AligTextInStr(R("Cargos"),30,0," "));
			//dbtotal=dbtotal+dbSubtotalLinea;
		
		
	}	
	
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.SetChr(30,"_"));
		chr=Impresora.FormatoDinero(dbSubtotalLinea);
		Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+chr,30,1," "));
		//Impresora.Texto(Impresora.AligTextInStr("Total Linea:"+dbSubtotalLinea,30,1," "));
		
		Impresora.Texto(" ");
		Impresora.Texto(Impresora.SetChr(30,"="));
		chr=Impresora.FormatoDinero(dbtotal);
		Impresora.Texto(Impresora.AligTextInStr("Total:"+chr,30,1," "));
		//Impresora.Texto(Impresora.AligTextInStr("Total:   "+dbtotal,30,1," "));
		Impresora.Texto(" ");
		
				//impresion del total en letras----------------------------------------------
			Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Entregó",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr("Recibió",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto(Impresora.SetChr(30,"_"));
	Impresora.Texto(Impresora.AligTextInStr(" Autorizó",30,2," "));
	Impresora.Texto("");
	Impresora.Texto("");
	Impresora.Texto("");
	Letras=Application.UIUsers.CurrentUser.UserID;
	Impresora.Texto(Impresora.AligTextInStr("Usuario: "+Letras,30,2," "));
		var Fecha_a,hora_a,x;
		Fecha_a=pos_support.Fecha();
		hora_a=pos_support.Hora();
		x=Fecha_a+" "+ hora_a + " Hrs.";
		Impresora.Texto(x);

	
	Letras=AppVars.GetTextVar("FXCA111"," ");
	Impresora.Texto(Impresora.getTextMultiLine(""+Letras,30,0));
		
		//------------------------------------------------------------------------------------------------------------*/

Impresora.Terminar();
}
catch(e){
			eBasic.eMsgbox("Error:"+e.description);
		}

}

function historialCXEntradas()
{
	if (!ModuleLoaded("us_historialcardex_entradas"))
	{
		loadScript("us_historialcardex_entradas","(Subprograma Funciones de movimientos de inventario)");
	}
	
var pk=	us_historialcardex_entradas.ShowBrowser();
if (pk > 0) imprimirValeEntrada(pk);

	
}


function historialCXSalidas()
{
	if (!ModuleLoaded("us_historialcardex_salidas"))
	{
		loadScript("us_historialcardex_salidas","(Subprograma Funciones de movimientos de inventario)");
	}
	
	var pk=	us_historialcardex_salidas.ShowBrowser();
	if (pk > 0) imprimirValeSalida(pk);
}

function historialCXTraspaso()
{
	if (!ModuleLoaded("us_historialcardex_traspasos"))
	{
		loadScript("us_historialcardex_traspasos","(Subprograma Funciones de movimientos de inventario)");
	}
	
	var ref=us_historialcardex_traspasos.ShowBrowser();
	if (ref != null) {
		if (ref != ""){ 
			ref=AcortarRef(ref);
			imprimirTraspaso(ref);
	
		}
	
	
	
 	}
	
}

function AcortarRef(ref){
var longitud;
var mensaje = ref;
longitud = mensaje.length - 2;
var referencia = mensaje.substring(0, longitud);
return referencia;
}



