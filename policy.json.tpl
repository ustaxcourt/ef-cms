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
        "dynamodb:DescribeLimits"
      ],
      "Resource": [
        "arn:aws:dynamodb::ACCOUNT_ID:global-table/efcms-*",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/efcms-*",
        "arn:aws:dynamodb:us-west-1:ACCOUNT_ID:table/efcms-*"
      ]
    },
    {
      "Sid": "IamGranular",
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:PutRolePolicy",
        "iam:PassRole",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "iam:GetInstanceProfile",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:ListPolicyVersions",
        "iam:DeletePolicy",
        "iam:DeleteInstanceProfile",
        "iam:ListInstanceProfilesForRole",
        "iam:AddRoleToInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:ListAttachedRolePolicies"
      ],
      "Resource": [
        "arn:aws:iam::ACCOUNT_ID:role/api_gateway_cloudwatch_global_*",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-cases-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-case-documents-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-case-deadlines-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-case-notes-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:instance-profile/dynamsoft_role-*",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-documents-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-users-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-work-items-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/s3_replication_role_*",
        "arn:aws:iam::ACCOUNT_ID:role/*"
      ]
    }
  ]
}
