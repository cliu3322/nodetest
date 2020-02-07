'use strict';
module.exports = (sequelize, DataTypes) => {
  const vClaimInfo = sequelize.define('vClaimInfo', {
    ID:  {
        type: DataTypes.STRING,
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

    name: DataTypes.STRING,
  }, {});
  vClaimInfo.associate = function(models) {
  };
  return vClaimInfo;
};
