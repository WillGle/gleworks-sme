#!/usr/bin/env bash

# Default to current date-time (e.g., 20260610-180135) if no tag is provided
TAG="${1:-$(date +%Y%m%d-%H%M%S)}"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

echo "Building Frontend Docker image with tag: ${TAG}..."
docker build \
  --label "build-date=${BUILD_DATE}" \
  -t glework-frontend:${TAG} .

echo "Building Backend Docker image with tag: ${TAG}..."
docker build \
  --label "build-date=${BUILD_DATE}" \
  -t glework-backend:${TAG} ./simpleBEDB

echo "Done! Image sizes:"
docker images glework-frontend:${TAG}
docker images glework-backend:${TAG}

echo ""
echo "To run individual containers:"
echo "  Frontend: docker run -p 8080:80 glework-frontend:${TAG}"
echo "  Backend:  docker run -p 3001:3001 glework-backend:${TAG}"
echo ""
echo "Or use docker-compose with the tag:"
echo "  TAG=${TAG} docker compose up"


