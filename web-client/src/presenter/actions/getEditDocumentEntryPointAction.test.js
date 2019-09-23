import { getEditDocumentEntryPointAction } from './getEditDocumentEntryPointAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const caseDetailMock = jest.fn();
const documentDetailMock = jest.fn();

presenter.providers.path = {
  CaseDetail: caseDetailMock,
  DocumentDetail: documentDetailMock,
};

describe('getEditDocumentEntryPointAction', () => {
  it('returns the CaseDetail path when the editDocumentEntryPoint is set to CaseDetail', async () => {
    await runAction(getEditDocumentEntryPointAction, {
      modules: {
        presenter,
      },
      state: {
        editDocumentEntryPoint: 'CaseDetail',
      },
    });
    expect(caseDetailMock).toHaveBeenCalled();
  });

  it('returns the DocumentDetail path by default if state.editDocumentEntryPoint is not set', async () => {
    await runAction(getEditDocumentEntryPointAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(documentDetailMock).toHaveBeenCalled();
  });
});
