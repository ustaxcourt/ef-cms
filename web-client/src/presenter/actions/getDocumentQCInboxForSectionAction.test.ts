import { ADC_SECTION } from '@shared/business/entities/EntityConstants';
import { adcUser } from '@shared/test/mockUsers';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCInboxForSectionAction } from './getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForSectionInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/workitems/getDocumentQCInboxForSectionProxy');

describe('getDocumentQCInboxForSectionAction', () => {
  const mockGetDocumentQCInboxForSectionInteractor =
    getDocumentQCInboxForSectionInteractor as jest.Mock;
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  beforeAll(() => {
    mockGetDocumentQCInboxForSectionInteractor.mockReturnValue(mockWorkItems);
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call getDocumentQCInboxForSectionInteractor with the judge user from state', async () => {
    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          name: 'A judgy person',
        },
        user: {
          section: 'judgy section',
        },
      },
    });

    expect(
      mockGetDocumentQCInboxForSectionInteractor.mock.calls[0][1],
    ).toMatchObject({
      judgeUser: {
        name: 'A judgy person',
      },
      section: 'judgy section',
    });
  });

  it('should call getDocumentQCInboxForSectionInteractor with the selectedSection when section exists off workQueueToDisplay', async () => {
    const mockSection = 'a selected section';

    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        user: {},
        workQueueToDisplay: {
          section: mockSection,
        },
      },
    });

    expect(
      mockGetDocumentQCInboxForSectionInteractor.mock.calls[0][1],
    ).toMatchObject({
      section: mockSection,
    });
  });

  it('should call getDocumentQCInboxForSectionInteractor with the CHIEF_JUDGE if judgeUser is not found in state and user role is adc', async () => {
    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: { user: adcUser },
    });

    expect(
      mockGetDocumentQCInboxForSectionInteractor.mock.calls[0][1],
    ).toMatchObject({
      judgeUser: {
        name: CHIEF_JUDGE,
      },
      section: ADC_SECTION,
    });
  });
});
