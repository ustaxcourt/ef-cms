import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { order } from './order';

describe('orders and notices', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Stephanie A. Servoss',
          orderContent: `<p>This is some sample notice text.</p>

        <p>NOTICE that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

        <p>NOTICE that the joint motion to remand to respondent's Appeals Office is granted and these cases are
        remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>`,
          orderTitle: 'NOTICE',
          titleOfClerk: 'Clerk of the Court',
        },
      }),
    testDescription: 'generates a Notice document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent: `<p>&emsp;&emsp;&emsp;Upon due consideration ofthe parties' joint motion to remand, filed December 30, 2019, and the parties' joint motion for continuance, filed December 30, 2019, it is</p>

        <p>&emsp;&emsp;&emsp;ORDERED that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
        remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
        located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
        reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
        remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
        located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
        reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
        remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
        located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
        reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
        remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
        located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
        reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
        located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
        reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>
        
        <p>&emsp;&emsp;&emsp;ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
        located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
        reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

        <p>&emsp;&emsp;&emsp;ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>`,
          orderTitle: 'ORDER',
        },
      }),
    testDescription: 'generates an Order document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order_For_Filing_Fee.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForFilingFee.content,
          orderTitle:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForFilingFee.documentTitle,
        },
      }),
    testDescription: 'generates an Order for Filing Fee document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order_To_Show_Cause.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderPetitionersToShowCause.content,
          orderTitle:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderPetitionersToShowCause
              .documentTitle,
        },
      }),
    testDescription: 'generates an Order To Show Cause document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order_For_Amended_Petition.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetition.content,
          orderTitle:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetition
              .documentTitle,
        },
      }),
    testDescription: 'generates an Order for Amended Petition',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order_Designating_Place_Of_Trial.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderDesignatingPlaceOfTrial
              .content,
          orderTitle:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderDesignatingPlaceOfTrial
              .documentTitle,
        },
      }),
    testDescription: 'generates an Order Designating Place Of Trial',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order_For_Amended_Petition_And_Filing_Fee.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
              .content,
          orderTitle:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
              .documentTitle,
        },
      }),
    testDescription: 'generates an Order for Amended Petition and Filing Fee',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Order_For_Notice_Added_Docket_Numbers.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      order({
        applicationContext,
        data: {
          addedDocketNumbers: [
            '101-20',
            '102-20',
            '103-20',
            '104-20',
            '105-20',
            '106-20',
          ],
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
              .content,
          orderTitle:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
              .documentTitle,
        },
      }),
    testDescription: 'generates an Notice with added docket entries',
  });
});
