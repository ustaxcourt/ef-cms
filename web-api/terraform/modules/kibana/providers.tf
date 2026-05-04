terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.42.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.3.2"
    }
  }
}
