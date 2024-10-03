resource "aws_ecr_repository" "docket_entry_zipper_repo" {
  name = "docket-entry-zipper-${var.environment}-${var.color}-${var.region}"
}

resource "aws_ecr_lifecycle_policy" "example" {
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
        "countNumber": 15,
        "tagPrefixList": [""]
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}
