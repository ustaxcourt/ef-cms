terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.34.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.3.2"
    }
  }
}
