import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { chooseDocketClerkReportPageTypeAction } from './chooseDocketClerkReportPageTypeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseDocketClerkReportPageTypeAction', () => {
  let documentQCStub: jest.Mock;
  let messagesStub: jest.Mock;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    documentQCStub = jest.fn();
    messagesStub = jest.fn();
    presenter.providers.path = {
      documentQC: documentQCStub,
      messages: messagesStub,
    };
  });

  it('should take path.messages when pageType is "messages"', async () => {
    await runAction(chooseDocketClerkReportPageTypeAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          pageType: 'messages',
        },
      },
    });

    expect(messagesStub).toHaveBeenCalled();
    expect(documentQCStub).not.toHaveBeenCalled();
  });

  it('should take path.documentQC when pageType is "documentQC"', async () => {
    await runAction(chooseDocketClerkReportPageTypeAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          pageType: 'documentQC',
        },
      },
    });

    expect(documentQCStub).toHaveBeenCalled();
    expect(messagesStub).not.toHaveBeenCalled();
  });

  it('should take path.documentQC when pageType is null (default)', async () => {
    await runAction(chooseDocketClerkReportPageTypeAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          pageType: null,
        },
      },
    });

    expect(documentQCStub).toHaveBeenCalled();
    expect(messagesStub).not.toHaveBeenCalled();
  });
});
