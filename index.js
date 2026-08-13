/**
 * snowball-stemmers-js — Snowball stemmers for JavaScript.
 *
 * Generated from snowballstem/snowball (BSD-3-Clause). Each stemmer is a
 * self-contained class exposing `stemWord(word)` / `stemWords(words)`.
 *
 * Usage:
 *   const { newStemmer, stem } = require("snowball-stemmers-js")
 *   newStemmer("english").stemWord("installing")   // "instal"
 *   stem("de", "Häusern")                          // "Haus"
 *
 * Languages accept either the snowball algorithm name ("german") or the
 * common ISO-639-1 code ("de").
 */
"use strict"

const fs = require("fs")
const path = require("path")

/* Derived from lib/ so the list stays in sync with the snowball build. */
const ALGORITHMS = fs.readdirSync(path.join(__dirname, "lib"))
  .filter(f => f.endsWith("-stemmer.js") && f !== "base-stemmer.js")
  .map(f => f.slice(0, -"-stemmer.js".length))
  .sort()

/* ISO-639-1 / lunr-languages style codes -> snowball algorithm names */
const CODES = {
  ar: "arabic", hy: "armenian", eu: "basque", ca: "catalan", cs: "czech",
  da: "danish", nl: "dutch", du: "dutch", en: "english", eo: "esperanto",
  et: "estonian", fi: "finnish", fr: "french", de: "german", el: "greek",
  hi: "hindi", hu: "hungarian", id: "indonesian", ga: "irish", it: "italian",
  lt: "lithuanian", ne: "nepali", no: "norwegian", fa: "persian",
  pl: "polish", pt: "portuguese", ro: "romanian", ru: "russian",
  sr: "serbian", st: "sesotho", es: "spanish", sv: "swedish", ta: "tamil",
  tr: "turkish", yi: "yiddish",
}

const _cache = Object.create(null)

/**
 * Create a stemmer instance for the given language.
 * @param {string} lang snowball algorithm name or ISO code
 * @returns {{ stemWord(word: string): string, stemWords(words: string[]): string[] }}
 */
function newStemmer(lang) {
  const algorithm = CODES[lang] || lang
  if (!ALGORITHMS.includes(algorithm)) {
    throw new Error(`snowball-stemmers-js: unknown stemmer "${lang}"`)
  }
  if (!_cache[algorithm]) {
    /* Generated modules are ES-module-style CommonJS: { default: Stemmer } */
    const { default: Stemmer } = require(`./lib/${algorithm}-stemmer.js`)
    _cache[algorithm] = Stemmer
  }
  return new _cache[algorithm]()
}

/**
 * Stem a single word.
 * @param {string} lang snowball algorithm name or ISO code
 * @param {string} word
 * @returns {string}
 */
function stem(lang, word) {
  return newStemmer(lang).stemWord(word)
}

module.exports = { newStemmer, stem, algorithms: ALGORITHMS, codes: CODES }
