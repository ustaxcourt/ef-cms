import { runAction } from 'cerebral/test';
import presenter from '..';
import { getDocumentTypeAction } from './getDocumentTypeAction';
import sinon from 'sinon';

describe('getDocumentType', async () => {
  let spy;

  beforeEach(() => {
    spy = sinon.spy();
    presenter.providers.path = {
      generic: spy,
    };
  });

  it('should invoke the error function when no document types returned', async () => {
    await runAction(getDocumentTypeAction, {
      modules: {
        presenter,
      },
      state: {
        document: {
          documentType: 'other',
        },
      },
    });
    expect(spy.called).toEqual(true);
  });
});
