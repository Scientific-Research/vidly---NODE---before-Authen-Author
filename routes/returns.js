const express = require("express");
const router = express.Router();

// app.post("/api/returns",async(req,res)=>{})
router.post("/", async (req, res) => {
  res.status(401).send("Unauthorized User!");
});

module.exports = router;
