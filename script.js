const quizApp = {}

quizApp.url = 'https://restcountries.com/v3.1/all';
quizApp.shuffledCountries = [];
quizApp.topTen = [];
quizApp.flagArray = [];
console.log(quizApp);

quizApp.makeQuestionData = () =>{
    
}

quizApp.getData = () =>{
    fetch(quizApp.url).then((response) =>{
        return response.json();
    }).then ((data) =>{
        quizApp.shuffledCountries = shuffleArray(data);
        console.log(quizApp.shuffledCountries);
        for (let i = 0; i < 10; i++) {
            quizApp.topTen.push(quizApp.shuffledCountries[i]);
        }
        quizApp.getFlags(quizApp.topTen);

    })
}

quizApp.getFlags = (array) =>{
    array.forEach((item) => {
        quizApp.flagArray.push(item.flags.png);
    })
    
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