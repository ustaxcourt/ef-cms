import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { petition } from './petition';

describe('generated petition', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Generated_Petition.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      petition({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner',
          caseDescription: 'Notice of Deficiency',
          caseTitle: 'Thaddeus Wilcox',
          contactCounsel: undefined,
          contactPrimary: {
            address1: '31 South Clarendon Freeway',
            address2: 'Est est qui fugit ',
            address3: 'Dignissimos eos veri',
            city: 'Aliquip possimus el',
            contactType: 'primary',
            countryType: 'domestic',
            email: 'petitioner@example.com',
            name: 'Thaddeus Wilcox',
            phone: '+1 (419) 437-7842',
            placeOfLegalResidence: 'NE',
            postalCode: '83310',
            state: 'LA',
          },
          contactSecondary: undefined,
          hasUploadedIrsNotice: false,
          irsNotices: [
            {
              caseDescription: 'Notice of Deficiency',
              caseType: 'Deficiency',
              cityAndStateIssuingOffice: 'Jackson, NJ',
              key: '74d1cdc6-7118-4f62-b6f7-c4a23e5ad4e4',
              noticeIssuedDate: '2024-08-06T00:00:00.000-04:00',
              noticeIssuedDateFormatted: '08/06/24',
              originalCaseType: 'Deficiency',
              taxYear: '2024',
              todayDate: '2024-08-22',
            },
          ],
          partyType: 'Petitioner',
          petitionFacts: ['Asperiores rem illum', 'Dolorem in laudantiu'],
          petitionReasons: ['In nisi magnam eius ', 'Iste dolorem sed fac'],
          preferredTrialCity: 'Birmingham, Alabama',
          procedureType: 'Regular',
        },
      }),
    testDescription: 'generates a petition',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Generated_Petition.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      petition({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner',
          caseDescription: 'Notice of Deficiency',
          caseTitle: 'Thaddeus Wilcox',
          contactCounsel: undefined,
          contactPrimary: {
            address1: '31 South Clarendon Freeway',
            address2: 'Est est qui fugit ',
            address3: 'Dignissimos eos veri',
            city: 'Aliquip possimus el',
            contactType: 'primary',
            countryType: 'domestic',
            email: 'petitioner@example.com',
            name: 'Thaddeus Wilcox',
            phone: '+1 (419) 437-7842',
            placeOfLegalResidence: 'NE',
            postalCode: '83310',
            state: 'LA',
          },
          contactSecondary: undefined,
          hasUploadedIrsNotice: false,
          irsNotices: [
            {
              caseDescription: 'Notice of Deficiency',
              caseType: 'Deficiency',
              cityAndStateIssuingOffice: 'Jackson, NJ',
              key: '74d1cdc6-7118-4f62-b6f7-c4a23e5ad4e4',
              noticeIssuedDate: '2024-08-06T00:00:00.000-04:00',
              noticeIssuedDateFormatted: '08/06/24',
              originalCaseType: 'Deficiency',
              taxYear: '2024',
              todayDate: '2024-08-22',
            },
          ],
          partyType: 'Petitioner',
          petitionFacts: ['Asperiores rem illum', 'Dolorem in laudantiu'],
          petitionReasons: ['In nisi magnam eius ', 'Iste dolorem sed fac'],
          preferredTrialCity: 'Birmingham, Alabama',
          procedureType: 'Regular',
        },
      }),
    testDescription: 'generates a petition',
  });
});
