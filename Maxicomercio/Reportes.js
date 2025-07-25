//v 2.0.0.0

//var RPTPath;
var CarpetaVentas="Ventas";
var CarpetaCompras="Compras";
var CarpetaInventario="Inventario";
var CarpetaCXC="Cuentas por Cobrar";
var CarpetaCXP="Cuentas por Pagar";
var CarpetaConta_Finanzas="Contabilidad y Finanzas";
var CarpetaRequisiciones="Requisiciones";
// function EstablecerDirectorioReportes(){
	// RPTPath=eBasic.AddSlashPath(Application.ResolvePath("$CnnReportsPath$"));		
// }

//ObjectTypeName opcional para asignar el nombre de objeto.
// Esto es porque cuando se llama al reporte y se esta en otra ventana que no pertenesca al objeto que se esta imprmiendo no sera posible imprimirlo.
function EjecutarReporte(sArchivo,Destino,PK,PGlobal,ArchivoXPR,P1,P1Val,pObjectTypeName,myADOCnn){
	//Destino  1=Previsualizar, 2=Imprimir, 3=Guardar en archivo
	//P1=nombre del parametro adicional
	//P1Val=valor del parametro adicional
	//pObjectTypeName opcional sustituye al valor actual
	
	//agregado 16 feb 2010
	//*****************
	//myADOCnn=conexion opcional para ejecucion de reportes
	//*****************
	var Reporte;
	var eDoc;
	var Parameter;
	var ID;	
	var Nombre;
	
	Application.UpdateNodeParameters();
	
	if(PGlobal==null) //INDICA SI SE ASIGNAN LOS PARAMETROS GLOBALES AL REPORTE INDICADO
		PGlobal=false;	
	
	
	//Reporte=Application.XPD.GetReport(sArchivo,PGlobal);	//comentado 16 feb 2010	
	if(myADOCnn==null)
		Reporte=Application.XPD.GetReport(sArchivo,PGlobal);		
	else
		Reporte=Application.XPD.GetReport(sArchivo,PGlobal,myADOCnn);		
	//***************************************************
	
	if(Reporte==null){
		Log("Error al cargar reporte " + sArchivo);
		return 0;
	}		
	
	if(PK==null) PK=0; //condicion agregada 17/02/2010
	if(PK>0){ //condicion agregada 17/02/2010
		Parameter=null;
		Parameter=Reporte.GetParameter("pPrimaryKey");
		if(Parameter!=null){
			Parameter.Value=PK;
		}else{
			Log("Error al asignar parametro: pPrimaryKey");
			return 0;
		}
	}
	if(P1!=null){
		Parameter=null;
		Parameter=Reporte.GetParameter(P1);
		if(Parameter!=null){
			Parameter.Value=P1Val;
		}else{
			Log("Error al asignar parametro: "+P1);
			return 0;
		}
	}
	
	if(pObjectTypeName!=null){
		Parameter=null;
		Parameter=Reporte.GetParameter("pObjectTypeName");
		if(Parameter!=null){
			Parameter.Value=pObjectTypeName;
		}else{
			Log("Error al asignar parametro: pObjectTypeName");
			return 0;
		}
	}
	
	eDoc=Application.XPD.Execute(Reporte,false);
	
	Nombre=eBasic.GetFileNameWithoutExt(sArchivo);
	switch(Destino){
		case 1: //Previsualización
				ID= Nombre+ "_" + PK;
				Application.XPD.Preview(eDoc,Nombre,ID);
				break;
		case 2://Imprimir
				Application.XPD.PrintXPR(eDoc);
				break;
		case 3://Guardar
				Application.XPD.Save(eDoc,ArchivoXPR);
				break;				
	}
}


function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}