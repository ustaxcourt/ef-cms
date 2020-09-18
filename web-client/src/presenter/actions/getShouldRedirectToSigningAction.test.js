import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShouldRedirectToSigningAction } from './getShouldRedirectToSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

let yesMock;
let noMock;

describe('getShouldRedirectToSigningAction', () => {
  beforeAll(() => {
    yesMock = jest.fn();
    noMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the yes path for court issued documents that DO NOT have a Notice event code', async () => {
    await runAction(getShouldRedirectToSigningAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: '123',
        eventCode: 'O',
      },
      state: {},
    });
    expect(yesMock).toHaveBeenCalled();
  });

  it('should call the no path for court issued documents that have a Notice event code', async () => {
    await runAction(getShouldRedirectToSigningAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: '123',
        eventCode: 'NOT',
      },
      state: {},
    });
    expect(noMock).toHaveBeenCalled();
  });

  it('should redirect to the document detail page for court issued documents that have a Notice event code', async () => {
    const result = await runAction(getShouldRedirectToSigningAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: '123',
        eventCode: 'NOT',
      },
      state: {},
    });

    // the editDocumentEntryPoint is a way of redirecting back where the edit
    // process started - this explicitly sets it to document detail to use the
    // built-in redirect functionality
    expect(result.state.editDocumentEntryPoint).toEqual('DocumentDetail');
  });
});
