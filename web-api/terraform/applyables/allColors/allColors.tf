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
    aws = "5.61.0"
  }
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

module "ef-cms_apis" {
  source                = "../../modules/everything-else-deprecated"
  active_ses_ruleset    = var.active_ses_ruleset
  alert_sns_topic_arn   = data.aws_sns_topic.system_health_alarms.arn
  cognito_suffix        = var.cognito_suffix
  dns_domain            = var.dns_domain
  email_dmarc_policy    = var.email_dmarc_policy
  enable_health_checks  = var.enable_health_checks
  environment           = var.environment
  es_instance_count     = var.es_instance_count
  es_instance_type      = var.es_instance_type
  es_volume_size        = var.es_volume_size
  lower_env_account_id  = var.lower_env_account_id
  prod_env_account_id   = var.prod_env_account_id
  should_es_alpha_exist = var.should_es_alpha_exist
  should_es_beta_exist  = var.should_es_beta_exist
  zone_name             = var.zone_name
}

module "ui-public-certificate" {
  source                    = "../../modules/certificates"
  domain_name               = var.dns_domain
  hosted_zone_name          = "${var.zone_name}."
  subject_alternative_names = ["*.${var.dns_domain}"]
  certificate_name          = var.dns_domain
  environment               = var.environment
  description               = "Certificate for public facing ${var.dns_domain}"
  product_domain            = "EFCMS"
}

module "ui-public-www-redirect" {
  source                 = "../../modules/ui-public-www-redirect"
  dns_domain             = var.dns_domain
  environment            = var.environment
  zone_name              = var.zone_name
  public_certificate_arn = module.ui-public-certificate.acm_certificate_arn
  viewer_protocol_policy = var.viewer_protocol_policy
}

module "dynamsoft_us_east" {
  source = "../../modules/dynamsoft"
  count  = var.is_dynamsoft_enabled
  providers = {
    aws = aws.us-east-1
  }

  region                 = "us-east-1"
  environment            = var.environment
  dns_domain             = var.dns_domain
  zone_name              = var.zone_name
  ami                    = "ami-0a313d6098716f372"
  availability_zones     = ["us-east-1a"]
  dynamsoft_s3_zip_path  = var.dynamsoft_s3_zip_path
  dynamsoft_url          = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}

module "dynamsoft_us_west" {
  source = "../../modules/dynamsoft"
  count  = var.is_dynamsoft_enabled
  providers = {
    aws = aws.us-west-1
  }

  region                 = "us-west-1"
  environment            = var.environment
  dns_domain             = var.dns_domain
  zone_name              = var.zone_name
  ami                    = "ami-06397100adf427136"
  availability_zones     = ["us-west-1a"]
  dynamsoft_s3_zip_path  = var.dynamsoft_s3_zip_path
  dynamsoft_url          = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}

module "public-ui-healthcheck" {
  source     = "../../modules/ui-healthcheck"
  count      = var.enable_health_checks
  alarm_name = "${var.dns_domain} is accessible over HTTPS"
  dns_domain = var.dns_domain
}

module "ui-healthcheck" {
  source     = "../../modules/ui-healthcheck"
  count      = var.enable_health_checks
  alarm_name = "app.${var.dns_domain} is accessible over HTTPS"
  dns_domain = "app.${var.dns_domain}"
}

module "vpc_west" {
  source            = "../../modules/vpc"
  environment       = var.environment
  providers = {
    aws = aws.us-west-1
  }
  zone_a = "us-west-1a"
  zone_b = "us-west-1c"
  cidr_block = "10.1.0.0/16"
  subnet_a_block = "10.1.4.0/24"
  subnet_b_block = "10.1.5.0/24"
  nat_subnet_block = "10.1.6.0/24"
  nat_zone = "us-west-1a"
}

module "vpc_east" {
  source            = "../../modules/vpc"
  environment       = var.environment
  providers = {
    aws = aws.us-east-1
  }
  zone_a = "us-east-1a"
  zone_b = "us-east-1b"
  cidr_block = "10.0.0.0/16"
  subnet_a_block = "10.0.4.0/24"
  subnet_b_block = "10.0.5.0/24"
  nat_subnet_block = "10.0.6.0/24"
  nat_zone = "us-east-1a"
}

resource "aws_security_group" "east_security_group" {
  name        = "${var.environment}-east-security-group"
  vpc_id      = module.vpc_east.vpc_id

  egress {
    description      = "Allow all outbound traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"  # -1 means all protocols
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "west_security_group" {
  name        = "${var.environment}-west-security-group"
  vpc_id      = module.vpc_west.vpc_id
  provider = aws.us-west-1

  egress {
    description      = "Allow all outbound traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"  # -1 means all protocols
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

resource "aws_vpc_peering_connection" "peer" {
  peer_vpc_id = module.vpc_west.vpc_id
  vpc_id      = module.vpc_east.vpc_id
  peer_region = "us-west-1"
}

resource "aws_vpc_peering_connection_accepter" "peer_accepter" {
  vpc_peering_connection_id = aws_vpc_peering_connection.peer.id
  auto_accept               = true
  provider = aws.us-west-1
}

resource "aws_db_subnet_group" "group" {
  name       = "${var.environment}-group"
  subnet_ids = [module.vpc_east.subnet_a_id, module.vpc_east.subnet_b_id]
}

module "rds" {
  source            = "../../modules/rds"
  environment       = var.environment
  postgres_user     = var.postgres_user
  postgres_password = var.postgres_password
  vpc_id = module.vpc_east.vpc_id
  subnet_group_name = aws_db_subnet_group.group.name
  security_group_ids = [
    aws_security_group.east_security_group.id, 
  ]
}


module "tunnel" {
  source            = "../../modules/tunnel"
  environment       = var.environment
  vpc_id = module.vpc_east.vpc_id
  subnet_id = module.vpc_east.public_subnet
  public_key_name = var.tunnel_key_name
}

