const router = require("express").Router();
const Username = require("./user");

router.post('/create', async (req, res) => {
    try{
        const newUsername = new Username({
            username: req.body.username,
            mailadress: req.body.mailadress,
            password: req.body.password,
            selectedChats: req.body.selectedChats,
        });
        const username = await newUsername.save();
        res.status(200).json(username);
    }  catch (err){res.status(500).json('feil1')}
})

module.exports = router;