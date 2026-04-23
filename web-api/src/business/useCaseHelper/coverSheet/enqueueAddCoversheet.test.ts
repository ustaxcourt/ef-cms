import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { enqueueAddCoversheet } from './enqueueAddCoversheet';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('enqueueAddCoversheet', () => {
  it('dispatches an ADD_COVERSHEET message via the worker gateway', async () => {
    await enqueueAddCoversheet(applicationContext, {
      authorizedUser: mockDocketClerkUser,
      docketEntryId: 'abc',
      docketNumber: '101-25',
    });

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser: mockDocketClerkUser,
        payload: { docketEntryId: 'abc', docketNumber: '101-25' },
        type: 'ADD_COVERSHEET',
      },
    });
  });
});
