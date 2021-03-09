import { AUTOMATIC_BLOCKED_REASONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsPaperFiledPendingDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndServes';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { petitionsClerkVerifyEligibleCase } from './journey/petitionsClerkVerifyEligibleCase';
import { petitionsClerkVerifyNotEligibleCase } from './journey/petitionsClerkVerifyNotEligibleCase';

const test = setupTest();
let caseDetail;

describe('Docket clerk verifies high priority case is not blocked', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(test, {
      preferredTrialCity: 'Lubbock, Texas',
    });
    test.docketNumber = caseDetail.docketNumber;
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsPaperFiledPendingDocketEntryAndServes(test, fakeFile);

  it('verify that the high-priority case is not automaticBlocked', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.automaticBlocked')).toBeFalsy();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkVerifyEligibleCase(test);
  petitionsClerkUnprioritizesCase(test);

  it('verify that the non-high-priority case is set to automaticBlocked', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.automaticBlocked')).toBeTruthy();
    expect(test.getState('caseDetail.automaticBlockedReason')).toBe(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
  });

  petitionsClerkVerifyNotEligibleCase(test);
});
