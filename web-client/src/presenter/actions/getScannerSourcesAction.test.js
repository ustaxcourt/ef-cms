import { getScannerSourcesAction } from './getScannerSourcesAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockSources = ['Test Source 1', 'Test Source 2'];

presenter.providers.applicationContext = {
  getScanner: () => ({
    getSources: () => mockSources,
  }),
};

describe('getScannerSourcesAction', () => {
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
