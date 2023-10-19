import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  waitForLoadingComponentToHide,
} from './helpers';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { respondentUpdatesAddress } from './journey/respondentUpdatesAddress';
import { respondentViewsCaseDetailNoticeOfChangeOfAddress } from './journey/respondentViewsCaseDetailNoticeOfChangeOfAddress';

describe('Modify Respondent Contact Information', () => {
  const cerebralTest = setupTest();

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

  loginAs(cerebralTest, 'irspractitioner@example.com');
  respondentUpdatesAddress(cerebralTest);

  it('wait for notice of change of address to be generated for each case the respondent is associated with', async () => {
    await waitForLoadingComponentToHide({
      cerebralTest,
      component: 'userContactEditProgress.inProgress',
      refreshInterval: 1000,
    });
  });

  respondentViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, 0, true);
  respondentViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, 1, false);
});
