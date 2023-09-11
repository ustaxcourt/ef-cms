import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generatePrintableFilingReceiptAction } from './generatePrintableFilingReceiptAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generatePrintableFilingReceiptAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call generatePrintableFilingReceiptInteractor', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          docketNumber: '123-19',
          primaryDocumentFile: {},
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
          fileAcrossConsolidatedGroup: true,
        },
      },
    });

    expect(
      applicationContext.getUseCases().generatePrintableFilingReceiptInteractor,
    ).toHaveBeenCalled();
  });
});
