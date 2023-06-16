import { isEditingOrderAction } from './isEditingOrderAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isEditingOrderAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns the yes path for editing a document', async () => {
    await runAction(isEditingOrderAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
    expect(noStub).not.toHaveBeenCalled();
  });

  it('returns the no path for editing a document', async () => {
    await runAction(isEditingOrderAction, {
      modules: {
        presenter,
      },
    });

    expect(yesStub).not.toHaveBeenCalled();
    expect(noStub).toHaveBeenCalled();
  });
});
