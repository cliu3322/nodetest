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
    billingRate: DataTypes.FLOAT,
    currencyDate: DataTypes.DATE
  }, {});
  ClaimInfoVisits.associate = function(models) {
    // associations can be defined here
    ClaimInfoVisits.hasMany(models.ClaimInfoVisitsFiles, {
      foreignKey: 'visitId',  targetKey: 'id', onDelete: 'cascade', hooks: true, onUpdate: 'cascade',
    });

    ClaimInfoVisits.hasMany(models.BillingInfo, {
      foreignKey: 'visitId',  targetKey: 'id',onDelete: 'cascade', hooks: true
    });

    ClaimInfoVisits.hasMany(models.BillingInfoOtherName, {
      foreignKey: 'visitId',  targetKey: 'id',onDelete: 'cascade', hooks: true
    });

    ClaimInfoVisits.hasMany(models.BillingInfoFiles, {
      foreignKey: 'visitId',  targetKey: 'id', onDelete: 'cascade', hooks: true
    });

    ClaimInfoVisits.hasMany(models.DocumentsFiles, {
      foreignKey: 'visitId',  targetKey: 'id', onDelete: 'cascade', hooks: true
    });


    ClaimInfoVisits.belongsTo(models.ClaimInfo, {
      foreignKey: 'claimInfoId',  targetKey: 'id',
    });
  };
  return ClaimInfoVisits;
};
