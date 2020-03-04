1. config db connection: ./config/config.json
2. node_modules/.bin/sequelize db:migrate --env claim
3. import BenefitCategories(remove id), BenefitSubCategories(remove id), ExchangeRates
4. Load excel  approved_reimbusement(in excel)