import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getIsPendingItemAction } from './getIsPendingItemAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getIsPendingItemAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns the yes path if saving for later', async () => {
    await runAction(getIsPendingItemAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: 'docket-entry-123', pending: true }],
        },
        docketEntryId: 'docket-entry-123',
      },
    });

    expect(yesStub).toBeCalled();
  });

  it('returns the no path if NOT saving for later (i.e. saving and serving)', async () => {
    await runAction(getIsPendingItemAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: 'docket-entry-123' }],
        },
        docketEntryId: 'docket-entry-123',
      },
    });

    expect(noStub).toBeCalled();
  });
});
