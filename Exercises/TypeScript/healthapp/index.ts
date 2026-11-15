import express from "express";
import calculateBmi from "./bmiCalculator.ts";
import {
  calculateExercises,
  type ParsedArguments,
} from "./exerciseCalculator.ts";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (height <= 0 || weight <= 0 || isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  res.json({ height, weight, bmi: calculateBmi(height, weight) });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target }: ParsedArguments = req.body;
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (
    daily_exercises.length === 0 ||
    daily_exercises.some((hour) => isNaN(hour)) ||
    target < 0 ||
    isNaN(target)
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  return res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
