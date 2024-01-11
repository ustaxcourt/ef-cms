import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkViewsDeadlineReport } from './journey/petitionsClerkViewsDeadlineReport';

describe('Case deadline report journey', () => {
  const cerebralTest = setupTest({
    constantsOverrides: {
      DEADLINE_REPORT_PAGE_SIZE: 1,
    },
  });

  const randomDay = `1${Math.floor(Math.random() * 9) + 1}`;
  const randomYear = `200${Math.floor(Math.random() * 9) + 1}`;

  const overrides = {
    day: randomDay,
    month: '01',
    year: randomYear,
  };

  beforeAll(() => {
    cerebralTest.createdDocketNumbers = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('set up test data - 3 cases with 2 deadlines each', () => {
    for (let i = 0; i < 3; i++) {
      loginAs(cerebralTest, 'petitioner@example.com');
      it(`create case ${i}`, async () => {
        const caseDetail = await uploadPetition(cerebralTest);
        expect(caseDetail.docketNumber).toBeDefined();
        cerebralTest.docketNumber = caseDetail.docketNumber;
        cerebralTest.createdDocketNumbers.push(caseDetail.docketNumber);
      });

      loginAs(cerebralTest, 'petitionsclerk@example.com');
      petitionsClerkCreatesACaseDeadline(cerebralTest, overrides);
      petitionsClerkCreatesACaseDeadline(cerebralTest, {
        ...overrides,
        month: '02',
      });
    }
  });

  describe('docket clerk', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    it('updates associatedJudge for first case to Judge Buch', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.createdDocketNumbers[0],
      });

      await cerebralTest.runSequence('openUpdateCaseModalSequence');

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'UpdateCaseModalDialog',
      );

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'caseStatus',
        value: CASE_STATUS_TYPES.submitted,
      });
      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: 'Buch',
      });
      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudgeId',
        value: 'dabbad02-18d0-43ec-bafb-654e83405416',
      });

      await cerebralTest.runSequence('submitUpdateCaseModalSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
        'Buch',
      );
      expect(cerebralTest.getState('caseDetail.associatedJudgeId')).toEqual(
        'dabbad02-18d0-43ec-bafb-654e83405416',
      );

      await refreshElasticsearchIndex();
    });
  });

  describe('View the deadlines report', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReport(cerebralTest, overrides);
  });
});
