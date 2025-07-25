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

}

//Al validar los datos ingresados
function validate()
{
	return true;
}

//Manejador genérico de eventos de controles
//CName=Nombre del control que genera el evento
//EName=Nombre del evento
function ControlEvent(CName, EName)
{
	
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
	
}

//Al bloquear los controles
function OnLock()
{
	
}