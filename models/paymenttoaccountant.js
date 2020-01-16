'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentToAccountant = sequelize.define('PaymentToAccountant', {
    sendAt: DataTypes.DATE,
    url: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  PaymentToAccountant.associate = function(models) {
    // associations can be defined here
  };
  return PaymentToAccountant;
};