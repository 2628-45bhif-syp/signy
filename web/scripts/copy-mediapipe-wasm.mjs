// Copies the MediaPipe WASM runtime from node_modules into public/ so the app
// serves it itself and never loads it from a third-party host.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm')
const target = join(root, 'public', 'mediapipe', 'wasm')

if (!existsSync(source)) {
  console.error(`MediaPipe WASM not found at ${source}. Run "npm install" first.`)
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(source, target, { recursive: true })
console.log(`Copied MediaPipe WASM to ${target}`)
