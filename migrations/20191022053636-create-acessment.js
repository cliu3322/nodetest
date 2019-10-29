'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Acessments', {
      claimInfoId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'ClaimInfos',
          key: 'id'
        }
      },
      forPreExisting: {
        type: Sequelize.BOOLEAN
      },
      relatePreExisting: {
        type: Sequelize.BOOLEAN
      },
      otherExclusion: {
        type: Sequelize.BOOLEAN
      },
      reasonable: {
        type: Sequelize.BOOLEAN
      },
      adhere: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Acessments');
  }
};
