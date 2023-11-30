import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { createOrderAction } from './createOrderAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createOrderAction', () => {
  beforeAll(() => {
    global.window ??= Object.create({
      DOMParser: class {
        constructor() {}
      },
    });

    global.window.DOMParser.prototype.parseFromString = jest
      .fn()
      .mockReturnValue({
        children: [{ innerHTML: '' }],
        querySelector: jest.fn().mockReturnValue({
          children: [{ innerHTML: '' }],
        }),
      });

    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('sets the eventCode, content html and document title for creating orders', async () => {
    const result = await runAction(createOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseCaption: 'Guy Fieri',
        },
        form: {
          documentTitle: 'Test Title',
          eventCode: 'NOT',
          richText: '<b>Foo</b>',
        },
      },
    });

    expect(result.output.contentHtml).toEqual('<b>Foo</b>');
    expect(result.output.documentTitle).toEqual('TEST TITLE');
    expect(result.output.eventCode).toEqual('NOT');
  });
});
