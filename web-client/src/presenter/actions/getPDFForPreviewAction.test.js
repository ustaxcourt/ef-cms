import { getPDFForPreviewAction } from './getPDFForPreviewAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockLoadPDF = jest.fn().mockResolvedValue('fake file data');

presenter.providers.applicationContext = {
  getUseCases: () => ({
    loadPDFForPreviewInteractor: mockLoadPDF,
  }),
};

describe('getPDFForPreviewAction', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns original props if we already have what appears to be an actual file', async () => {
    const props = { file: { name: 'name of a file on a real file object' } };
    const result = await runAction(getPDFForPreviewAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });
    expect(result.props).toEqual(props);
    expect(mockLoadPDF).not.toHaveBeenCalled();
  });

  it('returns results from loadPDFForPreviewInteractor if provided a caseId and documentId', async () => {
    const props = { file: { caseId: '123', documentId: '456' } };
    await runAction(getPDFForPreviewAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });
    expect(mockLoadPDF).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseId: '123',
      documentId: '456',
    });
  });
});
