const express = require("express");
const {
    addLead,
    deleteLead,
    updateLead,
    getAllLead,
    getLeadById,
} = require("../controllers/leadController");

const router = express.Router();

router.post("/add", addLead);
router.delete("/delete/:id", deleteLead);
router.put("/update/:id", updateLead);
router.get("/all", getAllLead);
router.get("/mano/:id", getLeadById);

module.exports = router;