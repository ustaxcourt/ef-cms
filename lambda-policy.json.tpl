{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:ACCOUNT_ID:log-group:/aws/lambda/ef-cms-*:*",
                "arn:aws:logs:us-east-1:ACCOUNT_ID:log-group:/aws/lambda/ef-cms-*:*:*",
                "arn:aws:logs:us-west-1:ACCOUNT_ID:log-group:/aws/lambda/ef-cms-*:*",
                "arn:aws:logs:us-west-1:ACCOUNT_ID:log-group:/aws/lambda/ef-cms-*:*:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "arn:aws:lambda:us-east-1:ACCOUNT_ID:function:*",
                "arn:aws:lambda:us-west-1:ACCOUNT_ID:function:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "cognito-idp:*"
            ],
            "Resource": [
                "arn:aws:cognito-idp:us-east-1:ACCOUNT_ID:userpool/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:*"
            ],
            "Resource": "arn:aws:s3:::*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "dynamodb:*"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/*",
                "arn:aws:dynamodb:us-west-1:ACCOUNT_ID:table/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "ses:*"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "es:*"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "execute-api:Invoke",
                "execute-api:ManageConnections"
            ],
            "Resource": [
                "arn:aws:execute-api:us-east-1:ACCOUNT_ID:*",
                "arn:aws:execute-api:us-west-1:ACCOUNT_ID:*"
            ],
            "Effect": "Allow"
        }
    ]
}