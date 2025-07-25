SET @lower_case_table_names=1;
CREATE TABLE GlobalVar (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), VarDefault VARCHAR(255), VarName VARCHAR(32) NOT NULL  UNIQUE , VarValue VARCHAR(32000),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE Profile (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), Item INT  NOT NULL , UserGroup INT  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE SItem (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), Description VARCHAR(250), ItemID VARCHAR(32) NOT NULL  UNIQUE , ItemParent INT,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TUser (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), Locked BOOL , Message VARCHAR(255), Notes VARCHAR(32000), PWD VARCHAR(32), UserID VARCHAR(32) NOT NULL  UNIQUE , UserName VARCHAR(100) NOT NULL,pwdmd5 VARCHAR(35),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE UserGroup (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), Description VARCHAR(80) NOT NULL , GroupID VARCHAR(15) NOT NULL  UNIQUE , Notes VARCHAR(32000),uf_hidetoolbar VARCHAR(1),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE UserVar (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), VarDefault VARCHAR(255), VarName VARCHAR(32) NOT NULL UNIQUE, VarValue VARCHAR(32000), fUser INT  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE User_UserGroup_ (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Groups INT  NOT NULL , Users INT  NOT NULL );

CREATE TABLE sisFirma (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), Aplicacion VARCHAR(32) NOT NULL , Archivo VARCHAR(50), Firma VARCHAR(50) NOT NULL UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE sisUbicacion (Sys_PK INT  NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sys_PK), Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BOOL , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), Ubicacion VARCHAR(255) UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

ALTER TABLE Profile ADD CONSTRAINT RLProfileItem_SItemSys_PK FOREIGN KEY  (Item ) REFERENCES SItem(Sys_PK);
ALTER TABLE Profile ADD CONSTRAINT RLProfileUserGroup_UserGroupSys_PK FOREIGN KEY  (UserGroup ) REFERENCES UserGroup(Sys_PK);
ALTER TABLE SItem ADD CONSTRAINT RLSItemItemParent_SItemSys_PK FOREIGN KEY  (ItemParent ) REFERENCES SItem(Sys_PK);
ALTER TABLE UserVar ADD CONSTRAINT RLUserVarUser_UserSys_PK FOREIGN KEY  (fUser ) REFERENCES TUser(Sys_PK);
ALTER TABLE User_UserGroup_ ADD CONSTRAINT RL_User_UserGroup_Groups_UserSys_PK FOREIGN KEY  (Groups ) REFERENCES UserGroup(Sys_PK);
ALTER TABLE User_UserGroup_ ADD CONSTRAINT RL_User_UserGroup_Users_UserGroupSys_PK FOREIGN KEY  (Users ) REFERENCES TUser(Sys_PK);

INSERT INTO TUser (Sys_TimeStamp,Sys_Guid,Sys_DTCreated,Sys_DTExported,Sys_User, Notes,PWD,UserID,UserName,Locked) values( Now(), "DA6A732827E14559BECFDA89938FC5",Now(),Now(),"ADMIN","Administrador del sistema","D41D8CD98F00B204E9800998ECF8427E","ADMIN","ADMINISTRADOR",0);

CREATE VIEW qryGroupProfile  AS SELECT Profile.Sys_PK, Profile.Sys_TimeStamp, Profile.Sys_GUID, Profile.Sys_DTCreated, Profile.Sys_User, Profile.Sys_LastUser, Profile.Sys_Exported, Profile.Sys_DTExported, Profile.Sys_Info, Profile.Item, Profile.UserGroup, UserGroup.GroupID, SItem.Description, SItem.ItemID FROM UserGroup INNER JOIN (SItem INNER JOIN Profile ON SItem.Sys_PK = Profile.Item) ON UserGroup.Sys_PK = Profile.UserGroup;
CREATE VIEW qryUsersByGroup  AS SELECT TUser.UserID, TUser.UserName, TUser.PWD, TUser.Message, TUser.Locked, TUser.Notes, UserGroup.GroupID FROM TUser INNER JOIN (UserGroup INNER JOIN User_UserGroup_ ON UserGroup.Sys_PK=User_UserGroup_.Groups) ON TUser.Sys_PK=User_UserGroup_.Users;
CREATE VIEW qryUserVarsPK AS SELECT UserVar.Sys_PK, TUser.UserID, UserVar.VarName FROM UserVar, TUser  WHERE TUser.Sys_PK=UserVar.fUser;
CREATE VIEW qryUserProfile AS SELECT TUser.UserID, Profile.Item, SItem.Description, SItem.ItemID FROM SItem INNER JOIN (TUser INNER JOIN (User_UserGroup_ INNER JOIN Profile ON User_UserGroup_.Groups=Profile.UserGroup) ON TUser.Sys_PK=User_UserGroup_.Users) ON SItem.Sys_PK=Profile.Item GROUP BY TUser.UserID, Profile.Item, SItem.Description, SItem.ItemID;
CREATE VIEW qryUserVars AS SELECT UserVar.*, TUser.userID FROM UserVar, TUser;

INSERT INTO Globalvar(Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_DTExported,VarName,VarValue) VALUES(now(),'C3F742EE949F41799E568600042876B2',now(),now(),'FXCA076',CONCAT(Year(now()),''));

CREATE VIEW qryLeyendaCBB AS SELECT IF(length(VarValue)=12,'Contribuyente de Régimen de Transparencia','Efectos fiscales al pago') AS Leyenda,VarValue AS RFC FROM GlobalVar WHERE VarName='FXCA101';

CREATE VIEW qryDomicilioXCConsumo AS SELECT IF(ISNULL(CConsumo.uf_DomicilioCFD),0,(IF(Ciudad.Nombre='(Desconocido)',0,CConsumo.uf_DomicilioCFD))) AS PKDomicilio, Venta.Sys_PK AS PKVenta, CConsumo.Sys_PK AS PKCConsumo FROM Venta INNER JOIN (CConsumo LEFT JOIN (Domicilio LEFT JOIN Ciudad ON Domicilio.ICiudad=Ciudad.Sys_PK) ON CConsumo.uf_DomicilioCFD=Domicilio.Sys_PK) ON Venta.ICConsumo=CConsumo.Sys_PK;

CREATE VIEW qryDomicilioEmisor AS SELECT IF(ISNULL(GlobalVar.VarValue),'0',GlobalVar.VarValue) AS PKDomicilio, IF(ISNULL(GlobalVar.VarValue),0,GlobalVar.VarValue) AS PKLongDomicilio FROM GlobalVar WHERE GlobalVar.VarName='FXCA102b';


INSERT INTO GlobalVar (Sys_TimeStamp, Sys_GUID, Sys_DTCreated, Sys_User, Sys_LastUser, Sys_Exported, Sys_DTExported, Sys_Info, VarName, VarValue) VALUES (NOW(),'1F0B903EF4EA41E1AD9CD6920296EC00',NOW(),NULL,NULL,NULL,NULL, NULL, 'DB_SCHEMA_VER', '4.0');

ALTER TABLE ut_SysLog ADD CONSTRAINT RLSysLog_tUserSysPK FOREIGN KEY(Usuario) REFERENCES tUser(Sys_PK);
