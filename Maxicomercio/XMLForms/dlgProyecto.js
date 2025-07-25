var readyFlag=false;

var Form=ThisForm.VBForm().getObject();


//Referencia al objeto principal de la aplicación
//var ADOCnn=Form.Application();

function initInterface()
{

var o_cUF_fase1=ThisForm.ControlObject("cUF_fase1");
o_cUF_fase1.Clear();

o_cUF_fase1.AddItem(0,"Contacto");
o_cUF_fase1.AddItem(1,"Manejo de objeciones");
o_cUF_fase1.AddItem(2,"Cierre");



var o_cUF_Usuarios1=ThisForm.ControlObject("cUF_Usuarios1");
o_cUF_Usuarios1.Clear();
o_cUF_Usuarios1.AddItem(0,"<Ninguno>");
o_cUF_Usuarios1.AddItem(1,"1");
o_cUF_Usuarios1.AddItem(2,"2");
o_cUF_Usuarios1.AddItem(3,"3");
o_cUF_Usuarios1.AddItem(4,"4");
o_cUF_Usuarios1.AddItem(5,"5");
o_cUF_Usuarios1.AddItem(6,"6");
o_cUF_Usuarios1.AddItem(7,"7");
o_cUF_Usuarios1.AddItem(8,"8");
o_cUF_Usuarios1.AddItem(9,"9");
o_cUF_Usuarios1.AddItem(10,"10");
o_cUF_Usuarios1.AddItem(11,"11");
o_cUF_Usuarios1.AddItem(12,"12");
o_cUF_Usuarios1.AddItem(13,"13");
o_cUF_Usuarios1.AddItem(14,"14");
o_cUF_Usuarios1.AddItem(15,"15");
o_cUF_Usuarios1.AddItem(16,"16");
o_cUF_Usuarios1.AddItem(17,"17");
o_cUF_Usuarios1.AddItem(18,"18");
o_cUF_Usuarios1.AddItem(19,"19");
o_cUF_Usuarios1.AddItem(20,"20");
o_cUF_Usuarios1.AddItem(21,"21");
o_cUF_Usuarios1.AddItem(22,"22");
o_cUF_Usuarios1.AddItem(23,"23");
o_cUF_Usuarios1.AddItem(24,"24");
o_cUF_Usuarios1.AddItem(25,"25");
o_cUF_Usuarios1.AddItem(30,"25-30");
o_cUF_Usuarios1.AddItem(40,"31-40");
o_cUF_Usuarios1.AddItem(50,"41-50");
o_cUF_Usuarios1.AddItem(100,"51-100");
o_cUF_Usuarios1.AddItem(150,"Más de 100");



var o_cUF_Color1=ThisForm.ControlObject("cUF_Color1");
o_cUF_Color1.Clear();

o_cUF_Color1.AddItem(0,"Predeterminado");
o_cUF_Color1.AddItem(1,"Rojo");
o_cUF_Color1.AddItem(2,"Verde");
o_cUF_Color1.AddItem(3,"Azul");
o_cUF_Color1.AddItem(4,"Morado");



var o_cUF_Status11=ThisForm.ControlObject("cUF_Status11");

o_cUF_Status11.Clear();

o_cUF_Status11.AddItem(1,"Congelado");
o_cUF_Status11.AddItem(2,"Frio");
o_cUF_Status11.AddItem(3,"Tibio");
o_cUF_Status11.AddItem(4,"Caliente");
o_cUF_Status11.AddItem(5,"Cerrada");
o_cUF_Status11.AddItem(6,"Descartada (perdida)");

}

/*
function OpenRst(oCnn,eSQl){
var R;
R=eBasic.eCreateObject("ADODB.Recordset");

R.Source=eSQL;
R.ActiveConnection = oCnn;
R.CursorLocation=3;
R.Open();

//if (R.EOF && R.BOF) return null;
//if (R.State<>1) return null;

return R;

}
*/
function SelFactura(){
var Cnn = ThisForm.VBForm().ADOCnn();
var Brw=null;
var RstData=null;
var xBrowsers=eBasic.eCreateObject("eBrowsers.eBrw");
var eSQL;

eSQL="Select Venta.Sys_PK,Venta.Referencia,Cliente.Nombre,Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4 as Total FROM Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK Where Documento=4 AND StatusAdministrativo<>99;";
eBasic.eMsgbox(Cnn.ConnectionString);

try{
RstData=eBasic.eCreateObject("ADODB.Recordset");
}
catch(e){
	eBasic.eMsgbox("Error al intentar crear recordset..." + e.Description);
	//eBasic.eMsgbox(Cnn.ConnectionString);
	return 0;
}

/*RstData.Source=eSQL;
RstData.ActiveConnection = Cnn;
RstData.CursorLocation=3;
RstData.Open();
*/
//RstData=OpenRst(Cnn,"Select Venta.Sys_PK,Venta.Referencia,Cliente.Nombre,Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4 as Total FROM Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK Where Documento=4 AND StatusAdministrativo<>99;");



if (RstData==null)
{
	eBasic.eMsgbox("Error al ejecutar la consulta SQL");
	return 0;
}



Brw = xBrowsers.CreateDlgBrowser(false, false, false, true, true,false,false);

xBrowsers.SetBrowser(Brw, RstData, "Sys_PK","Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info");

xBrowsers.SetMethods (Brw, us_brwselfactura, "AddNew", "Edit", "Delete");

Brw.Caption = "Seleccionar Factura Relacionada con el Proyecto";
return xBrowsers.ShowBrowserLng(Brw); 

}


function validate()
{

var oStatus=ThisForm.ControlObject("cUF_Status11").Value;
var dxFact=0;
	/*
	if (oStatus==5){
		dxFact=SelFactura();
		eBasic.eMsgbox("Valor de Venta:" + dxFact);
		if (dxFact<=0){
			eBasic.eMsgbox("Seleccione una Factura relacionada con el Proyecto a Cerrar.");
			return false;
		}
		else{
			//Asignar Valor a Control 
			ThisForm.ControlObject("cUF_PKFactura1").Value=dxFact;
			eBasic.eMsgbox(ThisForm.ControlObject("cUF_PKFactura1").Value);
			return false;
			//return true;
		}
 	}*/
	return true; 
}

function ControlEvent(CName, EName)
{

if(!readyFlag)return;

	if(CName=="cBoton1" && EName=="Click") ThisForm.VBForm().AgregarOrganizacion();
	if(CName=="cBoton2" && EName=="Click") ThisForm.VBForm().EditarOrganizacion();
	if(CName=="cBoton3" && EName=="Click") ThisForm.VBForm().AgregarPersona();
	if(CName=="cBoton4" && EName=="Click") ThisForm.VBForm().EditarPersona();
	if(CName=="cBoton5" && EName=="Click") ThisForm.VBForm().Relacionar();
	if(CName=="cBoton6" && EName=="Click") ThisForm.VBForm().BuscarOrganizacion();
}


function OnDiscard()
{


}

function Saved(action, PK)
{

}

function OnDispose()
{
	
}

function OnGetData()
{
	
}

function OnPutData()
{
	readyFlag=true;
}

function OnClear()
{
	
}

function OnUnlock()
{
	var o_cUF_monto1=ThisForm.ControlObject("cUF_monto1");
o_cUF_monto1.Object.Caption="Valor:";
}

function OnLock()
{
	
}

/* codigo agregado para soporte de browser */

function AddNew()
{

}

function Edit(Sys_PK)
{

}

function Delete(Sys_PK)
{

}



