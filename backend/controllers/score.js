const Score = require('../models/score');

const showscore = async (req, res) => {
    const score = await Score.find();

    if(!score || score.length == 0) return res.status(400).send("No Score ");

    return res.status(200).send({ score });

}


const registerScore = async (req, res) => {
    if(!req.body.pt_propuesto || !req.body.name) return res.status(400).send("Sorry Please check all the camps");

    let existingRanking = await Score.findOne({name:req.body.name});

    if(existingRanking) return res.status(400).send("Sorry the ranking already creater");

    if(req.body.pt_propuesto < 0 ) return res.status(400).send("Sorry please use a positive number");

    const score = new Score({
        name: req.body.name,
        pt_propuesto: req.body.pt_propuesto,
        dbStatus:true,

    })

    let result = await score.save();

    if(!result) return res.status(400).send("Sorry Cant save");

    return res.status(200).send({result});
}


module.exports = {showscore,registerScore}