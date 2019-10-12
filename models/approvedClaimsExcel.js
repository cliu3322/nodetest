'use strict';
module.exports = (sequelize, DataTypes) => {

  var attributes = {

        patientName: DataTypes.STRING,
        policyNumber: DataTypes.STRING,
        cause: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        ReimbursementCurrency: DataTypes.STRING,
        email: DataTypes.STRING,
        contactPhoneNumber: DataTypes.STRING,
        contactHomeAddress: DataTypes.STRING,
        bankAccount: DataTypes.STRING,
        accountHoldersName: DataTypes.STRING,
        bankName: DataTypes.STRING,
        bankAddress: DataTypes.STRING,
        swift: DataTypes.STRING,
        ibanCodeSortCode: DataTypes.STRING,
        status: DataTypes.STRING,
        decisioner: DataTypes.STRING,
        decisionDate: DataTypes.DATE,
        approvedUSD: DataTypes.FLOAT,
        approvedReimbursement: DataTypes.FLOAT,
        note: DataTypes.STRING,


        hospitalName: DataTypes.STRING,
        hospitalLocation: DataTypes.STRING,
        doctorName: DataTypes.STRING,
        billingCurrency: DataTypes.STRING,
        claimedTotalUSD: DataTypes.STRING,
        billingTotalUSD: DataTypes.STRING,
        hospitalDate: DataTypes.DATE,

  }
  for (var i = 1; i < 42; i++) {
    attributes[i] = DataTypes.FLOAT
  }
  const ApprovedClaimsExcel = sequelize.define('ApprovedClaimsExcel', attributes, {});
  ApprovedClaimsExcel.associate = function(models) {
  };
  return ApprovedClaimsExcel;
};
