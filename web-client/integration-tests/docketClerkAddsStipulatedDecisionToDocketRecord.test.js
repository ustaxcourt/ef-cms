import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsStipulatedDecisionDocketEntryFromOrder } from './journey/docketClerkAddsStipulatedDecisionDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Stipulated Decision to Docket Record', () => {
  const { STIPULATED_DECISION_EVENT_CODE } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 0);
  docketClerkSignsOrder(test, 0);
  docketClerkAddsStipulatedDecisionDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);

  loginAs(test, 'petitioner@example.com');
  it('petitioner views Stipulated Decision on docket record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const stipulatedDecisionDocument = formattedCase.formattedDocketEntries.find(
      document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
    );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(true);
  });

  loginAs(test, 'privatePractitioner@example.com');
  it('unassociated privatePractitioner views Stipulated Decision on docket record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const stipulatedDecisionDocument = formattedCase.formattedDocketEntries.find(
      document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
    );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(false);
  });
});
