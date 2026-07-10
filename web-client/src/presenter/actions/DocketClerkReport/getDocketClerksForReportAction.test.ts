import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocketClerksForReportAction } from './getDocketClerksForReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocketClerksForReportAction', () => {
  const mockDocketClerks = [
    { name: 'Zelda Smith', userId: 'z1' },
    { name: 'Alice Jones', userId: 'a1' },
    { name: 'Mary Brown', userId: 'm1' },
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockResolvedValue(mockDocketClerks);
  });

  it('should call getUsersInSectionInteractor with the DOCKET_SECTION constant', async () => {
    await runAction(getDocketClerksForReportAction, {
      modules: { presenter },
      state: { docketClerkReport: { docketClerks: [] } },
    });

    const callArgs =
      applicationContext.getUseCases().getUsersInSectionInteractor.mock
        .calls[0][1];
    expect(callArgs.section).toBe(
      applicationContext.getConstants().DOCKET_SECTION,
    );
  });

  it('should store the returned users sorted alphabetically by name', async () => {
    const { state } = await runAction(getDocketClerksForReportAction, {
      modules: { presenter },
      state: { docketClerkReport: { docketClerks: [] } },
    });

    expect(state.docketClerkReport.docketClerks).toEqual([
      { name: 'Alice Jones', userId: 'a1' },
      { name: 'Mary Brown', userId: 'm1' },
      { name: 'Zelda Smith', userId: 'z1' },
    ]);
  });

  it('should store an empty array when no users are returned', async () => {
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockResolvedValue([]);

    const { state } = await runAction(getDocketClerksForReportAction, {
      modules: { presenter },
      state: { docketClerkReport: { docketClerks: [] } },
    });

    expect(state.docketClerkReport.docketClerks).toEqual([]);
  });
});
