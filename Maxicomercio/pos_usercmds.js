function main()
{
	MainForm.AddUserCommand("+90", "M�dulo de recargas", " Despliega la ventana para realizar recargas ", "modulo_recargas.load",false,0xC000);
	MainForm.AddUserCommand("+G", "M�dulo de guarder�a", "M�dulo de guarder�a", "modulo_guarderia.load",false,0xC000);

	//Este c�digo debe ir en el script pos_usrcmd.js
	//MainForm.AddUserCommand("Comando", "Accion", "Descripcion", "function", Negritas t/f,Color fuente);
	//Comandos definibles por el usuario: +12 ... +98
	//MainForm.AddUserCommand("+12", "Accion", "Descripcion", "mifuncion", false,0xC000);
	MainForm.AddUserCommand("+12", "Cat�logo de documentos de flujo", "Muestra el cat�logo de documentos de flujo", "pos_requisiciones.dlgbrowser",false,0xC000);
	//MainForm.AddUserCommand("+13", "Configuraci�n de env�o de correo", "Permite al usuario configurar env�o del corte de caja por correo", "config_email_arqueo.configLoad",false,0xC000);
	
}


/*EJEMPLO: Carga un sub programa y ejecuta un m�todo
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