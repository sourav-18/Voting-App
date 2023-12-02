const Election = require("../model/election")

const handleNewElectionRegistration=async(req,res)=>{
    try{
        const {name,description,type}=req.body
        if(!name||!description||!type)return res.status(400).json({ message: "fill the data correctly" });
        const respose=await Election.create({
            name,
            description,
            type
        })
        //when i save the data in db in lastdateofrestrationSection why every time _id is pass that i dont't know 
        res.status(201).json({message:"ElectionRegistration successfuly"})

    }catch(error){
        console.log("error from electonRegistration ", err);
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
    }
}
const handleCalculateResult=async(req,res)=>{
    try{
        const {_id}=req.params
        const today=Date.now();
        const ElectionData=await Election.findById(_id);
        if(!ElectionData){
            return res.status(404).json({message:"Election not Found"})
        }
        const {resultDate}=ElectionData
        if(resultDate>today){
            const resultdate=String(new Date(resultDate));
           return res.status(200).json({message:`Result Date On ${resultdate.substring(0,15)} `})
        }
        if(!ElectionData.resultCalculat){
            let {candidate,result}=ElectionData;
              let WinCanidate={},count=0;
              for (const property in candidate) {
                let cp=candidate[property].totalGetVote
                if(cp>count){
                    WinCanidate=candidate[property];
                    count=cp;
                }
              }
              const finalResult={
                isCalculate:true,
                candidate,
                totalVote:result.length,
                totalRegisterVoter:ElectionData.voter.length,
                totalRegisterCandidate:ElectionData.candidate.length,
                TotalunattemptedVoter:ElectionData.voter.length-result.length,
                WinCanidate
              }
            //   console.log(finalResult)
            await Election.findByIdAndUpdate(_id,{$set:{finalResult,resultCalculat:true}})
            return res.status(200).json({message:"election result successfuly calculate ",})
        }
        return res.status(200).json({message:"election result allready calculate"})

    }catch(error){
        console.log("error from handleCalculateResult -> ",error)
        res.status(500).json({message:"please try again later"})
    }
}
module.exports={handleNewElectionRegistration,handleCalculateResult}