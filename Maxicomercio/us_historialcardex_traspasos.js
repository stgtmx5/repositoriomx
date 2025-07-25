/*Archivo de sub-programa generado automáticamente
13/07/2012 04:40:36 p.m.

***********************************************
*/

function ShowBrowser()
{
var Brw=null;
var RstData=null;
var xBrowsers=eBasic.eCreateObject("eBrowsers.eBrw");

RstData=DataAccess.CreateRecordset();
RstData.Source="SET ROWCOUNT 1000; SELECT  Cardex.Sys_PK as Sys_PK, Cardex.Fecha AS Fecha, Cardex.Referencia AS Referencia, Almacen.Descripcion AS Almacén, Categoria.Descripcion AS Categoría, sum(DCardex.Abonos) AS Abonos, sum(DCardex.Cargos) AS Cargos, Cardex.Descripcion AS Notas FROM (((Almacen INNER JOIN DCardex ON Almacen.Sys_PK = DCardex.IAlmacen)  INNER JOIN Cardex ON Cardex.Sys_PK = DCardex.FK_Cardex_Movimientos) INNER JOIN Categoria ON Categoria.Sys_PK = Cardex.ICategoria) where Cardex.Referencia LIKE '%-T' group by Cardex.Sys_PK, Cardex.Fecha, Cardex.Referencia, Almacen.Descripcion, Categoria.Descripcion, Cardex.Descripcion, DCardex.SYS_DTCreated ORDER BY DCardex.Sys_DTCreated DESC SET ROWCOUNT 0 ";

if (!DataAccess.OpenRecordset(RstData,DataAccess.ADOCnn))
{
	eBasic.eMsgbox("Error al ejecutar la consulta SQL");
	return 0;
}

Brw = xBrowsers.CreateDlgBrowser(false, false, false, true, true);

xBrowsers.SetBrowser(Brw, RstData, "Referencia","Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info");

xBrowsers.SetMethods (Brw, us_historialcardex_traspasos, "AddNew", "Edit", "Delete");

Brw.Caption = "Historial Cardex - Traspasos";

return xBrowsers.ShowBrowserStr(Brw);

}

function ModuleLoaded(OName)
{
var col;

col=Application.MainForm.Engine.Modules;

for (var i=1; i<=col.Count;i++)
{
	if (col.Item(i).Name=="mdl"+OName) return true;
}

return false;
}

function LoadFormScript(scriptName) 
{
	if (!ModuleLoaded(scriptName))
	{
		if (!Application.LoadScript(scriptName+".js")) 
		{
			eBasic.eMsgbox("El sub-programa de dialogos no pudo cargarse");
			return false;
		}
	}
	
	return true;
}

function AddNew()
{

}

function Edit(Sys_PK)
{

}

function Delete(Sys_PK)
{

}