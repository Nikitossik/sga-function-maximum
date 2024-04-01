"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// algorythm logic
var algorythmStepCount = 40;
var populationCount = getRandomNumber({
  minimum: 3,
  maximum: 10
});
var populationIndiviuals = getRandomNumber({
  minimum: 2,
  maximum: populationCount + 1
});
populationIndiviuals = populationIndiviuals % 2 != 0 ? populationIndiviuals + 1 : populationIndiviuals;
var initialCrossoverProb = 0.5 + Math.abs(0.5 - Math.random());
var initialMutationProb = Math.random();

function getFunctionValue(x) {
  var value = a * Math.pow(x, 2) + b * x + c;
  return value < 0 ? 1 : value;
}

function getRandomNumber(_ref) {
  var _ref$minimum = _ref.minimum,
      minimum = _ref$minimum === void 0 ? 0 : _ref$minimum,
      _ref$maximum = _ref.maximum,
      maximum = _ref$maximum === void 0 ? 1 : _ref$maximum;
  var min = Math.min(minimum, maximum);
  var max = Math.max(minimum, maximum);
  return min + Math.floor(Math.random() * (max - min));
}

function generateFirstPopulation(n) {
  var population = [];

  for (var i = 0; i < n; i++) {
    var randomNumber = getRandomNumber({
      maximum: 256
    });
    var binary = randomNumber.toString(2);
    var binaryTransformed = "0".repeat(8 - binary.length) + binary;
    population.push(binaryTransformed);
  }

  return population;
}

function doCrossOver(population) {
  var indexes = population.map(function (p, i) {
    return i;
  });
  var pairs = [];
  var newPopulation = [];

  for (var i = 0; i < population.length / 2; i++) {
    var first = indexes[getRandomNumber({
      maximum: indexes.length
    })];
    var second = indexes[getRandomNumber({
      maximum: indexes.length
    })];
    indexes.splice(indexes.indexOf(first), 1);
    indexes.splice(indexes.indexOf(second), 1);
    pairs.push([first, second]);
  }

  pairs.forEach(function (pair) {
    var first = population[pair[0]];
    var second = population[pair[1]];
    var crossOverProb = Math.random();
    var shouldChange = crossOverProb <= initialCrossoverProb;

    if (shouldChange) {
      var crossOverBoundary = getRandomNumber({
        minimum: 1,
        maximum: 8
      });
      first = population[pair[0]].substring(0, crossOverBoundary) + population[pair[1]].substring(crossOverBoundary);
      second = population[pair[1]].substring(0, crossOverBoundary) + population[pair[0]].substring(crossOverBoundary);
    }

    newPopulation.push(first, second);
  });
  return newPopulation;
}

function doMutation(population) {
  return population.map(function (member) {
    return member.split("").map(function (bit) {
      var mutationProb = Math.random();
      var shouldMutate = mutationProb <= initialMutationProb;
      return !shouldMutate ? bit : bit == "0" ? "1" : "0";
    }).join("");
  });
}

function doSelection(population) {
  var funtionValues = population.map(function (member) {
    return getFunctionValue(parseInt(member, 2));
  });
  var sum = funtionValues.reduce(function (acc, dec) {
    return acc + dec;
  }, 0);
  var probabilities = funtionValues.map(function (value) {
    return value / sum;
  });
  var min = 0,
      max = 0;
  var computatedProbs = probabilities.map(function (val, ind) {
    if (ind == 0) max = val;else {
      min = max;
      max += val;
    }
    return {
      min: min,
      max: max
    };
  });
  var newPopulation = population.map(function (prop, ind) {
    var selectionProp = Math.random();
    var selectedMemberindex = computatedProbs.findIndex(function (p) {
      return p.min <= selectionProp && p.max > selectionProp;
    });
    return population[selectedMemberindex];
  });
  return newPopulation;
}

function doCycle(population) {
  currentPopulation = _toConsumableArray(population);

  for (var i = 0; i < populationCount; i++) {
    var crossOvered = doCrossOver(currentPopulation);
    var mutated = doMutation(crossOvered);
    currentPopulation = doSelection(mutated);
  }

  return currentPopulation;
}

function getSolutions() {
  var solutions = "";

  for (var i = 0; i < algorythmStepCount; i++) {
    var initialPopulation = generateFirstPopulation(populationCount);
    var finalPopulation = doCycle(initialPopulation);
    var maxNumber = Math.max.apply(Math, _toConsumableArray(finalPopulation.map(function (num) {
      return parseInt(num, 2);
    })));
    var maxFunNumber = getFunctionValue(maxNumber);
    solutions += "step ".concat(i + 1, ": x = ").concat(maxNumber, ", f(x) = ").concat(maxFunNumber, "\n");
  }

  return solutions;
}

function downloadFile(content) {
  var link = document.createElement("a");
  var file = new Blob([content], {
    type: "text/plain"
  });
  link.href = URL.createObjectURL(file);
  link.download = "results.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}