import { AUTOMATIC_BLOCKED_REASONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsPaperFiledPendingDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndServes';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { petitionsClerkVerifyEligibleCase } from './journey/petitionsClerkVerifyEligibleCase';
import { petitionsClerkVerifyNotEligibleCase } from './journey/petitionsClerkVerifyNotEligibleCase';

describe('Docket clerk verifies high priority case is not blocked', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      preferredTrialCity: 'Lubbock, Texas',
    });
    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsPaperFiledPendingDocketEntryAndServes(cerebralTest, 'EVID');

  it('verify that the high-priority case is not automaticBlocked', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail.automaticBlocked')).toBeFalsy();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkVerifyEligibleCase(cerebralTest);
  petitionsClerkUnprioritizesCase(cerebralTest);

  it('verify that the non-high-priority case is set to automaticBlocked', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail.automaticBlocked')).toBeTruthy();
    expect(cerebralTest.getState('caseDetail.automaticBlockedReason')).toBe(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
  });

  petitionsClerkVerifyNotEligibleCase(cerebralTest);
});
