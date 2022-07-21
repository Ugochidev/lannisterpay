const LannisterUser = require("./lannister.model");
const share = async (req, res, next) => {
  try {
    const { amount, customerEmail, splitInfos, splitType, splitValue } =
      req.body;
    // const splitInfoo = [];
    let Lannistercode = 2014;
    const flatArray = [];
    const percentageArray = [];
    const ratioArray = [];
    let availableBalance = amount;
    splitInfos.forEach((info) => {
      if (info.splitType == "FLAT") {
        flatArray.push(info);
      } else if (info.splitType == "PERCENTAGE") {
        percentageArray.push(info);
      } else if (info.splitType == "RATIO") {
        ratioArray.push(info);
      }
    });
    const returnInfo = {
      ID: "",
      Balance: "",
      splitBreakdown: [],
    };
    const resultArray = [];
    flatArray.forEach((flat) => {
      const flatObject = {};
      flatAmount = flat.splitValue;
      availableBalance = availableBalance - flatAmount;
      Lannistercode = Lannistercode + 1;
      flatObject["splitAmount"] = flatAmount;
      flatObject["splitType"] = flat.splitType;
      flatObject["splitValue"] = flat.splitValue;
      flatObject["splitEntityId"] = `LNPYACC${Lannistercode}`;
      let returnResult = {
        splitEntityId: flatObject["splitEntityId"],
        amount: flatObject["splitAmount"],
      };
      returnInfo.splitBreakdown.push(returnResult);
      resultArray.push(flatObject);
    });

    percentageArray.forEach((percentage) => {
      percentageAmount = (percentage.splitValue / 100) * availableBalance;
      availableBalance = availableBalance - percentageAmount;
      Lannistercode = Lannistercode + 1;
      const percentageObject = {};
      percentageObject["splitAmount"] = percentageAmount;
      percentageObject["splitType"] = percentage.splitType;
      percentageObject["splitValue"] = percentage.splitValue;
      percentageObject["splitEntityId"] = `LNPYACC${Lannistercode}`;
      let returnResult = {
        splitEntityId: percentageObject["splitEntityId"],
        amount: percentageObject["splitAmount"],
      };
      returnInfo.splitBreakdown.push(returnResult);
      resultArray.push(percentageObject);
    });

    let ratioSum = 0;
    const ratioBalance = availableBalance;
    ratioArray.forEach((ratio) => {
      ratioSum = ratioSum + ratio.splitValue;
    });
    ratioArray.forEach((ratio) => {
      ratioAmount = (ratio.splitValue / ratioSum) * ratioBalance;
      availableBalance = availableBalance - ratioAmount;
      Lannistercode = Lannistercode + 1;
      const ratioObject = {};
      ratioObject["splitAmount"] = ratioAmount;
      ratioObject["splitType"] = ratio.splitType;
      ratioObject["splitValue"] = ratio.splitValue;
      ratioObject["splitEntityId"] = `LNPYACC${Lannistercode}`;
      let returnResult = {
        splitEntityId: ratioObject["splitEntityId"],
        amount: ratioObject["splitAmount"],
      };
      returnInfo.splitBreakdown.push(returnResult);
      resultArray.push(ratioObject);
    });

    const newShare = new LannisterUser({
      amount,
      customerEmail,
      splitInfo: resultArray,
      balance: availableBalance,
    });

    await newShare.save();

    returnInfo["ID"] = newShare._id;
    returnInfo["Balance"] = newShare.balance;

    return res.status(200).json({
      // newShare,
      returnInfo,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = { share };
