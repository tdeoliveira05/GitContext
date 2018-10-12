// analytics.js
// PURPOSE: To pull user data and a Point of Interest (POI) Object to conduct analytics to determine the contextual changes needed
// TYPE: standalone function
// INPUT: POI_Obj, an array containing information of the points of interest on the user's webpage
// OUTPUT: infoPack, an object containing instructions to display the content on a user's webpage

//TODO: Add speed units to dictionary
//TODO: Add error handlers


// Define userOptions
var userOptions = {
  'units': {
    'weight': 'kg',
    'distance': 'km',
    'speed': 'km/h',
    'currency': 'CAD'
  },
  'decimalPlaces': {
    'default': 2,
    'max': 4
  }
}

// Define the unit dictionary
var dictionary = {
  'imperial': {
    'distance':[
      {'id': ['in', 'inch', 'inches'], 'altSystemFactor': 0.03937007874},
      {'id': ['ft', 'foot', 'feet'], 'downFactor': 0.0833333},
      {'id': ['yd', 'yard', 'yards'], 'downFactor': 0.333333},
      {'id': ['mi', 'mile', 'miles'], 'downFactor': 0.000568182}
    ],
    'weight': [
      {'id': ['oz', 'ounce', 'ounces'], 'altSystemFactor': 0.00003527396},
      {'id': ['lb', 'pound', 'pounds'], 'downFactor': 0.0625}
    ]
  },
  'metric': {
    'distance': [
      {'id': ['mm', 'millimeter', 'millimeters', 'millimetre', 'millimetres'], 'altSystemFactor': 25.4},
      {'id': ['cm', 'centimeter', 'cetimeters', 'centimetre', 'centimetres'], 'downFactor': 0.1},
      {'id': ['m', 'meter', 'meters', 'metre', 'metres'], 'downFactor': 0.01},
      {'id': ['km', 'kilometer', 'kilometers', 'kilometre', 'kilometres'], 'downFactor': 0.001}
    ],
    'weight': [
      {'id': ['mg', 'milligram', 'milligrams'], 'altSystemFactor': 28349.4925441},
      {'id': ['g', 'gram', 'grams'], 'downFactor': 0.001},
      {'id': ['kg', 'kilogram', 'kilograms'], 'downFactor': 0.001}
    ]
  }
};

var measurementText = '10 lb'

var updatedObj = convertMeasurementText(measurementText, userOptions, dictionary);


console.log(updatedObj)

//-------------------------------- FUNCTIONS ---------------------------------//

function convertMeasurementText(unitObj, userOptions, dictionary) {

  // VALIDATION of measurementText____________________________________________________________________________________________________________________

  // Split the measurementText into an array [value, unit]
  var textArray = measurementText.split(' ')

  if (textArray.length > 2) {
    console.log('(analytics.js) error 0: too many spaces in measurementText')
  } else if (textArray.length == 1) {
    console.log('(analytics.js) error 1: no space in measurementText')
  }

  // handle example where units are in plural with a letter 's' in the end
  var temp = textArray[1].split('')

  // If the last array value is an 's' OR the array DOES NOT contain a speed unit that includes an '/'
  if (temp[temp.length-1] === 's' && !temp.includes('/')) {
    // pop the last array value which would be the plural 's'
    temp.pop()
  }

  // _______________________________________________________________________________________________________________________________________________

  var unit = temp.join('')
  var value = textArray[0];

  // Define the $originSys and $measurementType of $measurementText by using a recursive for-loop on the dictionary to search for a match
  for (var systemTypeInd in dictionary) {
    // run through 'imperial' and 'metric'

    for (var measurementTypeInd in dictionary[systemTypeInd]) {
      //+ run through 'weight' and 'distance' and etc, in each of the systemTypeInd

      for (var i = 0; i < dictionary[systemTypeInd][measurementTypeInd].length; i++) {
        //++  run through the entire array stored inside 'weight', 'distance', etc.
        if (dictionary[systemTypeInd][measurementTypeInd][i].id.includes(unit)) {
          //+++ if we find a matching unit type, we assign the measurementType and origin to it

          var measurementType = measurementTypeInd;
          var originSys = systemTypeInd;
        }
      }
    }
  }

  // Define the targetUnitType
  var targetUnitType = userOptions.units[measurementType];

  // Define $targetSys by using a recursive for-loop on the dictionary to search for a match
  // This for-loop also finds the $endIndex variable which is used for computations later in the code (refer to REF-A below)
  for (var systemTypeInd in dictionary) {
    // run through 'imperial' and 'metric'

    for (var measurementTypeInd in dictionary[systemTypeInd]) {
      //+ run through 'weight' and 'distance' and etc, in each of the systemTypeInd

      for (var i = 0; i < dictionary[systemTypeInd][measurementTypeInd].length; i++) {
        //++  run through the entire array stored inside 'weight', 'distance', etc.

        if (dictionary[systemTypeInd][measurementTypeInd][i].id.includes(targetUnitType)) {
          //+++ if we find a matching unit type, we assign the targetSys variable to it
          var targetSys = systemTypeInd;
          var endIndex = i;
        }
      }
    }
  }

  //NOTE: there are two recursive for-loops because they need to be executed in order. If the code were to join the two loops into a single recursive loop to define all
  // 5 variables, the code would become illegible and more complex than it needs to be. This would only be done for performance purposes, not utility.

  // VALIDATION of unit properties and conversion parameters ________________________________________________________________________________________

  if (!measurementType) {
    console.log('(analytics.js) error 2: the input unit of {' + unit + '} was not found in the dictionary')
  }

  if (!originSys) {
    console.log('(analytics.js) error 3: recursive for-loop error, could not find an $originSys')
  }

  if (!targetSys) {
    console.log('(analytics.js) error 3: recursive for-loop error, could not find a $targetSys')
  }

  if (!endIndex) {
    console.log('(analytics.js) error 4: recursive for-loop error, Desired unit type was not found in the dictionary')
  }

  // _______________________________________________________________________________________________________________________________________________

  //----- Create factor multiplicator -----//
  // downgrade factor array
  var start = dictionary[originSys][measurementType]

  // find starting point in the above downgrade factor array
  var startIndex;
  for (var i = 0; i < start.length; i++) {
    if (start[i].id.includes(unit)) {
      startIndex = i;
    }
  }

  // Move down from startIndex to the lowest unit possible in that measurementType by finding the total downFactor
  var downFactor = 1;
  for (var i = startIndex; i > 0; i--) {
    downFactor *= start[i].downFactor;
  }

  console.log('down: ' + downFactor)

  // jump from origin to targetSys using the altSystemFactor IF the $targetSys != $originSys
  if (originSys != targetSys) {
    jumpFactor = downFactor*start[0].altSystemFactor
  } else {
    jumpFactor = 1*downFactor
  }

  console.log('down-jump: ' + jumpFactor)

  // Define targetSys array
  var target = dictionary[targetSys][measurementType];


  // (REF-A) the $endIndex variable below was found through the recursive loop earlier in the code. Its purpose is to map the ending point of the conversion process

  // move up from index = 0 of target to the default unit type in target array
  var upFactor = jumpFactor;

  // k = 1 to avoid the 'altSystemFactor' key in index = 0 of targetSys array
  for (var k = 1; k < endIndex + 1; k++) {
    upFactor /= target[k].downFactor;
  }

  console.log('down-jump-up: ' + upFactor)

  // the real factor need to multiply value is 1/upFactor
  var realFactor = 1/upFactor;

  // Decide on what decimal places to return to the user
  // This splits the value based on whether there is a decimal point, creating an array with two values - ['pre-decimal', 'post-decimal']
  var decimalArray = value.toString().split('.')
  if (decimalArray[1]) {
    var decimalPlaces = decimalArray[1].length;
    // cap the maximum decimal points at a value that the user specifies in userOptions.decimalPlaces
    if (decimalPlaces > userOptions.decimalPlaces.max) {
      decimalPlaces = userOptions.decimalPlaces.max;
    }

  } else {
    var decimalPlaces = userOptions.decimalPlaces.default
  }

  // Create the updated unit object
  var updatedUnitObj = {
    'value': Number(value*realFactor).toFixed(decimalPlaces),
    'unit': targetUnitType,
    'measurementType': measurementType,
    'completed': true
  }

  // return updated and converted object

  return updatedUnitObj
}
