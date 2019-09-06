'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      accountholdersname: {
        type: Sequelize.STRING
      },
      bankaccountnumber: {
        type: Sequelize.STRING
      },
      bankaddress: {
        type: Sequelize.STRING
      },
      cause: {
        type: Sequelize.STRING
      },
      contactemail: {
        type: Sequelize.STRING
      },
      contactfirstname: {
        type: Sequelize.STRING
      },
      contacthomeaddress: {
        type: Sequelize.STRING
      },
      contactlastname: {
        type: Sequelize.STRING
      },
      contactphonenumber: {
        type: Sequelize.STRING
      },
      gop: {
        type: Sequelize.BOOLEAN
      },
      ibancodesortcode: {
        type: Sequelize.STRING
      },
      patientage: {
        type: Sequelize.INTEGER
      },
      patientdob: {
        type: Sequelize.DATE
      },
      patientfirstname: {
        type: Sequelize.STRING
      },
      patientlastname: {
        type: Sequelize.STRING
      },
      policyemail: {
        type: Sequelize.STRING
      },
      policyfirstname: {
        type: Sequelize.STRING
      },
      policygrouppolicy: {
        type: Sequelize.BOOLEAN
      },
      policylastname: {
        type: Sequelize.STRING
      },
      policylasttype: {
        type: Sequelize.STRING
      },
      policyvip: {
        type: Sequelize.BOOLEAN
      },
      reimbusementcurrency: {
        type: Sequelize.STRING
      },
      relationshiptopatient: {
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
