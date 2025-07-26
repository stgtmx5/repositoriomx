function main()
{
	MainForm.AddUserCommand("+90", "Módulo de recargas", " Despliega la ventana para realizar recargas ", "modulo_recargas.load",false,0xC000);
	MainForm.AddUserCommand("+G", "Módulo de guardería", "Módulo de guardería", "modulo_guarderia.load",false,0xC000);

	//Este código debe ir en el script pos_usrcmd.js
	//MainForm.AddUserCommand("Comando", "Accion", "Descripcion", "function", Negritas t/f,Color fuente);
	//Comandos definibles por el usuario: +12 ... +98
	//MainForm.AddUserCommand("+12", "Accion", "Descripcion", "mifuncion", false,0xC000);
	MainForm.AddUserCommand("+12", "Catálogo de documentos de flujo", "Muestra el catálogo de documentos de flujo", "pos_requisiciones.dlgbrowser",false,0xC000);
	//MainForm.AddUserCommand("+13", "Configuración de envío de correo", "Permite al usuario configurar envío del corte de caja por correo", "config_email_arqueo.configLoad",false,0xC000);
	
}


/*EJEMPLO: Carga un sub programa y ejecuta un método
function mifuncion()
{
	if (!loadScript("us_brw_ejemplo"))
	{
		eBasic.eMsgbox("Error al cargar el script");
		return 0;
	}
	
	Application.Eval("us_brw_ejemplo.ShowBrowser()");
}
*/