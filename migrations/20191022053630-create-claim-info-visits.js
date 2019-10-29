'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimInfoVisits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      claimInfoId: {
        type: Sequelize.STRING,
        references: {
          model: 'ClaimInfos',
          key: 'id'
        }
      },
      visitNumber: {
        type: Sequelize.INTEGER
      },
      dateOfAdmissionVisit: {
        type: Sequelize.DATE
      },
      doctorName: {
        type: Sequelize.STRING
      },
      hospitalOrClinicCountry: {
        type: Sequelize.STRING
      },
      hospitalOrclinicEmail: {
        type: Sequelize.STRING
      },
      hospitalOrClinicName: {
        type: Sequelize.STRING
      },
      hospitalOrClinicCountryrl: {
        type: Sequelize.STRING
      },
      MedicalDiagnosis: {
        type: Sequelize.STRING
      },
      billingCurrency: {
        type: Sequelize.STRING
      },
      billingRate: {
        type: Sequelize.FLOAT
      },
      currencyDate: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('ClaimInfoVisits');
  }
};
