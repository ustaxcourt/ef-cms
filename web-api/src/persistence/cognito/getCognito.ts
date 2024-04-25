import {
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  CognitoIdentityProvider,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { HttpHandlerOptions } from '@smithy/types';

let cognitoClientCache: CognitoIdentityProvider;

export function getCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityProvider({
      maxAttempts: 3,
      region: 'us-east-1',
    });
  }

  return cognitoClientCache;
}

export function getLocalCognito() {
  // KNOWN BUGS:
  // - users in a FORCE_CHANGE_PASSWORD state will get a new password challenge when authenticating even if the wrong password is entered
  // - respondToAuthChallenge does not associate tokens returned in authenticationResult on the user; cannot refresh app _immediately_ after changing password

  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityProvider({
      endpoint: 'http://localhost:9229/',
      maxAttempts: 3,
      region: 'local',
    });

    // Cognito local does NOT support adminCreateUser with "MessageAction: 'RESEND'" argument.
    // Here we stub out adminCreateUser locally IF it is being called with "MessageAction: 'RESEND'".
    const originalAdminCreateUser: (
      args: AdminCreateUserCommandInput,
      options?: HttpHandlerOptions | undefined,
    ) => Promise<AdminCreateUserCommandOutput> =
      cognitoClientCache.adminCreateUser;

    cognitoClientCache.adminCreateUser = async function (
      args: AdminCreateUserCommandInput,
    ): Promise<AdminCreateUserCommandOutput> {
      if (args.MessageAction === MessageActionType.RESEND) {
        return {
          $metadata: {},
        };
      }

      return originalAdminCreateUser.call(this, args);
    };
  }

  return cognitoClientCache;
}
