'use strict';
module.exports = (sequelize, DataTypes) => {

  var attributes = {

        patientName: DataTypes.STRING,
        policyNumber: DataTypes.STRING,
        cause: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        reimbursementCurrency: DataTypes.STRING,
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
        billingTotalbilling: DataTypes.STRING,
        hospitalDate: DataTypes.DATE,
        rejectReason:DataTypes.STRING,
        turnaround: DataTypes.INTEGER,
  }
  for (var i = 1; i < 42; i++) {
    attributes[i] = DataTypes.FLOAT
  }
  const LegacyExcel = sequelize.define('LegacyExcel', attributes, {});
  LegacyExcel.associate = function(models) {
  };
  return LegacyExcel;
};
