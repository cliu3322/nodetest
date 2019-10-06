var express = require('express');
var router = express.Router();
var models  = require('../models');

const tableData = JSON.parse(
  `[{
    "CategroiesId": "1",
    "title": "Inpatient Benefits",
    "subCategories": [
    {
      "subCategoriesId": "1",
      "title": "Room & Board Including General Nursing Care"
    },
    {
      "subCategoriesId": "2",
      "title": "Parental Accommodation (Added Bed, Same Room)"
    },
    {
      "subCategoriesId": "3",
      "title": "Theatre Fees, X-rays, Laboraotry Tests, Medicines & Drugs, Blood & Plasma, Surgical Appliances, Retal of Wheel Chairs"
    },
    {
      "subCategoriesId": "4",
      "title": "Intensive Care (Room & Board Including General Nursing Care)"
    },
    {
      "subCategoriesId": "5",
      "title": "Surgeon's Fees Including Pre & Post Surgical Services"
    },
    {
      "subCategoriesId": "6",
      "title": "Anesthetist Fees"
    },
    {
      "subCategoriesId": "7",
      "title": "Professional Fees Including Physician, Specialist, Radiologist, Physiotherapy & Pathologist Fees"
    },
    {
      "subCategoriesId": "8",
      "title": "Rehabilitation Cover"
    },
    {
      "subCategoriesId": "9",
      "title": "Kidney Dialysis"
    },
    {
      "subCategoriesId": "10",
      "title": "Oncology Cover"
    },
    {
      "subCategoriesId": "11",
      "title": "Emergency Room Treatment"
    },
    {
      "subCategoriesId": "12",
      "title": "Organ Transplant Cover"
    },
    {
      "subCategoriesId": "13",
      "title": "Local Ambulance to Hospital"
    },
    {
      "subCategoriesId": "14",
      "title": "Hospital Cash Benefits"
    }
  ]
    }, {
    "CategroiesId": "2",
    "title": "Outpatient Benefits",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "Outpatient Surgical"
      },
      {
        "subCategoriesId": "2",
        "title": "Pre Hospitalization"
      },
      {
        "subCategoriesId": "3",
        "title": "Post Hospitalization"
      },
      {
        "subCategoriesId": "4",
        "title": "GP Consultation Fees"
      },
      {
        "subCategoriesId": "5",
        "title": "Specialist Consultation Fees"
      },
      {
        "subCategoriesId": "6",
        "title": "Prescribed Medication"
      },
      {
        "subCategoriesId": "7",
        "title": "Imaging and Lab Tests"
      },
      {
        "subCategoriesId": "8",
        "title": "Physiotherapy"
      },
      {
        "subCategoriesId": "9",
        "title": "Oncology"
      },
      {
        "subCategoriesId": "10",
        "title": "Alternative Therapies Treatment"
      },
      {
        "subCategoriesId": "11",
        "title": "Chronic Conditions Benefit"
      }
    ]
    }, {
    "CategroiesId": "3",
    "title": "Wellbeing Benefits",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "Annual Medical Check ups"
      },
      {
        "subCategoriesId": "2",
        "title": "Vaccinations"
      },
      {
        "subCategoriesId": "3",
        "title": "Eye Test"
      }
    ]
    }, {
    "CategroiesId": "4",
    "title": "Dental Benefits",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "Emergency Dental (Relief of Pain Only)"
      },
      {
        "subCategoriesId": "2",
        "title": "Routine Dental (6 Months Waiting Period)"
      },
      {
        "subCategoriesId": "3",
        "title": "Major Dental (6 Months Waiting Period)"
      }
    ]
    }, {
    "CategroiesId": "5",
    "title": "Global Security Benefits",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "Terrorism"
      },
      {
        "subCategoriesId": "2",
        "title": "Hostage Negotiation"
      },
      {
        "subCategoriesId": "3",
        "title": "Hijacking"
      },
      {
        "subCategoriesId": "4",
        "title": "Mugging"
      }
    ]
    }, {
    "CategroiesId": "6",
    "title": "Psychology Benefits",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "24 Hour Psychology Counselling"
      },
      {
        "subCategoriesId": "2",
        "title": "24 Hour Personal Coaching"
      }
    ]
    }, {
    "CategroiesId": "7",
    "title": "International Assistance Benefits",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "24 Hour Emergency Assistance"
      }
    ]
    }, {
    "CategroiesId": "8",
    "title": "Life Cover",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "Death Benefit"
      }
    ]
    }, {
    "CategroiesId": "9",
    "title": "Optional Benefit",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": "Evacuation & Repatriation"
      }
    ]
    }, {
    "CategroiesId": "10",
    "title": "Other",
    "subCategories":[
      {
        "subCategoriesId": "1",
        "title": ""
      }
    ]
  }]`,
);

/* GET home page. */
router.get('/',  function(req, res, next) {
  // var newarray  = tableData.map(item => {
  //   return {id: item.CategroiesId, name: item.title}
  // });

  //let visitRecord = await models.BenefitCategories.bulkCreate(newarray)

  //subCategories
  // var subCategories  = tableData.map(async item => {
  //   var newArry = item.subCategories.map(sub => {
  //     return {name:sub.title, categoryId: item.CategroiesId}
  //   })
  //   let visitRecord = await models.BenefitSubCategories.bulkCreate(newArry)
  //   return visitRecord
  // });

  res.json({ firstName: 'Index' })
});



router.get('/test', async function(req, res, next) {


  let result = await models.BenefitCategories.findAll({
    include: [{
      model: models.BenefitSubCategories,
      include:[{
        model: models.BillingInfo,
        //where:{ billingSubCat: {$col:'BenefitSubCategories.id'}}
      }]
    }]
  })

  console.log(result);

  res.json(result)
});


module.exports = router;
