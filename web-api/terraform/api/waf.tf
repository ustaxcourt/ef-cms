resource "aws_wafv2_web_acl" "apis" {
  name  = "apis_${var.environment}_${var.current_color}"
  scope = "REGIONAL"

  default_action {
    allow {}
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
      metric_name                = "per_ip_request_limit_${var.environment}_${var.current_color}"
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
      metric_name                = "per_ip_expensive_request_limit_${var.environment}_${var.current_color}"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "wafv2_${var.environment}_${var.current_color}"
    sampled_requests_enabled   = false
  }
}

resource "aws_wafv2_regex_pattern_set" "expensive_requests" {
  name = "expensive_requests_${var.environment}_${var.current_color}"
  scope = "REGIONAL"

  regular_expression {
    regex_string = "^/public-api/(order|opinion)-search"
  }
}
