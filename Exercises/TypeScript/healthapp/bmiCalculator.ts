interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  const height: number = Number(args[2]);
  const weight: number = Number(args[3]);

  if (height === 0) throw new Error("Can't divide by zero");

  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Provided values were not numbers");
  } else {
    return {
      height: height,
      weight: weight,
    };
  }
};

const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = (weight / (height * height)) * 10000;

  if (bmi >= 30) {
    return "Obese range";
  } else if (bmi >= 25) {
    return "Overweight range";
  } else if (bmi >= 18.5) {
    return "Normal range";
  }
  return "Underweight range";
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export {};
