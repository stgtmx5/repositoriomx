/****************************************************************
Objetos disponibles:
	ThisForm	- Instancia de la clase eForm que maneja la ventana
	ADOCnn	- Referencia al objeto ADO.Connection 
	eBasic 	- Biblioteca de funciones de propósito general
****************************************************************/

//Referencia al objeto del formulario
var Form=ThisForm.VBForm().getObject();

//Referencia al objeto principal de la aplicación
var Application=Form.Application();


//Al inicializar el formulario
function initInterface()
{
	cargarAduanas();
	ThisForm.ControlObject("cUF_NumDocAduanero1").InputMask = "000000000000000";
	ThisForm.ControlObject("cUF_NumDocAduanero1").Max = 15;
}

function cargarAduanas(){	
	var ComboAduana = ThisForm.ControlObject("cUF_IAduana1");
	ComboAduana.Clear();
	ThisForm.FillList("cUF_IAduana1",ADOCnn,"SELECT Sys_PK,uf_Nombre FROM ut_aduana ORDER BY uf_Nombre","uf_Nombre","Sys_PK");
	ComboAduana.AddItem(0,"<Ninguno>");		
}

function DocTypeChange(){
	//funcion solo disponible en compras
	if(ThisForm.ControlObject("ctrlTipo").Value!=4 && ThisForm.ControlObject("ctrlTipo").Value!=5){
		ThisForm.ControlObject("cUF_Importado1").Value=0;
		ThisForm.ControlObject("cUF_Importado1").Enabled=false;		
	}else{
		ThisForm.ControlObject("cUF_Importado1").Enabled=true;
	}	
}



//Al validar los datos ingresados
function validate()
{
	if(ThisForm.ControlObject("cUF_Importado1").Value!=0){
		//esta marcado como importado
		if(ThisForm.ControlObject("cUF_IAduana1").Value<1){
			eBasic.eMsbox("Falta el nombre de la aduana.",6);
			return false;
		}
		if(ThisForm.ControlObject("cUF_NumDocAduanero1").Value=="" || ThisForm.ControlObject("cUF_NumDocAduanero1").Value==" "){
			eBasic.eMsbox("Falta el número del documento aduanero.",6);
			return false;
		}
		
	}
	return true;
}

//Manejador genérico de eventos de controles
//CName=Nombre del control que genera el evento
//EName=Nombre del evento
function ControlEvent(CName, EName)
{
	switch(EName){
		case "Click":			
			if(CName=="cUF_Importado1"){
				var v;
				if(ThisForm.ControlObject("cUF_Importado1").Value==0)
					v=false;
				else
					v=true;
				
				if(!v){
					ThisForm.ControlObject("cUF_IAduana1").Value=0;
					ThisForm.ControlObject("cUF_NumDocAduanero1").Value="";					
				}
				ThisForm.ControlObject("cUF_IAduana1").Enabled=v;
				ThisForm.ControlObject("cUF_NumDocAduanero1").Enabled=v;
				ThisForm.ControlObject("cUF_FechaDocAduanero1").Enabled=v;
				ThisForm.ControlObject("cBoton1").Enabled=v;
			}
			if(CName=="cBoton1"){
				cargarAduanas();
			}
			break;		
	}	
}

//Al descartar el formulario (Cancelar)
function OnDiscard()
{


}

//Al completar con éxito la actualización de los datos
function Saved(action, PK)
{

}

//Al destruir la instancia de la clase
function OnDispose()
{
	
}

//Al pasar datos desde los controles hacia el objeto de datos
function OnGetData()
{
	
}

//Al pasar datos desde el objeto de datos hacia los controles
function OnPutData()
{
	
}

//Al limpiar el formulario
function OnClear()
{
	
}

//Al debloquear los controles
function OnUnlock()
{		
	if(ThisForm.ControlObject("ctrlTipo").Value!=4 && ThisForm.ControlObject("ctrlTipo").Value!=5){
		ThisForm.ControlObject("cUF_Importado1").Value=0;
		ThisForm.ControlObject("cUF_Importado1").Enabled=false;		
	}else{
		ThisForm.ControlObject("cUF_Importado1").Enabled=true;
	}
	
	if(ThisForm.ControlObject("cUF_Importado1").Value==0){
		ThisForm.ControlObject("cUF_IAduana1").Enabled=false;
		ThisForm.ControlObject("cUF_NumDocAduanero1").Enabled=false;
		ThisForm.ControlObject("cUF_FechaDocAduanero1").Enabled=false;
		ThisForm.ControlObject("cBoton1").Enabled=false;
	}
}

//Al bloquear los controles
function OnLock()
{
	
}