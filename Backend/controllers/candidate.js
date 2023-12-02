const Candidate = require("../model/candidate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose=require("mongoose");
const Election = require("../model/election");
//addnewCandidate in database
const handleAddNewCandidate = async (req, res) => {
  try {
    console.log("enter");
    const {
      name,
      email,
      phoneNumber,
      aadharNumber,
      password,
      aboutCandidate,
      partiesName,
    } = req.body;
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !aadharNumber ||
      !password ||
      !aboutCandidate ||
      !partiesName
    )
      return res.status(400).json({ message: "fill the data correctly" });
    const isExistCandidate = await Candidate.findOne({ aadharNumber });
    if (isExistCandidate) {
      return res.status(403).json({ message: "Candidate allready exist" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log("error from password hashing candidate ", err);
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
      }
      const candidateData = await Candidate.create({
        name,
        email,
        phoneNumber,
        aadharNumber,
        partiesName,
        aboutCandidate,
        password: hash,
      });
      console.log(candidateData);
      return res.status(201).json({ message: "Candidate successfuly added" ,success:true});
    });
  } catch (error) {
    console.log("error from handleAddCandidate", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }
};

//add voting information
const handleAddVotingInfo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { aadharNumber, _id,name } = req.candidate;
    const { electionId, electionName} = req.body;
    if (!electionName|| !electionId || !aadharNumber)
      return res.status(400).json({ message: "fill the data correctly" });

      const electionData=await Election.findById(electionId) 
      if(!electionData){
        return res.status(404).json({message:"election is not find"})
      }
     //check already register or not
     const isAlreadyRegister =electionData.candidate.find((data) => {
      return data.aadharNumber == aadharNumber;
    });
    console.log(isAlreadyRegister)
    if (isAlreadyRegister) {
      return res.status(200).json({ message: "you have already register " });
    }
    //check start registration date end or not
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const today=String(Date.now())
const {endTime,startTime}=electionData.periodOfTimeCandidateRegistration;
if(today<startTime){
  const time=new Date(startTime);
  return res.status(200).json({message:`Registration open post ${months[time.getMonth()]} ${time.getDate()}`})
}
if(today>endTime){
  return res.status(200).json({message:"Registration close "})
}

const time=Date.now()
  await Candidate.updateOne({ aadharNumber }, { $push: { votingInfo: { electionName,electionId ,time} } }, session);
   await Election.findByIdAndUpdate(electionId , { $push: { candidate: { aadharNumber,candidateName:name,time } } }, session);

    res
      .status(200)
      .json({ message: "candidate successfuly register in election" });
      await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.log("error from handleaddCandidateInfo", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }finally{
    session.endSession();
  }
};
// Login Candidate
const handleCandidateLogin = async (req, res) => {
  try {
    const { aadharNumber, password } = req.body;
    if (!aadharNumber || !password)
      return res.status(400).json({ message: "fill the data correctly" });
    const candidate = await Candidate.findOne({ aadharNumber });
    if (!candidate) {
      return res.status(400).json({ message: "candidate not exist" });
    }
    bcrypt.compare(password, candidate.password, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
      if (result) {
        var token = jwt.sign({ candidate }, process.env.JWT_PRIVATEKEY);
        res
          .status(200)
          .json({ message: "candidate successfuly login", jwt_token: token });
      } else {
        res.status(200).json({ message: "password is not correct" });
      }
    });
  }catch(error) {
    console.log("error from candidateHandler login ",error)
    return res
    .status(500)
    .json({ message: "something worng try aganin later" });
  }
};
module.exports = {
  handleAddNewCandidate,
  handleAddVotingInfo,
  handleCandidateLogin,
};
