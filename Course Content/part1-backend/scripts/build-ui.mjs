// Created by AI

import { rmSync, cpSync } from "node:fs"
import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const backendDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
)
const frontendDir = path.resolve(backendDir, "..", "part1-frontend") // change to your frontend folder name

// 1. build the frontend
execSync("npm run build", { cwd: frontendDir, stdio: "inherit" })

// 2. replace the backend's old dist with the new one
rmSync(path.join(backendDir, "dist"), { recursive: true, force: true })
cpSync(path.join(frontendDir, "dist"), path.join(backendDir, "dist"), {
  recursive: true,
})

console.log("Frontend build copied to backend/dist")
