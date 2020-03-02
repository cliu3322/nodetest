'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentReceiptsToAccount = sequelize.define('PaymentReceiptsToAccount', {
    PaymentToAccountantsId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  PaymentReceiptsToAccount.associate = function(models) {
    // associations can be defined here
  };
  return PaymentReceiptsToAccount;
};