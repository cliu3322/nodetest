
UPDATE Dirties SET claimedTotalUSD = ([1]+[2]+[3]+[4]+[5]+[6]+[7]+[8]+[9]+
[10]+[11]+[12]+[13]+[14]+[15]+[16]+[17]+[18]+[19]+
[20]+[21]+[22]+[23]+[24]+[25]+[26]+[27]+[28]+[29]+
[30]+[31]+[32]+[33]+[34]+[35]+[36]+[37]+[38]+ [39]+
[40]+[41]) WHERE id = 'B173' or id = 'F1047' or id = 'T2794' or id = 'A403' 
or id = 'U4840' or id = 'B665' or id = 'U4813' or id = 'U4990' or id = 'C9363';



UPDATE Dirties SET [39] = claimedTotalUSD- ([1]+[2]+[3]+[4]+[5]+[6]+[7]+[8]+[9]+
[10]+[11]+[12]+[13]+[14]+[15]+[16]+[17]+[18]+[19]+
[20]+[21]+[22]+[23]+[24]+[25]+[26]+[27]+[28]+[29]+
[30]+[31]+[32]+[33]+[34]+[35]+[36]+[37]+[38]+
[40]+[41]) WHERE id = 'B5194A' or id = 'D4825' or id = 'B316' or id = 'B4923' 
or id = 'A4940' or id = 'C1152';


UPDATE Dirties SET [29] = 0 WHERE id = 'F4842' ;
UPDATE Dirties SET [30] = 0, [31] = claimedTotalUSD WHERE id = 'C9261' ;
UPDATE Dirties SET [30] = claimedTotalUSD WHERE id = 'D751' ;
UPDATE Dirties SET claimedTotalUSD = [25], billingTotalUSD = 515, [39] = 0 WHERE id = 'C6709' ;
UPDATE Dirties SET [39] = 0 WHERE id = 'C6709' ;





/****** Script for SelectTopNRows command from SSMS  ******/
SELECT * FROM [claim].[dbo].Dirties where id =  'A4919' OR id = 'C9371' OR id = 'C3861' OR id = 'A188'

