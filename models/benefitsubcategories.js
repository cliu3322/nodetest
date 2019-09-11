'use strict';
module.exports = (sequelize, DataTypes) => {
  const BenefitSubCategories = sequelize.define('BenefitSubCategories', {
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  BenefitSubCategories.associate = function(models) {
    // associations can be defined here
  };
  return BenefitSubCategories;
};