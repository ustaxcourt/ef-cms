import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitPublicCaseAdvancedSearchAction } from './submitPublicCaseAdvancedSearchAction';

describe('submitPublicCaseAdvancedSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('gets the public case information', async () => {
    applicationContextForClient
      .getUseCases()
      .casePublicSearchInteractor.mockResolvedValue([
        { docketNumber: '123-45' },
        { docketNumber: '678-90' },
        { docketNumber: '000-00' },
      ]);

    const result = await runAction(submitPublicCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          caseSearchByName: 'case name',
        },
      },
    });

    expect(result.output).toMatchObject({
      searchResults: [
        { docketNumber: '123-45' },
        { docketNumber: '678-90' },
        { docketNumber: '000-00' },
      ],
    });
    expect(
      applicationContextForClient.getUseCases().casePublicSearchInteractor,
    ).toHaveBeenCalled();
  });
});
