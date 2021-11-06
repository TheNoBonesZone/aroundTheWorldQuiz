const quizApp = {}

quizApp.url = 'https://restcountries.com/v3.1/all';
quizApp.shuffledCountries = [];
quizApp.topTen = [];
quizApp.flagArray = [];
quizApp.answerBank = {
    names: [],
    capitals: [],
    populations: []
};

console.log(quizApp);

quizApp.makeQuestionData = () => {

}

quizApp.getData = () => {
    fetch(quizApp.url).then((response) => {
        return response.json();
    }).then((data) => {
        quizApp.shuffledCountries = shuffleArray(data);
        console.log(quizApp.shuffledCountries);
        for (let i = 0; quizApp.topTen.length < 10; i++) {
            if (quizApp.shuffledCountries[i].capital != undefined) {
                quizApp.topTen.push(quizApp.shuffledCountries[i]);
            }
        }
        quizApp.getFlags(quizApp.topTen);

        quizApp.getAnswers(quizApp.shuffledCountries) // [{}, {}, {}]
    })
}

quizApp.getFlags = (array) => {
    array.forEach((item) => {
        quizApp.flagArray.push(item.flags.png);
    })
}

quizApp.getAnswers = (array) => {
    for (let i = 10; i < array.length; i++) {
        quizApp.answerBank.names.push(array[i].name.common)
        if (array[i].capital != undefined) {
            quizApp.answerBank.capitals.push(array[i].capital[0])
        }
        quizApp.answerBank.populations.push(array[i].population)
    }
}

quizApp.displayFlagQ = () => {
    // topTen.forEach(item => ...)
    // create img element
    // edit img src to item's flag png
    // append to section .flags-section
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}









quizApp.init = () => {
    quizApp.getData();
}

quizApp.init();