function initInterface()
{
//09/Feb/2009
//Corrección al Bug que muestra signo de $ en los siguientes controles

ThisForm.ControlObject("ctrlDiasCredito").Format="";
ThisForm.ControlObject("ctrlDiasEntrega").Format="";
ThisForm.ControlObject("cUF_vueltaviajero1").Format="";
ThisForm.FillList("cUF_TipoOp1",ADOCnn,"SELECT Sys_PK,Descripcion FROM tipooperacion ORDER BY Descripcion","Descripcion","Sys_PK");
}