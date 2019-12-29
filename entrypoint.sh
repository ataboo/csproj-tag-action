#!/bin/bash
# Tag the package version

set -e

PROJ_FILES=( "*.csproj" )
VERSION=$(awk -F'[<>]' '/Version/ {print $3}' ${PROJ_FILES[0]})
echo $VERSION

git tag v$VERSION

git push origin --tags
