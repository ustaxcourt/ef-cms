import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
// import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { environment } from '../../../../web-api/src/environment';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
//if local, skip this test

describe('irs superuser integration', async () => {
  //   const userName = 'ci_test_irs_super_user@example.com';
  //   let irsClientId: string, irsUserPoolId: string;

  //BEFORE!
  before(async () => {});
  it('should let an irs superuser view the reconciliation report and download a STIN', async () => {
    let cognito = getCognitoClient();
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
    });
    let foo = await getIrsCognitoInfo({ cognito });
    expect(foo).to.exist;
    expect(cognito).to.exist;
  });

  it('acts sanely during my sanity check', async () => {
    loginAsPetitioner();
    let cognito = getCognitoClient();
    expect(getCypressEnv().accessKeyId).to.exist;
    expect(getCypressEnv().secretAccessKey).to.exist;
    expect(getCognitoClient()).to.exist;
    let userPools = await cognito.listUserPools({
      MaxResults: 50,
    });
    expect(userPools).to.exist;
  });
});

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
    pool => pool.Name === `efcms-irs-${environment.stage}`,
  )?.Id;

  if (!irsUserPoolId) {
    throw new Error('Could not get userPoolId');
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
