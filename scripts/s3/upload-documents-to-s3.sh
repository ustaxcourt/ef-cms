#!/bin/bash -e

# uploads and overwrites files in s3 documents directory for the respective aws environment

# Usage
#   . scripts/env/set-env.zsh {YOUR ENV HERE}
# After setting the environment, use one of these commands
#   zsh scripts/s3/upload-documents-to-s3.sh
#   bash scripts/s3/upload-documents-to-s3.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Running script to upload document files to S3"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check environment variables first
if ! ./check-env-variables.sh \
  "ENV" \
  "EFCMS_DOMAIN" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"; then
    print_error "Environment variable check failed!"
    exit 1
fi

# Configuration
LOCAL_DIR="./scripts/s3/documents"
S3_DEST="s3://$EFCMS_DOMAIN-documents-$ENV-us-east-1"

# Check if local directory exists
if [ ! -d "$LOCAL_DIR" ]; then
    print_error "Local directory '$LOCAL_DIR' does not exist."
    exit 1
fi

# Check if directory is empty
if [ -z "$(ls -A "$LOCAL_DIR" 2>/dev/null)" ]; then
    print_warning "Local directory '$LOCAL_DIR' is empty."
    exit 0
fi

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed or not in PATH."
    exit 1
fi

print_status "Starting upload from '$LOCAL_DIR' to '$S3_DEST'"

# Count files to upload
FILE_COUNT=$(find "$LOCAL_DIR" -type f -print0 2>/dev/null | grep -zc .)
print_status "Found $FILE_COUNT files to upload"

print_status "Uploading files (will overwrite existing files with same names)..."

if aws s3 cp "$LOCAL_DIR" "$S3_DEST" \
   --recursive \
   --no-progress \
   --only-show-errors; then
    print_status "Upload completed successfully! ($FILE_COUNT files uploaded)"
else
    print_error "Upload failed!"
fi