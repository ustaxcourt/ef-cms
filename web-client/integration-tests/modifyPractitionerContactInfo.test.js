import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';
import { practitionerViewsCaseDetailNoticeOfChangeOfAddress } from './journey/practitionerViewsCaseDetailNoticeOfChangeOfAddress';

const cerebralTest = setupTest();

describe('Modify Practitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;
  cerebralTest.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(cerebralTest, 'privatePractitioner2@example.com');
    it('login as a practitioner and create 3 cases', async () => {
      caseDetail = await uploadPetition(
        cerebralTest,
        {},
        'privatePractitioner2@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  it('waits for elasticsearch', async () => {
    await refreshElasticsearchIndex();
  });

  practitionerUpdatesAddress(cerebralTest);

  for (let i = 0; i < 3; i++) {
    practitionerViewsCaseDetailNoticeOfChangeOfAddress(cerebralTest, i);
  }
});
