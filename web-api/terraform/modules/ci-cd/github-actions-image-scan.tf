# Read-only access for GitHub Actions to pull this account's deployed images and scan them.
# Created only in accounts that set github_image_scan_environment.

locals {
  github_image_scan_enabled = var.github_image_scan_environment != null
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  count = local.github_image_scan_enabled ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_policy_document" "github_actions_image_scan_trust" {
  count = local.github_image_scan_enabled ? 1 : 0

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions[0].arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Exact match on purpose: only jobs that run in this one GitHub Environment can assume the role.
    # The environment's branch rule (staging only) keeps pull requests and forks out.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:environment:${var.github_image_scan_environment}"]
    }
  }
}

resource "aws_iam_role" "github_actions_image_scan" {
  count = local.github_image_scan_enabled ? 1 : 0

  name               = "github_actions_image_scan"
  description        = "Assumed by GitHub Actions to pull deployed images for vulnerability scans. Read-only."
  assume_role_policy = data.aws_iam_policy_document.github_actions_image_scan_trust[0].json
}

data "aws_iam_policy_document" "github_actions_image_scan" {
  count = local.github_image_scan_enabled ? 1 : 0

  # AWS does not support limiting GetAuthorizationToken to a repository. The token it returns only
  # allows what the statements below allow.
  statement {
    sid       = "EcrLogin"
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid    = "EcrPullDeployedImages"
    effect = "Allow"
    actions = [
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [
      "arn:aws:ecr:us-east-1:${data.aws_caller_identity.current.account_id}:repository/ef-cms-us-east-1",
      "arn:aws:ecr:us-east-1:${data.aws_caller_identity.current.account_id}:repository/docket-entry-zipper-*-us-east-1",
    ]
  }

  # The live color says which docket-entry-zipper repository the Batch job runs.
  statement {
    sid       = "ReadCurrentColor"
    effect    = "Allow"
    actions   = ["ssm:GetParameter"]
    resources = ["arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/DAWSON/*/current-color"]
  }
}

resource "aws_iam_policy" "github_actions_image_scan" {
  count = local.github_image_scan_enabled ? 1 : 0

  name   = "github_actions_image_scan_policy"
  policy = data.aws_iam_policy_document.github_actions_image_scan[0].json
}

resource "aws_iam_role_policy_attachment" "github_actions_image_scan" {
  count = local.github_image_scan_enabled ? 1 : 0

  role       = aws_iam_role.github_actions_image_scan[0].name
  policy_arn = aws_iam_policy.github_actions_image_scan[0].arn
}
