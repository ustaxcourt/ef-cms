import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkViewsDeadlineReport } from './journey/petitionsClerkViewsDeadlineReport';

const test = setupTest();

describe('Case deadline report journey', () => {
  const randomDay = `1${Math.floor(Math.random() * 9) + 1}`;
  const randomYear = `200${Math.floor(Math.random() * 9) + 1}`;

  const overrides = {
    day: randomDay,
    month: '01',
    year: randomYear,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
    test.createdDocketNumbers = [];
  });

  describe('set up test data - 3 cases with 2 deadlines each', () => {
    for (let i = 0; i < 3; i++) {
      loginAs(test, 'petitioner@example.com');
      it(`create case ${i}`, async () => {
        const caseDetail = await uploadPetition(test);
        expect(caseDetail.docketNumber).toBeDefined();
        test.docketNumber = caseDetail.docketNumber;
        test.createdDocketNumbers.push(caseDetail.docketNumber);
      });

      loginAs(test, 'petitionsclerk@example.com');
      petitionsClerkCreatesACaseDeadline(test, overrides);
      petitionsClerkCreatesACaseDeadline(test, {
        ...overrides,
        month: '02',
      });
    }
  });

  describe('docket clerk', () => {
    loginAs(test, 'docketclerk@example.com');
    it('updates associatedJudge for first case to Judge Buch', async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.createdDocketNumbers[0],
      });

      await test.runSequence('openUpdateCaseModalSequence');

      expect(test.getState('modal.showModal')).toEqual('UpdateCaseModalDialog');

      await test.runSequence('updateModalValueSequence', {
        key: 'caseStatus',
        value: CASE_STATUS_TYPES.submitted,
      });
      await test.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: 'Buch',
      });

      await test.runSequence('submitUpdateCaseModalSequence');

      expect(test.getState('validationErrors')).toEqual({});

      expect(test.getState('caseDetail.associatedJudge')).toEqual('Buch');

      await refreshElasticsearchIndex();
    });
  });

  describe('View the deadlines report', () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReport(test, overrides);
  });
});
