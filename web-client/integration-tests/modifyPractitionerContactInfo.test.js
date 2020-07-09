import { loginAs, setupTest, uploadPetition } from './helpers';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';
import { practitionerViewsCaseDetailNoticeOfChangeOfAddress } from './journey/practitionerViewsCaseDetailNoticeOfChangeOfAddress';

const test = setupTest();

describe('Modify Practitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(test, 'privatePractitioner@example.com');
    it(`login as a practitioner and create case #${i}`, async () => {
      caseDetail = await uploadPetition(
        test,
        {},
        'privatePractitioner@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      test.createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  practitionerUpdatesAddress(test);
  for (let i = 0; i < 3; i++) {
    practitionerViewsCaseDetailNoticeOfChangeOfAddress(test, i);
  }
});
