import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocumentSigningAction } from './completeDocumentSigningAction-practice';
import { generateSignedDocumentInteractor } from '../../../../shared/src/business/useCases/generateSignedDocumentInteractor';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import fs from 'fs';

// see this for reference: shared/src/business/utilities/documentGenerators.test.js

describe('completeDocumentSigningAction', () => {
  const pdfList = [
    'pdfs/nvc-website.pdf',
    'pdfs/pdf-1.pdf',
    'pdfs/pdf-2.pdf',
    'pdfs/pdf-3.pdf',
  ];

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generateSignedDocumentInteractor.mockImplementation(
        generateSignedDocumentInteractor,
      );
    presenter.providers.applicationContext = applicationContext;
  });

  pdfList.forEach(filename => {
    it(`should sign ${filename} `, async () => {
      let pdfContents;
      pdfContents = new Uint8Array(fs.readFileSync(filename));
      expect(pdfContents).toBeDefined();

      global.pdfjsObj = {
        getData: () => Promise.resolve(pdfContents),
      };
      const result = await runAction(completeDocumentSigningAction, {
        modules: {
          presenter,
        },
        state: {
          pdfForSigning: {
            filename,
            nameForSigning: 'Maurice B. Foley',
            nameForSigningLine2: 'Chief Judge',
            pageNumber: 1,
            signatureData: {
              scale: 1,
              x: 0,
              y: 0,
            },
          },
        },
      });

      expect(result.output.signedPdfBytes).toBeDefined();
      fs.writeFileSync(
        filename.replace('.pdf', '-signed.pdf'),
        result.output.signedPdfBytes,
      );
    });
  });
});
