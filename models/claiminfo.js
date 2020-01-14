'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfo = sequelize.define('ClaimInfo', {
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
    approvedAt: DataTypes.DATE,
    reimbursementRef: DataTypes.STRING,
    PaidAt: DataTypes.DATE,
    paymentStatus: DataTypes.STRING,
    isPaid: DataTypes.BOOLEAN,
  }, {});
  ClaimInfo.associate = function(models) {
    // associations can be defined here
    ClaimInfo.hasMany(models.ClaimInfoVisits,
      {  foreignKey: 'claimInfoId',  targetKey: 'id'}
    )
    ClaimInfo.hasOne(models.Acessment,
      {  foreignKey: 'claimInfoId',  targetKey: 'id'}
    )
    ClaimInfo.hasMany(models.Comments,
      {  foreignKey: 'claimInfoId',  targetKey: 'id'}
    )
  };
  return ClaimInfo;
};
