import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';

describe('Petitions clerk creates case with statistics', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkEditsSavedPetition(cerebralTest);

  it('should do stuff', async () => {
    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'statistics.0.year',
      value: 2000,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 100,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      statisticIndex: 0,
      title: 'Calculate Penalties on IRS Notice',
    });

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'CalculatePenaltiesModal',
    );

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'penalties.0',
      value: '100',
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'penalties.1',
      value: '1000',
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
});
