'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfo = sequelize.define('ClaimInfo', {
    createdBy: DataTypes.INTEGER,
    accountholdersname: DataTypes.STRING,
    bankaccountnumber: DataTypes.STRING,
    bankaddress: DataTypes.STRING,
    cause: DataTypes.STRING,
    contactemail: DataTypes.STRING,
    contactfirstname: DataTypes.STRING,
    contacthomeaddress: DataTypes.STRING,
    contactlastname: DataTypes.STRING,
    contactphonenumber: DataTypes.STRING,
    gop: DataTypes.BOOLEAN,
    ibancodesortcode: DataTypes.STRING,
    patientage: DataTypes.INTEGER,
    patientdob: DataTypes.DATE,
    patientfirstname: DataTypes.STRING,
    patientlastname: DataTypes.STRING,
    policyemail: DataTypes.STRING,
    policyfirstname: DataTypes.STRING,
    policygrouppolicy: DataTypes.BOOLEAN,
    policylastname: DataTypes.STRING,
    policylasttype: DataTypes.STRING,
    policyvip: DataTypes.BOOLEAN,
    reimbusementcurrency: DataTypes.STRING,
    relationshiptopatient: DataTypes.STRING,
    swift: DataTypes.STRING
  }, {});
  ClaimInfo.associate = function(models) {
    // associations can be defined here
  };
  return ClaimInfo;
};