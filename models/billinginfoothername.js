'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInfoOtherName = sequelize.define('BillingInfoOtherName', {
    visitId: DataTypes.INTEGER,
    value: DataTypes.STRING
  }, {});
  BillingInfoOtherName.associate = function(models) {
    // associations can be defined here
    BillingInfoOtherName.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return BillingInfoOtherName;
};
