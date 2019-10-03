'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfoVisitsFiles = sequelize.define('ClaimInfoVisitsFiles', {
    uid:  {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    visitId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  ClaimInfoVisitsFiles.associate = function(models) {
    // associations can be defined here
    ClaimInfoVisitsFiles.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return ClaimInfoVisitsFiles;
};
