// analytics.js
// PURPOSE: To pull user data and a Point of Interest (POI) Object to conduct analytics to determine the contextual changes needed
// TYPE: standalone function
// INPUT: POI_Obj, an array containing information of the points of interest on the user's webpage
// OUTPUT: infoPack, an object containing instructions to display the content on a user's webpage

function analytics(POI_Obj) {
  // Initialize the infoPack object that will be returned
  var infoPack = new Object();

  // Start by parsing the current user's data


  // return final product
  return infoPack;
};


var examplePOI_Obj = [
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

var exampleResults = analytics(examplePOI_Obj);

console.log('--------')
console.log('The following are the results: ')
console.log(exampleResults)
console.log('--------')

// module.exports = analytics;
