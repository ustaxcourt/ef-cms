import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoReviewSavedPetitionSequence } from '../sequences/gotoReviewSavedPetitionSequence';
import { presenter } from '../presenter-mock';

describe('gotoReviewSavedPetitionSequence', () => {
  let test;
  let PARTY_TYPES;

  ({ PARTY_TYPES } = applicationContext.getConstants());

  const MOCK_CASE = {
    caseId: 'foo-bar-baz',
    docketNumber: '105-15',
    documents: [{ documentId: '123', documentType: 'Petition' }],
    partyType: PARTY_TYPES.petitioner,
  };
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(MOCK_CASE);
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
    expect(test.getState('caseDetail')).toMatchObject(MOCK_CASE);
    expect(test.getState('form')).toMatchObject(MOCK_CASE);
  });
});
