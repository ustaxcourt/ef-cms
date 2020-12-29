aws cognito-idp --region "us-east-1" add-custom-attributes --user-pool-id "" --custom-attributes Name="userId",AttributeDataType=String,Mutable=true,Required=false,StringAttributeConstraints="{MinLength=0,MaxLength=255}"

terraform state rm module.ef-cms_apis.aws_cognito_user_pool.pool

terraform import module.ef-cms_apis.aws_cognito_user_pool.pool <ARN>