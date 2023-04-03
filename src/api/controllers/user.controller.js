const BaseError = require("../../common/BaseError");
const { user } = require("../../models");
const { getStorage, uploadBytes, ref, getDownloadURL } = require('firebase/storage')
const { fileSave } = require('../../services/fileService')
var ObjectId = require('mongodb').ObjectId;
const sharp = require('sharp');
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
            const resizedImage = await sharp(newProfilePic.data)
                .resize(800).rotate() // Set the maximum width or height to 800 pixels
                .jpeg({ quality: 80 }) // Convert the image to JPEG format with 80% quality
                .toBuffer();

            // Compress the image to a maximum file size of 1MB
            let compressedImage = resizedImage;
            let compressedSize = compressedImage.length;
            while (compressedSize > 1000000) {
                compressedImage = await sharp(compressedImage)
                    .jpeg({ quality: 70 }) // Reduce the quality by 10%
                    .toBuffer();
                compressedSize = compressedImage.length;
            }

            // Upload the compressed image to Firebase Storage
            const compressedStorageRef = ref(storage, newProfilePic.name);
            const compressedSnapshot = await uploadBytes(compressedStorageRef, compressedImage);

            const downloadURL = await getDownloadURL(compressedStorageRef);


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
            const userDb = await user.findById(userId)


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

                res.json({ message: `You unfollowed ${targetUser.username}`, user: requestingUser, foreignUser: targetUser });
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
    searchUsers: async (req, res, next) => {
        try {

            const query = req.query.q

            const users = await user.find({
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            });

            res.json(users);
        } catch (error) {
            next(error);
        }
    },


};

module.exports = userController;