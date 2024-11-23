#!/bin/bash
# run.sh

# Exit on any error
set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check required tools
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required but not installed.  Aborting."; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo >&2 "Kubectl is required but not installed.  Aborting."; exit 1; }

# Build Docker images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build

# Push to local registry (for Minikube)
echo -e "${YELLOW}Pushing images to local registry...${NC}"
docker save docx-pdf-backend:latest | (eval "$(minikube docker-env)" && docker load)
docker save docx-pdf-frontend:latest | (eval "$(minikube docker-env)" && docker load)

# Create Kubernetes secrets
echo -e "${YELLOW}Creating Kubernetes secrets...${NC}"
kubectl create secret generic mongodb-secret \
  --from-literal=MONGODB_URI=mongodb://mongodb:27017/docx-converter || true

# Apply Kubernetes manifests
echo -e "${YELLOW}Deploying to Kubernetes...${NC}"
kubectl apply -f kubernetes/

# Wait for deployments to be ready
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
kubectl rollout status deployment/docx-pdf-backend
kubectl rollout status deployment/docx-pdf-frontend

# Get service URLs
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${YELLOW}Frontend URL:${NC} $(minikube service docx-pdf-frontend-service --url)"
echo -e "${YELLOW}Backend URL:${NC} $(minikube service docx-pdf-backend-service --url)"

# Optional: Open service in browser
read -p "Open frontend in browser? (y/n) " open_browser
if [[ $open_browser == "y" ]]; then
  minikube service docx-pdf-frontend-service
fi