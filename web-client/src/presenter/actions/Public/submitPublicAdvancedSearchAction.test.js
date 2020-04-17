import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';
import { submitPublicAdvancedSearchAction } from './submitPublicAdvancedSearchAction';

describe('submitPublicAdvancedSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('gets the public case information', async () => {
    applicationContextForClient
      .getUseCases()
      .casePublicSearchInteractor.mockResolvedValue([
        { caseId: 'case-id-123' },
        { caseId: 'case-id-234' },
        { caseId: 'case-id-345' },
      ]);

    const result = await runAction(submitPublicAdvancedSearchAction, {
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
        { caseId: 'case-id-123' },
        { caseId: 'case-id-234' },
        { caseId: 'case-id-345' },
      ],
    });
    expect(
      applicationContextForClient.getUseCases().casePublicSearchInteractor,
    ).toBeCalled();
  });
});
