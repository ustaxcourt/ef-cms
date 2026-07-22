resource "aws_ecr_repository" "image_repository" {
  #checkov:skip=CKV_AWS_51: mutable tags required — blue/green deploys push and pull :latest; immutable tags would break the deployment pattern
  #checkov:skip=CKV_AWS_136: ECR default AES-256 encryption is sufficient — images are pre-built CI artifacts; KMS encryption not configured; CMK adds key rotation overhead without security benefit
  #checkov:skip=CKV_AWS_163: ECR native scanning disabled — container vulnerability scanning handled by Trivy in CI (security-containers.yml); redundant to enable both
  name = "ef-cms-us-east-1"
}

# TODO: This is not applying as we do not tag images with 'SNAPSHOT-' prefix anymore. 
resource "aws_ecr_lifecycle_policy" "repo_policy" {
  repository = aws_ecr_repository.image_repository.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 30 images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["SNAPSHOT-"],
                "countType": "imageCountMoreThan",
                "countNumber": 10
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
