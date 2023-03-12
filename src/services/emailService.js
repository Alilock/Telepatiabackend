const { EMAIL_USER, EMAIL_APP_PASSWORD } = require("../config");
const nodemailer = require("nodemailer");

const sendMessage = async (code, toMail, subject = "Confirm code") => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'connectopiahelp@gmail.com',
            pass: "mujnflljpnmqictc",
        },
    });
    let info = await transporter.sendMail({
        from: EMAIL_USER, // sender address
        to: toMail, // list of receivers
        subject: subject,
        text: "Hello world?",
        html: `<code style="fontSize:32px;"><b>${code}</b></code>`, // html body
    });
    return info;
}

module.exports = {
    sendMessage: sendMessage
}