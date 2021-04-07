import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoReviewSavedPetitionSequence } from '../sequences/gotoReviewSavedPetitionSequence';
import { presenter } from '../presenter-mock';

describe('gotoReviewSavedPetitionSequence', () => {
  let test;
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
    test = CerebralTest(presenter);
  });

  it('Should set state.caseDetail and state.form to the mock case', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    test.setState('form', { partyType: 'petitioner' });
    test.setState('caseDetail', {
      docketNumber: '199-99',
      partyType: PARTY_TYPES.petitioner,
    });

    await test.runSequence('gotoReviewSavedPetitionSequence', {
      docketNumber: '105-15',
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor,
    ).toHaveBeenCalled();
    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');
    expect(test.getState('caseDetail')).toMatchObject(mockCase);
    expect(test.getState('form')).toMatchObject(mockCase);
  });

  it('should not unset state.caseDetail.petitioners in the ignore path', async () => {
    const mockDocketNumber = '199-99';
    const mockPetitioner = MOCK_CASE.petitioners[0];

    test.setState('form', { partyType: 'petitioner' });
    test.setState('caseDetail', {
      docketNumber: mockDocketNumber,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [mockPetitioner],
    });

    await test.runSequence('gotoReviewSavedPetitionSequence', {
      docketNumber: mockDocketNumber,
    });

    expect(test.getState('caseDetail.petitioners')).toEqual([mockPetitioner]);
  });
});
