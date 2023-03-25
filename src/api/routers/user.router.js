const router = require('express').Router();
const userController = require('../controllers/user.controller');


router.put('/putProfilePhoto', userController.updateProfilePic)
router.get('/getUserById/:userId', userController.getUserById)
router.get('/getForeignUser/:userId', userController.getForeignUser)
router.put('/followUser', userController.followUser)
router.get('/search', userController.searchUsers)
module.exports = router;
