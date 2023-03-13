const BaseError = require("../../common/BaseError");
const { user } = require("../../models");
const { tokenGenerate } = require("../../services/tokenService");
const { confirmCodeSendMail } = require("../../services/userService");
const { validationResult } = require("express-validator");

const authController = {
    confirmEmail: async (req, res, next) => {
        try {
            const confirmCode = req.body.confirmCode;
            const email = req.body.email;
            const userDb = await user.findOne().where({
                email: email
            });
            if (!userDb) {
                throw new BaseError("Email not found", 404);
            }
            let userConfirm = await user.findOne().where({
                email: email,
                confirmCode: confirmCode,
            });
            if (!userConfirm) {
                throw new BaseError("Confirm code error", 403);
            }
            // const confirmDate = new Date(userConfirm.confirmCodeExpDate);
            // const nowDate = new Date();
            // if (confirmDate - nowDate < 0) {
            //     throw new BaseError("Confirm code expired", 403);
            // }
            userDb.isConfirm = true;

            const token = tokenGenerate({
                email: userDb.email,
                username: userDb.username
            })
            userDb.save();
            res.json({
                token: token,
                user: {
                    email: userDb.email,
                    username: userDb.username
                }
            });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const email = req.body.email;
            const userDb = await user.findOne({
                email: email
            })
            if (!userDb) {
                throw new BaseError("User not found", 404);
            }
            if (!userDb.isConfirm) {
                throw new BaseError("Email not confirm!!!", 400);
            }
            const confirmObj = await confirmCodeSendMail(email);
            userDb.confirmCode = confirmObj.confirmCode;
            userDb.confirmCodeExpDate = confirmObj.expDate;
            userDb.save();
            res.json({
                ok: true,
                statusCode: 200,
                email: email
            });
        } catch (error) {
            next(error);
        }

    },
    register: async (req, res, next) => {
        return res("salam")
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(403).json(errors);
            }
            const email = req.body.email;
            const username = req.body.username;
            const password = req.body.password;

            const userDb = await user.findOne().where({
                email: email
            })
            if (userDb) {
                throw new BaseError("Email is already taken", 409);
            }
            const userDB = await user.findOne().where({
                username: username
            })
            if (userDB) {
                throw new BaseError("username is already taken", 409);

            }
            const confirmObj = await confirmCodeSendMail(email);
            const newUser = new user({
                email: email,
                username: username,
                password: password,
                confirmCode: confirmObj.confirmCode,
                confirmCodeExpDate: confirmObj.expDate,
            })
            newUser.save();
            res.json({
                ok: true,
                statusCode: 200,
                email: email
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = authController;