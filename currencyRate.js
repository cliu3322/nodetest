//https://www.exchangerate-api.com/
var Crawler  = require('crawler');
var cheerio  = require('cheerio');
const HtmlTableToJson = require('html-table-to-json');
var models  = require('./models');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{

            var $ = cheerio.load(res.body);
            const jsonTables = new HtmlTableToJson($(".historicalRateTable-wrap").html())
            jsonTables.results[0].forEach(function(element) {
              var newElement = {}
              Object.keys(element).forEach(function(key) {

                switch(key) {

                  case "Currency code\n\t\t\t\t\t\t\t\t\t\t\t▲▼":
                    newElement['code'] = element[key];
                    break;
                  case "Currency name\n\t\t\t\t\t\t\t\t\t\t\t▲▼":
                    newElement['name'] = element[key];
                    break;
                  case "Units per USD":
                    newElement['rate'] = element[key];
                    break;
                  default:
                    break
                }

              });

              newElement['date'] = Date.now()
              //console.log(newElement)


              updateOrCreate(models.ExchangeRate, {code:newElement.code}, newElement)
              // models.ExchangeRate.upsert(newElement).then(function(test) {
              //   console.log(test)
              // })

            });

        }
        done();
    }
});

const updateOrCreate = (model, where, newItem, beforeCreate) => {
    // Try to find record using findOne
    return model
        .findOne({ where })
        .then(item => {
            if (!item) {

                // Item doesn't exist, so we create it

                // Custom promise to add more data to the record
                // Being saved (optional)
                Promise.resolve(beforeCreate)
                    .then(() =>
                        model.create(newItem)
                            .then(item => ({ item, created: true }))
                    )
            }
            console.log(newItem)
            // Item already exists, so we update it
            return model
                .update(newItem, {where: where})
                .then(item => ({ item, created: false }))
        })
}

const countryList = (err, req, res, next) => {
	c.queue('https://www.xe.com/currencytables/?from=USD');
	console.log('countryList')
};

module.exports = { countryList};
