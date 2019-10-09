'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.addColumn('ClaimInfos', 'bankName', {
                type: Sequelize.STRING
            }, { transaction: t }),
            queryInterface.addColumn('ClaimInfos', 'RCExchangeRate', {
                type: Sequelize.FLOAT,
            }, { transaction: t }),
            queryInterface.addColumn('ClaimInfos', 'RCExchangeRateDate', {
                type: Sequelize.DATE,
            }, { transaction: t }),
            queryInterface.addColumn('ClaimInfos', 'status', {
                type: Sequelize.STRING,
            }, { transaction: t })
        ])
    })
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
