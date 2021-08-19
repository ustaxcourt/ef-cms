import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest } from './helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);
const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

const cerebralTest = setupTest();

describe('Adds automatic block case to trial', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  const overrides = {
    trialLocation,
  };

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, trialLocation);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  // automatic block with a due date
  petitionsClerkCreatesACaseDeadline(cerebralTest);
  cerebralTest.casesReadyForTrial = [];
  petitionsClerkManuallyAddsCaseToTrial(cerebralTest);

  it('should be able to add a trial session to an automatically blocked case', () => {
    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });
    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showBlockedTag).toBeTruthy();
    expect(formattedCase.automaticBlocked).toBeTruthy();
  });
});
