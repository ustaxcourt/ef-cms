import { applicationContextPublic } from '../../../applicationContextPublic';
import { runCompute } from 'cerebral/test';
import { todaysOpinionsHelper as todaysOpinionsHelperComputed } from './todaysOpinionsHelper';
import { withAppContextDecorator } from '../../../withAppContext';

const todaysOpinionsHelper = withAppContextDecorator(
  todaysOpinionsHelperComputed,
  applicationContextPublic,
);

let state;
describe('todaysOpinionsHelper', () => {
  beforeEach(() => {
    state = {
      baseUrl: 'https://www.example.com',
      todaysOpinions: [
        {
          caseCaption: 'Sauceboss, Petitioner',
          caseId: 'case-id-123',
          documentId: 'document-id-123',
          documentType: 'MOP - Memorandum Opinion',
          filingDate: '2020-06-11T20:17:10.646Z',
          judge: 'Guy Fieri',
        },
      ],
    };
  });

  it('should return the formattedOpinions as an array', () => {
    const result = runCompute(todaysOpinionsHelper, { state });
    expect(Array.isArray(result.formattedOpinions)).toBeTruthy();
    expect(result.formattedOpinions).toMatchObject([
      {
        caseCaption: 'Sauceboss, Petitioner',
        documentLink:
          'https://www.example.com/public-api/case-id-123/document-id-123/public-document-download-url',
        formattedDocumentType: 'Memorandum Opinion',
        formattedFilingDate: '06/11/20',
        formattedJudgeName: 'Fieri',
      },
    ]);
  });

  it('should return formattedCurrentDate', () => {
    const result = runCompute(todaysOpinionsHelper, { state });

    const currentDate = applicationContextPublic
      .getUtilities()
      .createISODateString();
    const formattedCurrentDate = applicationContextPublic
      .getUtilities()
      .formatDateString(currentDate, 'MMMM D, YYYY');

    expect(result.formattedCurrentDate).toEqual(formattedCurrentDate);
  });
});
