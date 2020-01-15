'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentReceipts = sequelize.define('PaymentReceipts', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    receivedAt: DataTypes.DATE
  }, {});
  PaymentReceipts.associate = function(models) {
    // associations can be defined here
  };
  return PaymentReceipts;
};