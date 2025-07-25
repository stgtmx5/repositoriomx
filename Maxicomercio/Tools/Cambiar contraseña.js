ChangePwd();
function ChangePwd(){
	var obj=null;
	var usr;
	obj=Application.NewObject("eUISS.cAppSubSys");
	
	if (obj==null)
	{
		eBasic.eMsgbox("No se pudo inicializar el componente.");
		return 0;
	}
	
	if(obj.ChangePWD(Application.UIUsers.CurrentUser))
	{	
		if(!Application.UIUsers.CurrentUser.Update())
		{
			//eBasic.eMsgbox("Error: " + Application.UIUsers.CurrentUser.lastErrDescrip + ".",6);
			//obj=null;
			var str = "UPDATE TUser SET PWD = '" + Application.UIUsers.CurrentUser.PWD + "', pwdmd5 = '" + Application.UIUsers.CurrentUser.PWD + "' WHERE Sys_PK = " + Application.UIUsers.CurrentUser.Sys_PK + ";";
			var str2 = "SELECT PWD FROM TUser WHERE Sys_PK = " + Application.UIUsers.Sys_PK + ";";
			
			Application.UIUsers.CurrentUser.ADOCnn.Execute(str);
			
			//var obj = Application.UIUsers.CurrentUser.ADOCnn.Execue(str2);
			
			//if(obj != null && !obj.EOF && !obj.BOF)
			//{
			//	if(obj("PWD").Value == Application.UIUsers.PWD)
			//	{
					eBasic.eMsgbox("La contraseña ha sido modificada correctamente, los cambios se aplicarán las siguiente vez que inicie el sistema.",6);
			//	}
			//}
			
			return -1;
		}
		else
		{
			eBasic.eMsgbox("La contraseña ha sido modificada correctamente, los cambios se aplicarán las siguiente vez que inicie el sistema.",6);
			obj=null;
			return -1;
		}
	}
	
}

