const BaseError = require("../../common/BaseError");
const { user } = require("../../models");
const { getStorage, uploadBytes, ref, getDownloadURL } = require('firebase/storage')
const { fileSave } = require('../../services/fileService')
var ObjectId = require('mongodb').ObjectId;

const userController = {
    // GET /api/users/:userId
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
            const storage = getStorage()

            const userId = req.body.userId;

            const userDb = await user.findById(userId);
            if (!userDb) {
                throw new BaseError("User not found", 404);
            }

            const newProfilePic = req.files.profilePic;
            const storageRef = ref(storage, newProfilePic.name)
            const snapshot = await uploadBytes(storageRef, newProfilePic.data);


            const downloadURL = await getDownloadURL(storageRef);

            userDb.profilePicture = downloadURL;
            await userDb.save();

            res.json({
                user: userDb,
            });
        } catch (error) {
            next(error)
        }

    },
    getForeignUser: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const userDb = await user.findById(userId).populate('posts').exec((err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
            })


            if (!userDb) {
                throw new BaseError("User not found", 404);
            }
            res.json(userDb);
        } catch (error) {
            next(error);
        }
    },
    followUser: async (req, res, next) => {
        try {
            const foreignId = req.body.foreignId;
            const targetUser = await user.findById(foreignId);
            if (!targetUser) {
                throw new BaseError("Target user not found", 404);
            }

            const requestingUser = await user.findById(req.body.userId);
            if (!requestingUser) {
                throw new BaseError("Requesting user not found", 404);
            }

            const isFollowing = requestingUser.following.includes(targetUser._id);

            if (isFollowing) {
                // remove target user from requesting user's following array
                requestingUser.following.pull(targetUser._id);
                await requestingUser.save();

                // remove requesting user from target user's followers array
                targetUser.followers.pull(requestingUser._id);
                await targetUser.save();

                res.json({ message: `You unfollowed ${targetUser.username}`, user: targetUser, foreignUser: requestingUser });
            } else {
                // add target user to requesting user's following array
                requestingUser.following.push(targetUser._id);
                await requestingUser.save();

                // add requesting user to target user's followers array
                targetUser.followers.push(requestingUser._id);
                await targetUser.save();

                res.json({ message: `You are now following ${targetUser.username}`, user: requestingUser, foreignUser: targetUser });
            }
        } catch (error) {
            next(error);
        }
    },



};

module.exports = userController;