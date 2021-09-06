const Score = require('../models/score');

const showscore = async (req, res) => {
    const score = await Score.find();

    if(!score || score.length == 0) return res.status(400).send("No Score ");

    return res.status(200).send({ score });

}


module.exports = {showscore}