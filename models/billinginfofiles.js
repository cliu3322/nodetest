'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfoFiles = sequelize.define('BillingInfoFiles', {
    visitId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  BillingInfoFiles.associate = function(models) {
    // associations can be defined here
    BillingInfoFiles.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return BillingInfoFiles;
};
