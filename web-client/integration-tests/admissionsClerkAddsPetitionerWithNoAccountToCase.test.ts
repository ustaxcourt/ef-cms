import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { admissionsClerkAddsUnverifiedEmailToPetitioner } from './journey/admissionsClerkAddsUnverifiedEmailToPetitioner';
import {
  callCognitoTriggerForPendingEmail,
  contactPrimaryFromState,
  loginAs,
  setupTest,
} from './helpers';
import { docketClerkQCsNoticeOfChange } from './journey/docketClerkQCsNoticeOfChange';
import { docketClerkViewsNoticeOfChangeOfAddress } from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

// TODO 10007. Transision to Cypress
describe.skip('admissions clerk adds petitioner without existing cognito account to case', () => {
  const cerebralTest = setupTest();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

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
