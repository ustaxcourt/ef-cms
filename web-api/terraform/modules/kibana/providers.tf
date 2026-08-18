terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.60.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.4.0"
    }
  }
}
