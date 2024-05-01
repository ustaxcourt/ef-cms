resource "aws_wafv2_web_acl" "apis" {
  name  = "apis_${var.environment}"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "block_banned_ip_addresses"
    priority = 0

    action {
      block {}
    }

    statement {
      or_statement {
        statement {
          ip_set_reference_statement {
            arn = aws_wafv2_ip_set.banned_ipv4_ips.arn
          }
        }
        statement {
          ip_set_reference_statement {
            arn = aws_wafv2_ip_set.banned_ipv6_ips.arn
          }
        }
      }

    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "block_banned_ip_addresses_${var.environment}"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "per_ip_request_limit"
    priority = 1

    action {
      count {} // change to `block {}` when confident in ruleset
    }

    statement {
      rate_based_statement {
        limit              = 10000 // per 5 minutes
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "per_ip_request_limit_${var.environment}"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "per_ip_expensive_request_limit"
    priority = 2

    action {
      count {} // change to `block {}` when confident in ruleset
    }

    statement {
      rate_based_statement {
        limit              = 150 // per 5 minutes
        aggregate_key_type = "IP"

        scope_down_statement {
          regex_pattern_set_reference_statement {
            arn = aws_wafv2_regex_pattern_set.expensive_requests.arn

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 1
              type = "LOWERCASE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "per_ip_expensive_request_limit_${var.environment}"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "wafv2_${var.environment}"
    sampled_requests_enabled   = false
  }
}

resource "aws_wafv2_regex_pattern_set" "expensive_requests" {
  name = "expensive_requests_${var.environment}"
  scope = "REGIONAL"

  regular_expression {
    regex_string = "^/public-api/(order|opinion)-search"
  }
}

resource "aws_wafv2_ip_set" "banned_ipv4_ips" {
  name               = "banned_ipv4_ips_${var.environment}"
  scope              = "REGIONAL"
  ip_address_version = "IPV4"

  # in CIDR notation, /32 = only the single specified IPv4 address
  # this IP is a designated example IP and cannot match IPs in use
  addresses          = ["192.0.2.0/32"]

  lifecycle {
    # Instructs Terrraform not to remove banned IPs when running Terraform updates
    ignore_changes = [ addresses ]
  }
}

resource "aws_wafv2_ip_set" "banned_ipv6_ips" {
  name               = "banned_ipv6_ips_${var.environment}"
  scope              = "REGIONAL"
  ip_address_version = "IPV6"

  # in CIDR notation, /128 = only the single specified IPv6 address
  # this IP is a designated example IP and cannot match IPs in use
  addresses          = ["2001:0db8:0000:0000:0000:0000:0000:0000/128"]

  lifecycle {
    # Instructs Terrraform not to remove banned IPs when running Terraform updates
    ignore_changes = [ addresses ]
  }
}
