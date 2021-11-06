const url = 'https://restcountries.com/v3.1/all';

fetch(url)
  .then(res => {
    return res.json() // Promise
  }).then(resJson => {
    const bigCountriesData = shuffleArray(resJson); // country array
    // const bigCountriesData2 = myShuffle(bigCountriesData);// country array
    console.log(bigCountriesData); // before Shuffle
    // console.log(bigCountriesData2);
  })

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

