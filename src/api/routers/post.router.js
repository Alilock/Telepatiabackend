const router = require('express').Router();
const postController = require("../controllers/post.controller");

router.get('/', postController.getAll);
router.post('/', postController.create);
router.get('/:id', postController.getById);

module.exports = router;
