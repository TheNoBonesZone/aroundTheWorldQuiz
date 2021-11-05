const url = 'https://restcountries.com/v3.1/all';

fetch(url)
  .then(res => {
    return res.json() // Promise
  }).then(resJson => {
    const bigCountriesData = myShuffle(resJson); // country array
    // const bigCountriesData2 = myShuffle(bigCountriesData);// country array
    console.log(bigCountriesData); // before Shuffle
    // console.log(bigCountriesData2);
  })

const myShuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}