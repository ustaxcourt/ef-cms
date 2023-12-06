import {
  ADC_SECTION,
  DOCKET_SECTION,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getInboxMessagesForSectionAction } from './getInboxMessagesForSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getInboxMessagesForSectionAction', () => {
  const message = {
    messageId: '180bfc0c-4e8e-448a-802a-8fe027be85ef',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getInboxMessagesForSectionInteractor.mockReturnValue([message]);
  });

  it('returns the messages retrieved from the use case', async () => {
    const results = await runAction(getInboxMessagesForSectionAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(results.output.messages).toEqual([message]);
  });

  it('retrieves inbox messages for the section from state when it is defined', async () => {
    await runAction(getInboxMessagesForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        messageBoxToDisplay: {
          section: DOCKET_SECTION,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getInboxMessagesForSectionInteractor.mock
        .calls[0][1],
    ).toEqual({ section: DOCKET_SECTION });
    expect(applicationContext.getCurrentUser).not.toHaveBeenCalled();
  });

  it("retrieves inbox messages for the current user's section when state.messageBoxToDisplay.section is undefined", async () => {
    const currentUserSection = { section: ADC_SECTION };
    applicationContext.getCurrentUser.mockReturnValue(currentUserSection);

    await runAction(getInboxMessagesForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        messageBoxToDisplay: {},
      },
    });

    expect(
      applicationContext.getUseCases().getInboxMessagesForSectionInteractor.mock
        .calls[0][1],
    ).toEqual(currentUserSection);
    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });
});
