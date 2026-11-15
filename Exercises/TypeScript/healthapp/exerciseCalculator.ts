interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  calculatedAverage: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
}

type Rating = 1 | 2 | 3;

interface ParsedArguments {
  hours: number[];
  target: number;
}

const parseArguments = (args: string[]): ParsedArguments => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target: number = Number(args[2]);
  const hours: number[] = args.slice(3).map((hour) => Number(hour));

  if (isNaN(target) || hours.some((hour) => isNaN(hour))) {
    throw new Error("Provided values were not numbers");
  }

  return {
    hours,
    target,
  };
};

const calculateExercises = (
  dailyHours: number[],
  targetHours: number,
): Result => {
  const average: number =
    dailyHours.reduce((sum, hours) => sum + hours, 0) / dailyHours.length;
  const activeDays: number = dailyHours.filter((day) => day > 0).length;

  let resultDescription: string;
  let rating: Rating;

  if (average <= targetHours / 2) {
    resultDescription = "Bad, do better";
    rating = 1;
  } else if (average < targetHours) {
    resultDescription = "Not bad, could be better";
    rating = 2;
  } else {
    resultDescription = "Good, keep going";
    rating = 3;
  }

  return {
    periodLength: dailyHours.length,
    trainingDays: activeDays,
    target: targetHours,
    calculatedAverage: average,
    success: average >= targetHours,
    rating: rating,
    ratingDescription: resultDescription,
  };
};

try {
  const { hours, target } = parseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
