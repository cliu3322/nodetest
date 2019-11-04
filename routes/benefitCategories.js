var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');



const tableData = JSON.parse(
  `[
  {
    "id": 1,
    "name": "Inpatient Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 1,
        "categoryId": 1,
        "name": "Room & Board Including General Nursing Care",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 2,
        "categoryId": 1,
        "name": "Parental Accommodation (Added Bed, Same Room)",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 3,
        "categoryId": 1,
        "name": "Theatre Fees, X-rays, Laboraotry Tests, Medicines & Drugs, Blood & Plasma, Surgical Appliances, Retal of Wheel Chairs",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 4,
        "categoryId": 1,
        "name": "Intensive Care (Room & Board Including General Nursing Care)",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 5,
        "categoryId": 1,
        "name": "Surgeon's Fees Including Pre & Post Surgical Services",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 6,
        "categoryId": 1,
        "name": "Anesthetist Fees",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 7,
        "categoryId": 1,
        "name": "Professional Fees Including Physician, Specialist, Radiologist, Physiotherapy & Pathologist Fees",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 8,
        "categoryId": 1,
        "name": "Rehabilitation Cover",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 9,
        "categoryId": 1,
        "name": "Kidney Dialysis",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 10,
        "categoryId": 1,
        "name": "Oncology Cover",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 11,
        "categoryId": 1,
        "name": "Emergency Room Treatment",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 12,
        "categoryId": 1,
        "name": "Organ Transplant Cover",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 13,
        "categoryId": 1,
        "name": "Local Ambulance to Hospital",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      },
      {
        "id": 14,
        "categoryId": 1,
        "name": "Hospital Cash Benefits",
        "createdAt": "2019-10-03T07:27:43.433Z",
        "updatedAt": "2019-10-03T07:27:43.433Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 2,
    "name": "Outpatient Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 18,
        "categoryId": 2,
        "name": "Outpatient Surgical",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 19,
        "categoryId": 2,
        "name": "Pre Hospitalization",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 20,
        "categoryId": 2,
        "name": "Post Hospitalization",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 21,
        "categoryId": 2,
        "name": "GP Consultation Fees",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 22,
        "categoryId": 2,
        "name": "Specialist Consultation Fees",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 23,
        "categoryId": 2,
        "name": "Prescribed Medication",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 24,
        "categoryId": 2,
        "name": "Imaging and Lab Tests",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 25,
        "categoryId": 2,
        "name": "Physiotherapy",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 26,
        "categoryId": 2,
        "name": "Oncology",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 27,
        "categoryId": 2,
        "name": "Alternative Therapies Treatment",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      },
      {
        "id": 28,
        "categoryId": 2,
        "name": "Chronic Conditions Benefit",
        "createdAt": "2019-10-03T07:27:43.434Z",
        "updatedAt": "2019-10-03T07:27:43.434Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 3,
    "name": "Wellbeing Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 15,
        "categoryId": 3,
        "name": "Annual Medical Check ups",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 16,
        "categoryId": 3,
        "name": "Vaccinations",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 17,
        "categoryId": 3,
        "name": "Eye Test",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 4,
    "name": "Dental Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 29,
        "categoryId": 4,
        "name": "Emergency Dental (Relief of Pain Only)",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 30,
        "categoryId": 4,
        "name": "Routine Dental (6 Months Waiting Period)",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 31,
        "categoryId": 4,
        "name": "Major Dental (6 Months Waiting Period)",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 5,
    "name": "Global Security Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 32,
        "categoryId": 5,
        "name": "Terrorism",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 33,
        "categoryId": 5,
        "name": "Hostage Negotiation",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 34,
        "categoryId": 5,
        "name": "Hijacking",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 35,
        "categoryId": 5,
        "name": "Mugging",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 6,
    "name": "Psychology Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 36,
        "categoryId": 6,
        "name": "24 Hour Psychology Counselling",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      },
      {
        "id": 37,
        "categoryId": 6,
        "name": "24 Hour Personal Coaching",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 7,
    "name": "International Assistance Benefits",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 38,
        "categoryId": 7,
        "name": "24 Hour Emergency Assistance",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 8,
    "name": "Life Cover",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 40,
        "categoryId": 8,
        "name": "Death Benefit",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 9,
    "name": "Optional Benefit",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 41,
        "categoryId": 9,
        "name": "Evacuation & Repatriation",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  },
  {
    "id": 10,
    "name": "Other",
    "createdAt": "2019-10-03T07:09:02.586Z",
    "updatedAt": "2019-10-03T07:09:02.586Z",
    "BenefitSubCategories": [
      {
        "id": 39,
        "categoryId": 10,
        "name": "",
        "createdAt": "2019-10-03T07:27:43.435Z",
        "updatedAt": "2019-10-03T07:27:43.435Z",
        "BillingInfo": null
      }
    ]
  }
]`,
);

/* GET home page. */
router.get('/', function(req, res, next) {
  models.BenefitCategories.bulkCreate(tableData,{
    include: [{
      model: models.BenefitSubCategories,
    }]
  }).then(records => {
    res.send(records)
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
});


router.get('/comments',async function(req, res, next) {
  //const claimID = base64url.decode(req.query.id)
  const claimID = req.query.id
  console.log(claimID)
  //retrieve policy: Approved YTD, policy Type
  //from Regency WT: Isured person, Previous, Start Date
  //? Approved YTD, Gross premium, Payment Frequency

  models.Comments.findAll({
    where:{claimInfoId:claimID},
    order: [['createdAt', 'DESC']],
  }).then(comments => {

    res.json(comments);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


  //retrieve patient, we should build patient db in the future

});

router.post('/comments',async function(req, res, next) {
  // const claimID = base64url.decode(req.query.id)

  models.Comments.create(req.body).then(comment => {

    res.json(comment);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


});


module.exports = router;
