#!/usr/bin/env bash

TAG="${1:-latest}"

echo "Building Docker image..."

docker build -t glework-frontend:${TAG} .

echo "Done! Image size:"
docker images glework-frontend:${TAG}

echo ""
echo "To run: docker run -p 8080:80 glework-frontend:${TAG}"
