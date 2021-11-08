// declare quizApp object
const quizApp = {}

// define quizApp properties + empty placeholders
quizApp.url = 'https://restcountries.com/v3.1/all';
quizApp.shuffledCountries = [];
quizApp.topTen = [];
quizApp.flagArray = [];
quizApp.answerBank = {
    names: [],
    capitals: [],
    populations: []
};

// quizApp Method Declarations  ⬇️

// init(): to be called when the page is loaded, at the end of the file
quizApp.init = () => {
    quizApp.getData();
}

// getData(): gets countries data from API via fetch api -> call methods to process that data -> manipulate the DOM
quizApp.getData = () => {
    fetch(quizApp.url).then((response) => {
        return response.json();
    }).then((data) => {

        quizApp.shuffledCountries = shuffleArray(data);

        quizApp.getCountries(quizApp.shuffledCountries, 10);
        quizApp.getAnswers(quizApp.shuffledCountries)
        quizApp.getFlags(quizApp.topTen);
        quizApp.displayFlagQ();

    })
}

// getCountries(array, numOfCountries): store 10 countries from the top of the shuffled countries array. option customize the number to retrieve with numOfCountries to be dynamic for future use
quizApp.getCountries = (array, numOfCountries) => {
    for (let i = 0; quizApp.topTen.length < numOfCountries; i++) {
        if (array[i].capital != undefined) {
            quizApp.topTen.push(array[i]);
        }
    }
}

// getAnswers(array): populate answer bank using data from the unselected countries (all the countries below the top ten)
quizApp.getAnswers = (array) => {
    for (let i = 10; i < array.length; i++) {
        quizApp.answerBank.names.push(array[i].name.common)
        if (array[i].capital != undefined) {
            quizApp.answerBank.capitals.push(array[i].capital[0])
        }
        quizApp.answerBank.populations.push(array[i].population)
    }
}

// getFlags(array): retrives the image url from the country array of objects 
quizApp.getFlags = (array) => {
    array.forEach(item => {
        quizApp.flagArray.push(item.flags.png);
    })
}

// displayFlagQ(): displays flags from selectedCountries onto the questions page with an image element
quizApp.displayFlagQ = () => {
    quizApp.topTen.forEach(item => {
        const flagImg = document.createElement('img');
        flagImg.src = item.flags.png
        flagImg.alt = `Official flag of ${item.name.common}`
        document.querySelector('.flags-section').appendChild(flagImg);
    })
}





// Durstenfeld Shuffle algorithm, used to shuffle our retrieved countries array of objects to make sure we get different questions each run
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// calling the quizApp
quizApp.init();