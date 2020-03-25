'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('ClaimInfos', 'approvedAt', {
          type: Sequelize.DataTypes.DATE
        }, { transaction: t }),
        queryInterface.addColumn('ClaimInfos', 'reimbursementRef', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('ClaimInfos', 'PaidAt', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
        queryInterface.addColumn('ClaimInfos', 'paymentStatus', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('ClaimInfos', 'isPaid', {
          type: Sequelize.DataTypes.BOOLEAN,
        }, { transaction: t }),
        queryInterface.addColumn('ClaimInfos', 'sendToAccountantAt', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
        queryInterface.addColumn('ClaimInfos', 'isSendToAccountant', {
          type: Sequelize.DataTypes.BOOLEAN,
        }, { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
