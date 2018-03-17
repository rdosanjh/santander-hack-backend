const IFTTT = require('node-ifttt-maker');
const ifttt = new IFTTT('b4SJByzu05UT4yAQNMlFhK');
 
const event = 'pelican';
 
const params = {
    'value1': 'test',
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
 