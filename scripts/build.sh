#!/usr/bin/env bash
# Build the snowball stemmers to JavaScript.
#
# Usage: bash scripts/build.sh [SNOWBALL_REF]
#   SNOWBALL_REF defaults to the pinned ref in SNOWBALL_REF.
#
# Clones snowballstem/snowball at the ref, builds the snowball compiler,
# generates every algorithm to lib/<algorithm>-stemmer.js, and records the
# ref. Generated output is committed (parity approach — the CI release job
# asserts it matches a fresh build).
set -euo pipefail

REF="${1:-$(cat SNOWBALL_REF)}"
echo "Building stemmers from snowball ${REF}"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --branch "${REF}" \
  https://github.com/snowballstem/snowball.git "${TMP}/snowball" \
  >/dev/null 2>&1

make -C "${TMP}/snowball" snowball >/dev/null

mkdir -p lib
cp "${TMP}/snowball/javascript/base-stemmer.js" lib/

for lang in arabic armenian basque catalan czech danish dutch dutch_porter \
  earlymodernenglish english esperanto estonian finnish french german greek \
  hindi hungarian indonesian irish italian lithuanian lovins nepali norwegian \
  persian polish porter portuguese romanian russian serbian sesotho spanish \
  swedish tamil turkish yiddish
do
  "${TMP}/snowball/snowball" \
    "${TMP}/snowball/algorithms/${lang}.sbl" \
    -js -o "lib/${lang}-stemmer.js"
done

echo "${REF}" > SNOWBALL_REF
echo "Built $(ls lib/*-stemmer.js | wc -l) stemmers from ${REF}"
