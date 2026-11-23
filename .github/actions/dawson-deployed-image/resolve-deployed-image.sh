#!/usr/bin/env bash

# Writes a digest-pinned reference to the image DEPLOY_ENV runs (IMAGE: ci-image | batch) to $GITHUB_OUTPUT.

set -euo pipefail

REGION="us-east-1"

fail() {
  echo "::error::$*" >&2
  exit 1
}

# AWS errors contain the account ID, so print only the error code.
aws_or_fail() {
  local err_file output code
  err_file="$(mktemp)"
  if ! output="$(aws "$@" 2>"$err_file")"; then
    code="$(sed -n '/An error occurred (/{s/.*An error occurred (\([A-Za-z0-9]*\)).*/\1/p;q;}' "$err_file")"
    rm -f "$err_file"
    fail "aws $1 $2 failed: ${code:-unknown error}"
  fi
  rm -f "$err_file"
  printf '%s' "$output"
}

read_ci_image_tag() {
  sed -n 's|^efcms-docker-image: &efcms-docker-image .*/ef-cms-us-east-1:\([^[:space:]]*\)[[:space:]]*$|\1|p' "$1"
}

[[ -n "${GITHUB_OUTPUT:-}" ]] || fail "GITHUB_OUTPUT is not set"
[[ "${DEPLOY_ENV:-}" =~ ^[a-z0-9]+$ ]] || fail "DEPLOY_ENV must be a DAWSON environment name, got '${DEPLOY_ENV:-}'"

case "${IMAGE:-}" in
  ci-image)
    [[ -f "${CI_CONFIG:-}" ]] || fail "No deploy config at '${CI_CONFIG:-}'"
    REPO="ef-cms-us-east-1"
    TAG="$(read_ci_image_tag "$CI_CONFIG")"
    [[ "$TAG" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail "No version tag for $REPO in the deploy config (found '$TAG')"
    ;;
  batch)
    PARAM="/DAWSON/${DEPLOY_ENV}/current-color"
    COLOR="$(aws_or_fail ssm get-parameter --region "$REGION" --name "$PARAM" --query Parameter.Value --output text)"
    [[ "$COLOR" == "blue" || "$COLOR" == "green" ]] || fail "$PARAM is '$COLOR', expected blue or green"
    REPO="docket-entry-zipper-${DEPLOY_ENV}-${COLOR}-${REGION}"
    TAG="latest"
    ;;
  *)
    fail "IMAGE must be ci-image or batch, got '${IMAGE:-}'"
    ;;
esac

echo "Looking up $REPO:$TAG"
DETAILS="$(aws_or_fail ecr describe-images --region "$REGION" --repository-name "$REPO" \
  --image-ids "imageTag=$TAG" --query 'imageDetails[0].[registryId,imageDigest]' --output text)"
read -r ACCOUNT_ID DIGEST <<<"$DETAILS" || true

[[ "${ACCOUNT_ID:-}" =~ ^[0-9]{12}$ ]] || fail "describe-images returned no registry ID for $REPO:$TAG"
echo "::add-mask::$ACCOUNT_ID"
[[ "${DIGEST:-}" =~ ^sha256:[0-9a-f]{64}$ ]] || fail "describe-images returned no digest for $REPO:$TAG"

echo "image_ref=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}@${DIGEST}" >>"$GITHUB_OUTPUT"
echo "Scanning $REPO:$TAG at $DIGEST"
