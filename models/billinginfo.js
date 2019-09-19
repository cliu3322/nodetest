'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfo = sequelize.define('BillingInfo', {
    visitId: DataTypes.INTEGER,
    billingCat: DataTypes.INTEGER,
    billingSubCat: DataTypes.INTEGER,
    value: DataTypes.FLOAT
  }, {});
  BillingInfo.associate = function(models) {
    // associations can be defined here
  };
  return BillingInfo;
};