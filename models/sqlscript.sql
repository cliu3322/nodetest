/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) *
  FROM [claim].[dbo].[dirty] where id = 'B652'


/****** duplicate ******/
SELECT id, COUNT(*), status occurrences
FROM [dirty]
GROUP BY 
[id], status
HAVING COUNT(*) > 1;

/****** duplicate ******/
SELECT id, COUNT(*) occurrences
FROM [dirty]
GROUP BY 
[id]
HAVING COUNT(*) > 1;

DELETE TOP (1) FROM [dirty]
WHERE
    id = 'B4871'

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
         FROM   dirty) 
DELETE FROM cte 
WHERE  row_num > 1; 