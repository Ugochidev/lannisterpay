const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const lannisterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    splitInfo: [
      {
        splitType: {
          type: String,
          required: true,
          enum: ["FLAT", "PERCENTAGE", "RATIO"],
        },
        splitValue: {
          type: Number,
          required: true,
        },
        splitAmount: {
          type: Number,
          required: true,
        },
        splitEntityId: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LannisterUser = mongoose.model("LannisterUser", lannisterSchema);
module.exports = LannisterUser;