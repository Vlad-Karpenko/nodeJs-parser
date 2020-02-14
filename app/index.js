var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('file-system');
var csv = require('fast-csv');
var URL = 'https://www.ferra.ru/news';
var result = [];

axios.get(URL).then((response) => {
    var $ = cheerio.load(response.data);
    var block = $('._3N8tN-V20fBSifLEwo0ySF');
    block.each(function () {
        result.push({
            Title: $(this).find('._2oXhZlL9gmDW4pOrJTTmwX').text(),
            Category: $(this).find('._3Dy8WrPhCEO9gd8w-CzNbC').text(),
            Date_Time: $(this).find('.jsx-3020305922').text(),
            link: 'https://www.ferra.ru' + $(this).find('a.jsx-1968532000').attr('href')
        })
    });
    /*Save to csv*/
    var ws = fs.createWriteStream('data.csv', {encoding: 'utf8'});
    csv.write(result, {headers: true, delimiter: ';'}).pipe(ws);

    /*Save to json*/
    fs.writeFile('data.json', JSON.stringify(result, null, '\t'), function (error) {
        error ? console.log('Error') : console.log('File saved');
    });
}).catch(error => {
    console.log(error)
});
