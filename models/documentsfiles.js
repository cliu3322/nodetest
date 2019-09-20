'use strict';
module.exports = (sequelize, DataTypes) => {
  const DocumentsFiles = sequelize.define('DocumentsFiles', {
    path: DataTypes.STRING,
    fileName: DataTypes.STRING,
    notes: DataTypes.STRING,
    visitId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {});
  DocumentsFiles.associate = function(models) {
    // associations can be defined here
  };
  return DocumentsFiles;
};