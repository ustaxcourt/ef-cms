import users from '../web-api/storage/fixtures/seed/users.json';
import fs from 'fs';
import path from 'path';

type CognitoLocalJSON = {
  Users: {
    [email: string]: {
      Username: string;
      Password: string;
      Attributes: Array<{
        Name: string;
        Value: string;
      }>;
      Enabled: boolean;
      UserStatus: string;
      UserCreateDate: string;
      UserLastModifiedDate: string;
      RefreshTokens: Array<string>;
    };
  };
  Options: {
    Policies: {
      PasswordPolicy: {
        MinimumLength: number;
        RequireUppercase: boolean;
        RequireLowercase: boolean;
        RequireNumbers: boolean;
        RequireSymbols: boolean;
        TemporaryPasswordValidityDays: number;
      };
    };
    LambdaConfig: {
      endpoint: string;
    };
    SchemaAttributes: Array<{
      Name: string;
      AttributeDataType: string;
      DeveloperOnlyAttribute: boolean;
      Mutable: boolean;
      Required: boolean;
      StringAttributeConstraints?: {
        MinLength: string;
        MaxLength: string;
      };
      NumberAttributeConstraints?: {
        MinValue: string;
      };
    }>;
    VerificationMessageTemplate: {
      DefaultEmailOption: string;
    };
    MfaConfiguration: string;
    EstimatedNumberOfUsers: number;
    EmailConfiguration: {
      EmailSendingAccount: string;
    };
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: boolean;
      UnusedAccountValidityDays: number;
    };
    UsernameAttributes: Array<string>;
    Arn: string;
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    Name: string;
  };
};

const cognitoLocalJSON: CognitoLocalJSON = {
  Options: {
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8,
        RequireUppercase: true,
        RequireLowercase: true,
        RequireNumbers: true,
        RequireSymbols: true,
        TemporaryPasswordValidityDays: 7,
      },
    },
    LambdaConfig: {
      endpoint: 'http://localhost:9991',
    },
    SchemaAttributes: [
      {
        Name: 'sub',
        AttributeDataType: 'String',
        DeveloperOnlyAttribute: false,
        Mutable: false,
        Required: true,
        StringAttributeConstraints: {
          MinLength: '1',
          MaxLength: '2048',
        },
      },
      {
        Name: 'custom:name',
        AttributeDataType: 'String',
        DeveloperOnlyAttribute: false,
        Mutable: true,
        Required: true,
        StringAttributeConstraints: {
          MinLength: '0',
          MaxLength: '2048',
        },
      },
      {
        Name: 'email',
        AttributeDataType: 'String',
        DeveloperOnlyAttribute: false,
        Mutable: true,
        Required: false,
        StringAttributeConstraints: {
          MinLength: '0',
          MaxLength: '2048',
        },
      },
      {
        Name: 'email_verified',
        AttributeDataType: 'Boolean',
        DeveloperOnlyAttribute: false,
        Mutable: true,
        Required: false,
      },
      {
        Name: 'updated_at',
        AttributeDataType: 'Number',
        DeveloperOnlyAttribute: false,
        Mutable: true,
        Required: false,
        NumberAttributeConstraints: {
          MinValue: '0',
        },
      },
      {
        Name: 'custom:role',
        AttributeDataType: 'String',
        DeveloperOnlyAttribute: false,
        Mutable: true,
        Required: false,
        NumberAttributeConstraints: {
          MinValue: '0',
        },
        StringAttributeConstraints: {
          MinLength: '0',
          MaxLength: '255',
        },
      },
      {
        Name: 'custom:userId',
        AttributeDataType: 'String',
        DeveloperOnlyAttribute: false,
        Mutable: true,
        Required: false,
        StringAttributeConstraints: {
          MinLength: '0',
          MaxLength: '255',
        },
      },
    ],
    VerificationMessageTemplate: {
      DefaultEmailOption: 'CONFIRM_WITH_CODE',
    },
    MfaConfiguration: 'OFF',
    EstimatedNumberOfUsers: 0,
    EmailConfiguration: {
      EmailSendingAccount: 'COGNITO_DEFAULT',
    },
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: false,
      UnusedAccountValidityDays: 7,
    },
    UsernameAttributes: ['email'],
    Arn: 'arn:aws:cognito-idp:local:local:userpool/local_2pHzece7',
    CreationDate: '2023-01-24T22:34:48.100Z',
    Id: 'local_2pHzece7',
    LastModifiedDate: '2023-01-24T22:34:48.100Z',
    Name: 'efcms-local',
  },
  Users: {},
};

users.forEach(user => {
  cognitoLocalJSON.Users[user.email] = {
    Username: user.email,
    Password: 'Testing1234$',
    Attributes: [
      {
        Name: 'sub',
        Value: user.userId,
      },
      {
        Name: 'custom:userId',
        Value: user.userId,
      },
      {
        Name: 'email',
        Value: user.email,
      },
      {
        Name: 'email_verified',
        Value: 'True',
      },
      {
        Name: 'custom:role',
        Value: user.role,
      },
      {
        Name: 'custom:name',
        Value: user.name,
      },
    ],
    Enabled: false,
    UserStatus: 'CONFIRMED',
    UserCreateDate: '2023-01-24T23:54:42.392Z',
    UserLastModifiedDate: '2023-02-21T18:41:41.466Z',
    RefreshTokens: [],
  };
});

const filePath = path.join(__dirname, 'db/local_2pHzece7.json');
fs.writeFileSync(filePath, JSON.stringify(cognitoLocalJSON), 'utf-8');
