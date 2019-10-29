'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfo = sequelize.define('BillingInfo', {
    visitId: DataTypes.INTEGER,
    billingCat: DataTypes.INTEGER,
    billingSubCat: DataTypes.INTEGER,
    value: DataTypes.BIGINT,
    approved: DataTypes.BIGINT
  }, {});
  BillingInfo.associate = function(models) {
    // associations can be defined here
    BillingInfo.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
    BillingInfo.belongsTo(models.BenefitCategories, {
      foreignKey: 'billingCat', targetKey: 'id'
    });
    BillingInfo.belongsTo(models.BenefitSubCategories, {
      foreignKey: 'billingSubCat', targetKey: 'id'
    });
  };
  return BillingInfo;
};
