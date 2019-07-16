import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryAction } from './submitDocketEntryAction';
import sinon from 'sinon';

describe('submitDocketEntryAction', () => {
  let createCoverSheetStub;
  let fileDocketEntryStub;

  beforeEach(() => {
    createCoverSheetStub = sinon.stub();
    fileDocketEntryStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createCoverSheet: createCoverSheetStub,
        fileDocketEntryInteractor: fileDocketEntryStub,
      }),
    };
  });

  it('should call fileDocketEntry', async () => {
    fileDocketEntryStub.returns({ documents: [] });
    await runAction(submitDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(fileDocketEntryStub.calledOnce).toEqual(true);
  });
});
