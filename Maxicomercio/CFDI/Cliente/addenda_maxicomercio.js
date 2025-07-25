//v.1.0
//ADDENDA MAXICOMERCIO PARA CFDI 3.0

//estan disponibles todos los objetos de cfdi.js
//mas las siguientes variables globales
/*
TIPO; //1=venta 2=cxc
archivoXML_timbrado; //ubicacion del archivo xml del cfdi timbrado
pkcfd;
pkventa;
pkcxc;
pkcliente;
codigocliente;
nombrecliente;
*/

integrarAddenda();

function integrarAddenda(){
//retornar verdadero para continuar	
	var er="Error al crear addenda MaxiComercio. ";	
	var addenda,mc,vnt,detalles,dv_element,prod_element,element,e2;			
	
try{
	
	//crear objeto venta
	//------------------
	if(TIPO!=1) return -1;
	var venta=eBasic.eCreateObject("EDOFx.Venta");
	if(esInvalido(venta,er+"Error al crear objeto EDOFx.venta")) return 0;
	venta.LoadFromADOConnection(pkventa,"",Application.ADOCnn,3);
				
	//Nodo <Addenda>
	addenda=nuevoElemento("Addenda");
	if(addenda==null) return 0;	
	addenda.Prefix=proccess.getDefault_cfdi_Prefix(); //prefijo para cfdi
	addenda.URI=proccess.getDefault_cfdi_URI();		  //namespace asociado al prefijo
	//------------------
	
	
	
	var sl_enparte="0",np_enconcepto="0";	
	if(loadNumFromGlobalVar("FXCA400x",0)==1) np_enconcepto="1";
	if(loadNumFromGlobalVar("FXCA403x",0)==1) sl_enparte="1";
	
	
	//Nodo <Maxicomerio>
	mc=nuevoElemento("Maxicomercio");
	if(mc==null) return 0;		
	mc.SetMyAttribute("Version","1.0");		
	addenda.Elements.Add(mc);

		//Nodo <Info>
		element=nuevoElemento("Info");
		if(element==null) return 0;	
		element.SetMyAttribute("Notas_partida_concepto",np_enconcepto);
		element.SetMyAttribute("Serie_lote_parte",sl_enparte);
		
		mc.Elements.Add(element);
		
		/*
		//Nodo <Proveedor>
		//Datos del emisor quien se reconoce como proveedor para el cliente
		element=nuevoElemento("Proveedor");
		if(element==null) return 0;	
		element.SetMyAttribute("Codigo","");
		element.SetMyAttribute("Nombre","");
		mc.Elements.Add(element);
		*/
	
		//Nodo <Venta>
		vnt=nuevoElemento("Venta");
		if(vnt==null) return 0;	
		vnt.SetMyAttribute("Documento",venta.Documento+"");
		vnt.SetMyAttribute("Referencia",venta.Referencia+"");
		vnt.SetMyAttribute("Fecha",formatoFecha(venta.Fecha)+"");		
		vnt.SetMyAttribute("Subtotal",venta.Subtotal+"");
		vnt.SetMyAttribute("Descuento1",venta.Descuento1+"");
		vnt.SetMyAttribute("Descuento2",venta.Descuento2+"");
		vnt.SetMyAttribute("Impuesto1",venta.Impuesto1+"");
		vnt.SetMyAttribute("Impuesto2",venta.Impuesto2+"");
		vnt.SetMyAttribute("Impuesto3",venta.Impuesto3+"");
		vnt.SetMyAttribute("Impuesto4",venta.Impuesto4+"");
		vnt.SetMyAttribute("Tipocambio",venta.TipoCambio+"");
		if(venta.DomicilioEntrega!="") vnt.SetMyAttribute("Domicilioentrega",venta.DomicilioEntrega+"");
		if(venta.txtGuia!="") vnt.SetMyAttribute("Txtguia",venta.txtGuia+"");
		vnt.SetMyAttribute("Fembarque",formatoFecha(venta.FEmbarque));
		vnt.SetMyAttribute("Fentrega",formatoFecha(venta.FEntrega));
		vnt.SetMyAttribute("Vencimiento",formatoFecha(venta.Vencimiento));		
		vnt.SetMyAttribute("Formapago",venta.FormaPago+"");
		vnt.SetMyAttribute("Statusentrega",venta.StatusEntrega+"");
		vnt.SetMyAttribute("Statusfinanciero",venta.StatusFinanciero+"");
		if(venta.Notas!="") vnt.SetMyAttribute("Notas",venta.Notas+"");				
		
		mc.Elements.Add(vnt);
			
			//Nodo <Venta.Divisa>
			element=nuevoElemento("Divisa");
			if(element==null) return 0;	
			element.SetMyAttribute("Codigo",venta.IDivisa.Codigo+"");
			element.SetMyAttribute("Descripcion",venta.IDivisa.Descripcion+"");
			
			vnt.Elements.Add(element);
			
			//Nodo <Venta.Folio>			
			element=nuevoElemento("Folio");
			if(element==null) return 0;	
			element.SetMyAttribute("Numero",venta.IFolio.Folio+"");
			element.SetMyAttribute("Serie",venta.IFolio.Block.Serie+"");
			
			vnt.Elements.Add(element);			
			
			//Nodo <Venta.Cconsumo>			
			element=nuevoElemento("Cconsumo");
			if(element==null) return 0;	
			var tcconsumo=venta.ICConsumo.GetStrongObject(true);
			if(esInvalido(tcconsumo,er+"Error al crear objeto EDOFx.CConsumo")) return 0;			
			element.SetMyAttribute("Codigo",tcconsumo.Codigo+"");
			element.SetMyAttribute("Descripcion",tcconsumo.Descripcion+"");
			if(tcconsumo.Notas!="") element.SetMyAttribute("Notas",tcconsumo.Notas+"");
			tcconsumo=null;
			
			vnt.Elements.Add(element);
			
			
				//Nodo <Venta.Cconsumo.talmacen>			
				e2=nuevoElemento("Almacen");
				if(e2==null) return 0;	
				var talmacen=eBasic.eCreateObject("EDOFx.Almacen");
				if(esInvalido(talmacen,er+"Error al crear objeto EDOFx.Almacen")) return 0;
				talmacen.LoadFromADOConnection(venta.ICConsumo.FK_IAlmacen,"",Application.ADOCnn,1);
				e2.SetMyAttribute("Codigo",talmacen.Codigo+"");
				e2.SetMyAttribute("Descripcion",talmacen.Descripcion+"");				
				if(talmacen.eMail!="") e2.SetMyAttribute("Email",talmacen.eMail+"");
				if(talmacen.Fax!="") e2.SetMyAttribute("Fax",talmacen.Fax+"");
				if(talmacen.Telefonos!="") e2.SetMyAttribute("Telefonos",talmacen.Telefonos+"");
				if(talmacen.WebSite!="") e2.SetMyAttribute("Website",talmacen.WebSite+"");				
				talmacen=null;
				
				element.Elements.Add(e2);
	
			//Nodo <Venta.Cliente>			
			element=nuevoElemento("Cliente");
			if(element==null) return 0;
			var tcliente=venta.ICliente.GetStrongObject(true);
			if(esInvalido(tcliente,er+"Error al crear objeto EDOFx.Cliente")) return 0;			
			element.SetMyAttribute("Codigo",tcliente.Codigo+"");
			element.SetMyAttribute("Nombre",tcliente.Nombre+"");			
			element.SetMyAttribute("Rfc",tcliente.RFC+"");
			element.SetMyAttribute("Monedero",tcliente.Monedero+"");
			element.SetMyAttribute("Limitecredito",tcliente.LimiteCredito+"");
			element.SetMyAttribute("Puntos",tcliente.Puntos+"");
			element.SetMyAttribute("Saldo",tcliente.Saldo+"");
			element.SetMyAttribute("Saldopuntos",tcliente.SaldoPuntos+"");			
			tcliente=null;
			
			vnt.Elements.Add(element);
				
				//Nodo <Venta.Cliente.Tipocliente>			
				e2=nuevoElemento("Tipocliente");
				if(e2==null) return 0;	
				var ttipocliente=eBasic.eCreateObject("EDOFx.TipoCliente");
				if(esInvalido(ttipocliente,er+"Error al crear objeto EDOFx.TipoCliente")) return 0;
				ttipocliente.LoadFromADOConnection(venta.ICliente.FK_Tipo,"",Application.ADOCnn,1);				
				e2.SetMyAttribute("Codigo",ttipocliente.Codigo+"");
				e2.SetMyAttribute("Descripcion",ttipocliente.Descripcion+"");
				if(ttipocliente.Notas!="") e2.SetMyAttribute("Notas",ttipocliente.Notas+"");
				
				element.Elements.Add(e2);
	
			//Nodo opcional <Venta.Agente>	
			if(venta.IAgente.Sys_PK>0){
				element=nuevoElemento("Agente");
				if(element==null) return 0;	
				var tagente=venta.IAgente.GetStrongObject(true);
				if(esInvalido(tagente,er+"Error al crear objeto EDOFx.Agente")) return 0;				
				element.SetMyAttribute("Codigo",tagente.Codigo+"");
				element.SetMyAttribute("Nombre",tagente.Nombre+"");	
				if(tagente.eMail!="") element.SetMyAttribute("Email",tagente.eMail+"");	
				if(tagente.Telefono!="") element.SetMyAttribute("Telefono",tagente.Telefono+"");	
				if(tagente.Notas!="") element.SetMyAttribute("Notas",tagente.Notas+"");	
				tagente=null;
				
				vnt.Elements.Add(element);
			}
			
			//Nodo opcional <Venta.Repartidor>	
			if(venta.IRepartidor.Sys_PK>0){
				element=nuevoElemento("Repartidor");
				if(element==null) return 0;	
				var trepartidor=venta.IRepartidor.GetStrongObject(true);
				if(esInvalido(trepartidor,er+"Error al crear objeto EDOFx.Repartidor")) return 0;				
				element.SetMyAttribute("Codigo",trepartidor.Codigo+"");
				element.SetMyAttribute("Nombre",trepartidor.Nombre+"");					
				if(trepartidor.eMail!="") element.SetMyAttribute("Email",trepartidor.eMail+"");	
				if(trepartidor.Telefono!="") element.SetMyAttribute("Telefono",trepartidor.Telefono+"");	
				if(trepartidor.Notas!="") element.SetMyAttribute("Notas",trepartidor.Notas+"");	
				trepartidor=null;
				
				vnt.Elements.Add(element);
			}
			
			//Nodo opcional <Venta.Porteador>	
			if(venta.IPorteador.Sys_PK>0){
				element=nuevoElemento("Porteador");
				if(element==null) return 0;	
				var tporteador=venta.IPorteador.GetStrongObject(true);
				if(esInvalido(tporteador,er+"Error al crear objeto EDOFx.Porteador")) return 0;				
				element.SetMyAttribute("Codigo",tporteador.Codigo+"");
				element.SetMyAttribute("Descripcion",tporteador.Descripcion+"");										
				if(tporteador.Notas!="") element.SetMyAttribute("Notas",tporteador.Notas+"");	
				tporteador=null;
				
				vnt.Elements.Add(element);
			}
	
			//Nodo opcional <Venta.Movcaja>			
			if(venta.IMovCaja.Sys_PK>0){
				element=nuevoElemento("Movcaja");
				if(element==null) return 0;	
				var tmovcaja=venta.IMovCaja.GetStrongObject(true);
				if(esInvalido(tmovcaja,er+"Error al crear objeto EDOFx.MovCaja")) return 0;			
				element.SetMyAttribute("Efectivo",tmovcaja.Efectivo+"");
				element.SetMyAttribute("Tarjetas",tmovcaja.Tarjetas+"");
				element.SetMyAttribute("Vales",tmovcaja.Vales+"");
				element.SetMyAttribute("Depositos",tmovcaja.Depositos+"");
				element.SetMyAttribute("Cheques",tmovcaja.Cheques+"");
				element.SetMyAttribute("Tipocambio",tmovcaja.TipoCambio+"");			
				tmovcaja=null;
				
				vnt.Elements.Add(element);
			}
			
			
			//Nodo <Venta.Detalles>			
			detalles=nuevoElemento("Detalles");
			if(detalles==null) return 0;	
			
			vnt.Elements.Add(detalles);
			
			var ti=0,tdv=null,tproducto;
			for(ti=1;ti<=venta.Detalle.Elements.Count();ti++){						
				tdv=null;
				tdv=venta.Detalle.Elements.Item(ti);
				if(esInvalido(tdv,er+"No se pudo obtener detalle de venta con indice: "+ti)) return 0;
				
				//Nodo Venta.Dventa
				dv_element=nuevoElemento("Dventa");
				if(dv_element==null) return 0;					
				dv_element.SetMyAttribute("Cantidad",tdv.Cantidad+"");
				dv_element.SetMyAttribute("Unidad",tdv.Unidad+"");
				dv_element.SetMyAttribute("Factor",tdv.Factor+"");
				dv_element.SetMyAttribute("Precio",tdv.Precio+"");
				dv_element.SetMyAttribute("Descuento1",tdv.Descuento1+"");
				dv_element.SetMyAttribute("Descuento2",tdv.Descuento2+"");
				dv_element.SetMyAttribute("Impuesto1",tdv.Impuesto1+"");
				dv_element.SetMyAttribute("Impuesto2",tdv.Impuesto2+"");
				dv_element.SetMyAttribute("Impuesto3",tdv.Impuesto3+"");
				dv_element.SetMyAttribute("Impuesto4",tdv.Impuesto4+"");
				dv_element.SetMyAttribute("Tipocambio",tdv.TipoCambio+"");
				if(tdv.Notas!="") dv_element.SetMyAttribute("Notas",tdv.Notas+"");			
				
				detalles.Elements.Add(dv_element);
					
					//Nodo Venta.Dventa.Producto
					prod_element=nuevoElemento("Producto");
					if(prod_element==null) return 0;
					tproducto=null;
					tproducto=tdv.IProducto.GetStrongObject(true);
					if(esInvalido(tproducto,er+"Error al crear objeto EDOFx.Producto")) return 0;	
					prod_element.SetMyAttribute("Codigo",tproducto.Codigo+"");	
					prod_element.SetMyAttribute("Descripcion",tproducto.Descripcion+"");
					prod_element.SetMyAttribute("Unidad",tproducto.Unidad+"");
					if(tproducto.CodBar1!="") prod_element.SetMyAttribute("Codbar1",tproducto.CodBar1+"");
					if(tproducto.CodBar2!="") prod_element.SetMyAttribute("Codbar2",tproducto.CodBar2+"");
					if(tproducto.CodBar3!="") prod_element.SetMyAttribute("Codbar3",tproducto.CodBar3+"");
					prod_element.SetMyAttribute("Diasentrega",tproducto.DiasEntrega+"");
					prod_element.SetMyAttribute("Ppuntos",tproducto.PPuntos+"");										
					if(tproducto.ReqLote){
						prod_element.SetMyAttribute("Reqlote","1");
					}else{
						prod_element.SetMyAttribute("Reqlote","0");
					}					
					if(tproducto.ReqSerie){
						prod_element.SetMyAttribute("Reqserie","1");
					}else{
						prod_element.SetMyAttribute("Reqserie","0");
					}					
					prod_element.SetMyAttribute("Iclase",tproducto.IClase+"");					
					if(tproducto.Notas!="") prod_element.SetMyAttribute("Notas",tproducto.Notas+"");					
					
					dv_element.Elements.Add(prod_element);
					
						//Nodo Venta.Dventa.Producto.Tipoimpuesto
						element=nuevoElemento("Tipoimpuesto");
						if(element==null) return 0;
						element.allowPipes=true;
						element.SetMyAttribute("Nombre",tproducto.Impuestos.Nombre+"");	
						element.SetMyAttribute("I1venta",tproducto.Impuestos.I1Venta+"");	
						element.SetMyAttribute("I2venta",tproducto.Impuestos.I2Venta+"");	
						element.SetMyAttribute("I3venta",tproducto.Impuestos.I3Venta+"");	
						element.SetMyAttribute("I4venta",tproducto.Impuestos.I4Venta+"");	
						
						prod_element.Elements.Add(element);
						
						//Nodo Venta.Dventa.Producto.Linea
						element=nuevoElemento("Linea");
						if(element==null) return 0;
						element.SetMyAttribute("Codigo",tproducto.ILinea.Codigo+"");	
						element.SetMyAttribute("Descripcion",tproducto.ILinea.Descripcion+"");							
						
						prod_element.Elements.Add(element);
						
						//Nodo opcional Venta.Dventa.Producto.Marca
						if(tproducto.IMarca.Sys_PK>0){
							element=nuevoElemento("Marca");
							if(element==null) return 0;
							element.SetMyAttribute("Codigo",tproducto.IMarca.Codigo+"");	
							element.SetMyAttribute("Descripcion",tproducto.IMarca.Descripcion+"");							
							
							prod_element.Elements.Add(element);
						}
						
						//Nodo opcional Venta.Dventa.Producto.Departamento
						if(tproducto.IDepartamento.Sys_PK>0){
							element=nuevoElemento("Departamento");
							if(element==null) return 0;
							element.SetMyAttribute("Codigo",tproducto.IDepartamento.Codigo+"");	
							element.SetMyAttribute("Descripcion",tproducto.IDepartamento.Descripcion+"");							
							
							prod_element.Elements.Add(element);
						}
						
						if(!agregarLotesSeries(prod_element,tdv.Sys_PK,tproducto.ReqLote,tproducto.ReqSerie)){ 
							Log(er+"Error al agregar series y/o lotes");
							return 0;						
						}
						
			
			}//fin for dventa
			
			
	//agregar la addenda al comprobante
	if(proccess.setAddendaInXMLCFDI(archivoXML_timbrado,addenda)){
		return -1;
	}else{
		return 0;
	}
	
	// cfd.new_xmlns(name,value);
	// cfd.new_schemaLocation(location);
	/*
	cfd.new_xmlns("xmlns:otro","http://www.misitio.com.mx");
	cfd.new_schemaLocation("http://www.misitio.com.mx");
	cfd.new_schemaLocation("http://www.misitio.com.mx/miaddenda.xsd");
	*/
	return -1;
	}catch(e){
		Log(e.description);
		throw(e);
		return 0;
	}
}

function nuevoElemento(Nombre){
	if(Nombre==null) Nombre="";
	var newE=eBasic.eCreateObject("geCFD.cMyElement");
	if(esInvalido(newE,"No se pudo crear el elemento "+Nombre+". Error al crear objeto geCFD.cMyElement.")) return null;
	newE.Name=Nombre;
	return newE;
}
function formatoFecha(f){
	return eBasic.eFormat(f,"yyyy-MM-dd");
}

function formatoFechaHora(f){
	return eBasic.eFormat(f,"yyyy-MM-dd HH:mm:ss");
}

function agregarLotesSeries(element_producto,tpkdventa,reqLote,reqSerie){
	var sql="SELECT Lote.Numero AS Lote,Lote.FCaducidad AS LoteFCaducidad,Serie.Numero AS Serie, Serie.Notas AS SerieNotas,DCardex.Salidas FROM (DCardex LEFT JOIN Serie ON DCardex.ISerie=Serie.Sys_PK) LEFT JOIN Lote ON DCardex.ILote=Lote.Sys_PK WHERE (DCardex.ISerie>0 OR DCardex.ILote>0) AND DCardex.RVenta="+tpkdventa+" ORDER BY Lote.Numero,Serie.Numero";
	var r=Application.DataBase.OpenRecordset(sql,Application.ADOCnn);
	if(esInvalido(r,"No se pudo obtener información de series o lotes.")){
		return 0;
	}	
	if(r.EOF && r.BOF){ //no existe cardex o no tiene series o lotes
		r=null;
		return 1;
	}
	
	var la,l,s,notasserie;
	var Lotes,Series,lote,serie,cantidadLote;
	
	la="";
	if(reqLote){
		Lotes=nuevoElemento("Lotes");
		if(Lotes==null) return 0;
		
		cantidadLote=0;
		while(!r.EOF){
			l=null;
			l=r("Lote").Value;			
			if(esInvalido(l,"No se pudo obtener información de lotes.")){
				r=null;
				return 0;
			}	
			if(la!=l){				
				if(la!=""){
					//es un lote creado anteriormente //agregar su cantidad total
					lote.SetMyAttribute("Cantidad",cantidadLote);										
				}
				cantidadLote=0;
					
				lote=nuevoElemento("Lote");
				if(lote==null) return 0;
				lote.SetMyAttribute("Numero",l+"");					
				lote.SetMyAttribute("Fcaducidad",formatoFecha(r("LoteFCaducidad").Value)+"");	
				
				Lotes.Elements.Add(lote);
				la=l;
				
				if(reqSerie){	
					Series=null;				
					Series=nuevoElemento("Series");
					if(Series==null) return 0;
					lote.Elements.Add(Series);
				}
			}
			
			cantidadLote+=r("Salidas").Value;
			
			if(reqSerie){
				s=null;
				s=r("Serie").Value;
				if(esInvalido(s,"No se pudo obtener información de números de serie.")){
					r=null;
					return 0;
				}	
				
				serie=nuevoElemento("Serie");
				if(serie==null) return 0;
				serie.SetMyAttribute("Numero",s+"");	
				notasserie=r("SerieNotas").Value;
				if(notasserie==null) notasserie="";
				if(notasserie!="") serie.SetMyAttribute("Notas",notasserie+"");	
				
				Series.Elements.Add(serie);
			}
			
			r.MoveNext();
			
			if(r.EOF){
				//agregar su cantidad total al ultimo lote
				lote.SetMyAttribute("Cantidad",cantidadLote);	
			}
		}
		
		element_producto.Elements.Add(Lotes);
		
		r.Close();
		r=null;
	}else{
		if(reqSerie){
			Series=null;				
			Series=nuevoElemento("Series");
			if(Series==null) return 0;
			
			while(!r.EOF){
				s=null;
				s=r("Serie").Value;
				if(esInvalido(s,"No se pudo obtener información de números de serie.")){
					r=null;
					return 0;
				}	
				
				serie=nuevoElemento("Serie");
				if(serie==null) return 0;
				serie.SetMyAttribute("Numero",s+"");	
				notasserie=r("SerieNotas").Value;
				if(notasserie==null) notasserie="";
				if(notasserie!="") serie.SetMyAttribute("Notas",notasserie+"");	
				
				Series.Elements.Add(serie);
				
				r.MoveNext();
			}
			element_producto.Elements.Add(Series);
			r.Close();
			r=null;
		}
	}
	
	return 1;	
}
