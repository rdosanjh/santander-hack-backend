var hue = require("node-hue-api");

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

// --------------------------
// Using a promise
hue.nupnpSearch().then(displayBridges).done();

var HueApi = require("node-hue-api").HueApi;
//////////////////////////

let host = "10.1.210.46"
let userDescription = "Pelican Balance";
;


var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};

var hue = new HueApi();

// --------------------------
// Using a promise
hue.registerUser(host, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();

// --------------------------
// Using a callback (with default description and auto generated username)
hue.createUser(host, function(err, user) {
	if (err) throw err;
	displayUserResult(user);
});

let username = 'yuq-WfWDiIfwHsQ-Babzx8pYJ336yK2LONaqhsbE';

var api = new HueApi(host, username);

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

// --------------------------
// Using a promise
//api.registeredUsers().then(displayResult).done();

api.lights()
.then(displayResult)
.done();
