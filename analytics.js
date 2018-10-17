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
  'weight': {
    'metric': [
      {'id': ['mg', 'milligram', 'milligrams'], 'altSystemFactor': 28349.4925441},
      {'id': ['g', 'gram', 'grams'], 'downFactor': 0.001},
      {'id': ['kg', 'kilogram', 'kilograms'], 'downFactor': 0.001}
    ],
    'imperial': [
      {'id': ['oz', 'ounce', 'ounces'], 'altSystemFactor': 0.00003527396},
      {'id': ['lb', 'pound', 'pounds'], 'downFactor': 0.0625}
    ]
  },
  'distance': {
    'metric': [
      {'id': ['mm', 'millimeter', 'millimeters', 'millimetre', 'millimetres'], 'altSystemFactor': 25.4},
      {'id': ['cm', 'centimeter', 'cetimeters', 'centimetre', 'centimetres'], 'downFactor': 0.1},
      {'id': ['m', 'meter', 'meters', 'metre', 'metres'], 'downFactor': 0.01},
      {'id': ['km', 'kilometer', 'kilometers', 'kilometre', 'kilometres'], 'downFactor': 0.001}
    ],
    'imperial':[
      {'id': ['in', 'inch', 'inches'], 'altSystemFactor': 0.03937007874},
      {'id': ['ft', 'foot', 'feet'], 'downFactor': 0.0833333},
      {'id': ['yd', 'yard', 'yards'], 'downFactor': 0.333333},
      {'id': ['mi', 'mile', 'miles'], 'downFactor': 0.000568182}
    ]
  },
  'time': [
      {'id': ['ms', 'millisecond', 'milliseconds'], 'altSystemFactor': 1},
      {'id': ['s', 'second', 'seconds'], 'downFactor': 0.001},
      {'id': ['min', 'minute', 'minutes'], 'downFactor': 0.0166667},
      {'id': ['h', 'hr', 'hour', 'hours'], 'downFactor': 0.0166667}
    ]
};

var measurementText = '880 m/min'

var updatedObj = convertMeasurementText(measurementText, userOptions, dictionary);


console.log(updatedObj)

//-------------------------------- FUNCTIONS ---------------------------------//

function convertMeasurementText(unitObj, userOptions, dictionary) {

  // VALIDATION of measurementText____________________________________________________________________________________________________________________
  // declare a speed variable in case the conversion is for a speed value
  var speedBoolean;

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


  // _______________________________________________________________________________________________________________________________________________
  if (temp.includes('/')) {
    // this is a speed measurement which means time + distance conversions with additional calculations needed
    var conversionType = 'speed';

  } else {
    var conversionType = 'notSpeed';
  }
  var value = textArray[0];
  var unit = temp.join('');

  //+ Decide on what decimal places to return to the user
  //+ This splits the value based on whether there is a decimal point, creating an array with two values - ['pre-decimal', 'post-decimal']
  var decimalArray = value.toString().split('.')
  if (decimalArray[1]) {
    var decimalPlaces = decimalArray[1].length;
    //+ cap the maximum decimal points at a value that the user specifies in userOptions.decimalPlaces
    if (decimalPlaces > userOptions.decimalPlaces.max) {
      decimalPlaces = userOptions.decimalPlaces.max;
    }

  } else {
    var decimalPlaces = userOptions.decimalPlaces.default
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////-----------------  DISTANCE and WEIGHT conversions -----------------//////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (conversionType === 'notSpeed') {

    //+ Define the $originSys and $measurementType of $measurementText by using a recursive for-loop on the dictionary to search for a match
    for (var measurementTypeInd in dictionary) {
        //++ run through 'weight' and 'distance' and etc, in each of the measurementTypeInd

      for (var systemTypeInd in dictionary[measurementTypeInd]) {
        //+++ run through 'imperial' and 'metric'

        for (var i = 0; i < dictionary[measurementTypeInd][systemTypeInd].length; i++) {
          //++++  run through the entire array stored inside 'weight', 'distance', etc.
          if (dictionary[measurementTypeInd][systemTypeInd][i].id.includes(unit)) {
            //+++++ if we find a matching unit type, we assign the measurementType and origin to it

            var measurementType = measurementTypeInd;
            var originSys = systemTypeInd;
          }
        }
      }
    }

    //+ Define the targetUnitType
    var targetUnitType = userOptions.units[measurementType];

    //+ Define $targetSys by using a recursive for-loop on the dictionary to search for a match
    //+ This for-loop also finds the $endIndex variable which is used for computations later in the code (refer to REF-A below)
    for (var measurementTypeInd in dictionary) {
      //++ run through 'weight' and 'distance' and etc, in each of the measurementTypeInd

      for (var systemTypeInd in dictionary[measurementTypeInd]) {
        //+++ run through 'imperial' and 'metric'

        for (var i = 0; i < dictionary[measurementTypeInd][systemTypeInd].length; i++) {
          //++++  run through the entire array stored inside 'weight', 'distance', etc.

          if (dictionary[measurementTypeInd][systemTypeInd][i].id.includes(targetUnitType)) {
            //+++++ if we find a matching unit type, we assign the targetSys variable to it
            var targetSys = systemTypeInd;
            var endIndex = i;
          }
        }
      }
    }

    //+ NOTE: there are two recursive for-loops because they need to be executed in order. If the code were to join the two loops into a single recursive loop to define all
    //+  5 variables, the code would become illegible and more complex than it needs to be. This would only be done for performance purposes, not utility.

    //+ VALIDATION of unit properties and conversion parameters ________________________________________________________________________________________

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

    //+ _______________________________________________________________________________________________________________________________________________
    //+----- Create factor multiplicator -----//

    //+ downgrade factor array
    var start = dictionary[measurementType][originSys]

    //+ find starting point in the above downgrade factor array
    var startIndex;
    for (var i = 0; i < start.length; i++) {
      if (start[i].id.includes(unit)) {
        startIndex = i;
      }
    }

    //+ Move down from startIndex to the lowest unit possible in that measurementType by finding the total downFactor
    var downFactor = 1;
    for (var i = startIndex; i > 0; i--) {
      downFactor *= start[i].downFactor;
    }

    console.log('down: ' + downFactor)

    //+ jump from origin to targetSys using the altSystemFactor IF the $targetSys != $originSys
    if (originSys != targetSys) {
      jumpFactor = downFactor*start[0].altSystemFactor
    } else {
      jumpFactor = 1*downFactor
    }

    console.log('down-jump: ' + jumpFactor)

    //+ Define targetSys array
    var target = dictionary[measurementType][targetSys];


    //+ (REF-A) the $endIndex variable below was found through the recursive loop earlier in the code. Its purpose is to map the ending point of the conversion process

    //+ move up from index = 0 of target to the default unit type in target array
    var upFactor = jumpFactor;

    //+ k = 1 to avoid the 'altSystemFactor' key in index = 0 of targetSys array
    for (var k = 1; k < endIndex + 1; k++) {
      upFactor /= target[k].downFactor;
    }

    console.log('down-jump-up: ' + upFactor)

    //+ the real factor need to multiply value is 1/upFactor
    var realFactor = 1/upFactor;

    //+ Create the updated unit object
    var updatedUnitObj = {
      'value': Number(value*realFactor).toFixed(decimalPlaces),
      'unit': targetUnitType,
      'measurementType': measurementType,
      'completed': true
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////------------------------  SPEED conversions ------------------------//////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (conversionType === 'speed') {
    // Deifne multi parameter conversion
    var distanceUnit = unit.split('/')[0];
    var timeUnit = unit.split('/')[1];

    // Define targets
    var targetDistanceUnit = userOptions.units['speed'].split('/')[0];
    var targetTimeUnit = userOptions.units['speed'].split('/')[1];

    //+ VALIDATION of unit variables ______________________ ________________________________________________________________________________________

    if (!distanceUnit) {
      console.log('(analytics.js) error 5: no distance unit found')
    }

    if (!timeUnit) {
      console.log('(analytics.js) error 6: no time unit found')
    }

    if (!targetDistanceUnit) {
      console.log('(analytics.js) error 7: no target distance unit found')
    }

    if (!targetTimeUnit) {
      console.log('(analytics.js) error 8: no target time unit found')
    }

    //+ _______________________________________________________________________________________________________________________________________________

    // Conduct two separate conversions
    // Distance conversion
    if (distanceUnit !== targetDistanceUnit) {
      for (var systemTypeInd in dictionary['distance']) {
        //++ run through 'imperial' and 'metric'
        for (var i = 0; i < dictionary['distance'][systemTypeInd].length; i++) {
          //+++ run through each entry into the 'imperial' and 'metric' arrays to map out start and end points
          if (dictionary['distance'][systemTypeInd][i].id.includes(distanceUnit)) {
            var distanceStartInd = i;
            var tempSys = systemTypeInd;
          }

          if (dictionary['distance'][systemTypeInd][i].id.includes(targetDistanceUnit)) {
            var distanceEndInd = i;
            var tempTargetSys = systemTypeInd;
          }
        }
      }

      //+ VALIDATION of conversion parameters _________________________________________________________________________________________________________

      if (!distanceStartInd) {
        console.log('(analytics.js) error 9: no distance start index')
      }

      if (!distanceEndInd) {
        console.log('(analytics.js) error 10: no distance end index')
      }

      if (!tempSys) {
        console.log('(analytics.js) error 11: no current system found')
      }

      if (!tempTargetSys) {
        console.log('(analytics.js) error 12: no target system found')
      }

      //+ _______________________________________________________________________________________________________________________________________________

      var downFactor = 1;

      for (var i = distanceStartInd; i != 0; i--) {
        downFactor *= dictionary['distance'][tempSys][i].downFactor
      }

      var jumpFactor = 1;

      if (tempSys !== tempTargetSys) {
        jumpFactor = dictionary['distance'][tempSys][0].altSystemFactor
      }

      var upFactor = downFactor*jumpFactor

      // note var i = 1 is used to allow us to skip the altSystemFactor on the first array entry
      for (var i = 1; i < distanceEndInd + 1; i++) {
        upFactor /= dictionary['distance'][tempTargetSys][i].downFactor
      }

      var realDistanceFactor = 1/upFactor;

      console.log('Distance conversion factor: ' + realDistanceFactor)


    } else {
      var realDistanceFactor = 1;
    }

    // Time conversion
    if (timeUnit !== targetTimeUnit) {
      //+ Map out indexes
      for (var i = 0; i < dictionary['time'].length; i++) {
        if (dictionary['time'][i].id.includes(timeUnit)) {
          var timeStartInd = i;
        }

        if (dictionary['time'][i].id.includes(targetTimeUnit)) {
          var timeEndInd = i;
        }
      }

      console.log('conversion starting from index ' + timeStartInd + ' to index ' + timeEndInd)

      // check direction of conversion
      if (timeStartInd > timeEndInd) {
        // A downshift is needed to complete the conversion
        var realTimeFactor = 1;

        // Start accounting for a unit downshift towards the targetUnitType
        for (var i = timeStartInd; i > timeEndInd; i--) {
          console.log('in downshift for loop')
          realTimeFactor *= dictionary.time[i].downFactor;
        }

        console.log('time conversion factor (downshift): ' + realTimeFactor)


      } else {
        // an upshift is needed to complete the conversion
        var realTimeFactor = 1;

        // Start accounting for a unit upshift towards the targetUnitType
        for (var i = timeStartInd; i < timeEndInd; i++) {
          realTimeFactor /= dictionary.time[i + 1].downFactor;
        }

        console.log('time conversion factor (upshift): ' + realTimeFactor)

      }

    } else {
      // if the time units are the same, just leave the time factor as 1
      var realTimeFactor = 1;
    }


    var realTotalFactor = realTimeFactor*realDistanceFactor;

    //+ Create the updated unit object
    var updatedUnitObj = {
      'value': Number(value*realTotalFactor).toFixed(decimalPlaces),
      'unit': userOptions.units['speed'],
      'measurementType': 'speed',
      'completed': true
    }


  }



  // return updated and converted object

  return updatedUnitObj
}
