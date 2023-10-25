import { PARTIES_CODES } from '../../shared/src/business/entities/EntityConstants';
import { chambersViewsTrialSessionWorkingCopy } from './journey/chambersViewsTrialSessionWorkingCopy';
import { docketClerkAddsPretrialMemorandumToCase } from './journey/docketClerkAddsPretrialMemorandumToCase';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { manuallyAddCaseToTrial } from './utils/manuallyAddCaseToTrial';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Chambers dashboard', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    cerebralTest.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'colvinschambers@example.com');
  chambersViewsTrialSessionWorkingCopy(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesARemoteTrialSession(cerebralTest);

  for (let i = 1; i <= 4; i++) {
    loginAs(cerebralTest, 'petitioner@example.com');
    it(`Creates case ${i} and adds to trial session`, async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest[`docketNumber${i}`] = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    manuallyAddCaseToTrial(cerebralTest, `${i}`);
  }

  docketClerkAddsPretrialMemorandumToCase(cerebralTest, {
    caseNumber: 1,
    filedByPetitioner: true,
    filedByPractitioner: false,
  });

  docketClerkAddsPretrialMemorandumToCase(cerebralTest, {
    caseNumber: 2,
    filedByPetitioner: false,
    filedByPractitioner: true,
  });

  docketClerkAddsPretrialMemorandumToCase(cerebralTest, {
    caseNumber: 3,
    filedByPetitioner: true,
    filedByPractitioner: true,
  });

  loginAs(cerebralTest, 'cohenschambers@example.com');
  it('chambers user verifies PTM column and value for cases', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    const caseWithPtmFiledByPetitioner = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber1,
    );
    expect(caseWithPtmFiledByPetitioner.filingPartiesCode).toBe(
      PARTIES_CODES.PETITIONER,
    );

    const caseWithPtmFiledByRespondent = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber2,
    );
    expect(caseWithPtmFiledByRespondent.filingPartiesCode).toBe(
      PARTIES_CODES.RESPONDENT,
    );

    const caseWithPtmFiledByBoth = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber3,
    );
    expect(caseWithPtmFiledByBoth.filingPartiesCode).toBe(PARTIES_CODES.BOTH);

    const caseWithoutPtm = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber4,
    );
    expect(caseWithoutPtm.filingPartiesCode).toEqual('');
  });
});
