#!/usr/bin/env node
/**
 * Copy demo videos from the package repo assets/ into static/video/ before build.
 *
 * Monorepo (submodule): node docs/scripts/sync-media.mjs
 * Docs-only clone: PACKAGE_REPO_ROOT=/path/to/google-signin node scripts/sync-media.mjs
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageRoot = process.env.PACKAGE_REPO_ROOT ?? join(docsRoot, '..')

const copies = [
  ['assets/google-signin-android.webm', 'static/video/google-signin-android.webm'],
  ['assets/google-signin-iOS.mov', 'static/video/google-signin-ios.mov'],
]

mkdirSync(join(docsRoot, 'static/video'), { recursive: true })

for (const [from, to] of copies) {
  const src = join(packageRoot, from)
  const dest = join(docsRoot, to)
  if (!existsSync(src)) {
    console.error(
      `sync-media: missing ${src}\n` +
        'Set PACKAGE_REPO_ROOT to the google-signin repo when working in a docs-only clone.',
    )
    process.exit(1)
  }
  copyFileSync(src, dest)
  console.log(`sync-media: ${from} → ${to}`)
}
