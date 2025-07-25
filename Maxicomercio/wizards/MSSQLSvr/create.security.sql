/* Este es el inicio de la secuencia de comandos de creación de la estructura de soporte de la base de datos*/

CREATE TABLE GlobalVar (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_GlobalVar_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), VarDefault VARCHAR(255), VarName VARCHAR(32) NOT NULL  UNIQUE , VarValue VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Profile (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Profile_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Item Int  NOT NULL , UserGroup Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE SItem (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_SItem_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Description VARCHAR(250) , ItemID VARCHAR(32) NOT NULL  UNIQUE , ItemParent Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TUser (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_User_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Locked Bit , Message VARCHAR(255), Notes VARCHAR(MAX) , PWD VARCHAR(32), UserID VARCHAR(32) NOT NULL  UNIQUE , UserName VARCHAR(100) NOT NULL,pwdmd5 VARCHAR(35),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE UserGroup (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_UserGroup_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Description VARCHAR(80) NOT NULL , GroupID VARCHAR(15) NOT NULL  UNIQUE , Notes VARCHAR(MAX),uf_hidetoolbar VARCHAR(1),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE UserVar (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_UserVar_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), VarDefault VARCHAR(255), VarName VARCHAR(32) NOT NULL UNIQUE, VarValue VARCHAR(MAX) , [fUser] Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE User_UserGroup_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX__User_UserGroup__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Groups Int  NOT NULL , Users Int  NOT NULL );

CREATE TABLE sisFirma (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_sisFirma_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Aplicacion VARCHAR(32) NOT NULL , Archivo VARCHAR(50) NOT NULL , Firma VARCHAR(50) NOT NULL UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE sisUbicacion (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_sisUbicacion_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Ubicacion VARCHAR(255) UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );


ALTER TABLE Profile ADD CONSTRAINT RLProfileItem_SItemSys_PK FOREIGN KEY  (Item ) REFERENCES SItem(Sys_PK);
ALTER TABLE Profile ADD CONSTRAINT RLProfileUserGroup_UserGroupSys_PK FOREIGN KEY  (UserGroup ) REFERENCES UserGroup(Sys_PK);
ALTER TABLE SItem ADD CONSTRAINT RLSItemItemParent_SItemSys_PK FOREIGN KEY  (ItemParent ) REFERENCES SItem(Sys_PK);
ALTER TABLE UserVar ADD CONSTRAINT RLUserVarUser_UserSys_PK FOREIGN KEY  ([fUser] ) REFERENCES TUser(Sys_PK);
ALTER TABLE User_UserGroup_ ADD CONSTRAINT RL_User_UserGroup_Groups_UserSys_PK FOREIGN KEY  (Groups ) REFERENCES UserGroup(Sys_PK);
ALTER TABLE User_UserGroup_ ADD CONSTRAINT RL_User_UserGroup_Users_UserGroupSys_PK FOREIGN KEY  (Users ) REFERENCES TUser(Sys_PK);


INSERT INTO TUSER (Sys_TimeStamp,Sys_Guid,Sys_DTCreated,Sys_DTExported,Sys_User, Notes,PWD,UserID,UserName,Locked) values(GETDATE(), 'DA6A732827E14559BECFDA89938FC5',GETDATE(),GETDATE(),'ADMIN','Administrador del sistema','D41D8CD98F00B204E9800998ECF8427E','ADMIN','ADMINISTRADOR',0);


Create view qryGroupProfile AS SELECT Profile.Sys_PK, Profile.Sys_TimeStamp, Profile.Sys_GUID, Profile.Sys_DTCreated, Profile.Sys_User, Profile.Sys_LastUser, Profile.Sys_Exported, Profile.Sys_DTExported, Profile.Sys_Info, Profile.Item, Profile.UserGroup, UserGroup.GroupID, SItem.Description, SItem.ItemID FROM UserGroup INNER JOIN (SItem INNER JOIN Profile ON SItem.Sys_PK = Profile.Item) ON UserGroup.Sys_PK = Profile.UserGroup;

Create view qryUserProfile AS SELECT TUser.UserID, Profile.Item, SItem.Description, SItem.ItemID FROM SItem INNER JOIN (TUser INNER JOIN (User_UserGroup_ INNER JOIN Profile ON [User_UserGroup_].Groups=Profile.UserGroup) ON TUser.Sys_PK=[User_UserGroup_].Users) ON SItem.Sys_PK=Profile.Item GROUP BY TUser.UserID, Profile.Item, SItem.Description, SItem.ItemID;

Create view qryUsersByGroup AS SELECT TUser.UserID, TUser.UserName, TUser.PWD, TUser.[Message], TUser.Locked, TUser.Notes, UserGroup.GroupID FROM TUser INNER JOIN (UserGroup INNER JOIN User_UserGroup_ ON UserGroup.Sys_PK=[User_UserGroup_].Groups) ON TUser.Sys_PK=[User_UserGroup_].Users;

Create view qryUserVars AS SELECT uservar.*, Tuser.userID FROM uservar, Tuser;

Create view qryUserVarsPK AS SELECT UserVar.Sys_PK, TUser.UserID, UserVar.VarName FROM UserVar, TUser WHERE TUser.Sys_PK=UserVar.[fUser];


INSERT INTO Globalvar(Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_DTExported,VarName,VarValue) VALUES(getdate(),'C3F742EE949F41799E568600042876B2',getdate(),getdate(),'FXCA076',Year(getdate())+'');





CREATE VIEW qryLeyendaCBB AS SELECT (CASE len(VarValue) WHEN 12 THEN 'Contribuyente de Régimen de Transparencia' ELSE 'Efectos fiscales al pago' END) AS Leyenda,VarValue AS RFC FROM GlobalVar WHERE VarName='FXCA101';

CREATE VIEW qryDomicilioXCConsumo AS SELECT (CASE isnull(Ciudad.Nombre,'(Desconocido)') WHEN '(Desconocido)' THEN 0 ELSE CConsumo.uf_DomicilioCFD END) AS PKDomicilio, Venta.Sys_PK AS PKVenta, CConsumo.Sys_PK AS PKCConsumo FROM Venta INNER JOIN (CConsumo LEFT JOIN (Domicilio LEFT JOIN Ciudad ON Domicilio.ICiudad=Ciudad.Sys_PK) ON CConsumo.uf_DomicilioCFD=Domicilio.Sys_PK) ON Venta.ICConsumo=CConsumo.Sys_PK;

CREATE VIEW qryDomicilioEmisor AS SELECT (CASE WHEN (ISNULL(GlobalVar.VarValue,0)=0) THEN '0' ELSE GlobalVar.VarValue END) AS PKDomicilio, (CASE WHEN (ISNULL(GlobalVar.VarValue,0)=0) THEN 0 ELSE CAST(GlobalVar.VarValue AS INT) END) AS PKLongDomicilio  FROM GlobalVar WHERE GlobalVar.VarName='FXCA102b';


INSERT INTO GlobalVar (Sys_TimeStamp, Sys_GUID, Sys_DTCreated, Sys_User, Sys_LastUser, Sys_Exported, Sys_DTExported, Sys_Info, VarName, VarValue) VALUES (GETDATE(),'1F0B903EF4EA41E1AD9CD6920296EC00',GETDATE(),NULL,NULL,NULL,NULL, NULL, 'DB_SCHEMA_VER', '4.0');



ALTER TABLE ut_SysLog ADD CONSTRAINT RLSysLog_tUserSysPK FOREIGN KEY(Usuario) REFERENCES tUser(Sys_PK);

