//Consultas CRM - Es necesario establecer el motor de la base de datos sobre la que se ejecutarán las consultas.
var cObj = Application.InternalObject("UIDef");
//Almacenará el motor de la base de datos, dependiendo de ello tomará las consultas sql a ejecutar. 1: SQLServer, 2: MySQL, 3: MSAccess.
var motorBD = cObj.inDataBaseType;
var count = 10; //Cantidad de ventas a mostrar en datos generales del Cliente
var ACRM;

/*
Modificaciones:
1. Colocar el parámetro en correcto en el archivo HTML cliente_template.html
2. Realizar el reemplazo del parámetro en el método readHTML
*/

//Lee la plantilla del cliente, reemplaza los parametros necesario y devuelve una cadena HTML que será leida por la aplicación.
function readHTML(Cliente, type)
{
	//motorBD = type;
	var stAcumulado;
	var Acumulado;
	var AcumuladoPasado;
	var StAcumuladoPasado;
	var Saldo;
	var StSaldo;
	try
	{
		var html = "";
		
		html = eBasic.LoadFileToStr(eBasic.AddSlashPath(GetRepository())+"\\Templates\\TmpCliente.html");
		
		html = html.replace("@Nombre", Cliente.Nombre);
		html = html.replace("@Codigo", Cliente.Codigo);
		html = html.replace("@RFC", Cliente.RFC);
		html = html.replace("@Telefono", Cliente.Telefonos);
		html = html.replace("@EMail", "<a href=\"mailto:"+Cliente.EMail+"? target=\"_top\">"+Cliente.EMail+"</a>");
		
		if(Cliente.Website!=null)
		{
			if(Cliente.Website!="")
			{
				html = html.replace("@Web", "<p style=\"font-family:MS Sans Serif;font-weight:bold;color:blue;font-size:12px;\">Página web: <a href=\"http:\\\\" + Cliente.Website + "\" target=\"_blank\">"+Cliente.Website+"</a></p>");
		
			}
			else
			{
				html = html.replace("@Web","");	
		
			}
		}
		else
		{
			html = html.replace("@Web","");	
		}
		
		/*Agregar domicilio del cliente*/
		if(Cliente.Domicilio1!=null)
		{
			html = html.replace("@Domicilio", getDomicilio(Cliente.Domicilio1.Sys_PK))	
		}
		else
		{
			html = html.replace("@Domicilio", "")	
		}
		
		
		var html2 = "";
		if(Cliente.Contacto1!=null)
		{
			html2 = getContacto(Cliente.Contacto1.Sys_PK, html2);
		}
		
		if(Cliente.Contacto2!=null)
		{
			html2 = getContacto(Cliente.Contacto2.Sys_PK, html2);
		}
		
		if(Cliente.Contacto3!=null)
		{
			html2 = getContacto(Cliente.Contacto3.Sys_PK, html2);
		}
		
		html = html.replace("@Contactos", html2);
		
		Saldo = Cliente.Saldo;
		StSaldo = formatNumber(Saldo,"$");
		html = html.replace("@Saldo", StSaldo);
		
		html = html.replace("@SaldoVencido", SaldoVencido(Cliente.Sys_PK))
		html = html.replace("@Ventas", getVentas(Cliente.Sys_PK));
		Acumulado =  SalesYear(Cliente.Sys_PK, getYear());
		stAcumulado = formatNumber(Acumulado,"$");
		html = html.replace("@Acumulado", stAcumulado);
		AcumuladoPasado = SalesYear(Cliente.Sys_PK, getYear() - 1);
		StAcumuladoPasado = formatNumber(AcumuladoPasado,"$");
		html = html.replace("@AcumuladoPasado", StAcumuladoPasado);
		Acumulado = Acumulado / getMonth();
		stAcumulado = formatNumber(Acumulado,"$");
		html = html.replace("@PromedioMensual",stAcumulado);
		AcumuladoPasado = AcumuladoPasado / 12;
		StAcumuladoPasado = formatNumber(AcumuladoPasado,"$");
		html = html.replace("@PromedioMensualPasado",StAcumuladoPasado);
		html = html.replace("@Antiguedad", AntiguedadSaldos(Cliente.Sys_PK));
		
		return html;
	}
	catch(e)
	{
		//eBasic.eMsgbox("Error en método readHTML: " + e.descripcion);
		return "";
	}
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

function getDomicilio(PKDomicilio)
{
	var d = "";
	try
	{
	
		switch(motorBD)
		{
			case 2:
				sql = "Select ifnull(domicilio.Colonia,'') as Colonia, ifnull(domicilio.Direccion,'') as Direccion, ifnull(domicilio.CodPos,0) as CP, ifnull(domicilio.Telefonos,'') as Telefonos, ifnull(Ciudad.Nombre, '') as Ciudad, ifnull(edoprov.Nombre,'') as Estado from domicilio left join Ciudad on domicilio.iciudad = Ciudad.Sys_PK left join edoprov on ciudad.Estado = edoprov.Sys_PK where domicilio.sys_pk = " + PKDomicilio;
			break;
			case 1:
				sql = "Select isnull(domicilio.Colonia,'') as Colonia, isnull(domicilio.Direccion,'') as Direccion, isnull(domicilio.CodPos,0) as CP, isnull(domicilio.Telefonos,'') as Telefonos, isnull(Ciudad.Nombre, '') as Ciudad, isnull(edoprov.Nombre,'') as Estado from domicilio left join Ciudad on domicilio.iciudad = Ciudad.Sys_PK left join edoprov on ciudad.Estado = edoprov.Sys_PK where domicilio.sys_pk = " + PKDomicilio;
			break;
			case 3:
				sql = "Select IIF(isnull(domicilio.Colonia),'',domicilio.colonia) as Colonia, IIF(isnull(domicilio.Direccion),'',domicilio.direccion) as Direccion, IIF(isnull(domicilio.CodPos),0,domicilio.CodPos) as CP, IIF(isnull(domicilio.Telefonos),'',domicilio.Telefonos) as Telefonos, IIF(isnull(Ciudad.Nombre), '',Ciudad.Nombre) as Ciudad, IIF(isnull(edoprov.Nombre),'',edoprov.Nombre) as Estado from (domicilio left join Ciudad on domicilio.iciudad = Ciudad.Sys_PK) left join edoprov on ciudad.Estado = edoprov.Sys_PK where domicilio.sys_pk = " + PKDomicilio;
			break;
		}
				
		var R;
		var direccion = "";
		var tel = "";
		var edo = "";
		var cd = "";
		var col = "";
		var cp = 0;
		
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "";
		if (R.EOF && R.BOF) return "";
		
		while(!R.EOF)
		{
			direccion = R("Direccion").Value;
			direccion = direccion.replace("|||"," ");	
			direccion = direccion.replace("||"," ");	
			direccion = direccion.replace("|"," ");
			direccion = trim(direccion);	
			
			tel = R("Telefonos").Value;
			tel = trim(tel);
			col = R("Colonia").Value;
			cd = R("Ciudad").Value;
			edo = R("Estado").Value;
			cp = R("CP").Value;
			
			if(direccion!="")
			{
				d = d + "Domicilio: " + direccion;
				
				if(cp>0)
				{
					d = d + " CP. " + cp;
				}
				
			}			
			
			if(tel!="")
			{
				d = d + " " + "Tel: " + tel;
			}
			
			if(col!="")
			{
				if(d!="")
				{
					d = d + ", ";
				}
				d = d + "Colonia: " + col;
				
				if(cd!="")
				{
					if(d!="")
					{
						d = d + ", ";
					}
					d = d + cd;
				}
				
				if(edo!="")
				{
					if(d!="")
					{
						d = d + "; ";
					}
					d = d + edo;
				}
			}
			R.MoveNext();
		}
		R.Close();
		R = null;
		
		return d;
	}catch(e)
	{
	
		
		return "";
	}
}

function getContacto(PKContacto, html)
{
	if(PKContacto<1) return html;
	var domicilio = 0;
	try
	{
		switch(motorBD)
		{
			case 2:
				sql = "select ifnull(Empresa,'') as Empresa, Nombre, Apellidos, ifnull(eMail1,'') as eMail1, ifnull(eMail2,'') as eMail2, ifnull(eMail3,'') as eMail3, ifnull(eMail4,'') as eMail4, ifnull(Tel1,'') as Tel1, ifnull(Tel2,'') as Tel2, ifnull(Tel3,'') as Tel3, ifnull(Puesto,'') as Puesto from contacto where sys_pk = " + PKContacto;
			break;
			case 1:
				sql = "select isnull(Empresa,'') as Empresa, Nombre, Apellidos, isnull(eMail1,'') as eMail1, isnull(eMail2,'') as eMail2, isnull(eMail3,'') as eMail3, isnull(eMail4,'') as eMail4, isnull(Tel1,'') as Tel1, isnull(Tel2,'') as Tel2, isnull(Tel3,'') as Tel3, isnull(Puesto,'') as Puesto from contacto where sys_pk = " + PKContacto;
			break;
			case 2:
				sql = "select IFF(isnull(Empresa),'',Empresa) as Empresa, Nombre, Apellidos, IFF(isnull(eMail1),'',eMail1) as eMail1, IFF(isnull(eMail2),'',eMail2) as eMail2, IFF(isnull(eMail3),'',eMail3) as eMail3, IFF(isnull(eMail4),'',eMail4) as eMail4, IFF(isnull(Tel1),'',Tel1) as Tel1, IFF(isnull(Tel2),'',Tel2) as Tel2, IFF(isnull(Tel3),'',Tel3) as Tel3, IFF(isnull(Puesto),'',Puesto) as Puesto from contacto where sys_pk = " + PKContacto;
			break;
		}

		var R;
		var empresa = "";
		var name = "";
		var mail = "";
		var tel = "";
		var puesto = "";
		var web = "";
				
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "";
		if (R.EOF && R.BOF) return "";
		
		if(html=="")
		{
			html = "<tr align=center style=background-color:lightblue;><th COLSPAN=5 BGCOLOR=lightblue> Información general de contactos</th>";
			html = html + "<tr align=left style=background-color:lightblue;><th>Empresa</th><th>Contacto</th><th>Correo electrónico</th><th>Teléfono</th><th>Puesto</th></tr>";
		}
		while(!R.EOF)
		{
			empresa = R("Empresa").Value;	
			name = R("Nombre").Value + " " + R("Apellidos").Value;	
			tel = R("Tel1").Value;
			
			if(R("Tel2").Value!="")
			{
				if(tel!="")
				{
					tel = tel + '<br>';		
				}
				tel = tel + R("Tel2").Value;
			}
				
			if(R("Tel3").Value!="")
			{
				if(tel!="")
				{
					tel = tel + '<br>';		
				}
				tel = tel + R("Tel3").Value;
			}
			
			
			if(R("eMail1").Value!="")
			{
				mail = mail +  "<a href=\"mailto:"+R("eMail1").Value+"? target=\"_top\">"+R("eMail1").Value+"</a>";
			}
			
			if(R("eMail2").Value!="")
			{
				if(mail!="")
				{
					mail = mail + '<br>';		
				}
				mail = mail +  "<a href=\"mailto:"+R("eMail2").Value+"? target=\"_top\">"+R("eMail2").Value+"</a>";
			}
			
			if(R("eMail3").Value!="")
			{
				if(mail!="")
				{
					mail = mail + '<br>';		
				}
				mail = mail +  "<a href=\"mailto:"+R("eMail3").Value+"? target=\"_top\">"+R("eMail3").Value+"</a>";
			}
			
			if(R("eMail4").Value!="")
			{
				if(mail!="")
				{
					mail = mail + '<br>';		
				}
				mail = mail +  "<a href=\"mailto:"+R("eMail4").Value+"? target=\"_top\">"+R("eMail4").Value+"</a>";
			}
			
			puesto = R("Puesto").Value;		
			
			html = html + "<tr>";
			html = html + "<td style=width:20%;>" + empresa + "</td>";
			html = html + "<td style=width:20%;>" + name + "</td>";
			html = html + "<td style=width:10%;>" + mail + "</td>";
			html = html + "<td style=width:10%;>" + tel + "</td>";
			html = html + "<td style=width:10%;>" + puesto + "</td>";
			
			html = html + "</tr>";
			R.MoveNext();
		}
		R.Close();
		R = null;
			
		return html;
	}catch(e)
	{
		return html;
	}
}

function trim(str)
{
	return str.replace(/\s+$/,"");	
}

//Devuelve una cadena con formato moneda o en decimales...
/*
Ejemplo
Envio: formatNumber(12.6584,$)
Devuelve: $12.66

Envio: formatNumber(12.6584)
Devuelve: 12.66
*/

function formatNumber(num,prefix)  
{  
num = Math.round(parseFloat(num)*Math.pow(10,2))/Math.pow(10,2)  
prefix = prefix || '';  
num += '';  
var splitStr = num.split('.');  
var splitLeft = splitStr[0];  
var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '.00';  
splitRight = splitRight + '00';  
splitRight = splitRight.substr(0,3);  
var regx = /(\d+)(\d{3})/;  
while (regx.test(splitLeft)) {  
splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');  
}  
return prefix + " " + splitLeft + splitRight;  
}  

/*
Obtiene las ultimas ventas realizadas por el cliente.
*/
function getVentas(PKCliente)
{
	var html = "";
	var sumCantidad = 0;
	var sumTotal = 0;
	try
	{
		var sql; 
		switch(motorBD)
		{
			case 1:
				sql = "Select top "+count+" z.SFecha as Fecha, z.Descripcion as Producto, z.Referencia, z.Cantidad, z.Importe from qryCRMVentas z Where z.ICliente = " + PKCliente + " order by z.PKVenta desc;";
				break;
			case 2:
				sql = "Select z.SFecha as Fecha, z.Descripcion as Producto, z.Referencia, z.Cantidad, z.Importe from qryCRMVentas z Where z.ICliente = " + PKCliente + " order by z.PKVenta desc limit "+count+";";
				break;
			case 3:
				sql = "Select top "+count+" z.SFecha as Fecha, z.Descripcion as Producto, z.Referencia, z.Cantidad, z.Importe from qryCRMVentas z Where z.ICliente = " + PKCliente + " order by z.PKVenta desc;";
				break;
		}

		var R;
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "<td>No se encontraron ventas.</td>";
		if (R.EOF && R.BOF) return "<td>No se encontraron ventas.</td>";
		
		html = "<tr align=center style=background-color:lightblue;><th COLSPAN=5 BGCOLOR=lightblue>Listado de últimas "+count+" ventas</th>";
		html = html + "<tr align=left style=background-color:lightblue;><th>Fecha</th><th>Producto</th><th>Referencia</th><th>Cantidad</th><th>Importe</th></tr>";
		
		while(!R.EOF)
		{
			html = html + "<tr>";
			html = html + "<td style=width:10%;>" + R("Fecha").Value + "</td>";
			html = html + "<td>" + R("Producto").Value + "</td>";
			html = html + "<td style=width:20%;>" + R("Referencia").Value + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("Cantidad").Value) + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("Importe").Value, "$") + "</td>";
			html = html + "</tr>";
			
			sumCantidad = sumCantidad + R("Cantidad").Value;
			sumTotal = sumTotal + R("Importe").Value;
			
			R.MoveNext();
		}
		R.Close();
		R = null;
		
		html = html + "<tr align=left style=background-color:lightblue;><th COLSPAN=3; align=right>TOTALES</th><th align=right>" + formatNumber(sumCantidad) + "</th><th align=right>" + formatNumber(sumTotal,"$") + "</th></tr>";

		return html;
	}
	catch(e)
	{
		//eBasic.eMsgbox("Error en método getVentas: " + e.descripcion);
		return "";
	}
}

function getYear()
{
	var fecha = new Date();
	var anio = fecha.getFullYear();
	return anio;
}

function getMonth()
{
	var fecha = new Date();
	var mes = fecha.getMonth() + 1;
	return mes;
}

/*
Función general

Obtiene la sumatoria de las ventas realizadas el año actual o el año anterior.
*/
function SalesYear(PKCliente, Anio)
{
	try
	{
		var value;
		var sql;
		switch(motorBD)
		{
			case 1:
				sql = "Select round(isnull(sum(z.Importe),0),2) as Total from qryCRMVentas z Where z.Anio = " + Anio + " AND z.ICliente = " + PKCliente; 
			break;
			case 2:
				sql = "Select round(coalesce(sum(z.Importe),0),2) as Total from qryCRMVentas z Where z.Anio = " + Anio + " AND z.ICliente = " + PKCliente;  
				
			break;
			case 3:
				sql = "Select round(IIF(isnull(sum(z.Importe)),0,sum(z.Importe)),2) as Total from qryCRMVentas z Where z.Anio = " + Anio + " AND z.ICliente = " + PKCliente;  
				
			break;
		}
		var R;
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "$ 0.00";
		if (R.EOF && R.BOF) return "$ 0.00";
		while(!R.EOF)
		{
			value = R("Total").Value;
			R.MoveNext();
		}
		R.Close();
		R = null;
		return value;
	}
	catch(e)
	{
		//eBasic.eMsgbox("Error en método SalesLastYear: " + e.descripcion);
		return 0;
	}
}

function SaldoVencido(PKCliente)
{
	
	try
	{
		var sql;
		var val;
		
		switch(motorBD)
		{
			case 1:
				sql = "select sum(z.saldo) as Total from qryCRMSaldoClientes z where dias > 0 and z.PKCliente = " + PKCliente;
			break;
			case 2:
				sql = "select sum(z.saldo) as Total from qryCRMSaldoClientes z where dias > 0 and z.PKCliente = " + PKCliente;
			break;
			case 3:
				sql = "select sum(z.saldo) as Total from qryCRMSaldoClientes z where dias > 0 and z.PKCliente = " + PKCliente;
				
			break;
		}
		
		var R;
		R = Application.ADOCnn.Execute(sql);
		if (R==undefined) return "$ 0.00";
		if (R==null) return "$ 0.00";
		if (R.EOF && R.BOF) return "$ 0.00";
		while(!R.EOF)
		{
			val = R("Total").Value;
			R.MoveNext();
		}
		R.Close();
		R = null;
		return formatNumber(val,"$");
	}
	catch(e)
	{
		//eBasic.eMsgbox("Error en método SaldoVencido: " + e.descripcion);
		return "$ 0.00";
	}

}

function AntiguedadSaldos(PKCliente)
{
	var R = null;
	var html = "", sql = "";
	var sumNoVencido = 0, sumMenor30 = 0, sumMenor60 = 0, sumMenor90 = 0, sumMayor90 = 0;
	try
	{
		sql = "select q.Fecha, q.Aplicacion, q.Referencia, q.No_Vencido, q.menor30, q.menor60, q.menor90, q.mayor90 from qryCRMAntiguedadSaldos q WHERE q.PKCliente = " + PKCliente + " ORDER BY q.PKDCXC;"
		
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "";
		if (R.EOF && R.BOF) return "";
		
		html = "<tr align=center style=background-color:lightblue;><th COLSPAN=8 BGCOLOR=lightblue>Antiguedad de saldos</th>";
		html = html + "<tr align=left style=background-color:lightblue;><th>Fecha</th><th>Vencimiento</th><th>Documentos</th><th align=center>No vencido</th><th align=center>1 - 30 dias</th><th align=center>31-60 dias</th><th align=center>61 - 90 dias</th><th align=center>Mayor a 90 dias</th></tr>";
		
		while(!R.EOF)
		{
			html = html + "<tr>";
			html = html + "<td style=width:15%;>" + R("Fecha").Value + "</td>";
			html = html + "<td style=width:15%;>" + R("Aplicacion").Value + "</td>";
			html = html + "<td style=width:20%;>" + R("Referencia").Value + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("No_Vencido").Value,"$") + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("menor30").Value, "$") + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("menor60").Value, "$") + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("menor90").Value, "$") + "</td>";
			html = html + "<td style=width:10%; align=right>" + formatNumber(R("mayor90").Value, "$") + "</td>";
			
			sumNoVencido = sumNoVencido + R("No_Vencido").Value;
			sumMenor30 = sumMenor30 + R("menor30").Value;
			sumMenor60 = sumMenor60 + R("menor60").Value;
			sumMenor90 = sumMenor90 + R("menor90").Value;
			sumMayor90 = sumMayor90 + R("mayor90").Value;
			
			html = html + "</tr>";
			R.MoveNext();
		}
		R.Close();
		R = null;
		
		html = html + "<tr align=left style=background-color:lightblue;><th COLSPAN=3; align=right>TOTALES</th><th align=right>" + formatNumber(sumNoVencido,"$") + "</th><th align=right>" + formatNumber(sumMenor30,"$") + "</th><th align=right>" + formatNumber(sumMenor60,"$") + "</th><th align=right>" + formatNumber(sumMenor90,"$") + "</th><th align=right>" + formatNumber(sumMayor90,"$") + "</th></tr>";

		return html;
	}
	catch(e)
	{
		return "";
	}
}

function mostrarPanelAdmon()
{
	try
	{
		if(ACRM==null) 
			ACRM = Application.InternalObject("UICRM");
	
		ACRM.AdmonCRM();
	}
	catch(e)
	{
		eBasic.eMsgbox(e.description);
	}
}

//Lee la plantilla TemplateEstadisticas, reemplaza los parametros necesario y devuelve una cadena HTML que será leida por la aplicación.
function readHTMLEstadistica(header1, header2,sql)
{
	try
	{
		var html = "";
		var R;
		var Notas = "";
		html = eBasic.LoadFileToStr(eBasic.AddSlashPath(GetRepository())+"\\Templates\\TmpEstadisticas.html");
		 
		html = html.replace("@Header", header1);
		html = html.replace("@HeaderInfo", header2);
		
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "";
		if (R.EOF && R.BOF) return "";
		
		Notas = "<tr align=center style=background-color:lightblue;><th COLSPAN=5 BGCOLOR=lightblue>Atenciones</th>";
		Notas = Notas + "<tr align=left style=background-color:lightblue;><th>C&oacutedigo</th><th>Nombre</th><th>Fecha</th><th align=center>Atenci&oacuten</th><th align=center>Usuario</th></tr>";
		
		while(!R.EOF)
		{
			Notas = Notas + "<tr>";
			Notas = Notas + "<td style=width:15%;>" + R("codigo").Value + "</td>";
			Notas = Notas + "<td style=width:15%;>" + R("Nombre").Value + "</td>";
			Notas = Notas + "<td style=width:15%;>" + stringFecha(R("Fecha").Value) + "</td>";
			Notas = Notas + "<td style=width:40%;>" + R("notas").Value + "</td>";
			Notas = Notas + "<td style=width:15%;>" + R("usuario").Value + "</td>";
			
			Notas = Notas + "</tr>";
			R.MoveNext();
		}
		R.Close();
		R = null;
		
		html = html.replace("@InfoAtenciones", Notas);
		
		return html;
	}
	catch(e)
	{
		//eBasic.eMsgbox("Error en método readHTMLEstadisticas: " + e.descripcion);
		return "";
	}
}

//Lee la plantilla TemplateEstadisticas, reemplaza los parametros necesario y devuelve una cadena HTML que será leida por la aplicación.
function readHTMLEstadisticaCaso(header, sql)
{
	try
	{
		var html = "";
		var hdr = "";
		var R;
		var Notas = "";
		var Arr1;
		html = eBasic.LoadFileToStr(eBasic.AddSlashPath(GetRepository())+"\\Templates\\TmpCasos.html");
		
		Arr1 = header.split("|");
			
		for (var i=0;i<Arr1.length;i++)
		{
			hdr = hdr + "<tr><td>" + Arr1[i] + "</td></tr>";
		}

		html = html.replace("@InfoTable", hdr);
		
		R = Application.ADOCnn.Execute(sql);
		if (R==null) return "";
		if (R.EOF && R.BOF) return "";
		
		Notas = "<tr align=center style=background-color:lightblue;><th COLSPAN=3 BGCOLOR=lightblue>Notas</th>";
		Notas = Notas + "<tr align=left style=background-color:lightblue;><th>Fecha de creaci&oacuten</th><th>Nota</th><th align=center>Usuario</th></tr>";
		while(!R.EOF)
		{
			Notas = Notas + "<tr>";
			Notas = Notas + "<td style=width:20%;>" + stringFecha(R("Sys_DTCreated").Value) + "</td>";
			Notas = Notas + "<td style=width:60%;>" + R("notas").Value + "</td>";
			Notas = Notas + "<td style=width:20%;>" + R("usuario").Value + "</td>";
						
			Notas = Notas + "</tr>";
			R.MoveNext();
		}
		R.Close();
		R = null;
		
		html = html.replace("@Info", Notas);
		
		return html;
	}
	catch(e)
	{
		//eBasic.eMsgbox("Error en método readHTMLEstadisticas: " + e.descripcion);
		return "";
	}
}

function stringFecha(fecha)
{
	var f = new Date(fecha);
	var dateStr = pad(f.getDate().toString()) + "/" + pad((1 + f.getMonth())) + "/" + f.getFullYear().toString() + " " + pad(f.getHours().toString()) + ":" + pad(f.getMinutes().toString()) + ":" + pad(f.getSeconds().toString());
	return dateStr;
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function fAcuerdoPago(PKCliente)
{
	try
	{
		var NProyecto = eBasic.eCreateObject("ReportesVentas.rptVentas");
		
		if(NProyecto==null)
		{
			eBasic.eMsgbox("Error al crear el objeto NProject", 6);
			return false;
		}
		
		if(PKCliente == null || PKCliente == 0)
		{
			eBasic.eMsgbox("Debe seleccionar un cliente.", 6);
			return false;
		}
		
		NProyecto.Conexion = Application.ADOCnn;
		NProyecto.eUISS = Application.UIUsers;
		//eBasic.eMsgbox(motorBD);
		NProyecto.SQLServer = (motorBD == 1 ? true : false);
		
		if(!NProyecto.AcuerdoDePago(PKCliente))
		{
			eBasic.eMsgbox(NProyecto.LastError, 6);
		}
		else
		{
			return NProyecto.AcuerdoEstablecido;
		}
	}
	catch(e)
	{
		eBasic.eMsgbox(e.message, 6);
	}
}

function fAdmonAcuerdos(PKCliente)
{
	try
	{
		var NProyecto = eBasic.eCreateObject("ReportesVentas.rptVentas");
		
		if(NProyecto==null)
		{
			eBasic.eMsgbox("Error al crear el objeto NProject", 6);
			return false;
		}
		
		if(PKCliente == null || PKCliente == 0)
		{
			eBasic.eMsgbox("Debe seleccionar un cliente.", 6);
			return false;
		}
		
		NProyecto.Conexion = Application.ADOCnn;
		NProyecto.eUISS = Application.UIUsers;
		//eBasic.eMsgbox(motorBD);
		NProyecto.SQLServer = (motorBD == 1 ? true : false);
		
		if(!NProyecto.AdmonAcuerdoDePago(PKCliente))
		{
			eBasic.eMsgbox(NProyecto.LastError, 6);
		}
		else
		{
			return NProyecto.AcuerdoEstablecido;
		}
	}
	catch(e)
	{
		eBasic.eMsgbox(e.message, 6);
	}
}