const fetch = require('node-fetch');
var express = require('express'),
app = express(),
port = process.env.PORT || 3000;

const KEY  = "4c2ym25yptkhdfvxrgqi413b0pdzwsueq4q2bqqb";
const TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.G5ed2SpILJdLUmjoXVGYWTMSQlJ8boLptydemtOM52Q";

app.get('/ping', (req, res) =>{
    res.json({res: "pong"})
})

app.get('/accounts', (req, res) =>{
    // return new Promise(async (resolve, reject) => {
    //     resolve()
    // })        
    return fetch("https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts-held",{
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

app.get('/account', (req, res)=>{
    

    return fetch('https://santander.openbankproject.com/obp/v3.0.0/banks/santander.01.uk.sanuk/accounts/Funds/owner/account',{
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

app.post('/accounts', (req, res) =>{
    // return new Promise(async (resolve, reject) => {
    //     resolve()
    // })        
    return fetch("https://santander.openbankproject.com/obp/v3.0.0//banks/santander.01.uk.sanuk/accounts/dsfdsfasdf",{
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

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
