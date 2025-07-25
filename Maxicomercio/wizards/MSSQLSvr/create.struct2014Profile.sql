INSERT INTO docf_blockxgrupousuarios(sys_timestamp, sys_guid, sys_dtcreated, sys_exported, sys_dtexported, sys_recver, IGrupo, IBlock, ITipo) VALUES(GETDATE(), 'DBDC22BFB60B11E3970120A0C0E12929', GETDATE(), 0, GETDATE(), 0, (SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'), (SELECT Sys_PK FROM BlockDocumentos WHERE Serie = 'RP'), (SELECT Sys_PK FROM docf_tipo WHERE ID = 1));

INSERT INTO docf_blockxgrupousuarios(sys_timestamp, sys_guid, sys_dtcreated, sys_exported, sys_dtexported, sys_recver, IGrupo, IBlock, ITipo) VALUES(GETDATE(), 'FCAF0950B60D11E3970120A0C0E12929', GETDATE(), 0, GETDATE(), 0, (SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'), (SELECT Sys_PK FROM BlockDocumentos WHERE Serie = 'RA'), (SELECT Sys_PK FROM docf_tipo WHERE ID = 2));

INSERT INTO docf_blockxgrupousuarios(sys_timestamp, sys_guid, sys_dtcreated, sys_exported, sys_dtexported, sys_recver, IGrupo, IBlock, ITipo) VALUES(GETDATE(), '7E70E61DB60E11E3970120A0C0E12929', GETDATE(), 0, GETDATE(), 0, (SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'), (SELECT Sys_PK FROM BlockDocumentos WHERE Serie = 'RC'), (SELECT Sys_PK FROM docf_tipo WHERE ID = 3));

INSERT INTO docf_blockxgrupousuarios(sys_timestamp, sys_guid, sys_dtcreated, sys_exported, sys_dtexported, sys_recver, IGrupo, IBlock, ITipo) VALUES(GETDATE(), '821A91EEB60E11E3970120A0C0E12929', GETDATE(), 0, GETDATE(), 0, (SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'), (SELECT Sys_PK FROM BlockDocumentos WHERE Serie = 'RG'), (SELECT Sys_PK FROM docf_tipo WHERE ID = 4));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'215D0DC1B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '3C9F31A94ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'257BD6F7B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '2B8A2C804ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'293BF0BBB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '2E9BA2034ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'2C66FCA6B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '34EABAC64ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'2F977DC9B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '39DDA95C4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'3278C168B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '3F12A42A4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'35A479C0B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '41FB3DA64ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'3AEF6D24B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '44242EDB4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'3E3C19E9B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '47B197934ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'411FDB3FB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '49BADA1B4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'44074D1FB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '4C09A70D4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'47357548B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '4E44E9DD4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'4A38EC43B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '50D1F7F04ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'4CE5BBADB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '5309E9464ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'509ECEECB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '5538C0D14ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'555C712CB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '577C8F924ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'5895858FB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '59D9F5264ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'5C8AA1B8B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '5BF356B34ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'607AFD6EB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '5E7045954ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'63A5925FB75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '60A6A3C04ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'67AD04A9B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '68059B8A4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'6AC195A8B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '63B3E87C4ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'6DEFFEE7B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '65F29FF04ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));

INSERT INTO ut_crmprofile(Sys_TimeStamp, Sys_GUID,  Sys_DTCreated, Sys_Exported, fk_crmsitem, fk_tuser_group) VALUES (GETDATE(),'70DFA8C9B75811E3A801233CC21B3EE9',GETDATE(),0,(Select Sys_PK from ut_crmsitem where Sys_GUID = '6A1A0F204ED911E3A1FB143DF30D67DC'),(SELECT Sys_PK FROM usergroup where GroupID = 'Administradores'));