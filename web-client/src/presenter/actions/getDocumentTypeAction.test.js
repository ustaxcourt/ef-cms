import { getDocumentTypeAction } from './getDocumentTypeAction';
import presenter from '..';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('getDocumentType', () => {
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
