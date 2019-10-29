'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    code:  {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    perUSD: DataTypes.FLOAT,
    USDper: DataTypes.FLOAT,
    date: DataTypes.DATE
  }, {});
  ExchangeRate.associate = function(models) {
    // associations can be defined here
  };
  return ExchangeRate;
};
