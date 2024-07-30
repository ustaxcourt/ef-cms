import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setIrsNoticeUploadFormInfoAction } from '@web-client/presenter/actions/setIrsNoticeUploadFormInfoAction';

describe('setIrsNoticeUploadFormInfoAction', () => {
  const UNIQUE_GUID = 'UNIQUE_GUID';
  const FORMAT_NOW_RESULTS = 'FORMAT_NOW_RESULTS';

  beforeEach(() => {
    applicationContext.getUniqueId.mockImplementation(() => UNIQUE_GUID);

    applicationContext
      .getUtilities()
      .formatNow.mockImplementation(() => FORMAT_NOW_RESULTS);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should set "irsNoticeUploadFormInfo" in state correctly', async () => {
    const { state } = await runAction(setIrsNoticeUploadFormInfoAction, {
      modules: { presenter },
      state: {
        irsNoticeUploadFormInfo: undefined,
      },
    });

    const formatNowCalls =
      applicationContext.getUtilities().formatNow.mock.calls;

    expect(formatNowCalls.length).toEqual(1);
    expect(formatNowCalls[0][0]).toEqual(FORMATS.YYYYMMDD);

    expect(state.irsNoticeUploadFormInfo).toMatchObject([
      {
        key: UNIQUE_GUID,
        todayDate: FORMAT_NOW_RESULTS,
      },
    ]);
  });
});
