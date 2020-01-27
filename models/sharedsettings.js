'use strict';
module.exports = (sequelize, DataTypes) => {
  const SharedSettings = sequelize.define('SharedSettings', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  SharedSettings.associate = function(models) {
    // associations can be defined here
  };
  return SharedSettings;
};