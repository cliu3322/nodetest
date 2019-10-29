'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    claimInfoId: DataTypes.STRING,
    group: DataTypes.STRING,
    message: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    parent: DataTypes.INTEGER,
    adhere: DataTypes.BOOLEAN
  }, {});
  Comments.associate = function(models) {
    // associations can be defined here
  };
  return Comments;
};