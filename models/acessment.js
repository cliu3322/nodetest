'use strict';
module.exports = (sequelize, DataTypes) => {
  const Acessment = sequelize.define('Acessment', {
    claimInfoId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    forPreExisting: DataTypes.BOOLEAN,
    relatePreExisting: DataTypes.BOOLEAN,
    otherExclusion: DataTypes.BOOLEAN,
    reasonable: DataTypes.BOOLEAN,
    adhere: DataTypes.BOOLEAN
  }, {});
  Acessment.associate = function(models) {
    // associations can be defined here
  };
  return Acessment;
};
