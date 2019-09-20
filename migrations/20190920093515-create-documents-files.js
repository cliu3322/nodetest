'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DocumentsFiles', {
      path: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      visitId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClaimInfoVisits',
          key: 'id'
        }
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    return queryInterface.dropTable('DocumentsFiles');
  }
};
