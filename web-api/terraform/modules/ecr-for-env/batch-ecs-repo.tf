resource "aws_ecr_repository" "docket_entry_zipper_repo" {
  name = "docket-entry-zipp`r-${var.environment}-${var.color}-${var.region}"
}

# TODO: This is not applying as we do not tag images with 'SNAPSHOT-' prefix anymore. 
resource "aws_ecr_lifecycle_policy" "repo_policy" {
  repository = aws_ecr_repository.docket_entry_zipper_repo.name

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
