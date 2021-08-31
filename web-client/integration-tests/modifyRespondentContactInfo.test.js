import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { respondentUpdatesAddress } from './journey/respondentUpdatesAddress';
import { respondentViewsCaseDetailNoticeOfChangeOfAddress } from './journey/respondentViewsCaseDetailNoticeOfChangeOfAddress';

const cerebralTest = setupTest();

describe('Modify Respondent Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;
  cerebralTest.createdDocketNumbers = [];

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case and associate a respondent which will be served', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case and associate a respondent which will NOT be served', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  it('wait for ES index', async () => {
    // waiting for the respondent to be associated with the newly created cases
    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  respondentUpdatesAddress(cerebralTest);

  it('wait for ES index', async () => {
    // waiting for the associated cases to be updated, and THEN an index
    await refreshElasticsearchIndex(5000);
  });

  respondentViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, 0, true);
  respondentViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, 1, false);
});
