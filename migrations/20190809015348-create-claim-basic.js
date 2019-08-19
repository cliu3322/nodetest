const uuid = require('uuid/v1'); // ES5
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimBasics', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: Sequelize.literal('newid()'),
        type: "UNIQUEIDENTIFIER",
      },
      plan_name: {
        type: Sequelize.STRING
      },
      member_policy_name: {
        type: Sequelize.STRING
      },
      mode_of_treatment: {
        type: Sequelize.STRING
      },
      date_of_hospitalisation_visit: {
        type: Sequelize.DATE
      },
      cause_of_hospitalisation_visit: {
        type: Sequelize.STRING
      },
      hospital_name_address: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      doctor_name: {
        type: Sequelize.STRING
      },
      billing_currency: {
        type: Sequelize.STRING
      },
      reimbursement_currency: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      home_address: {
        type: Sequelize.STRING
      },
      bank_account_number: {
        type: Sequelize.STRING
      },
      account_holder_name: {
        type: Sequelize.STRING
      },
      bank_name: {
        type: Sequelize.STRING
      },
      bank_address: {
        type: Sequelize.STRING
      },
      swift_address: {
        type: Sequelize.STRING
      },
      iban_code: {
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
    return queryInterface.dropTable('ClaimBasics');
  }
};
