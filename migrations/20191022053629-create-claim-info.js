'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimInfos', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      accountHoldersName: {
        type: Sequelize.STRING
      },
      bankAccountNumber: {
        type: Sequelize.STRING
      },
      bankAddress: {
        type: Sequelize.STRING
      },
      bankName: {
        type: Sequelize.STRING
      },
      cause: {
        type: Sequelize.STRING
      },
      contactEmail: {
        type: Sequelize.STRING
      },
      contactFirstName: {
        type: Sequelize.STRING
      },
      contactHomeAddress: {
        type: Sequelize.STRING
      },
      contactLastName: {
        type: Sequelize.STRING
      },
      contactPhoneNumberCountryCode: {
        type: Sequelize.STRING
      },
      contactPhoneNumber: {
        type: Sequelize.STRING
      },
      gop: {
        type: Sequelize.BOOLEAN
      },
      ibanCodeSortCode: {
        type: Sequelize.STRING
      },
      patientAge: {
        type: Sequelize.INTEGER
      },
      patientDob: {
        type: Sequelize.DATE
      },
      patientFirstName: {
        type: Sequelize.STRING
      },
      patientLastName: {
        type: Sequelize.STRING
      },
      policyEmail: {
        type: Sequelize.STRING
      },
      policyFirstName: {
        type: Sequelize.STRING
      },
      policyGroupPolicy: {
        type: Sequelize.BOOLEAN
      },
      policyLastName: {
        type: Sequelize.STRING
      },
      policyLastType: {
        type: Sequelize.STRING
      },
      policyNumber: {
        type: Sequelize.STRING
      },
      policyVip: {
        type: Sequelize.BOOLEAN
      },
      reimbusementCurrency: {
        type: Sequelize.STRING
      },
      relationshipToPatient: {
        type: Sequelize.STRING
      },
      swift: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('ClaimInfos');
  }
};
