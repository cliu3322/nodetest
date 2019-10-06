'use strict';
module.exports = (sequelize, DataTypes) => {
  const RejectedClaimsOldData = sequelize.define('RejectedClaimsOldData', {

    patientName: DataTypes.STRING,
    policyNumber: DataTypes.STRING,
    cause: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    reimbusementCurrency: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    contactPhoneNumber: DataTypes.STRING,
    bankAccountNumber: DataTypes.STRING,

  }, {});
  RejectedClaimsOldData.associate = function(models) {
  };
  return RejectedClaimsOldData;
};
