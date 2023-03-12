const { randomNumberGenerator, setDateMinutes } = require("../helpers");
const { sendMessage } = require("./emailService");

const confirmCodeSendMail = async (email) => {
    const confirmCode = randomNumberGenerator(100000, 999999);
    const response = await sendMessage(confirmCode, email);
    const expDate = setDateMinutes();
    return {
        confirmCode: confirmCode,
        expDate: expDate
    }
}

module.exports = {
    confirmCodeSendMail: confirmCodeSendMail
};