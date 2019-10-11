'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfo = sequelize.define('BillingInfo', {
    visitId: DataTypes.INTEGER,
    billingCat: DataTypes.INTEGER,
    billingSubCat: DataTypes.INTEGER,
    value: DataTypes.BIGINT
  }, {});
  BillingInfo.associate = function(models) {
    // associations can be defined here
    BillingInfo.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return BillingInfo;
};
