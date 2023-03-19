const router = require('express').Router();
const postController = require("../controllers/post.controller");

router.post('/', postController.publish);
router.get('/getAll', postController.getAll)
router.get('/getAllByUser', postController.getAllByUser)
module.exports = router;
