terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
       version = "~> 5.100.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}
