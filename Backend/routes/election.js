
const {Router}=require("express");
const { handleNewElectionRegistration, handleCalculateResult } = require("../controllers/admin");

const router=Router();
router.post("/register",handleNewElectionRegistration);
router.post("/calculatResult/:_id",handleCalculateResult);
module.exports=router