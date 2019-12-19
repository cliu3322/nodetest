'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfo_v1 = sequelize.define('ClaimInfos_v1', {
    id:  {
        type: DataTypes.STRING,
        primaryKey: true
    },
    createdBy: DataTypes.INTEGER,
    accountHoldersName: DataTypes.STRING,
    bankAccountNumber: DataTypes.STRING,
    bankAddress: DataTypes.STRING,
    bankName: DataTypes.STRING,
    cause: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    contactFirstName: DataTypes.STRING,
    contactHomeAddress: DataTypes.STRING,
    contactLastName: DataTypes.STRING,
    contactPhoneNumberCountryCode: DataTypes.STRING,
    contactPhoneNumber: DataTypes.STRING,
    gop: DataTypes.BOOLEAN,
    ibanCodeSortCode: DataTypes.STRING,
    patientAge: DataTypes.INTEGER,
    patientDob: DataTypes.DATE,
    patientFirstName: DataTypes.STRING,
    patientLastName: DataTypes.STRING,
    policyEmail: DataTypes.STRING,
    policyFirstName: DataTypes.STRING,
    policyGroupPolicy: DataTypes.BOOLEAN,
    policyLastName: DataTypes.STRING,
    policyType: DataTypes.STRING,
    policyNumber: DataTypes.STRING,
    policyVip: DataTypes.BOOLEAN,
    reimbusementCurrency: DataTypes.STRING,
    relationshipToPatient: DataTypes.STRING,
    swift: DataTypes.STRING,
    RCExchangeRate:DataTypes.FLOAT,
    RCExchangeRateDate:DataTypes.DATE,
    status: DataTypes.STRING,
  }, {});
  ClaimInfo_v1.associate = function(models) {
    // associations can be defined here
  };
  return ClaimInfo_v1;
};
