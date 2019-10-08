'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfoFiles = sequelize.define('ClaimInfoFiles', {
    visitId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    fileAddress: DataTypes.STRING
  }, {});
  ClaimInfoFiles.associate = function(models) {
    // associations can be defined here
    ClaimInfoFiles.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return ClaimInfoFiles;
};
