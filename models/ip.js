'use strict';
module.exports = (sequelize, DataTypes) => {
  const IP = sequelize.define('IP', {
    address: DataTypes.STRING
  }, {});
  IP.associate = function(models) {
    // associations can be defined here
  };
  return IP;
};