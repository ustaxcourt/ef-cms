import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setDocumentDetailPageTitleAction } from './setDocumentDetailPageTitleAction';

presenter.providers.applicationContext = applicationContext;

describe('setDocumentDetailPageTitleAction', () => {
  it('sets the page title with the docket number and document type from the case if the document is on the case', async () => {
    await runAction(setDocumentDetailPageTitleAction, {
      state: {
        caseDetail: {
          docketNumber: '123-19',
          documents: [
            {
              documentId: '123-abc-123-abc',
            },
            { documentId: '321-cba-321-cba', documentType: 'Answer' },
          ],
        },
        documentId: '321-cba-321-cba',
      },
    });
    expect(window.document.title).toEqual(
      'Docket 123-19 | Answer | U.S. Tax Court',
    );
  });

  it('sets the page title with the docket number and hardcoded "Document details" if the document is not on the case', async () => {
    await runAction(setDocumentDetailPageTitleAction, {
      state: {
        caseDetail: {
          docketNumber: '123-19',
          documents: [
            {
              documentId: '123-abc-123-abc',
            },
            { documentId: '321-cba-321-cba', documentType: 'Answer' },
          ],
        },
        documentId: 'no',
      },
    });
    expect(window.document.title).toEqual(
      'Docket 123-19 | Document details | U.S. Tax Court',
    );
  });

  it('sets the page title with the docket number and hardcoded "Document details" if there are no documents on the case', async () => {
    await runAction(setDocumentDetailPageTitleAction, {
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        documentId: '321-cba-321-cba',
      },
    });
    expect(window.document.title).toEqual(
      'Docket 123-19 | Document details | U.S. Tax Court',
    );
  });
});
