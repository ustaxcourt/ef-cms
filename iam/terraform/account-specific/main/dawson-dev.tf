data "aws_iam_policy_document" "trust_policy_document" {

  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "AWS"
      identifiers = var.dawson_dev_trusted_role_arns
    }
    effect = "Allow"
  }
}

resource "aws_iam_role" "dawson_dev" {
  name = "dawson_dev"
  assume_role_policy = data.aws_iam_policy_document.trust_policy_document.json
}

resource "aws_iam_role_policy_attachment" "dawson_dev_policy_attachment" {
  role       = aws_iam_role.dawson_dev.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_policy" "dawson_dev_policy" {
  name = "dawson_dev_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Cognito",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Elasticsearch",
      "Effect": "Allow",
      "Action": [
        "es:*"
      ],
      "Resource": [
        "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/efcms-search-*",
        "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/info"
      ]
    },
    {
      "Sid": "ESGlobal",
      "Effect": "Allow",
      "Action": [
        "es:DescribeReservedElasticsearchInstanceOfferings",
        "es:ListElasticsearchInstanceTypeDetails",
        "es:CreateElasticsearchServiceRole",
        "es:RejectInboundCrossClusterSearchConnection",
        "es:PurchaseReservedElasticsearchInstanceOffering",
        "es:DeleteElasticsearchServiceRole",
        "es:AcceptInboundCrossClusterSearchConnection",
        "es:DescribeInboundCrossClusterSearchConnections",
        "es:DescribeReservedElasticsearchInstances",
        "es:ListDomainNames",
        "es:DeleteInboundCrossClusterSearchConnection",
        "es:ListElasticsearchInstanceTypes",
        "es:DescribeOutboundCrossClusterSearchConnections",
        "es:ListElasticsearchVersions",
        "es:DescribeElasticsearchInstanceTypeLimits",
        "es:DescribeElasticsearchDomains",
        "es:DeleteOutboundCrossClusterSearchConnection"
      ],
      "Resource": "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:*"
    },
    {
      "Sid": "Route53",
      "Effect": "Allow",
      "Action": [
        "route53:GetChange",
        "route53:GetHostedZone",
        "route53:ListResourceRecordSets",
        "route53:ListHostedZones",
        "route53:ChangeResourceRecordSets",
        "route53:ListTagsForResource",
        "route53:ListHostedZonesByName",
        "route53:CreateHealthCheck",
        "route53:DeleteHealthCheck",
        "route53:GetHealthCheck",
        "route53:ListHealthChecks",
        "route53:UpdateHealthCheck"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ApiGateway",
      "Effect": "Allow",
      "Action": [
        "apigateway:DELETE",
        "apigateway:UpdateRestApiPolicy",
        "apigateway:PATCH",
        "apigateway:GET",
        "apigateway:PUT",
        "apigateway:POST"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Acm",
      "Effect": "Allow",
      "Action": [
        "acm:RequestCertificate",
        "acm:ListCertificates",
        "acm:AddTagsToCertificate",
        "acm:ListTagsForCertificate",
        "acm:DescribeCertificate",
        "acm:DeleteCertificate"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Ecr",
      "Effect": "Allow",
      "Action": [
          "ecr:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:GetDistribution",
        "cloudfront:TagResource",
        "cloudfront:CreateDistribution",
        "cloudfront:ListTagsForResource",
        "cloudfront:UpdateDistribution",
        "cloudfront:CreateCloudFrontOriginAccessIdentity",
        "cloudfront:GetCloudFrontOriginAccessIdentity",
        "cloudfront:DeleteCloudFrontOriginAccessIdentity",
        "cloudfront:ListDistributions",
        "cloudfront:GetDistributionConfig",
        "cloudfront:DeleteDistribution"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Other",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:*",
        "dynamodb:*",
        "ec2:*",
        "elasticloadbalancing:*",
        "events:*",
        "lambda:*",
        "logs:*",
        "s3:*",
        "ses:*",
        "sns:*",
        "sqs:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Secrets",
      "Effect": "Allow",
      "Action": "secretsmanager:*",
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:exp3_deploy*",
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:exp2_deploy*",
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:exp1_deploy*",
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:dev_deploy*",
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:stg_deploy*",
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:irs_deploy*",
        "arn:aws:secretsmanager:us-east-1:${data.aws_caller_identity.current.account_id}:secret:test_deploy*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "secretsmanager:ListSecrets",
      "Resource": "*"
    }
  ]
}

EOF
}
