import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoReviewSavedPetitionSequence } from '../sequences/gotoReviewSavedPetitionSequence';
import { presenter } from '../presenter-mock';

describe('gotoReviewSavedPetitionSequence', () => {
  let cerebralTest;
  let PARTY_TYPES;

  ({ PARTY_TYPES } = applicationContext.getConstants());

  const mockCase = {
    docketEntries: [{ docketEntryId: '123', documentType: 'Petition' }],
    docketNumber: '105-15',
    partyType: PARTY_TYPES.petitioner,
  };
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(mockCase);
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoReviewSavedPetitionSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('Should set state.caseDetail and state.form to the mock case', async () => {
    cerebralTest.setState('currentPage', 'SomeOtherPage');
    cerebralTest.setState('form', { partyType: 'petitioner' });
    cerebralTest.setState('caseDetail', {
      docketNumber: '199-99',
      partyType: PARTY_TYPES.petitioner,
    });

    await cerebralTest.runSequence('gotoReviewSavedPetitionSequence', {
      docketNumber: '105-15',
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor,
    ).toHaveBeenCalled();
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');
    expect(cerebralTest.getState('caseDetail')).toMatchObject(mockCase);
    expect(cerebralTest.getState('form')).toMatchObject(mockCase);
  });

  it('should not unset state.caseDetail.petitioners in the ignore path', async () => {
    const mockDocketNumber = '199-99';
    const mockPetitioner = MOCK_CASE.petitioners[0];

    cerebralTest.setState('form', { partyType: 'petitioner' });
    cerebralTest.setState('caseDetail', {
      docketNumber: mockDocketNumber,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [mockPetitioner],
    });

    await cerebralTest.runSequence('gotoReviewSavedPetitionSequence', {
      docketNumber: mockDocketNumber,
    });

    expect(cerebralTest.getState('caseDetail.petitioners')).toEqual([
      mockPetitioner,
    ]);
  });
});
