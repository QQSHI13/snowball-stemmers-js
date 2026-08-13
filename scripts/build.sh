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

# Derive the algorithm list from the checked-out tree — the set grows with
# snowball releases (e.g. earlymodernenglish appeared after 3.1.1).
for sbl in "${TMP}"/snowball/algorithms/*.sbl; do
  lang=$(basename "${sbl}" .sbl)
  "${TMP}/snowball/snowball" \
    "${sbl}" \
    -js -o "lib/${lang}-stemmer.js"
done

echo "${REF}" > SNOWBALL_REF
echo "Built $(ls lib/*-stemmer.js | wc -l) stemmers from ${REF}"
