const LannisterUser = require("./lannister.model");
const uuid = require("uuid");
// console.log(uuid)
// console.log(LannisterUser);

const share = async (req, res, next) => {
  try {
    const { amount, customerEmail, splitInfo, splitType, splitValue } =
      req.body;

    const flatArray = [];
    const percentageArray = [];
    const ratioArray = [];
    let availableBalance = amount;
    splitInfo.forEach((info) => {
      if (info.splitType == "FLAT") {
        flatArray.push(info);
      } else if (info.splitType == "PERCENTAGE") {
        percentageArray.push(info);
      } else if (info.splitType == "RATIO") {
        ratioArray.push(info);
      }
    });
   const resultArray = []
    flatArray.forEach((flat) => {
      flatAmount = flat.splitValue;
      availableBalance = availableBalance - flat.splitValue;
       let flatObject = {}
       flatObject["splitAmount"] = flatAmount
      console.log(flatAmount);
      console.log(flatObject);
      resultArray.push(flatObject)
    });

    percentageArray.forEach((percentage) => {
      percentageAmount = (percentage.splitValue / 100) * availableBalance;
      availableBalance = availableBalance - percentageAmount;
      // console.log(percentageAmount);
      let percentageObject = {};
      percentageObject["splitAmount"] = percentageAmount;
      console.log(percentageAmount);
      console.log(percentageObject);
      resultArray.push(percentageObject);
    });
    let ratioSum = 0;
    let ratioBalance = availableBalance;
    ratioArray.forEach((ratio) => {
      ratioSum = ratioSum + ratio.splitValue;
      // availableBalance = availableBalance - ratioAmount;
    });
    ratioArray.forEach((ratio) => {
      // ratioSum = ratioSum + ratio.splitValue;
      ratioAmount = (ratio.splitValue / ratioSum) * ratioBalance;
      availableBalance = availableBalance - ratioAmount;
      // console.log(ratioAmount);
         let ratioObject = {};
         ratioObject["splitAmount"] = ratioAmount;
         console.log(ratioAmount);
         console.log(ratioObject);
         resultArray.push(ratioObject);
    });

    console.log(ratioSum);
    console.log("This is available Balance", availableBalance);
    const newShare = new LannisterUser({
      amount,
      customerEmail,
      splitInfo,
      // : [
        // {
        //   splitType: splitInfo[0].splitType,
        //   splitValue: splitInfo[0].splitValue,
        //   splitAmount: splitInfo[0].splitAmount,
        //   splitEntityId: uuid.v4(),
        // },
      // ],
      balance: availableBalance,
    });
    console.log(resultArray);
    await newShare.save();
    console.log(ratioArray);
    // console.log(percentageArray);
    // console.log(ratioArray);
    return res.status(200).json({
      newShare,
      flatArray: flatArray,
      percentageArray: percentageArray,
      ratioArray: ratioArray,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = { share };


// {
//     "amount": 4500,
//     "currency": "NGN",
//     "customerEmail": "anon8@customers.io",
//     "splitInfo": [
//         {
//             "splitType": "FLAT",
//             "splitValue": 450,
//             "splitEntityId": "LNPYACC0019"
//         },
//         {
//             "splitType": "RATIO",
//             "splitValue": 3,
//             "splitEntityId": "LNPYACC0011"
//         },
//         {
//             "splitType": "PERCENTAGE",
//             "splitValue": 3,
//             "splitEntityId": "LNPYACC0015"
//         },
//         {
//             "splitType": "RATIO",
//             "splitValue": 2,
//             "splitEntityId": "LNPYACC0016"
//         },
//         {
//             "splitType": "FLAT",
//             "splitValue": 2450,
//             "splitEntityId": "LNPYACC0029"
//         },
//         {
//             "splitType": "PERCENTAGE",
//             "splitValue": 10,
//             "splitEntityId": "LNPYACC0215"
//         }
//     ]
// }
