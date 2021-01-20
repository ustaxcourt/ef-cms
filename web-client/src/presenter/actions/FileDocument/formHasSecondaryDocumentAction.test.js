import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { formHasSecondaryDocumentAction } from './formHasSecondaryDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('formHasSecondaryDocumentAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

  it('should call path.error when state.form.secondaryDocument is undefined', async () => {
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

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should call path.error when state.form.secondaryDocument.documentType is undefined', async () => {
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

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should call path.success when state.form.secondaryDocument.documentType is defined', async () => {
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

    expect(pathSuccessStub).toHaveBeenCalled();
  });
});
