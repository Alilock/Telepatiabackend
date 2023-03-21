const router = require('express').Router();
const postController = require("../controllers/post.controller");

router.post('/', postController.publish);
router.get('/getAll', postController.getAll)
router.get('/getAllByUser', postController.getAllByUser)
router.post('/likePost', postController.likePost)
router.post('/postComment', postController.postComment)
router.get('/getById', postController.getById)
module.exports = router;
