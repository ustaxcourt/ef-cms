#!/usr/bin/env bash

# Writes a digest-pinned reference to the latest IMAGE (ci-image | batch) for DEPLOY_ENV to $GITHUB_OUTPUT.

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

[[ -n "${GITHUB_OUTPUT:-}" ]] || fail "GITHUB_OUTPUT is not set"
[[ "${DEPLOY_ENV:-}" =~ ^[a-z0-9]+$ ]] || fail "DEPLOY_ENV must be a DAWSON environment name, got '${DEPLOY_ENV:-}'"

case "${IMAGE:-}" in
  ci-image)
    REPO="ef-cms-us-east-1"
    TAGS="$(aws_or_fail ecr describe-images --region "$REGION" --repository-name "$REPO" \
      --filter tagStatus=TAGGED --query 'imageDetails[].imageTags[]' --output text)"
    TAG="$(tr -s '[:space:]' '\n' <<<"$TAGS" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -n 1 || true)"
    [[ -n "$TAG" ]] || fail "No version tag in $REPO"
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
