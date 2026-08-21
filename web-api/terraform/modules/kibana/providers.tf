terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.58.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.4.0"
    }
  }
}
