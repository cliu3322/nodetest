'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfoOtherName = sequelize.define('BillingInfoOtherName', {
    visitId: DataTypes.INTEGER,
    value: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {});
  BillingInfoOtherName.associate = function(models) {
    BillingInfoOtherName.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return BillingInfoOtherName;
};
