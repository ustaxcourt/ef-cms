import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentIdAction } from './getDocumentIdAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentIdAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('returns an object with a docketEntryId property and value extracted from state', async () => {
    const docketEntryId = '19a41e75-cdbb-42a0-a602-e59d50a3ba6e';
    const result = await runAction(getDocumentIdAction, {
      modules: {
        presenter,
      },
      state: { docketEntryId },
    });
    expect(result.output).toEqual({ docketEntryId });
  });
});
