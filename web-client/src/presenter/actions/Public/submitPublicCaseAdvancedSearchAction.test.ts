import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitPublicCaseAdvancedSearchAction } from './submitPublicCaseAdvancedSearchAction';

describe('submitPublicCaseAdvancedSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
    applicationContextForClient
      .getUseCases()
      .casePublicSearchInteractor.mockResolvedValue({
        results: [],
      });
  });

  it('gets the public case information', async () => {
    await runAction(submitPublicCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          caseSearchByName: { petitionerName: 'case name' },
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases().casePublicSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toEqual({
      petitionerName: 'case name',
    });
  });
});
