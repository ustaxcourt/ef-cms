provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "5.47.0"
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}

provider "opensearch" {
  url = "https://${aws_opensearch_domain.efcms-logs.endpoint}"
}

module "health-alarms-east" {
  source = "../../modules/health-alarms"
  providers = {
    aws = aws.us-east-1
  }
}

# module "health-alarms-west" {
#   source = "../../modules/reindex-cron"
# }
