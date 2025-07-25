function evLeerBascula()
{
	Application.MainForm.ClearConsole();
	var command = "readcom.exe "+bascula_params;
	Application.MainForm.ExecInConsole(command);
	var response = Application.MainForm.txtConsole.Text;
	response = response.replace(command, "");
	
	var ultMayorQue = response.lastIndexOf(">");
	var firstAdmiracion = response.indexOf("!");
	
	response = response.substr(ultMayorQue+1, firstAdmiracion - ultMayorQue-1);
	//eBasic.eMsgBox(response);
	return response;
}

function evProcConsole(data)
{
	eBasic.eMsgBox(data);
	Application.MainForm.ClearConsole();
}

function test()
{
	Application.MainForm.ExecInConsole("ping google.com");
	Application.MainForm.PrintConsole("##GO!");
}


function config_console()
{
	eBasic.eMsgBox("Configuracion");
}