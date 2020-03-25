UPDATE Dirties SET status = 'Approved. To be Paid', Reject_USD = 0 WHERE id = 'D779a';
/*check*/
UPDATE Dirties SET claimedTotalUSD = ([18]+[23]) WHERE id = 'D1014';

UPDATE Dirties SET claimedTotalUSD = approved_USD WHERE id = 'F1040';
UPDATE Dirties SET claimedTotalUSD = approved_USD WHERE id = 'T5079';




UPDATE Dirties SET  approved_USD = claimedTotalUSD, approved_reimbusement = billingTotalUSD WHERE id = 'A5328';

UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'U5087';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'U5088';

UPDATE Dirties SET  approved_USD = claimedTotalUSD,  billingTotalUSD=approved_reimbusement WHERE id = 'B4850';

UPDATE Dirties SET claimedTotalUSD=approved_USD, [23]= approved_USD WHERE id = 'T4791';

UPDATE Dirties SET claimedTotalUSD = approved_USD WHERE id = 'D391';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'C2150';
UPDATE Dirties SET claimedTotalUSD = approved_USD WHERE id = 'F4991';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'S4948';

UPDATE Dirties SET approved_reimbusement = 168, billingTotalUSD = 168, claimedTotalUSD=183.42, [15]=183.42, approved_USD = claimedTotalUSD WHERE id = 'T5138';
UPDATE Dirties SET approved_USD = 5, approved_reimbusement = 5 WHERE id = 'B5478A';
UPDATE Dirties SET status = 'Rejected' WHERE id = 'G4859';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'D458';
UPDATE Dirties SET claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement, [30]= approved_USD WHERE id = 'B641';
UPDATE Dirties SET claimedTotalUSD = [15], billingTotalUSD=1900 WHERE id = 'B293';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'A4937';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'U4990';

UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'A2';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'A4';
UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'C6880';
UPDATE Dirties SET approved_USD = claimedTotalUSD, approved_reimbusement=billingTotalUSD WHERE id = 'D5103';
UPDATE Dirties SET approved_USD = claimedTotalUSD, approved_reimbusement=billingTotalUSD WHERE id = 'D5104';
UPDATE Dirties SET claimedTotalUSD = approved_USD WHERE id = 'B432';

/*new*/
UPDATE Dirties SET approved_USD = claimedTotalUSD, approved_reimbusement=billingTotalUSD WHERE id = 'A5329';
UPDATE Dirties SET hospitalDate = '2019-12-17 00:00:00.000' WHERE id = 'A5329';

UPDATE Dirties SET approved_USD = claimedTotalUSD WHERE id = 'F1047';
UPDATE Dirties SET claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement WHERE id = 'B5336';
UPDATE Dirties SET claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement WHERE id = 'T5116';
UPDATE Dirties SET claimedTotalUSD=approved_USD WHERE id = 'B652';
UPDATE Dirties SET claimedTotalUSD=approved_USD WHERE id = 'D5012';
UPDATE Dirties SET claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement WHERE id = 'D5080';
UPDATE Dirties SET claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement WHERE id = 'C9363';


UPDATE Dirties SET policyNumber='RIH/2018/ST/55876459' WHERE id = 'C1342';
UPDATE Dirties SET policyNumber='RIH/2018/FC/05017568' WHERE id = 'B471';
UPDATE Dirties SET policyNumber='RIH/2019/ST/44974043' WHERE id = 'U4970';

UPDATE Dirties SET policyNumber='RIH/2019/FC/09303544' WHERE id = 'B5463';



UPDATE Dirties SET policyNumber='RIH/2017/CO/632377' WHERE id = 'A28';
UPDATE Dirties SET claimedTotalUSD=1715.22, billingTotalUSD=1715.22 WHERE id = 'G4977';


UPDATE Dirties SET policyNumber='RIH/2017/CO/632377' WHERE id = 'A28';
UPDATE Dirties SET [39] = (claimedTotalUSD-([1]+[3]+[7])) WHERE id = 'G4977';

UPDATE Dirties SET policyNumber='RIH/2018/FC/96703534' WHERE id = 'B381';
UPDATE Dirties SET policyNumber='RIH/2018/CO/51128415' WHERE id = 'A113';

UPDATE Dirties SET status = 'Approved. To be Paid', billingTotalUSD = 5429.82, claimedTotalUSD = 3905.41, approved_USD = 3905.41, approved_reimbusement = 5429.82, [3] =  3905.41 WHERE id = 'C3861';
UPDATE Dirties SET status = 'Approved. To be Paid', billingTotalUSD = 300, claimedTotalUSD = 78.41, approved_USD = 78.41, approved_reimbusement = 300, [21] =  78.41 WHERE id = 'D293';

UPDATE Dirties SET billingCurrency='Euro', billingTotalUSD = approved_reimbusement WHERE id = 'C726';
UPDATE Dirties SET billingCurrency='Euro', billingTotalUSD = approved_reimbusement WHERE id = 'C1008';





/*YOU CAN NOT RUN SECOND TIME*/
/* UPDATE Dirties SET [39] = approved_USD - claimedTotalUSD,  claimedTotalUSD = approved_USD WHERE id = 'B212'; */
UPDATE Dirties SET [39] = approved_USD - claimedTotalUSD,  claimedTotalUSD = approved_USD WHERE id = 'B224'; 
UPDATE Dirties SET [39] = (approved_USD - ([21]+[23]+[24])),claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement  WHERE id = 'C6569';
UPDATE Dirties SET [39] = (approved_USD - 25),claimedTotalUSD=approved_USD, billingTotalUSD=approved_reimbusement  WHERE id = 'C6709';
UPDATE Dirties SET [39] = (approved_USD - 18),claimedTotalUSD=approved_USD  WHERE id = 'D183';
UPDATE Dirties SET policyNumber=patientName, patientName=policyNumber WHERE id = 'U4929';



UPDATE Dirties SET Reject_USD = (claimedTotalUSD - approved_USD)




