resource "aws_ecr_repository" "docket_entry_zipper_repo" {
  #checkov:skip=CKV_AWS_51: mutable tags required — blue/green deploys push and pull :latest; immutable tags would break the deployment pattern
  #checkov:skip=CKV_AWS_136: ECR default AES-256 encryption is sufficient — images are pre-built CI artifacts; CMK adds key rotation overhead without meaningful security benefit; KMS encryption not configured
  #checkov:skip=CKV_AWS_163: ECR native scanning disabled — container vulnerability scanning handled by Trivy in CI (security-containers.yml); redundant to enable both
  name = "docket-entry-zipper-${var.environment}-${var.color}-${var.region}"
}

resource "aws_ecr_lifecycle_policy" "docket_entry_zipper_lifecycle_policy" {
  repository = aws_ecr_repository.docket_entry_zipper_repo.name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep only the last 15 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 15
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}

