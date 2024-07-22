import { FORMATS } from '@shared/business/utilities/DateHandler';
import { addAnotherIrsNoticeToFormAction } from '@web-client/presenter/actions/addAnotherIrsNoticeToFormAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addAnotherIrsNoticeToFormAction', () => {
  const TEST_GUID = 'TEST_GUID';
  const TEST_NOW_DATE = 'TEST_NOW_DATE';

  beforeEach(() => {
    applicationContext.getUniqueId.mockImplementation(() => TEST_GUID);
    applicationContext
      .getUtilities()
      .formatNow.mockImplementation(() => TEST_NOW_DATE);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should add a new IRS form into state with correct initial data', async () => {
    const result = await runAction(addAnotherIrsNoticeToFormAction, {
      modules: { presenter },
      state: {
        irsNoticeUploadFormInfo: [],
      },
    });

    const { irsNoticeUploadFormInfo } = result.state;
    expect(irsNoticeUploadFormInfo.length).toEqual(1);

    const formatNowCalls =
      applicationContext.getUtilities().formatNow.mock.calls;

    expect(formatNowCalls.length).toEqual(1);
    expect(formatNowCalls[0][0]).toEqual(FORMATS.YYYYMMDD);

    const irsForm = irsNoticeUploadFormInfo[0];
    expect(irsForm).toEqual({
      key: TEST_GUID,
      todayDate: TEST_NOW_DATE,
    });
  });

  it('should not add a new IRS form into state when there is already 5 in the array', async () => {
    const result = await runAction(addAnotherIrsNoticeToFormAction, {
      modules: { presenter },
      state: {
        irsNoticeUploadFormInfo: [{}, {}, {}, {}, {}],
      },
    });

    const { irsNoticeUploadFormInfo } = result.state;
    expect(irsNoticeUploadFormInfo.length).toEqual(5);
  });
});
