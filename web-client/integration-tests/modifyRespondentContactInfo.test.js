import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { respondentUpdatesAddress } from './journey/respondentUpdatesAddress';
import { respondentViewsCaseDetailNoticeOfChangeOfAddress } from './journey/respondentViewsCaseDetailNoticeOfChangeOfAddress';

const test = setupTest();

describe('Modify Respondent Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(test, 'petitioner@example.com');

    it(`create case #${i} and associate a respondent`, async () => {
      caseDetail = await uploadPetition(test);
      expect(caseDetail.docketNumber).toBeDefined();
      test.createdDocketNumbers.push(caseDetail.docketNumber);
    });

    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkAddsRespondentsToCase(test);
  }

  it('wait for ES index', async () => {
    // waiting for the respondent to be associated with the newly created cases
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'irsPractitioner@example.com');
  respondentUpdatesAddress(test);

  it('wait for ES index', async () => {
    // waiting for the associated cases to be updated, and THEN an index
    await refreshElasticsearchIndex(5000);
  });

  for (let i = 0; i < 3; i++) {
    respondentViewsCaseDetailNoticeOfChangeOfAddress(test, i);
  }
});
