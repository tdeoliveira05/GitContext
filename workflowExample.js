// test.js
// PURPOSE: to test out analytics.js as a standalone function

// Import the analytics function
// var analytics = require('./analytics.js');
// but not really
function fakeAnalytics(input) {
  return input
};

//--- 1. The first stepping stone --> creating some sort of readObj with webpage information on the content that the user is seeing
var readObj = {
  'html': '<html> <head></head> <body>     <p id = \"weight\"> 17 lb </p> <br/> <p id = \" distance \"> 780 m </p>            </body> </html>'
};

//--- 2. The second stepping stone --> transforming the readObj into a new object that contains pertinent information for each Point of Interest in the webpage content

// Extract the POIs from the readObj using someFunction()...
// the next 3 lines are basically a fake someFunction()...
function someFunction(readObj) {
  // Stop looking here
  var text = readObj.html
  // This doesnt make any sense
  var POI_Obj = [
    {
      'location': 'somewhere on the webpage...',
      'text': '17 lb',
      'type': 'weight'
    },
    {
      'location': 'somewhere else on the webpage...',
      'text': '780 m',
      'type': 'distance'
    }
  ];
  // in this example, POI_Obj is totally unrelated to readObj.
  // In a real workflow for this extension though: someFunction(readObj) = POI_Obj
  return POI_Obj
};

// Create what will become the POI object by executing the (currently arbitrary) someFunction() and passing readObj into it
var POI_Obj = someFunction(readObj);

//--- 3. The third stepping stone --> input the POI_Obj into the analytics function for processing contextual changes

var infoPackage = fakeAnalytics(POI_Obj);

// Possible output structure of infoPackage:
var possibleInfoPackage = {
  'POI_array': [
    {
      'location': 'somewhere on the webpage...',
      'type': 'weight',
      'oldContext': {
        'text': '17 lb',
        'system': 'imperial',
        'units': 'pounds',
        'abbreviation': 'lb'
      },
      'newContext': {
        'text': '7.71 kg',
        'system': 'metric',
        'units': 'kilogram',
        'abbreviation': 'kg'
      }
    },
    {
      'location': 'somewhere else on the webpage...',
      'type': 'distance',
      'oldContext': {
        'text': '780 m',
        'system': 'metric',
        'units': 'meter',
        'abbreviation': 'm',
        'value': '780'
      },
      'newContext': {
        'text': '2559 ft',
        'system': 'imperial',
        'units': 'feet',
        'abbreviation': 'ft',
        'value': '2559'
      }
    }
  ],
  'user_data': {
    'name': 'John Doe',
    'location': 'UK',
    'currentWebpage': 'howdovaccinescauseautism.com',
    'meta': {
      'usageInfo': 'insertMetricsHere',
      'etc': 'etc'
    }
  }
}

console.log(possibleInfoPackage)
