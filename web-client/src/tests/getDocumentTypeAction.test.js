import { runAction } from 'cerebral/test';
import presenter from '../presenter';
import getDocumentType from '../presenter/actions/getDocumentTypeAction';
import sinon from 'sinon';

describe('getDocumentType', async () => {
  let spy;

  beforeEach(() => {
    spy = sinon.spy();
    presenter.providers.path = {
      generic: spy
    };
  });

  it('should invoke the error function when no document types returned', async () => {
    const result = await runAction(getDocumentType, {
      state: {
        document: {
          documentType: 'other',
        }
      },
      modules: {
        presenter,
      },
    });
    expect(spy.called).toEqual(true);
  });
});
