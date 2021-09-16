import { admissionsClerkAddsUnverifiedEmailToPetitioner } from './journey/admissionsClerkAddsUnverifiedEmailToPetitioner';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  callCognitoTriggerForPendingEmail,
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { docketClerkQCsNoticeOfChange } from './journey/docketClerkQCsNoticeOfChange';
import { docketClerkViewsNoticeOfChangeOfAddress } from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const cerebralTest = setupTest();

describe('admissions clerk adds petitioner without existing cognito account to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'admissionsclerk@example.com');

  admissionsClerkAddsUnverifiedEmailToPetitioner({
    EMAIL_TO_ADD,
    cerebralTest,
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(cerebralTest.userId);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsNoticeOfChangeOfAddress({
    cerebralTest,
    documentTitle: 'Notice of Change of Email Address',
  });

  docketClerkQCsNoticeOfChange({
    cerebralTest,
    documentTitle: 'Notice of Change of Email Address',
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner email is no longer pending and service preference was updated to electronic', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    expect(contactPrimary.email).toEqual(EMAIL_TO_ADD);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
