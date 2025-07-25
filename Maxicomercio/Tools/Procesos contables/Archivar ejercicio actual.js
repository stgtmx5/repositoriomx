var BDTemplate="AEC.sys";

function ArchivarEjercicio(){
	
	if (eBasic.eMsgbox("Este proceso eliminará las pólizas, saldos de cuentas y de departamentos. ¿Está seguro que desea continuar?", 4)==7)
			return 0;
	
	var Contabilidad;
	var gFunciones;
	var EdoFX;
	var Procesos;
	var GuardarEn;
	var UbicacionTemplate;
	var CnnDestino;
	var Ejercicio;
	var Configuracion;
	var HTC;
	
	//Agregado v2010
	//*************
	var UIEjercicio;
	var nombreBD;
	var nombreEjercicio;
	var notas;
	var anio=0;
	var anioActual;
	var tconexion=0;
	var connectionString="";	
	//***************
	
	Ejercicio=0;
	/*
	GuardarEn="";
	UbicacionTemplate=eBasic.AddSlashPath(Application.GetPath(0))+BDTemplate;
	
	GuardarEn=Application.SaveAs("Base de datos *.dco|*.dco",UbicacionTemplate);
	if(GuardarEn==""){ 
		eBasic.eMsgbox("El proceso se ha cancelado.",6);
		return 0;
	}
	
	Application.eDoEvents();
	Application.MouseHourglass();
		
	CnnDestino = Application.NewObject("ADODB.Connection");
    CnnDestino.ConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + GuardarEn + ";Persist Security Info=False";
    CnnDestino.open();
    if(CnnDestino.State!=1){
        Application.MouseDefault();
		eBasic.eMsgbox("Error al conectar con la base de datos:" +GuardarEn,6);
		return 0;
    }	
	*/	
		
	Configuracion=Application.InternalObject("Configuracion");		
	Contabilidad=Application.InternalObject("Contabilidad");	
	UIEjercicio=Application.InternalObject("UIEjercicio"); //v2010
	gFunciones=Application.InternalObject("gFunciones");	
	Finanzas=Application.InternalObject("UIFinanzas");	
	EdoFX=Application.InternalObject("DataAccess");
	HTC=Application.InternalObject("HTCambio");
	
	if(Contabilidad==null || gFunciones==null || Finanzas==null || EdoFX==null || Configuracion==null || HTC==null){
		Application.MouseDefault();
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}
				
	Procesos=Application.NewObject("ProcCC.lgProcCC");		//Procesos contables
	if(Procesos==null){
		Application.MouseDefault();
		eBasic.eMsgbox("Error al crear ProcCC.lgProcCC",6);
		return 0;
	}
	Ejercicio=Configuracion.eApplicationVars.FXCA076;
	
	Procesos.SetObjects(Contabilidad.DataObjects,Contabilidad,gFunciones,EdoFX,HTC,Application.UIUsers,eBasic);
    Procesos.NuevaBDCmdsMSAccess=UIEjercicio.NuevaBDCmdsMSAccess;
	Procesos.NuevaBDCmdsMySQL=UIEjercicio.NuevaBDCmdsMySQL;
	Procesos.NuevaBDCmdsMSSqlSrv=UIEjercicio.NuevaBDCmdsMSSqlSrv;
	
	//Agregado v2010
	//*************
				
		if(Ejercicio<=0){
			eBasic.eMsgbox("La configuración es incorrecta. Por favor indique el año del ejercicio actual en el panel de control.",6);
			return 0;
		}
		
		tconexion=Procesos.DatabaseType(Procesos.DataObjects.ADOCnn);
		if(tconexion==1){			
			if(!eBasic.FileExists(Procesos.NuevaBDCmdsMSAccess)){										
				eBasic.eMsgbox("La plantilla del ejercicio contable no existe: " + Procesos.NuevaBDCmdsMSAccess,6);					
				return 0;
			}			
			GuardarEn=Application.SaveAs("Base de datos *.dco|*.dco",Procesos.NuevaBDCmdsMSAccess);				
			Application.eDoEvents();			
			nombreBD=GuardarEn;
		}else{
			nombreBD=Procesos.CreateGUID();
			GuardarEn="";			
		}
		if(nombreBD==""){
			eBasic.eMsgbox("Nombre incorrecto de base de datos.",6);
			return 0;
		}
				
		anio=Ejercicio;
		nombreEjercicio=Procesos.NombreValidoEjercicioArchivado("Ejercicio "+anio);
		if(nombreEjercicio=="") nombreEjercicio="Ejercicio archivado maxicomercio";
		notas="Ejercicio archivado "+Application.CurrentDate();
				
		Application.eDoEvents();
		Application.MouseHourglass();
		try{						
			//CREAR Y/O CONECATAR A  EJERCICIO
			Procesos.DataObjects.ADOCnn.Execute("INSERT INTO ut_CEjercicio(uf_Nombre,uf_Notas,uf_Anio,uf_NombreBD) VALUES('"+nombreEjercicio+"','"+notas+"',"+anio+",'"+nombreBD+"')");			
			if(tconexion==1){
				connectionString="Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + nombreBD + ";Persist Security Info=False";												
			}else{
				connectionString=Application.CurrCnnInfo.ConnectionString;
			}
			
			CnnDestino = Application.NewObject("ADODB.Connection");
			CnnDestino.Open(connectionString,Application.CurrCnnInfo.UserID,Application.CurrCnnInfo.PWD);
			if(CnnDestino.State==1){
				if(tconexion>1){					
					Procesos.DataObjects.ADOCnn.Execute("CREATE DATABASE "+nombreBD);
					CnnDestino.Execute("USE "+nombreBD);	
					if(!Procesos.CrearEjercicioContable(CnnDestino)){				
						Procesos.DataObjects.ADOCnn.Execute("DELETE FROM ut_CEjercicio WHERE uf_Nombre='"+ nombreEjercicio +"'");										
						Application.MouseDefault();
						eBasic.eMsgbox("Error al archivar ejercicio. "+Procesos.LastErrDescrip,6);
						return 0;
					}
				}				
			}else{
				Procesos.DataObjects.ADOCnn.Execute("DELETE FROM ut_CEjercicio WHERE uf_Nombre='"+ nombreEjercicio +"'");				
				Application.MouseDefault();
				eBasic.eMsgbox("Error al abrir conexión.",6);
				return 0;
			}
		}catch(e){
			Procesos.DataObjects.ADOCnn.Execute("DELETE FROM ut_CEjercicio WHERE uf_Nombre='"+ nombreEjercicio +"'");
			Application.MouseDefault();
			eBasic.eMsgbox("Error al archivar ejercicio."+e.message,6);
			return 0;
		}
			
	//*************
	
	
	if(Procesos.ResultArchivarEjercicio(Ejercicio,CnnDestino)){
		Configuracion.eApplicationVars.FXCA076=Ejercicio+1;
		Configuracion.eApplicationVars.SaveValues();		
		eBasic.eMsgbox("¡El proceso se realizó correctamente!",6);
	}else{
		//eliminarbd
		Procesos.DataObjects.ADOCnn.Execute("DELETE FROM ut_CEjercicio WHERE uf_Nombre='"+ nombreEjercicio +"'");
				
		Application.MouseDefault();
		if(Procesos.LastErrCode!=0)
			eBasic.eMsgbox(Procesos.LastErrDescrip,6);
		else
			eBasic.eMsgbox("Error al archivar ejercicio "+Ejercicio,6);
			
		return 0;
	}
	CnnDestino.Close();
	Application.MouseDefault();	
	return -1;
}

ArchivarEjercicio();