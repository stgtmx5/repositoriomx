
function initInterface()
{

var o_cUF_Empleados1=ThisForm.ControlObject("cUF_Empleados1");

o_cUF_Empleados1.Clear();
o_cUF_Empleados1.AddItem(1,"1 a 10");
o_cUF_Empleados1.AddItem(11,"11 a 50");
o_cUF_Empleados1.AddItem(51,"51 a 100");
o_cUF_Empleados1.AddItem(101,"101 a 500");
o_cUF_Empleados1.AddItem(501,"501 o más");


var o_cUF_Sucursales1=ThisForm.ControlObject("cUF_Sucursales1");
o_cUF_Sucursales1.Clear();

o_cUF_Sucursales1.AddItem(0,"Ninguna");
o_cUF_Sucursales1.AddItem(1,"1");
o_cUF_Sucursales1.AddItem(2,"2");
o_cUF_Sucursales1.AddItem(3,"3");
o_cUF_Sucursales1.AddItem(4,"4");
o_cUF_Sucursales1.AddItem(5,"5 a 10");
o_cUF_Sucursales1.AddItem(11,"11 a 50");
o_cUF_Sucursales1.AddItem(51,"51 o más");



var o_cUF_Tamano1=ThisForm.ControlObject("cUF_Tamano1");
o_cUF_Tamano1.Clear();

o_cUF_Tamano1.AddItem(1,"Micro");
o_cUF_Tamano1.AddItem(2,"Pequeña");
o_cUF_Tamano1.AddItem(3,"Mediana");
o_cUF_Tamano1.AddItem(4,"Grande");



var o_cUF_Sector1=ThisForm.ControlObject("cUF_Sector1");
o_cUF_Sector1.Clear();

o_cUF_Sector1.AddItem(1,"Comercio");
o_cUF_Sector1.AddItem(2,"Industria");
o_cUF_Sector1.AddItem(3,"Servicios");
o_cUF_Sector1.AddItem(4,"Gobierno");




}

function validate()
{
	return true;
}

function ControlEvent(CName, EName)
{

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
	
}

function OnClear()
{
	
}

function OnUnlock()
{
	
}

function OnLock()
{
	
}



