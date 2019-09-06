'use strict';
//node_modules/.bin/sequelize model:generate --name User --attributes userName:string,password:string,email:string,firstName:string,lastName:string
//node_modules/.bin/sequelize model:generate --name ClaimInfo --attributes createdBy:INTEGER,accountholdersname:string,bankaccountnumber:string,bankaddress:string,cause:string,contactemail:string,contactfirstname:string,contacthomeaddress:string,contactlastname:string,contactphonenumber:string,gop:BOOLEAN,ibancodesortcode:string,patientage:INTEGER,patientdob:DATE,patientfirstname:string,patientlastname:string,policyemail:string,policyfirstname:string,policygrouppolicy:BOOLEAN,policylastname:string,policylasttype:string,policyvip:BOOLEAN,reimbusementcurrency:string,relationshiptopatient:string,swift:string
//node_modules/.bin/sequelize model:generate --name ClaimInfoFiles --attributes fileName:string,fileAddress:string,claimInfoId:INTEGER
//node_modules/.bin/sequelize model:generate --name ClaimInfoVisits --attributes claimInfoId:INTEGER,dateOfAdmissionVisit:DATE,doctorName:STRING,hospitalOrClinicCountry:STRING,hospitalOrclinicEmail:STRING,hospitalOrClinicName:STRING,hospitalOrClinicCountryrl:STRING,MedicalDiagnosis:STRING
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
