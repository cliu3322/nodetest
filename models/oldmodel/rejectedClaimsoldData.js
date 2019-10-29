'use strict';
module.exports = (sequelize, DataTypes) => {
  const RejectedClaimsOldData = sequelize.define('RejectedClaimsOldData', {

    patientName: DataTypes.STRING,
    policyNumber: DataTypes.STRING,
    cause: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    ReimbursementCurrency: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    contactPhoneNumber: DataTypes.STRING,
    bankAccountNumber: DataTypes.STRING,
    accountHoldersName: DataTypes.STRING,
    bankName: DataTypes.STRING,
    bankAddress: DataTypes.STRING,
    swift: DataTypes.STRING,
    ibanCodeSortCode: DataTypes.STRING,
    status: DataTypes.STRING,
    rejector: DataTypes.STRING,
    decisionDate: DataTypes.DATE,
    decisionReason: DataTypes.STRING,
    RCExchangeRate: DataTypes.STRING,
    RCExchangeRateDate: DataTypes.DATE,

  }, {});
  RejectedClaimsOldData.associate = function(models) {
  };
  return RejectedClaimsOldData;
};
