import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';
import { practitionerViewsCaseDetailNoticeOfChangeOfAddress } from './journey/practitionerViewsCaseDetailNoticeOfChangeOfAddress';

const test = setupTest();

describe('Modify Practitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(test, 'privatePractitioner2@example.com');
    it(`login as a practitioner and create case #${i}`, async () => {
      caseDetail = await uploadPetition(
        test,
        {},
        'privatePractitioner2@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      test.createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  practitionerUpdatesAddress(test);

  it('waits for elasticsearch', async () => {
    await refreshElasticsearchIndex(25000);
  });

  for (let i = 0; i < 3; i++) {
    practitionerViewsCaseDetailNoticeOfChangeOfAddress(test, i);
  }
});
