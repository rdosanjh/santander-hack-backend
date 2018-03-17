// const http = require('http')


var _this = this;
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q";
const url = 'https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts-held';

const http = require('http')

http.get('http://167.99.82.88:3000/account', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
  
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }
  
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        //////////////////////////////////
        console.log(parsedData.balance.amount);
        //////////////////////////////////
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });