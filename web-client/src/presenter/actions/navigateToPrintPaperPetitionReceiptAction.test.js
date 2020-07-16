import { navigateToPrintPaperPetitionReceiptAction } from './navigateToPrintPaperPetitionReceiptAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToPrintPaperPetitionReceiptAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should navigate to the print paper petition receipt page with current page included the url', async () => {
    const mockDocketNumber = '123';
    const mockCurrentPage = 'DocumentQC';

    await runAction(navigateToPrintPaperPetitionReceiptAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        currentPage: mockCurrentPage,
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      `/case-detail/${mockDocketNumber}/print-paper-petition-receipt/${mockCurrentPage}`,
    );
  });
});
