'use strict';
module.exports = (sequelize, DataTypes) => {
  const BenefitSubCategories = sequelize.define('BenefitSubCategories', {
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  BenefitSubCategories.associate = function(models) {
    // associations can be defined here

    BenefitSubCategories.belongsTo(models.BenefitCategories, {
      foreignKey: 'categoryId',  targetKey: 'id'
    });


  };
  return BenefitSubCategories;
};
