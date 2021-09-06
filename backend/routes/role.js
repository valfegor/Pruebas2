const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role");

router.post("/registerRole", RoleController.registerRole);
router.get("/listRole", RoleController.listRole);
router.put("/updateRole", RoleController.updateRole);

module.exports = router;
