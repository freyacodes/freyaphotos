#!/usr/bin/env sh
yarn install
./gradlew run --args='meta'
./gradlew run
