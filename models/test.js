'use strict';
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    name: DataTypes.STRING
  }, {
    paranoid: true,
    timestamps: true
  });
  Test.associate = function(models) {
    // associations can be defined here
  };
  return Test;
};
