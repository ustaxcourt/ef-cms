import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { gotoReviewSavedPetitionSequence } from '../sequences/gotoReviewSavedPetitionSequence';
import { presenter } from '../presenter-mock';

describe('gotoReviewSavedPetitionSequence', () => {
  let cerebralTest;

  const { PARTY_TYPES } = applicationContext.getConstants();

  const mockDocketEntry = { docketEntryId: '123', documentType: 'Petition' };
  const mockCase = {
    docketEntries: [],
    docketNumber: '105-15',
    partyType: PARTY_TYPES.petitioner,
  };
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(mockCase);
    applicationContext
      .getUseCases()
      .getCaseDocketEntriesInteractor.mockReturnValue({
        docketEntries: [mockDocketEntry],
        page: 0,
        pageSize: 1000,
        totalCount: 1,
      });
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
    expect(cerebralTest.getState('caseDetail')).toMatchObject({
      ...mockCase,
      docketEntries: [mockDocketEntry],
    });
    expect(cerebralTest.getState('form')).toMatchObject({
      ...mockCase,
      docketEntries: [mockDocketEntry],
    });
  });
});
