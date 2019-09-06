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
        type: Sequelize.INTEGER,
        references: {
          model: 'ClaimInfos',
          key: 'id'
        }
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
