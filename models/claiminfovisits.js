'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfoVisits = sequelize.define('ClaimInfoVisits', {
    claimInfoId: DataTypes.STRING,
    dateOfAdmissionVisit: DataTypes.DATE,
    doctorName: DataTypes.STRING,
    hospitalOrClinicCountry: DataTypes.STRING,
    hospitalOrclinicEmail: DataTypes.STRING,
    hospitalOrClinicName: DataTypes.STRING,
    hospitalOrClinicCountryrl: DataTypes.STRING,
    MedicalDiagnosis: DataTypes.STRING
  }, {});
  ClaimInfoVisits.associate = function(models) {
    // associations can be defined here
  };
  return ClaimInfoVisits;
};