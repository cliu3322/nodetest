/****** Script for SelectTopNRows command from SSMS  ******/
SELECT SUM([1]+[2]+[3]+[4]+[5]+[6]+[7]+[8]+[9]+
[10]+[11]+[12]+[13]+[14]+[15]+[16]+[17]+[18]+[19]+
[20]+[21]+[22]+[23]+[24]+[25]+[26]+[27]+[28]+[29]+
[30]+[31]+[32]+[33]+[34]+[35]+[36]+[37]+[38]+
[40]+[41])
  FROM [claim].[dbo].Dirties where id =  'B173'

  SELECT TOP (1000) *
  FROM [claim].[dbo].Dirties where id =  'S4827'

  SELECT (claimedTotalUSD-([1]+[3]+[7]))
  FROM [claim].[dbo].Dirties where id =  'G4977'

/****** duplicate ******/
SELECT id, COUNT(*), status occurrences
FROM Dirties
GROUP BY 
[id], status
HAVING COUNT(*) > 1;

/****** duplicate ******/
SELECT id, COUNT(*) occurrences
FROM Dirties
GROUP BY 
[id]
HAVING COUNT(*) > 1;

DELETE TOP (1) FROM Dirties
WHERE
    id = 'E1000'


UPDATE Dirties
SET status = 'Approved. To be Paid'
WHERE id = 'T4788a';

/****** remove duplicate ******/

WITH cte 
     AS (SELECT [id], [policytype], [policynumber], [patientname], [status2], [hospitaldate], [cause], [hospitalname], [hospitallocation], [doctorname], [billingcurrency], 
     [reimbursementcurrency], [createdat], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [18], [19], [20], [21], [22], [23], [24], [25], [26], 
     [27], [28], [15], [16], [17], [29], [30], [31], [32], [33], [34], [35], [36], [37], [38], [40], [41], [claimedtotalusd], [billingtotalusd], [email], 
     [contactphonenumber], [bankaccount], [accountholdersname], [bankname], [bankaddress], [swift], [ibancodesortcode], [contacthomeaddress], [status], [decisioner], 
     [decisiondate], [approved_usd], [approved_reimbusement], [decisionreason], [turnaround], [reject_usd], [benefitarea], 
                Row_number() 
                  OVER ( 
                    partition BY [id], [policytype], [policynumber], [patientname], [status2], [hospitaldate], [cause], [hospitalname], [hospitallocation], [doctorname], 
                    [billingcurrency], [reimbursementcurrency], [createdat], [1], [2], [3] , [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [18], [19], [20], 
                    [21], [22], [23], [24], [25], [26], [27], [28], [15], [16], [17], [29], [30] , [31], [32], [33], [34], [35], [36], [37], [38], [40], [41], 
                    [claimedtotalusd], [billingtotalusd], [email], [contactphonenumber], [bankaccount], [accountholdersname], [bankname], [bankaddress], [swift], 
                    [ibancodesortcode], [contacthomeaddress], [status], [decisioner], [decisiondate], [approved_usd], [approved_reimbusement], [decisionreason], 
                    [turnaround], [reject_usd], [benefitarea]   
                ORDER BY 
                [id], [policytype], [policynumber], [patientname], [status2], [hospitaldate], [cause], [hospitalname], [hospitallocation], [doctorname], [billingcurrency], 
     [reimbursementcurrency], [createdat], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [18], [19], [20], [21], [22], [23], [24], [25], [26], 
     [27], [28], [15], [16], [17], [29], [30], [31], [32], [33], [34], [35], [36], [37], [38], [40], [41], [claimedtotalusd], [billingtotalusd], [email], 
     [contactphonenumber], [bankaccount], [accountholdersname], [bankname], [bankaddress], [swift], [ibancodesortcode], [contacthomeaddress], [status], [decisioner], 
     [decisiondate], [approved_usd], [approved_reimbusement], [decisionreason], [turnaround], [reject_usd], [benefitarea] ) row_num 
         FROM   Dirties) 
DELETE FROM cte 
WHERE  row_num > 1; 


/****** Script for pre ******/
UPDATE [dbo].[BillingInfos]
SET billingCat = t2.categoryId
FROM  [dbo].[BillingInfos]
INNER JOIN [dbo].[BenefitSubCategories] as t2 ON [dbo].[BillingInfos].billingSubCat = t2.id


