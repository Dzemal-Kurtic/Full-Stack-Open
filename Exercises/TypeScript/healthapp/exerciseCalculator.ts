export interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
}

type Rating = 1 | 2 | 3;

export interface ParsedArguments {
  daily_exercises: number[];
  target: number;
}

const parseArguments = (args: string[]): ParsedArguments => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target: number = Number(args[2]);
  const daily_exercises: number[] = args.slice(3).map((hour) => Number(hour));

  if (isNaN(target) || daily_exercises.some((hour) => isNaN(hour))) {
    throw new Error("Provided values were not numbers");
  }

  return {
    daily_exercises,
    target,
  };
};

export const calculateExercises = (
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
    average: average,
    success: average >= targetHours,
    rating: rating,
    ratingDescription: resultDescription,
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { daily_exercises, target } = parseArguments(process.argv);
    console.log(calculateExercises(daily_exercises, target));
  } catch (error) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
