
function initInterface()
{
ThisForm.FillList("cUF_IUser1",ADOCnn,"SELECT Sys_PK,UserName FROM tuser ORDER BY UserName","UserName","Sys_PK");

}
