const router = require("express").Router();

router.get("/", () => console.log("GET users"));
router.get("/:userID", () => console.log("GET users by ID"));
router.post("/", () => console.log("Post users"));

module.export = router;
