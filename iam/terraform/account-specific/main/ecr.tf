resource "aws_ecr_repository" "image_repository" {
  name = "ef-cms-us-east-1"

}

# keep the last 10 images
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

resource "aws_ecrpublic_repository" "public_image_repository" {
  repository_name = "ef-cms-us-east-1-public-images"
}