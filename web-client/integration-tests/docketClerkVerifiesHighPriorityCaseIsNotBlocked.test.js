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

  // if a case is set to high priority, and then one of its docket entries is set to pending, that case should no longer be blocked
  // if the high priority label is removed from the case, then the case should be updated to be blocked with blocked reason being pending

  //create a case
  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  //set it to high priority
  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(test);
  //add a pending item
  loginAs(test, 'docketclerk@example.com');
  const mockDayReceived = 30;
  const mockMonthReceived = '04';
  const mockYearReceived = 2001;
  docketClerkAddsPaperFiledPendingDocketEntryAndServes({
    dayReceived: mockDayReceived,
    fakeFile,
    monthReceived: mockMonthReceived,
    test,
    yearReceived: mockYearReceived,
  });

  //check blocked
  // verify that case is eligible for trial
  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkVerifyEligibleCase(test);
  //unprioritize case
  petitionsClerkUnprioritizesCase(test);
  //check blocked and reason for block
  // verify that case is NOT eligible for trial
  petitionsClerkVerifyNotEligibleCase(test);
});
