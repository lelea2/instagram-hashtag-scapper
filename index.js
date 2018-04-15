const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

let keyWord = '';

process.argv.forEach((val, index, array) => {
  console.log(index + ': ' + val);
  //proscess.argv[2]
  keyWord = val;
});

let URL = `https://www.instagram.com/explore/tags/${keyWord}/`;

rp(URL)
  .then((html) => {
    let hashtags = scrapeHashtags(html);
    hashtags = removeDuplicates(hashtags);
    hashtags = hashtags.map(ele => "#" + ele)
    // console.log(hashtags);
    fs.writeFile('result.txt', hashtags, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('Write to result.txt');
    });
  })
  .catch((err) => {
    console.log(err);
  });

const scrapeHashtags = (html) => {  
  const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
  const matches = [];
  while ((match = regex.exec(html))) {
    matches.push(match[1]);
  }
  return matches;
};

const removeDuplicates = (arr) => {
  let newArr = [];
  arr.map(ele => {
    if (newArr.indexOf(ele) === -1) {
      newArr.push(ele)
    }
  });
  return newArr;
};