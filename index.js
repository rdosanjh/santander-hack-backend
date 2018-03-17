const fetch = require('node-fetch');
const http = require('http');
var twilio = require('twilio');

var bodyParser = require('body-parser')


var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
app.use(bodyParser());
    
const KEY = "4c2ym25yptkhdfvxrgqi413b0pdzwsueq4q2bqqb";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q";

let sendSms = (number, message) => {
    const accountSid = 'AC2819318b73a9940db26a37dcec045b55';
    const authToken = '26e442bd9c212b382a7eb711017762ef';

    // require the Twilio module and create a REST client
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            to: number,
            from: '+441183246439',
            body: message,
        })
        .then(message => console.log(message.sid));
}

app.get('/ping', (req, res) => {
    res.json({ res: "pong" })
})

app.post('/ping-sms', (req, res) => {
    
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q";

    fetch('https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts/Funds/owner/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DirectLogin token="${TOKEN}"`
        }
    }).then(result => result.json())
        .then((result) => {
            console.log("------------------");
            console.log(result)
            //  sendSms('+447763133487', `Your balance is £${result.balance.amount} 😀`)
            let balance = result.balance.amount
            //        let number = '+447763133487'; 
            let number = req.body.number || '+447763133487';
            if (balance < 1000) {
                sendSms(number, `🛑`)
            }

            if (balance >= 1000 && balance <= 2000) {
                sendSms(number, `⚠️`)
            }

            if (balance > 2000) {
                sendSms(number, `💚`)
            }

            return res.json(result)
        })

})

app.get('/accounts', (req, res) => {
    // return new Promise(async (resolve, reject) => {
    //     resolve()
    // })        
    return fetch("https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts-held", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DirectLogin token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q"`
        }
    }).then(result => result.json())
        .then((result) => {
            console.log("------------------");
            console.log(result)
            return res.json(result)
        })

})


app.get('/account', (req, res) => {
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q";

    return fetch('https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts/Funds/owner/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DirectLogin token="${TOKEN}"`
        }
    }).then(result => result.json())
        .then((result) => {
            console.log("------------------");
            console.log(result)
            return res.json(result)
        })

})

app.post('/accounts', (req, res) => {
    // return new Promise(async (resolve, reject) => {
    //     resolve()
    // })        
    return fetch("https://santander.openbankproject.com/obp/v3.0.0//banks/santander.01.uk.sanuk/accounts/dsfdsfasdf", {
        method: 'PUT',
        body: `{  
           "user_id":"66214b8e-259e-44ad-8868-3eb47be70646", 
            "label":"Label",  
            "type":"CURRENT",  
            "balance":{    "currency":"EUR",    "amount":"0"  },  
            "branch_id":"1234",  
            "account_routing":{    "scheme":"OBP",    "address":"UK123456"  }}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DirectLogin token="${TOKEN}"`
        }
    }).then((result) => {
        console.log("------------------");
        console.log(result)
        return res.json(result.text())
        // next()
        // res.json(res.body);
    })

})

app.post('/transaction', (req, res) => {
    console.log(req.body.amount);
    return fetch(`https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts/${req.body.from}/owner/transaction-request-types/SANDBOX_TAN/transaction-requests`, {
        method: 'POST',
        body: `{  
            "to":{    "bank_id":"santander.01.uk.sanuk",    "account_id":"${req.body.to}"  },  
            "value":{    "currency":"GBP",    "amount":"${req.body.amount}"  },  
            "description":"this is for work"}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DirectLogin token="${TOKEN}"`
        }
    }).then((result) => {
        return res.json(result)
    })
})


//https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts/Funds/owner/transaction-request-types/SANDBOX_TAN/transaction-requests


app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
