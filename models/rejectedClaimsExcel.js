'use strict';
module.exports = (sequelize, DataTypes) => {
  const RejectedClaimsExcel = sequelize.define('RejectedClaimsExcel', {

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
    decisionReason: DataTypes.STRING,
    decisionReason: DataTypes.STRING,
    RCExchangeRate: DataTypes.STRING,
    RCExchangeRateDate: DataTypes.DATE,
    turnaround: DataTypes.INTEGER,

  }, {});
  RejectedClaimsExcel.associate = function(models) {
  };
  return RejectedClaimsExcel;
};
