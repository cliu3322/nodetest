'use strict';

// node_modules/.bin/sequelize model:generate --name User --attributes userName:string,password:string,email:string,firstName:string,lastName:string
// node_modules/.bin/sequelize model:generate --name ClaimInfo --attributes id:string,createdBy:INTEGER,accountHoldersName:string,bankAccountNumber:string,bankAddress:string,bankName:string,cause:string,contactEmail:string,contactFirstName:string,contactHomeAddress:string,contactLastName:string,contactPhoneNumberCountryCode:string,contactPhoneNumber:string,gop:BOOLEAN,ibanCodeSortCode:string,patientAge:INTEGER,patientDob:DATE,patientFirstName:string,patientLastName:string,policyEmail:string,policyFirstName:string,policyGroupPolicy:BOOLEAN,policyLastName:string,policyLastType:string,policyNumber:string,policyVip:BOOLEAN,reimbusementCurrency:string,relationshipToPatient:string,swift:string,status:string,RCExchangeRate:FLOAT,RCExchangeRateDate:DATE
//
// node_modules/.bin/sequelize model:generate --name ClaimInfoVisits --attributes claimInfoId:STRING,visitNumber:INTEGER,dateOfAdmissionVisit:DATE,doctorName:STRING,hospitalOrClinicCountry:STRING,hospitalOrclinicEmail:STRING,hospitalOrClinicName:STRING,hospitalOrClinicCountryrl:STRING,MedicalDiagnosis:STRING,billingCurrency:STRING,billingRate:FLOAT,currencyDate:DATE
// node_modules/.bin/sequelize model:generate --name ClaimInfoVisitsFiles --attributes visitId:INTEGER,name:STRING,url:STRING
//
// node_modules/.bin/sequelize model:generate --name BillingInfo --attributes visitId:INTEGER,billingCat:INTEGER,billingSubCat:INTEGER,value:FLOAT,approved:FLOAT
// node_modules/.bin/sequelize model:generate --name BillingInfoFiles --attributes visitId:INTEGER,name:STRING,url:STRING
// node_modules/.bin/sequelize model:generate --name BillingInfoOtherName --attributes visitId:INTEGER,value:STRING
// node_modules/.bin/sequelize model:generate --name DocumentsFiles --attributes visitId:INTEGER,name:STRING,url:STRING,notes:STRING
// node_modules/.bin/sequelize model:generate --name BenefitCategories --attributes name:string
// node_modules/.bin/sequelize model:generate --name BenefitSubCategories --attributes categoryId:INTEGER,name:string
//
// node_modules/.bin/sequelize model:generate --name ExchangeRate --attributes code:STRING,name:STRING,rate:FLOAT,date:DATE
//
// node_modules/.bin/sequelize model:generate --name Acessment --attributes claimInfoId:STRING,forPreExisting:BOOLEAN,relatePreExisting:BOOLEAN,otherExclusion:BOOLEAN,reasonable:BOOLEAN,adhere:BOOLEAN
// node_modules/.bin/sequelize model:generate --name Comments --attributes claimInfoId:STRING,group:string,message:STRING,createdBy:INTEGER,parent:INTEGER,adhere:BOOLEAN


//node_modules/.bin/sequelize db:migrate --env development
//node_modules/.bin/sequelize db:migrate --env azure


//node_modules/.bin/sequelize migration:create --name add_colomn_to_claimInfo
//node_modules/.bin/sequelize migration:create --name add_colomn_to_claimInfo2



//legacy

//node_modules/.bin/sequelize model:generate --name Test --attributes name:STRING

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
  // config.logging = function (str) {
  //       // do your own logging
  //       console.log(str)
  // }
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
