import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocketClerksForReportAction } from './getDocketClerksForReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocketClerksForReportAction', () => {
  const mockDocketClerks = [
    { name: 'Zelda Smith', role: 'docketclerk', userId: 'z1' },
    { name: 'Alice Jones', role: 'docketclerk', userId: 'a1' },
    { name: 'Mary Brown', role: 'docketclerk', userId: 'm1' },
    { name: 'Candy Case', role: 'caseServicesSupervisor', userId: 'css1' },
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

  it('should store the returned users sorted alphabetically by name, filtered to docket clerks only', async () => {
    const { state } = await runAction(getDocketClerksForReportAction, {
      modules: { presenter },
      state: { docketClerkReport: { docketClerks: [] } },
    });

    expect(state.docketClerkReport.docketClerks).toEqual([
      { name: 'Alice Jones', role: 'docketclerk', userId: 'a1' },
      { name: 'Mary Brown', role: 'docketclerk', userId: 'm1' },
      { name: 'Zelda Smith', role: 'docketclerk', userId: 'z1' },
    ]);
    expect(
      state.docketClerkReport.docketClerks.find(
        (u: any) => u.role === 'caseServicesSupervisor',
      ),
    ).toBeUndefined();
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
