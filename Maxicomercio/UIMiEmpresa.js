//Versión: 1.0.0.0
//By JFrank - 11 Nov 09
var home_page_items;
var Counter;

function CrearPanel(){
var ActionCat = "UIMiEmpresa.ProcesarAccion"	

	Application.UIShortCuts.CreatePane("P_HOME","Mi Empresa","","","ICON_HOME","",0 );
	Application.UIShortCuts.Pane("P_HOME").CreateGroup(0,"Explorer","","","",0);
	
	Application.UIShortCuts.CreateAction("Root","Mi Empresa",0,"","SMICON_HOME","ICON32","UIMiEmpresa.FrmMiEmpresa",0,"","","Haga click aquí",0);
	
	//********************************************
	//20/11/2013 - Versión 2014
	//JV
	//Application.UIShortCuts.CreateAction("N_01","Atención a clientes",0,"","","","UICRM.ShowCRM",0,"","","Haga click aquí",0);
	//Application.UIShortCuts.CreateAction("N_02","Requisiciones",0,"","","","UIRequisiciones.MainRequisiciones",0,"","","Haga click aquí",0);
	//********************************************
	
	Application.UIShortCuts.CreateAction("R_02","Contabilidad y finanzas",0,"","","","UIFinanzas.qCuentas",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("R_03","Ventas",0,"","","","UIVentas.QVentas",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("R_04","Clientes y cuentas por cobrar",0,"","","","UICxC.QCxC",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("R_05","Inventario, productos y servicios",0,"","","","UIInventario.QProductosXLinea",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("R_06","Compras",0,"","","","UICompras.QCompras",0,"","","Haga click aquí",0);
	Application.UIShortCuts.CreateAction("R_07","Proveedores y cuentas por pagar",0,"","","","UICxP.QCxP",0,"","","Haga click aquí",0);
	//Application.UIShortCuts.CreateAction("R_08","Contactos",0,"","","","",0,"","","Haga click aquí",0);
	//Application.UIShortCuts.CreateAction("R_09","Países, estados y ciudades",0,"","","","",0,"","","Haga click aquí",0);
	//Application.UIShortCuts.CreateAction("R_10","Zonas (Ubicaciones geográficas personalizadas)",0,"","","","",0,"","","Haga click aquí",0);
	
	
	
	// Agregar Acciones	
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddItem("Root");
	
	//********************************************
	//20/11/2013 - Versión 2014
	//JV
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","N_01");
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","N_02");
	//********************************************
	
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","R_02");
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","R_03");
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","R_04");
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","R_05");
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","R_06");
	Application.UIShortCuts.Pane("P_HOME").Group("Explorer").AddChild("Root","R_07");

}


function hidegroups_ToolBar()
{
// Devuelve una cadena con los grupos que se ocultara el panel
var sql;
var sV;
var sGroups;

	sGroups = "";
	sV ="s";
	sql = "SELECT tuser.UserID, usergroup.GroupID, user_usergroup_.Groups,user_usergroup_.Users ,usergroup.uf_hidetoolbar FROM (user_usergroup_ Inner JOIN usergroup on user_usergroup_.Groups=usergroup.Sys_PK) Inner Join tuser ON user_usergroup_.Users=tuser.Sys_PK Where uf_hidetoolbar is null or uf_hidetoolbar='"+ sV+ "';";
	
	R = Application.Adocnn.Execute(sql);
	
	if (R==null) return sGroups;
	if (R.EOF && R.BOF) return sGroups;
	
	while (!R.EOF)
	{
		if (sGroups=="")
			sGroups =  R.Fields("GroupID").Value;
		
		else
			sGroups =  sGroups + ";" +  R.Fields("GroupID").Value;
			
		R.MoveNext();
	}
	
	R = null;
	return sGroups;

}

function GetInfoHomePanel()
{
// Recuperar Información de Home Panel
var Cnn;
var R;

Cnn = Application.Adocnn;

	try{
		Counter=0
		R =  Cnn.Execute("Select Sys_PK,uf_Tipo,uf_Titulo,uf_Imagen,uf_funcion, uf_grupos  FROM  ut_HomePage Order By uf_Orden");
		home_page_items = new Array(6);
		
			//LLenar con información de RecordSet
			home_page_items[0]=FieldToArray("uf_Tipo",R);
			home_page_items[1]=FieldToArray("uf_Titulo",R);//Comentado - Eliminar titulo de la página de inicio.
			home_page_items[2]=FieldToArray("uf_Imagen",R);	
			home_page_items[3]=FieldToArray("uf_funcion",R);
			home_page_items[4]=FieldToArray("uf_grupos",R);
			home_page_items[5]=FieldToArray("Sys_PK",R);
			
			
		R =null;
		return 0;
	}
	catch(e){
		eBasic.eMsgbox("Error al intentar cargar información de Página de Inicio");
	}
}

//15022014 - JV
//NO VISUALIZAR TITULO DE LOS BOTONES EN LA VENTANA PRINCIPAL.
function FieldToArray(FieldName,Rst){
var Arr = new Array();
var Cnt;
var newV=null;

Cnt =0;

	Rst.MoveFirst();
	while(!Rst.EOF)
	{
	
		
		newV=Rst.Fields(FieldName).Value;
		if(newV==undefined || newV==null) newV="";
		if(FieldName == "uf_Titulo" && Rst.Fields("uf_Tipo").Value != 0) newV="";
		Arr[Cnt]=newV;
		newV=null;
		
		Cnt = Cnt + 1;
		Rst.MoveNext();
	}
	
	if (Cnt>Counter) Counter  = Cnt;
	return Arr;
}


function FrmMiEmpresa()
{
var ButtonMenu;
var Frm;
var NoArr;
var sGroupID;
var sHideGroups;
var grupoPermitido;

Frm = null;
Frm=Application.AXForms.AXForm("FMiEmpresa");

	if (Frm==null)
	{
		Frm=Application.AXForms.CreateForm("FormButtonMenu","FMiEmpresa");
		Frm.CmdOnEvent="UIMiEmpresa.OnClick_MiEmpresa";
		GetInfoHomePanel();
	
		//Obtener lista de grupos del usuario.
		sGroupsID= get_usergroups(Application.UIUsers.CurrentUser.UserID);
		//Obtener lista de grupos con panel bloqueado
		sHideGroups = hidegroups_ToolBar();
		if (find_cad1_in_cad2(sGroupsID,sHideGroups))
		{
			Application.MainForm.ShowMenuBar();
			Application.MainForm.ShowShortcutPane();
		}
		else
		{
			// Ocultar Barra y Panel en pantalla princiapal, dependiendo del Grupo  
			Application.MainForm.HideMenuBar();
			Application.MainForm.HideShortcutPane();
		}
		
		if (Frm==null)
			{
			eBasic.eMsgbox("Error al crear ventana de inicio.",6);
			return 0;
			}
		
			
		Application.MouseHourglass();
		Frm.Caption="Mi Empresa";
		ButtonMenu=Frm.GetAXObject();

		//eBasic.SaveStrToFile("C:\\grupos.txt",home_page_items);//
		
		/* Configurar con Base a Tabla  ut_homepage */
		for (var i=0;i<Counter;i++)
		{
			if (home_page_items[0][i]==0){
				//Es un titulo
				ButtonMenu.CreateTitle (home_page_items[1][i]);
			}
			else{
				// Es un Boton
				
				if(home_page_items[4][i]!=null){
					if(find_cad1_in_cad2(sGroupsID+";*",home_page_items[4][i])){
						ButtonMenu.CreateButton(home_page_items[5][i],home_page_items[1][i],Application.LoadImage(eBasic.AddSlashPath(Application.GetPath(0))+home_page_items[2][i],false));
					}
				}
			}
		}
		
		ButtonMenu.Draw();
		Application.MouseDefault();	
		
	}else
		Frm.Zorder();	
}

function OnClick_MiEmpresa(obj)
{
	var opt;
	if(obj==null)
		return 0;
	if (obj.Name == "OnClick") 
	{
	opt=(obj.EventParameters(0).Value);
		
		for (var i=0;i<Counter;i++)
		{
			if (home_page_items[5][i]==opt)
			{
			Application.Eval(home_page_items[3][i]);
			return 0;
			}
		}
		
	}
}