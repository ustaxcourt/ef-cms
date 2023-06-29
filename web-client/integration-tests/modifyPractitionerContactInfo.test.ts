import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';
import { practitionerViewsCaseDetailNoticeOfChangeOfAddress } from './journey/practitionerViewsCaseDetailNoticeOfChangeOfAddress';

describe('Modify Practitioner Contact Information', () => {
  const cerebralTest = setupTest();

  cerebralTest.createdDocketNumbers = [];

  let caseDetail;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'privatepractitioner2@example.com');
  it('login as a practitioner and creates a case that will be served', async () => {
    caseDetail = await uploadPetition(
      cerebralTest,
      {},
      'privatepractitioner2@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdDocketNumbers.push(caseDetail.docketNumber);
  });
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'privatepractitioner2@example.com');
  it('login as a practitioner and creates a case that will not be served', async () => {
    caseDetail = await uploadPetition(
      cerebralTest,
      {},
      'privatepractitioner2@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdDocketNumbers.push(caseDetail.docketNumber);
  });

  it('waits for elasticsearch', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'privatepractitioner2@example.com');
  practitionerUpdatesAddress(cerebralTest);

  practitionerViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, 0, true);
  practitionerViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, 1, false);
});
