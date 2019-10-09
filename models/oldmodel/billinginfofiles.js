'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfoFiles = sequelize.define('BillingInfoFiles', {
    visitId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    fileAddress: DataTypes.STRING
  }, {});
  BillingInfoFiles.associate = function(models) {
    // associations can be defined here
  };
  return BillingInfoFiles;
};