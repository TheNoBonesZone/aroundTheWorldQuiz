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

// init() method
quizApp.init = () => {
    quizApp.getData();
}

// getData(): gets countries data from API via fetch api -> call methods to process that data -> manipulate the DOM
quizApp.getData = () => {
    fetch(quizApp.url).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Oops! Something went wrong when fetching the data!")
        }
    })
        .then(data => {
            document.getElementById('startButton').disabled = false;
            quizApp.shuffledCountries = quizApp.shuffleArray(data);
            quizApp.topTen = [];
            quizApp.getCountries(quizApp.shuffledCountries, 10);
            quizApp.getAnswers(quizApp.shuffledCountries)
            quizApp.getFlags(quizApp.topTen);
            quizApp.displayFlagQ();
            quizApp.startButton();
            quizApp.submitQuiz();
        })
        .catch(err => {
            console.log(err)
            quizApp.displayError();
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
    const questionBox = document.getElementById('questionPack')

    // make a question for each of the selected countries in the topTen array:
    for (let i = 0; i < quizApp.topTen.length; i++) {
        const questionCard = document.createElement('div')
        questionCard.classList = `questionCard question${i + 1}`
        questionCard.innerHTML = `
            <h2>Question ${i + 1}</h2> 
            <h3> What country does this flag belong to?</h3> 
            <img src='${quizApp.topTen[i].flags.png}' alt='flag of question ${i + 1}'>
            `

        // make answers/buttons for each question: store answers into an array with correct answer + 3 random answer from generated answer bank
        const answerArray = [];
        answerArray.push(quizApp.topTen[i].name.common);
        for (let j = 0; j < 3; j++) {
            answerArray.push(quizApp.answerBank.names.pop())
        }
        quizApp.shuffleArray(answerArray);

        const answerBox = document.createElement('ul');
        answerBox.className = 'answerBox';

        answerArray.forEach(answer => {
            const btnBox = document.createElement('li');
            btnBox.innerHTML = `<input type="radio" name="answers${i + 1}" id="${answer}">
                    <label for="${answer}">${answer}</label>`
            answerBox.appendChild(btnBox);
        })

        questionCard.appendChild(answerBox);
        questionBox.appendChild(questionCard);
    }

    const submitButton = document.createElement('button')
    submitButton.className = 'uppercase'
    submitButton.id = 'submitBtn'
    submitButton.textContent = 'Submit Quiz'
    questionBox.appendChild(submitButton)

    quizApp.checkTextLength();

}

// startButton(): event listener for the start button to switch page to question page
quizApp.startButton = () => {
    const firstButton = document.getElementById("startButton")

    // event listener to display .questionPage and hide .landingPage
    firstButton.addEventListener('click', () => {
        document.querySelector('.landingPage').style.display = 'none',
            document.querySelector('.questionPage').style.display = 'flex'
    })
}

// checkTextLength(): checks answer text length and adjust size/padding if text.length was too long
quizApp.checkTextLength = () => {
    const allAnswers = document.querySelectorAll('label');
    allAnswers.forEach(item => {
        if (item.textContent.length > 16) {
            const label = document.getElementById(item.textContent)
            label.nextElementSibling.style.fontSize = '18px';
            label.nextElementSibling.style.lineHeight = '20px';
            label.nextElementSibling.style.padding = '4px';
        }
    })
}

// getScore(): calculates the score based on the user checked answers
quizApp.getScore = () => {
    let score = 0;
    for (let i = 1; i <= quizApp.topTen.length; i++) {
        const answerNodeList = document.querySelectorAll(`input[name='answers${i}']`);
        answerNodeList.forEach(item => {
            if (item.checked === true) {
                item.disabled = true;
                if (item.id === quizApp.topTen[i - 1].name.common) {
                    score = score + 1;
                    item.checked = false;
                    item.nextElementSibling.className = "correct noHover";
                } else {
                    item.checked = false;
                    item.nextElementSibling.className = "incorrect noHover";
                    document.querySelector(`.question${i}`).classList.add('incorrectCard')
                }
            } else {
                item.disabled = true;
                if (item.id === quizApp.topTen[i - 1].name.common) {
                    item.nextElementSibling.className = "correct noHover";
                } else {
                    item.nextElementSibling.className = "disabledBtn"
                }
            }
        })
    }

    // add scoreCard to page
    const scoreSheet = document.createElement('div');
    scoreSheet.className = "score";
    scoreSheet.innerHTML = `<h2>Your score is ${score} out of 10!`;
    questionPack.appendChild(scoreSheet);

    // restart button to restart the game with new data
    const restartBtn = document.createElement('button');
    restartBtn.className = "uppercase restart";
    restartBtn.innerText = "Restart"
    scoreSheet.appendChild(restartBtn);

    restartBtn.addEventListener('click', () => {
        document.querySelector("#questionPack").innerHTML = "";
        quizApp.getData();
    })

}

// submitQuiz(): when submit button is pressed, run getScore() to calculate and display score, then hide the submit button
quizApp.submitQuiz = () => {
    const submitBtn = document.getElementById('submitBtn')
    submitBtn.addEventListener('click', () => {
        quizApp.getScore();
        submitBtn.style.display = 'none';
    })
}

// displayError(): displays error message and disables game start button on landing page if fetch was unsuccessful
quizApp.displayError = () => {
    const startBtn = document.getElementById('startButton')
    startBtn.disabled = true;
    startBtn.classList.add('disabledBtn')

    const errorMessage = document.createElement('p')
    errorMessage.className = "errorText"
    errorMessage.textContent = "Sorry! We failed to load the quiz questions from the server, please try again!"

    const landingPage = document.querySelector('.landingPage .wrapper');
    landingPage.appendChild(errorMessage);
}

// Durstenfeld Shuffle algorithm, used to shuffle our retrieved countries array of objects to make sure we get different questions each run
// Credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
quizApp.shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// calling the quizApp once the page has loaded
quizApp.init();