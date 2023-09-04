data "aws_caller_identity" "current" {}

resource "aws_iam_user" "circle_ci" {
  name = "CircleCI"
}

resource "aws_iam_user_policy_attachment" "circle_ci_policy_attachment" {
  user       = aws_iam_user.circle_ci.name
  policy_arn = aws_iam_policy.circle_ci_policy.arn
}

resource "aws_iam_policy" "circle_ci_policy" {
  name = "circle_ci_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
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
      "Sid": "DynamoDb",
      "Effect": "Allow",
      "Action": [
        "dynamodb:ListTables",
        "dynamodb:ListTagsOfResource",
        "dynamodb:TagResource",
        "dynamodb:CreateBackup",
        "dynamodb:DeleteTable",
        "dynamodb:DescribeTimeToLive",
        "dynamodb:UpdateContinuousBackups",
        "dynamodb:ListStreams"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SQS",
      "Effect": "Allow",
      "Action": [
        "sqs:GetQueueAttributes",
        "sqs:ListQueueTags",
        "sqs:CreateQueue",
        "sqs:SetQueueAttributes",
        "sqs:SendMessageBatch",
        "sqs:SendMessage",
        "sqs:DeleteQueue"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Cognito",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminDisableUser",
        "cognito-idp:AdminEnableUser",
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminInitiateAuth",
        "cognito-idp:AdminRespondToAuthChallenge",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:CreateUserPool",
        "cognito-idp:CreateUserPoolClient",
        "cognito-idp:CreateUserPoolDomain",
        "cognito-idp:DeleteUserPoolDomain",
        "cognito-idp:DescribeUserPool",
        "cognito-idp:DescribeUserPoolClient",
        "cognito-idp:DescribeUserPoolDomain",
        "cognito-idp:GetUserPoolMfaConfig",
        "cognito-idp:ListUserPoolClients",
        "cognito-idp:ListUserPools",
        "cognito-idp:SetUICustomization",
        "cognito-idp:SetUserPoolMfaConfig",
        "cognito-idp:UpdateUserPool",
        "cognito-idp:UpdateUserPoolClient"
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
        "apigateway:HEAD",
        "apigateway:PUT",
        "apigateway:POST",
        "apigateway:SetWebACL"
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
        "logs:*",
        "events:*",
        "sns:*",
        "elasticloadbalancing:*",
        "es:*",
        "ec2:*",
        "ses:*",
        "s3:*",
        "cloudformation:*",
        "cloudwatch:*",
        "lambda:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DynamoDescribeLimits",
      "Effect": "Allow",
      "Action": [
        "dynamodb:DescribeLimits"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Sid": "DynamoGranular",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:BatchGetItem",
        "dynamodb:UpdateTable",
        "dynamodb:UpdateTimeToLive",
        "dynamodb:CreateGlobalTable",
        "dynamodb:DescribeContinuousBackups",
        "dynamodb:DescribeGlobalTable",
        "dynamodb:DescribeLimits",
        "dynamodb:DescribeStream",
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:UpdateItem",
        "dynamodb:ListStreams",
        "dynamodb:UpdateGlobalTable",
        "dynamodb:CreateTableReplica"
      ],
      "Resource": [
        "arn:aws:dynamodb::${data.aws_caller_identity.current.account_id}:global-table/efcms-*",
        "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-*",
        "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/efcms-*"
      ]
    },
    {
      "Sid": "IamGranular",
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:PassRole",
        "iam:GetRolePolicy",
        "iam:GetInstanceProfile",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:ListPolicyVersions",
        "iam:ListInstanceProfilesForRole",
        "iam:AddRoleToInstanceProfile",
        "iam:CreateServiceLinkedRole",
        "iam:ListAttachedRolePolicies",
        "iam:DeleteRolePolicy",
        "iam:DeleteRole"
      ],
      "Resource": [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/api_gateway_cloudwatch_global*",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-cases-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-case-documents-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-case-deadlines-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-case-notes-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:instance-profile/dynamsoft_role-*",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-documents-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-users-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ef-cms-work-items-*-lambdaRole",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/s3_replication_role_*",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/*"
      ]
    },
    {
      "Sid": "WAFv2",
      "Effect": "Allow",
      "Action": [
        "wafv2:*"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Sid": "SecretsManager",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:GetResourcePolicy",
        "secretsmanager:DescribeSecret",
        "secretsmanager:GetRandomPassword",
        "secretsmanager:ListSecretVersionIds"
      ],
      "Resource": [
        "arn:aws:secretsmanager:*:*:secret:*_deploy*"
      ]
    },
    {
      "Action": [
        "iam:CreateRole",
        "iam:PutRolePolicy",
        "iam:ListRolePolicies",
        "iam:AttachRolePolicy"
      ],
      "Resource": [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/clamav_fargate_execution_*",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/clamav_fargate_task_*"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "ecs:CreateCluster",
        "ecs:DescribeClusters",
        "ecs:RegisterTaskDefinition",
        "ecs:DescribeTaskDefinition",
        "ecs:DeregisterTaskDefinition",
        "ecs:CreateService",
        "ecs:DeleteCluster"
      ],
      "Resource": [
        "*"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
				"ssm:PutParameter",
				"ssm:LabelParameterVersion",
				"ssm:DeleteParameter",
				"ssm:DeleteParameters",
				"ssm:UnlabelParameterVersion",
        "ssm:ListTagsForResource",
				"ssm:DescribeParameters",
				"ssm:DescribeDocumentParameters",
				"ssm:GetParameterHistory",
				"ssm:GetParametersByPath",
				"ssm:GetParameters",
				"ssm:GetParameter"
      ],
      "Resource": "*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "ecs:DescribeServices",
        "ecs:UpdateService",
        "ecs:DeleteService"
      ],
      "Resource": [
        "arn:aws:ecs:us-east-1:${data.aws_caller_identity.current.account_id}:service/clamav_fargate_cluster_*/clamav_service_*"
      ],
      "Effect": "Allow"
    }
  ]
}

EOF
}
