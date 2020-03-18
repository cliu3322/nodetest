Server admin login: regency-claims, Baza7183!

. config db connection: ./config/config.json
. node_modules/.bin/sequelize db:migrate --env claim
. import BenefitCategories(remove id), BenefitSubCategories(remove id), ExchangeRates
. Load excel  approved_reimbusement(in excel)
. duplicate data( give it to abhik)
. add column 39 to Dirties
. run constant/validation
. don't forget to run prescript

Check status first


no id A4919 null
no id C9371 null



