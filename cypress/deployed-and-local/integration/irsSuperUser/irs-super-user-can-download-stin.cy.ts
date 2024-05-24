import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { TOTP } from 'totp-generator';
import { environment } from '../../../../web-api/src/environment';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import axios from 'axios';

//if local, skip this test

describe('irs superuser integration', async () => {
  const userName = 'ci_test_irs_super_user@example.com';
  let irsClientId: string, irsUserPoolId: string;
  let cognito: CognitoIdentityProvider;
  let idToken: string;

  //BEFORE!
  before(async () => {
    cognito = getCognitoClient();
    const result = await getIrsCognitoInfo({ cognito });
    ({ irsClientId, irsUserPoolId } = result);

    // Delete USER
    try {
      await cognito.adminDeleteUser({
        UserPoolId: irsUserPoolId,
        Username: userName,
      });
      console.log(`User deleted in before: ${userName}`);
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log('Did not delete user because: ', e);
    }

    const password = environment.defaultAccountPass;
    await createUserInIrsPool({
      cognito,
      irsUserPoolId,
      password,
      userName,
    });
    console.log(`hey you created a user: ${userName}`);
    ({ idToken } = await verifyUserAndGetIdToken({
      cognito,
      irsClientId,
      irsUserPoolId,
      password,
      userName,
    }));
  });

  after(async () => {
    // Delete USER
    try {
      await cognito.adminDeleteUser({
        UserPoolId: irsUserPoolId,
        Username: userName,
      });
      console.log(`User deleted in after: ${userName}`);
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log('Did not delete user because: ', e);
    }
  });
  it.only('should let an irs superuser view the reconciliation report and download a STIN', async () => {
    // loginAsPetitioner();
    // petitionerCreatesElectronicCase().then(docketNumber => {
    //   petitionsClerkQcsAndServesElectronicCase(docketNumber);
    // });
    // let foo = await getIrsCognitoInfo({ cognito });
    // expect(foo).to.exist;
    // expect(cognito).to.exist;

    await getReconciliationReport(idToken);
  });

  it('acts sanely during my sanity check', async () => {
    loginAsPetitioner();
    expect(getCypressEnv().accessKeyId).to.exist;
    expect(getCypressEnv().secretAccessKey).to.exist;
    expect(getCognitoClient()).to.exist;
    let userPools = await cognito.listUserPools({
      MaxResults: 50,
    });
    expect(userPools).to.exist;
    let foo = await getIrsCognitoInfo({ cognito });
    expect(foo).to.exist;
    console.log(foo.irsUserPoolId);
    console.log(JSON.stringify(foo));
  });
});

const getReconciliationReport = async (bearerToken: string) => {
  const url = `https://api-${Cypress.env('DEPLOYING_COLOR')}.${getCypressEnv().env}.ef-cms.ustaxcourt.gov/v2/reconciliation-report/today`;
  console.log('this is the url', url);
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  expect(response.status).to.equal(200);

  const { docketEntries } = response.data;

  // get document-download-url for STIN from case
  const { docketEntryId, docketNumber } = docketEntries.find(
    entry => entry.eventCode === 'STIN',
  );

  const docDownloadUrl = `https://api-${Cypress.env('DEPLOYING_COLOR')}.${getCypressEnv().env}.ef-cms.ustaxcourt.gov/v2/cases/${docketNumber}/entries/${docketEntryId}/document-download-url`;
  // get the download link for the stin
  const docDownloadUrlResponse = await axios.get(docDownloadUrl, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  expect(docDownloadUrlResponse.status).to.equal(200);

  // the stin link 200s
  const stinDocDownloadUrl = docDownloadUrlResponse.data.url;
  const stinDownloadUrlResponse = await axios.get(stinDocDownloadUrl, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  expect(stinDownloadUrlResponse.status).to.equal(200);
};

function getCognitoClient() {
  const cognito = new CognitoIdentityProvider({
    credentials: {
      accessKeyId: getCypressEnv().accessKeyId,
      secretAccessKey: getCypressEnv().secretAccessKey,
      sessionToken: getCypressEnv().sessionToken,
    },
    maxAttempts: 3,
    region: 'us-east-1',
  });

  return cognito;
}

async function getIrsCognitoInfo({
  cognito,
}: {
  cognito: CognitoIdentityProvider;
}): Promise<{ irsUserPoolId: string; irsClientId: string }> {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  const irsUserPoolId = results?.UserPools?.find(
    pool => pool.Name === `efcms-irs-${getCypressEnv().env}`,
  )?.Id;

  if (!irsUserPoolId) {
    throw new Error(
      `Could not get userPoolId for name: efcms-irs-${getCypressEnv().env}`,
    );
  }

  const userPoolClients = await cognito.listUserPoolClients({
    MaxResults: 20,
    UserPoolId: irsUserPoolId,
  });
  const irsClientId = userPoolClients?.UserPoolClients?.[0].ClientId;

  if (!irsClientId) {
    throw new Error(
      `Unable to find a client for the IRS Superuser pool: ${irsUserPoolId}`,
    );
  }

  return {
    irsClientId,
    irsUserPoolId,
  };
}

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

async function verifyUserAndGetIdToken({
  cognito,
  irsClientId,
  irsUserPoolId,
  password,
  userName,
}: {
  cognito: CognitoIdentityProvider;
  password: string;
  userName: string;
  irsClientId: any;
  irsUserPoolId: string;
}): Promise<{ idToken: string }> {
  const initiateAuthResult = await cognito.adminInitiateAuth({
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    AuthParameters: {
      PASSWORD: password,
      USERNAME: userName,
    },
    ClientId: irsClientId,
    UserPoolId: irsUserPoolId,
  });
  const associateResult = await cognito.associateSoftwareToken({
    Session: initiateAuthResult.Session,
  });
  if (!associateResult.SecretCode) {
    throw new Error('Could not generate Secret Code');
  }
  const { otp } = TOTP.generate(associateResult.SecretCode);
  const verifyTokenResult = await cognito.verifySoftwareToken({
    Session: associateResult.Session,
    UserCode: otp,
  });
  const challengeResponse = await cognito.respondToAuthChallenge({
    ChallengeName: ChallengeNameType.MFA_SETUP,
    ChallengeResponses: {
      USERNAME: userName,
    },
    ClientId: irsClientId,
    Session: verifyTokenResult.Session,
  });
  if (!challengeResponse.AuthenticationResult?.IdToken) {
    throw new Error('An ID token was not generated for the IRS Superuser.');
  }
  return { idToken: challengeResponse.AuthenticationResult?.IdToken };
}
