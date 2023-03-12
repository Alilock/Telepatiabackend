const randomNumberGenerator = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const setDateMinutes = (minutes = 5) => {
    return new Date(new Date().setMinutes(new Date().getMinutes() + minutes));
}


module.exports = {
    randomNumberGenerator: randomNumberGenerator,
    setDateMinutes: setDateMinutes
}