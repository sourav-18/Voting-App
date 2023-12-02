
const {Router}=require("express");
const { handleAddNewVoter, handleRegisterInElection, handleVoterLogin, handleVote } = require("../controllers/voter");
const { isvalidVoter } = require("../middleware/voter");
const { handleShowRegisterVote } = require("../controllers/infodisplay/voter");
const router=Router();
router.post("/signup",handleAddNewVoter);
router.post("/register",isvalidVoter, handleRegisterInElection);
router.post("/vote/:_id",isvalidVoter,handleVote );
router.post("/signin",handleVoterLogin);
router.get('/registervote',isvalidVoter,handleShowRegisterVote)
module.exports=router