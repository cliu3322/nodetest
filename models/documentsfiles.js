'use strict';
module.exports = (sequelize, DataTypes) => {
  const DocumentsFiles = sequelize.define('DocumentsFiles', {
    visitId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {});
  DocumentsFiles.associate = function(models) {
    // associations can be defined here
    DocumentsFiles.belongsTo(models.ClaimInfoVisits, {
      foreignKey: 'visitId',  targetKey: 'id'
    });
  };
  return DocumentsFiles;
};
