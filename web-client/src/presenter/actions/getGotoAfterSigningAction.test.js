import { getGotoAfterSigningAction } from './getGotoAfterSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const mockCaseDetail = jest.fn();
const mockDocumentDetail = jest.fn();

describe('getGotoAfterSigningAction', () => {
  beforeAll(() => {
    presenter.providers.path = {
      CaseDetail: mockCaseDetail,
      DocumentDetail: mockDocumentDetail,
    };
  });

  it('calls the path for the given props.gotoAfterSigning', async () => {
    await runAction(getGotoAfterSigningAction, {
      modules: {
        presenter,
      },
      props: {
        gotoAfterSigning: 'DocumentDetail',
      },
    });
    expect(mockDocumentDetail).toHaveBeenCalled();
  });

  it('calls path.CaseDetail() if no props.gotoAfterSigning is provided', async () => {
    await runAction(getGotoAfterSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(mockCaseDetail).toHaveBeenCalled();
  });
});
