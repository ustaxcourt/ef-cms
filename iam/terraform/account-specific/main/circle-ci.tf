data "aws_caller_identity" "current" {}


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
        "route53:ChangeResourceRecordSets"
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
        "dynamodb:DescribeTimeToLive",
        "dynamodb:UpdateContinuousBackups"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Cognito",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:UpdateUserPoolClient",
        "cognito-idp:CreateUserPool",
        "cognito-idp:AdminRespondToAuthChallenge",
        "cognito-idp:AdminConfirmSignUp",
        "cognito-idp:DescribeUserPool",
        "cognito-idp:CreateUserPoolDomain",
        "cognito-idp:UpdateUserPool",
        "cognito-idp:DescribeUserPoolClient",
        "cognito-idp:AdminInitiateAuth",
        "cognito-idp:SignUp",
        "cognito-idp:ListUserPools",
        "cognito-idp:ListUserPoolClients",
        "cognito-idp:CreateUserPoolClient",
        "cognito-idp:DescribeUserPoolDomain",
        "cognito-idp:SetUICustomization",
        "cognito-idp:DeleteUserPoolDomain"
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
        "acm:DescribeCertificate"
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
        "cloudfront:DeleteCloudFrontOriginAccessIdentity"
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
        "dynamodb:ListStreams"
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
        "iam:ListAttachedRolePolicies"
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
    }
  ]
}

EOF
}