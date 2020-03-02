'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentToAccountant = sequelize.define('PaymentToAccountant', {
    sendAt: DataTypes.DATE,
    url: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  PaymentToAccountant.associate = function(models) {
    PaymentToAccountant.hasMany(models.PaymentReceiptsToAccount,
      {  foreignKey: 'PaymentToAccountantsId',  targetKey: 'id'}
    )
  };
  return PaymentToAccountant;
};