import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
let MOCK_CASE = {
  caseId: 'foo-bar-baz',
  docketNumber: '105-15',
  partyType: 'Petitioner',
};
const getCaseInteractor = jest.fn().mockResolvedValue(MOCK_CASE);
presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    getCaseInteractor,
  }),
};

test = CerebralTest(presenter);

describe('gotoReviewSavedPetitionSequence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should set state.caseDetail and state.form to the mock case', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    test.setState('form', { partyType: 'petitioner' });
    test.setState('caseDetail', {
      docketNumber: '199-99',
      partyType: 'Petitioner',
    });

    await test.runSequence('gotoReviewSavedPetitionSequence', {
      docketNumber: '105-15',
    });

    expect(getCaseInteractor).toHaveBeenCalled();
    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');
    expect(test.getState('caseDetail')).toMatchObject(MOCK_CASE);
    expect(test.getState('form')).toMatchObject(MOCK_CASE);
  });
});
