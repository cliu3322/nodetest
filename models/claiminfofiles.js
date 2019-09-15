'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimInfoFiles = sequelize.define('ClaimInfoFiles', {
    fileName: DataTypes.STRING,
    fileAddress: DataTypes.STRING,
    claimInfoId: DataTypes.STRING
  }, {});
  ClaimInfoFiles.associate = function(models) {
    // associations can be defined here
  };
  return ClaimInfoFiles;
};