require("../model/model")
const controller = require("../controller/controller")


const express = require("express")

const router = express.Router()

router.get("/ping", controller.pingHandler);
router.get("/", controller.getHandler);
router.post("/", controller.insertHandler)
router.put("/", controller.updateHandler)
router.delete("/", controller.deleteHandler)
router.post("/login",controller.loginHandler)

//router.get("/authenticate",controller.authenticationHandler)

module.exports = router