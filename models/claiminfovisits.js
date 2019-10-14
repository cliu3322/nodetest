'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfoVisits = sequelize.define('ClaimInfoVisits', {
    claimInfoId: DataTypes.STRING,
    visitNumber: DataTypes.INTEGER,
    dateOfAdmissionVisit: DataTypes.DATE,
    doctorName: DataTypes.STRING,
    hospitalOrClinicCountry: DataTypes.STRING,
    hospitalOrclinicEmail: DataTypes.STRING,
    hospitalOrClinicName: DataTypes.STRING,
    hospitalOrClinicCountryrl: DataTypes.STRING,
    MedicalDiagnosis: DataTypes.STRING,
    billingCurrency: DataTypes.STRING,
    billingUsdper: DataTypes.FLOAT,
    reimbusementUsdper: DataTypes.FLOAT,
    currencyDate: DataTypes.DATE
  }, {});
  ClaimInfoVisits.associate = function(models) {
    // associations can be defined here
    ClaimInfoVisits.hasMany(models.ClaimInfoVisitsFiles, {
      foreignKey: 'visitId',  targetKey: 'id'
    });

    ClaimInfoVisits.hasMany(models.BillingInfo, {
      foreignKey: 'visitId',  targetKey: 'id'
    });

    ClaimInfoVisits.hasMany(models.BillingInfoFiles, {
      foreignKey: 'visitId',  targetKey: 'id'
    });


    ClaimInfoVisits.belongsTo(models.ClaimInfo, {
      foreignKey: 'claimInfoId',  targetKey: 'id'
    });
  };
  return ClaimInfoVisits;
};
