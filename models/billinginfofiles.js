'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfoFiles = sequelize.define('BillingInfoFiles', {
    visitId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE
  }, {});
  BillingInfoFiles.associate = function(models) {
    // associations can be defined here
  };
  return BillingInfoFiles;
};