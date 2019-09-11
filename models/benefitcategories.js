'use strict';
module.exports = (sequelize, DataTypes) => {
  const BenefitCategories = sequelize.define('BenefitCategories', {
    name: DataTypes.STRING
  }, {});
  BenefitCategories.associate = function(models) {
    // associations can be defined here
  };
  return BenefitCategories;
};