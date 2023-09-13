import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formHasSecondaryDocumentAction } from './formHasSecondaryDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formHasSecondaryDocumentAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const pathYesStub = jest.fn();
  const pathNoStub = jest.fn();

  presenter.providers.path = {
    no: pathNoStub,
    yes: pathYesStub,
  };

  it('should call path.no when state.form.secondaryDocument is undefined', async () => {
    await runAction(formHasSecondaryDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          secondaryDocument: undefined,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should call path.no when state.form.secondaryDocument.documentType is undefined', async () => {
    await runAction(formHasSecondaryDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          secondaryDocument: { documentType: undefined, eventCode: 'HE' },
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should call path.yes when state.form.secondaryDocument.documentType is defined', async () => {
    await runAction(formHasSecondaryDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          secondaryDocument: {
            documentType: 'Hearings and Exhibits',
            eventCode: 'HE',
          },
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
