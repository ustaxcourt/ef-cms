import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import {
  createUserInIrsPool,
  getIrsCognitoInfo,
  verifyUserAndGetIdToken,
} from '../../../../web-api/hostedEnvironmentTests/irsSuperUser.test';
import { environment } from '../../../../web-api/src/environment';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';

//if local, skip this test

describe('irs superuser integration', async () => {
  const userName = 'ci_test_irs_super_user@example.com';
  const cognito = new CognitoIdentityProvider({
    maxAttempts: 3,
    region: 'us-east-1',
  });
  let irsClientId: string, irsUserPoolId: string;

  //BEFORE!
  before(async () => {
    Cypress.env('DEPLOYING_COLOR', 'blue');
    const result = await getIrsCognitoInfo({ cognito });
    irsClientId = result.irsClientId;
    irsUserPoolId = result.irsUserPoolId;

    // Delete USER
    try {
      await cognito.adminDeleteUser({
        UserPoolId: irsUserPoolId,
        Username: userName,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  });

  it('should let an irs superuser view the reconciliation report and download a STIN', async () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
    });
    const password = environment.defaultAccountPass;
    createUserInIrsPool({ cognito, irsUserPoolId, password, userName });
    const { idToken } = await verifyUserAndGetIdToken({
      cognito,
      irsClientId,
      irsUserPoolId,
      password,
      userName,
    });

    console.log('THIS IS THE BERER ID TOKEN', idToken);
  });
});

async function createUserInIrsPool({
  cognito,
  irsUserPoolId,
  password,
  userName,
}: {
  cognito: CognitoIdentityProvider;
  userName: string;
  password: string;
  irsUserPoolId: string;
}): Promise<void> {
  await cognito.adminCreateUser({
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: 'custom:role',
        Value: ROLES.irsSuperuser,
      },
      {
        Name: 'email',
        Value: userName,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: irsUserPoolId,
    Username: userName,
  });
  await cognito.adminSetUserPassword({
    Password: password,
    Permanent: true,
    UserPoolId: irsUserPoolId,
    Username: userName,
  });
}
