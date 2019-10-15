'use strict';
module.exports = (sequelize, DataTypes) => {
  const DocumentsFiles = sequelize.define('DocumentsFiles', {
    path: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    fileName: DataTypes.STRING,
    notes: DataTypes.STRING,
    visitId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {});
  DocumentsFiles.associate = function(models) {
    // associations can be defined here
    DocumentsFiles.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return DocumentsFiles;
};
