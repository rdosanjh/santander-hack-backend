const fetch = require('node-fetch');
const http = require('http');
var twilio = require('twilio');

var bodyParser = require('body-parser')
var cors = require('cors')

var db = new Map();

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
app.use(bodyParser());
app.use(cors())

let changeLights = (color) => {
    const IFTTT = require('node-ifttt-maker');
    const ifttt = new IFTTT('b4SJByzu05UT4yAQNMlFhK');
     
    const event = 'pelican';
    if(color === 'red'){

    }
    if(color === 'amber'){
        color = 'orange';
    }
    if(color === 'green'){
        
    }
    const params = {
        'value1': color,
        'value2': 2,
        'value3': {
            x: 1, y: 2
        }
    }
     
    ifttt
      .request({ event, params })
      .then((response) => {
          console.log(response);
      })
      .catch((err) => {});
     
}

db.set('limits', {
    low: 1000,
    high: 3000
})

db.set('style', 'normal');

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

let getLevel = (balance) => {
    let limits = db.get('limits')
    
    if (balance < limits.low) {
        return 'red'
    }

    if (balance >= limits.low && balance <= limits.high) {
        return 'amber'
    }

    if (balance > limits.high) {
        return 'green'
    }
    return 'amber'
}

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
            let number = db.get('number') || '+447763133487';
            if (getLevel(balance) === 'red') {
                sendSms(number, `🛑`)
            }
            if (getLevel(balance) === 'amber') {
                sendSms(number, `⚠️`)
            }

            if (getLevel(balance) === 'green') {
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
            result.balance.responseStyle = db.get('style');
            result.balance.level = getLevel(result.balance.amount)
            changeLights(result.balance.level);
            return res.json(result)
        })

})

app.get('/account_back', (req, res) => {
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q";

    return fetch('https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts/Funds/owner/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DirectLogin token="${TOKEN}"`
        }
    }).then(result => result.json())
        .then((result) => {
            console.log("----------Backend--------");
            console.log(result)
            result.balance.responseStyle = db.get('style');
            result.balance.level = getLevel(result.balance.amount)
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

app.post('/limits', (req, res) => {
    if(!(req.body.low && req.body.high)){
        res.status(400);
    }
    db.set('limits', req.body);
    res.status(200).send();
})

app.get('/limits', (req, res) => {
    let limits = db.get('limits');
    res.json({limits});
})

app.post('/response-style', (req, res) => {
    db.set('style', req.body.style);
    res.status(200).send();
})

app.get('/response-style', (req, res) => {
    let style = db.get('style');
    res.json({style});
})

app.get('/suggested-limits',(req, res) => {
    res.json({
        low: 1200,
        high:2200
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
