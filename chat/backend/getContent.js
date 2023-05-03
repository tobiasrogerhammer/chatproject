const router = require("express").Router();
const Message = require("./message");

router.post('/create', async (req, res) => {
    try{
        const newMessage = new Message({
            message: req.body.message,
            username: req.body.user,
            time: req.body.time,
        });
        const message = await newMessage.save();
        res.status(200).json(message);
    }  catch (err){res.status(500).json('feil')}
})

/*router.get('/', async (req, res) => {
    try{ 
    let message = await Message.find()
    res.status(200).json(message);
    } catch (err){res.status(500).json(err)}
})
*/

module.exports = router;