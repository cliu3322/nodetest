/*duplicate record*/

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



/*delete the reject one record*/

DELETE TOP (1) FROM Dirties WHERE id = 'A305' and status = 'Rejected'
DELETE TOP (1) FROM Dirties WHERE id = 'B5186' and status = 'Rejected'
DELETE TOP (1) FROM Dirties WHERE id = 'B651' and status = 'Rejected'
DELETE TOP (1) FROM Dirties WHERE id = 'B652' and status = 'Rejected'
DELETE TOP (1) FROM Dirties WHERE id = 'C3581' and status = 'Rejected'
DELETE TOP (1) FROM Dirties WHERE id = 'C3582' and status = 'Rejected'


DELETE TOP (1) FROM Dirties WHERE id = 'B4862' 
DELETE TOP (1) FROM Dirties WHERE id = 'B4871' 

DELETE TOP (1) FROM Dirties WHERE id = 'B4827' and bankAddress = 'n/a'


UPDATE Dirties SET id = 'C9227a' WHERE id = 'C9227' and status = 'Rejected';
UPDATE Dirties SET id = 'D992a' WHERE id = 'D992' and status = 'Rejected';
UPDATE Dirties SET id = 'U5033a' WHERE id = 'U5033' and status = 'Rejected';

DELETE TOP (1) FROM Dirties WHERE id = 'D433' and Reject_USD is null
UPDATE Dirties SET status = 'Rejected' WHERE id = 'U5033a' and status = 'Rejected';


UPDATE Dirties SET approved_reimbusement = 2578404.00 WHERE id = 'A119'