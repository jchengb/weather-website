#!/bin/sh
set -e

if [ -z "$1" ]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh v1.0.0"
  exit 1
fi

VERSION=$1

# Validate version format
echo "$VERSION" | grep -qE '^v[0-9]+\.[0-9]+\.[0-9]+$' || {
  echo "Error: version must be in the format v1.2.3"
  exit 1
}

# Ensure working tree is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: uncommitted changes present. Commit or stash them before releasing."
  exit 1
fi

echo "Running unit tests..."
node tests.js

echo ""
echo "Creating tag $VERSION..."
git tag -a "$VERSION" -m "Release $VERSION"

echo "Pushing to GitHub..."
git push origin main
git push origin "$VERSION"

echo ""
echo "Done. GitHub Actions will create the release at:"
echo "  https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]//' | sed 's/\.git$//')/releases/tag/$VERSION"
