var UIP;

function insertContact(){
	var EFile;
	var ESheet;
	var lgItems;
	var itRows;
	var stFile;
	var itCount=0;
	
	var mail, nombreC, telefono, empresa, puesto, ciudad, estado, pais, interes, comentarios;			
	var insertar, validaEmpresa;
	
	stFile=Application.OpenFile("Archivos de excel (*.xls)|*.xls");

	if (stFile==""){
		return false;
	}
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Ingresando Datos"
	UIP.Min=0;
	
	EFile=Application.NewObject("Excel.Application");
	EFile.WorkBooks.Open (stFile);
	
    // si es la versión de Excel 97, asigna la hoja activa ( ActiveSheet )
	if (EFile.Application.Version>=8){
		ESheet = EFile.ActiveSheet;
	}
	else{
		ESheet = EFile;
	}
	
	itRows=ESheet.UsedRange.Rows.Count;
	UIP.Max=itRows;
	UIP.Show();
	
	Application.MouseHourglass();
	
	itCount=0;
	
	for (lgItems=2;lgItems<=itRows;lgItems++){
		Application.eDoEvents();
		
		try{
			mail = ESheet.Cells(lgItems,1)+"";
			nombreC = ESheet.Cells(lgItems,2)+"";
			telefono= ESheet.Cells(lgItems,3)+"";
			empresa= ESheet.Cells(lgItems,4)+"";
			puesto = ESheet.Cells(lgItems,5)+"";
			ciudad= ESheet.Cells(lgItems,6)+"";
			estado= ESheet.Cells(lgItems,7)+"";
			pais= ESheet.Cells(lgItems,8)+"";
			interes= ESheet.Cells(lgItems,9)+"";
			comentarios = ESheet.Cells(lgItems,10)+"";
			
			//validaEmpresa = verificaEmpresa(empresa);Verifica si exista la empresa
			
			//if(validaEmpresa == 0){//Si no existe la empresa entra a los procesos
				
				if( (mail == "undefined") || (mail == null) || mail == ""){
					mail = "";
				}
				if( (nombreC == "undefined") || (nombreC == null) || (nombreC == "") ){
					nombreC = "";
				}
				if( (telefono == "undefined") || (telefono == null) || (telefono == "") ){
					telefono = "";
				}
				if( (empresa == "undefined") || (empresa == null) || (empresa == "") ){
					empresa = "";
				}				
				if( (puesto == "undefined") || (puesto == null) || (puesto == "") ){
					puesto = "";
				}
				if( (ciudad == "undefined") || (ciudad == null) || (ciudad == "") ){
					ciudad = "";	
				}
				if( (estado == "undefined") || (estado == null) || (estado == "") ){
					estado = "";
				}
				if( (pais == "undefined") || (pais == null) || (pais == "") ){
					pais = "";
				}
				if( (interes == "undefined") || (interes == null) || (interes == "") ){
					interes = "";
				}
				if( (comentarios == "undefined") || (comentarios == null) || (comentarios == "") ){
					comentarios = "";	
				}
				
				UIP.TopTitle="Almacenando Registros. Espere...";
				
				insertar ="insert into ut_icontact (sys_timestamp, sys_guid, sys_dtcreated, sys_user, sys_lastUser, sys_exported, sys_dtexported, sys_info, uf_email, uf_nombre, uf_telefono, uf_empresa, uf_puesto, uf_ciudad, uf_estado, uf_pais, uf_interes, uf_comentarios, uf_fecha, uf_Iejecutivo, uf_status, uf_notastatus, uf_fechastatus, uf_tipo, uf_color) values(CURRENT_TIMESTAMP, replace(ucase(UUID()),'-',''), CURRENT_TIMESTAMP, null, null, null, null, null, '" +mail+"', '"+nombreC+"', '"+telefono+"', '"+empresa+"', '"+puesto+"', '"+ciudad+"', '"+estado+"', '"+pais+"', '" + interes + "', '" + comentarios + "', CURRENT_TIMESTAMP, NULL, 0,NULL,NULL,0,0)";
			
				Application.adoCnn.Execute(insertar);
				itCount=itCount+1;
				
				UIP.Value=lgItems;
				
			/*}else{
				Log("Error al procesar fila "+lgItems+". El nombre de la empresa " + empresa + " ya existe.");
			}*/
		}
		catch(e){
			Log("Error al procesar fila "+lgItems + " - " + empresa + ": " + e.message);
		}
	}
	
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();	
	eBasic.eMsgbox ("Cantidad de registros actualizados: "+itCount,6); 		
	EFile.ActiveWorkBook.Close (false);
	EFile.Quit();
	EFile=null;
	ESheet=null;
	return true;	
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function Procesar(){
	try
	{
		eBasic.eMsgBox(NewGUID());
		eBasic.eMsgBox(NewGUID());
		return insertContact();
	}catch(e)
	{
		if(UIP!=null){
			Application.CloseUIProgress(UIP);
			Application.MouseDefault();
		}
		Log("Error al ejecutar subprograma");
		throw e;
		return false;
	}
}

function verificaEmpresa(empresa){
	var val = "";
	
	val = Application.adoCnn.Execute("SELECT uf_empresa AS empresa FROM ut_icontact where uf_empresa = '"+ empresa + "'");
	
	if( (val == null) || (val.EOF == true && val.BOF == true) ){
		return 0;
	}
	return 1;
}

function NewGUID() 
{
  function s4() 
  {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  
  var NG = s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  return NG.toUpperCase();
}

Procesar();