'use strict';
//node_modules/.bin/sequelize model:generate --name User --attributes userName:string,password:string,email:string,firstName:string,lastName:string
//node_modules/.bin/sequelize model:generate --name ClaimInfo --attributes id:string,createdBy:INTEGER,accountHoldersName:string,bankAccountNumber:string,bankAddress:string,cause:string,contactEmail:string,contactFirstName:string,contactHomeAddress:string,contactLastName:string,contactPhoneNumber:string,gop:BOOLEAN,ibanCodeSortCode:string,patientAge:INTEGER,patientDob:DATE,patientFirstName:string,patientLastName:string,policyEmail:string,policyFirstName:string,policyGroupPolicy:BOOLEAN,policyLastName:string,policyLastType:string,policyNumber:string,policyVip:BOOLEAN,reimbusementCurrency:string,relationshipToPatient:string,swift:string

// node_modules/.bin/sequelize model:generate --name ClaimInfoVisits --attributes claimInfoId:STRING,visitNumber:INTEGER,dateOfAdmissionVisit:DATE,doctorName:STRING,hospitalOrClinicCountry:STRING,hospitalOrclinicEmail:STRING,hospitalOrClinicName:STRING,hospitalOrClinicCountryrl:STRING,MedicalDiagnosis:STRING,billingCurrency:STRING,usdper:FLOAT,currencyDate:DATE
// node_modules/.bin/sequelize model:generate --name ClaimInfoFiles --attributes visitId:INTEGER,fileName:STRING,fileAddress:STRING
//node_modules/.bin/sequelize model:generate --name BillingInfoFiles --attributes visitId:INTEGER,fileName:STRING,fileAddress:STRING
//node_modules/.bin/sequelize model:generate --name BillingInfo --attributes visitId:INTEGER,billingCat:INTEGER,billingSubCat:INTEGER,value:FLOAT
//node_modules/.bin/sequelize model:generate --name BenefitCategories --attributes name:string
//node_modules/.bin/sequelize model:generate --name BenefitSubCategories --attributes categoryId:INTEGER,name:string

//node_modules/.bin/sequelize model:generate --name ExchangeRate --attributes code:STRING,name:STRING,perUSD:FLOAT,USDper:FLOAT,date:DATE

//node_modules/.bin/sequelize db:migrate --env development
//node_modules/.bin/sequelize db:migrate --env azure



const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

//Before modify this line of code, consult with Eric first
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log(config)
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => {
    console.log('NEW Connection has been established successfully.');
  })
  .catch(err => {
    console.error('NEW Unable to connect to the database:', err);
  });

module.exports = db;
