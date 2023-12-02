const Election = require("../../model/election");

const handleShowRegisterVote=async(req,res)=>{
    try{
        const{aadharNumber}=req.voter;
        const RegisterVotingData=await Election.find({ "voter.aadharNumber": aadharNumber }).select("_id name description type candidate")
        
        res.status(200).json({message:aadharNumber,data:RegisterVotingData})
    }catch(error){
        console.log("error from handleShowRegisterVote-> ",error);
        res.status(500).json("try again latter!")
    }
}
module.exports={handleShowRegisterVote}
// {
//     name:"sourav",
//     arr:[{hoby:"done",is:flase},{hoby:"os",is:true}]
// }