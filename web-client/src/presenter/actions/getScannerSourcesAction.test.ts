import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getScannerSourcesAction } from './getScannerSourcesAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const mockSources = ['Test Source 1', 'Test Source 2'];

describe('getScannerSourcesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext.getScanner.mockReturnValue({
      getSources: () => mockSources,
    });
  });

  it('gets an array of sources and sets them on state.scanner.sources', async () => {
    const result = await runAction(getScannerSourcesAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          sources: [],
        },
      },
    });
    expect(result.state.scanner.sources.length).toEqual(mockSources.length);
  });
});
