'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfoVisitsFiles = sequelize.define('ClaimInfoVisitsFiles', {
    visitId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  ClaimInfoVisitsFiles.associate = function(models) {
    // associations can be defined here
    ClaimInfoVisitsFiles.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id', onDelete: 'CASCADE'
    });
  };
  return ClaimInfoVisitsFiles;
};
