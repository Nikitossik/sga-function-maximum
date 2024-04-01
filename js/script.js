// algorythm logic

const algorythmStepCount = 40;
const populationCount = getRandomNumber({ minimum: 3, maximum: 10 });
let populationIndiviuals = getRandomNumber({
  minimum: 2,
  maximum: populationCount + 1,
});

populationIndiviuals =
  populationIndiviuals % 2 != 0
    ? populationIndiviuals + 1
    : populationIndiviuals;

const initialCrossoverProb = 0.5 + Math.abs(0.5 - Math.random());
const initialMutationProb = Math.random();

function getFunctionValue(x) {
  const value = a * x ** 2 + b * x + c;
  return value < 0 ? 1 : value;
}

function getRandomNumber({ minimum = 0, maximum = 1 }) {
  const min = Math.min(minimum, maximum);
  const max = Math.max(minimum, maximum);
  return min + Math.floor(Math.random() * (max - min));
}

function generateFirstPopulation(n) {
  const population = [];

  for (let i = 0; i < n; i++) {
    const randomNumber = getRandomNumber({ maximum: 256 });
    const binary = randomNumber.toString(2);
    const binaryTransformed = "0".repeat(8 - binary.length) + binary;
    population.push(binaryTransformed);
  }

  return population;
}

function doCrossOver(population) {
  const indexes = population.map((p, i) => i);
  const pairs = [];
  const newPopulation = [];

  for (let i = 0; i < population.length / 2; i++) {
    const first = indexes[getRandomNumber({ maximum: indexes.length })];
    const second = indexes[getRandomNumber({ maximum: indexes.length })];
    indexes.splice(indexes.indexOf(first), 1);
    indexes.splice(indexes.indexOf(second), 1);
    pairs.push([first, second]);
  }

  pairs.forEach((pair) => {
    let first = population[pair[0]];
    let second = population[pair[1]];

    const crossOverProb = Math.random();

    const shouldChange = crossOverProb <= initialCrossoverProb;

    if (shouldChange) {
      const crossOverBoundary = getRandomNumber({ minimum: 1, maximum: 8 });
      first =
        population[pair[0]].substring(0, crossOverBoundary) +
        population[pair[1]].substring(crossOverBoundary);
      second =
        population[pair[1]].substring(0, crossOverBoundary) +
        population[pair[0]].substring(crossOverBoundary);
    }

    newPopulation.push(first, second);
  });

  return newPopulation;
}

function doMutation(population) {
  return population.map((member) => {
    return member
      .split("")
      .map((bit) => {
        const mutationProb = Math.random();

        const shouldMutate = mutationProb <= initialMutationProb;
        return !shouldMutate ? bit : bit == "0" ? "1" : "0";
      })
      .join("");
  });
}

function doSelection(population) {
  const funtionValues = population.map((member) =>
    getFunctionValue(parseInt(member, 2))
  );
  const sum = funtionValues.reduce((acc, dec) => acc + dec, 0);
  const probabilities = funtionValues.map((value) => value / sum);

  let [min, max] = [0, 0];

  const computatedProbs = probabilities.map((val, ind) => {
    if (ind == 0) max = val;
    else {
      min = max;
      max += val;
    }
    return {
      min,
      max,
    };
  });

  const newPopulation = population.map((prop, ind) => {
    const selectionProp = Math.random();
    const selectedMemberindex = computatedProbs.findIndex(
      (p) => p.min <= selectionProp && p.max > selectionProp
    );
    return population[selectedMemberindex];
  });
  return newPopulation;
}

function doCycle(population) {
  currentPopulation = [...population];
  for (let i = 0; i < populationCount; i++) {
    const crossOvered = doCrossOver(currentPopulation);
    const mutated = doMutation(crossOvered);
    currentPopulation = doSelection(mutated);
  }
  return currentPopulation;
}

function getSolutions() {
  let solutions = "";
  for (let i = 0; i < algorythmStepCount; i++) {
    const initialPopulation = generateFirstPopulation(populationCount);
    const finalPopulation = doCycle(initialPopulation);
    const maxNumber = Math.max(
      ...finalPopulation.map((num) => parseInt(num, 2))
    );
    const maxFunNumber = getFunctionValue(maxNumber);
    solutions += `step ${i + 1}: x = ${maxNumber}, f(x) = ${maxFunNumber}\n`;
  }
  return solutions;
}

function downloadFile(content) {
  const link = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = "results.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
