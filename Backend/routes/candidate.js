const {Router}=require("express");
const { handleAddNewCandidate, handleAddVotingInfo, handleCandidateLogin } = require("../controllers/candidate");
const { isvalidCandidate } = require("../middleware/candidate");
const router=Router();
router.post("/signup",handleAddNewCandidate);
router.post("/register",isvalidCandidate, handleAddVotingInfo);
router.post("/signin",handleCandidateLogin);
module.exports=router