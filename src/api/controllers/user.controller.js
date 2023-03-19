const BaseError = require("../../common/BaseError");
const { user } = require("../../models");

const userController = {
    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const userDb = await user.findById(userId);
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
    updateProfilePic:async(req,res,next)=>{
        const userId=req.params.userId;
        

    }
};

module.exports = userController;