'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApprovedClaimsExcel = sequelize.define('ApprovedClaimsExcel', {

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
    note: DataTypes.STRING

  }, {});
  ApprovedClaimsExcel.associate = function(models) {
  };
  return ApprovedClaimsExcel;
};
