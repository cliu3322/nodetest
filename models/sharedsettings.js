'use strict';
module.exports = (sequelize, DataTypes) => {
  const SharedSettings = sequelize.define('SharedSettings', {
    modifiedBy: DataTypes.INTEGER,
    accountantEmail: DataTypes.STRING,
    forwardEmail: DataTypes.STRING,
    paymentPassword: DataTypes.STRING
  }, {});
  SharedSettings.associate = function(models) {
    // associations can be defined here
  };
  return SharedSettings;
};