const BaseError = require("../../common/BaseError");
const { user } = require("../../models");
const { fileSave } = require('../../services/fileService')
var ObjectId = require('mongodb').ObjectId;

const userController = {
    // GET /api/users/:userId
    // Retrieves a user with the specified ID
    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const userDb = await user.findById(userId);
            if (!userDb) {
                throw new BaseError("User not found", 404);
            }
            res.json(userDb);
        } catch (error) {
            next(error);
        }
    }
    ,
    getUserByUsername: async (req, res, next) => {
        try {
            const username = req.params.username;
            const userDb = await user.findOne({ username: username });
            if (!userDb) {
                throw new BaseError("User not found", 404);
            }
            res.json({
                user: {
                    email: userDb.email,
                    username: userDb.username,
                    // other user data
                },
            });
        } catch (error) {
            next(error);
        }
    },
    updateProfilePic: async (req, res, next) => {
        try {
            const userId = req.body.userId;

            const userDb = await user.findById(userId);
            if (!userDb) {
                throw new BaseError("User not found", 404);
            }

            // save the new profile picture to the server
            const newProfilePic = req.files.profilePic;
            let paths = []
            if (newProfilePic) {

                paths = fileSave(newProfilePic);
            }

            // update the user's profile picture field
            userDb.profilePicture = paths[0];
            await userDb.save();

            res.json({
                user: userDb,
            });
        } catch (error) {
            next(error)
        }

    },
};

module.exports = userController;