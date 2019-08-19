'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClaimBasic = sequelize.define('ClaimBasic', {
    plan_name: DataTypes.STRING,
    member_policy_name: DataTypes.STRING,
    mode_of_treatment: DataTypes.STRING,
    date_of_hospitalisation_visit: DataTypes.DATE,
    cause_of_hospitalisation_visit: DataTypes.STRING,
    hospital_name_address: DataTypes.STRING,
    location: DataTypes.STRING,
    doctor_name: DataTypes.STRING,
    billing_currency: DataTypes.STRING,
    reimbursement_currency: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    home_address: DataTypes.STRING,
    bank_account_number: DataTypes.STRING,
    account_holder_name: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    bank_address: DataTypes.STRING,
    swift_address: DataTypes.STRING,
    iban_code: DataTypes.STRING
  }, {});
  ClaimBasic.associate = function(models) {
    // associations can be defined here
  };
  return ClaimBasic;
};
