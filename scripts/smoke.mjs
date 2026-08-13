/* Smoke test: stem known words per language against snowball's expected output. */
import assert from "node:assert/strict"
import { newStemmer, stem, algorithms } from "../index.js"

let passed = 0
function check(name, cond) {
  assert.ok(cond, name)
  passed++
  console.log(`  ✓ ${name}`)
}

/* All 38 algorithms load and produce a stemmable instance */
check("38 algorithms exported", algorithms.length === 38)
for (const alg of algorithms) {
  const s = newStemmer(alg)
  assert.equal(typeof s.stemWord("test"), "string", alg)
  assert.equal(typeof s.stemWord("test"), "string", alg)
}

/* Known stems (matches snowball test data) */
check("en: installing -> instal", stem("en", "installing") === "instal")
check("en: connections -> connect", stem("english", "connections") === "connect")
check("de: Häusern -> Haus", stem("de", "Häusern") === "Haus")
check("fr: installations -> install", stem("fr", "installations") === "install")
check("es: buscándolo -> busc", stem("es", "buscándolo") === "busc")
check("ru: красивейший -> красив", stem("ru", "красивейший") === "красив")
check("ar: \u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646 -> \u0645\u0633\u062a\u062e\u062f\u0645", 
  stem("ar", "\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646") === "\u0645\u0633\u062a\u062e\u062f\u0645")

/* Error on unknown language */
assert.throws(() => newStemmer("klingon"))

console.log(`\nsnowball-stemmers-js: ${passed} checks passed`)
