const { addMessage, getAddMessage } = require("../controller/messageController")

const router = require("express").Router()



router.post("/addmsg/",addMessage)
router.post("/getmsg/", getAddMessage )

module.exports = router