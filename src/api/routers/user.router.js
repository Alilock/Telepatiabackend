const router = require('express').Router();
const userController = require('../controllers/user.controller');


router.put('/putProfilePhoto', userController.updateProfilePic)
router.get('/getUserById/:userId', userController.getUserById)
module.exports = router;
