terraform {
  backend "s3" {
    bucket = "ustc-case-mgmt.flexion.us.terraform.deploys"
    key    = "rachel-zach-delete-me.tfstate"
    region = "us-east-1"
    dynamodb_table = "efcms-terraform-lock"
  }

  required_providers {
    aws = "5.47.0"
  }
}

module "sqs_queue_mod" {
 source = "./modules/sqs"
}
