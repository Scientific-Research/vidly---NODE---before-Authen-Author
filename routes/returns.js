const express = require("express");
const router = express.Router();
// const { Customer } = require("../models/customer");

// app.post("/api/returns",async(req,res)=>{})
router.post("/", async (req, res) => {
  //   const customer = await Customer.findById(req.body.customerId);
  //   if (!customer) return res.status(400).send("Invalid customer.");

  if (!req.body.customerId)
    return res.status(400).send("customerId not provided!");
  if (!req.body.movieId) return res.status(400).send("movieId not provided!");
  return res.status(401).send("Unauthorized User!");
});

module.exports = router;
