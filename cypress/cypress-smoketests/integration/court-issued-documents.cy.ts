import {
  addDocketEntryForOrderAndSaveForLater,
  addDocketEntryForOrderAndServePaper,
  addDocketEntryForUploadedPdfAndServe,
  addDocketEntryForUploadedPdfAndServePaper,
  clickSaveUploadedPdfButton,
  createOrder,
  editAndSignOrder,
  goToCaseDetail,
  serveCourtIssuedDocketEntry,
  uploadCourtIssuedDocPdf,
} from '../support/pages/case-detail';
import { petitionerCreatesACase } from '../../helpers/petitioner-creates-a-case';
import { petitionsclerkCreatesAndServesPaperPetition } from '../../helpers/petitionsclerk-creates-and-serves-paper-petition';
import { petitionsclerkServePetition } from '../../helpers/petitionsclerk-serves-petition';

describe('Court Issued Documents', { scrollBehavior: 'center' }, () => {
  it('should create a paper petition, serve the petition, and create an order on the petition', () => {
    petitionsclerkCreatesAndServesPaperPetition().then(
      createdPaperDocketNumber => {
        cy.login('docketclerk1');
        cy.getByTestId('inbox-tab-content').should('exist');
        createOrder(createdPaperDocketNumber);
        editAndSignOrder();
        addDocketEntryForOrderAndServePaper();
        goToCaseDetail(createdPaperDocketNumber);
        uploadCourtIssuedDocPdf();
        clickSaveUploadedPdfButton();
        addDocketEntryForUploadedPdfAndServePaper();
      },
    );
  });

  it('should create an e-filed petition, serve the petition, and create an order on the petition', () => {
    petitionerCreatesACase().then(createdPaperDocketNumber => {
      petitionsclerkServePetition(createdPaperDocketNumber);
      cy.login('docketclerk1');
      cy.getByTestId('inbox-tab-content').should('exist');
      createOrder(createdPaperDocketNumber);
      editAndSignOrder();
      addDocketEntryForOrderAndSaveForLater('0');
      serveCourtIssuedDocketEntry();
      goToCaseDetail(createdPaperDocketNumber);
      uploadCourtIssuedDocPdf();
      clickSaveUploadedPdfButton();
      addDocketEntryForUploadedPdfAndServe();
    });
  });
});
