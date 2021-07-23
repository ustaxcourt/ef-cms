import { applicationContextPublic } from '../../../applicationContextPublic';
import { runCompute } from 'cerebral/test';
import { todaysOpinionsHelper as todaysOpinionsHelperComputed } from './todaysOpinionsHelper';
import { withAppContextDecorator } from '../../../withAppContext';

describe('todaysOpinionsHelper', () => {
  const todaysOpinionsHelper = withAppContextDecorator(
    todaysOpinionsHelperComputed,
    applicationContextPublic,
  );

  let state;

  beforeEach(() => {
    state = {
      todaysOpinions: [
        {
          caseCaption: 'Sauceboss, Petitioner',
          docketEntryId: 'document-id-123',
          docketNumber: '123-20',
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
        formattedFilingDate: '06/11/20',
        formattedJudgeName: 'Fieri',
      },
    ]);
  });

  it('sets numberOfPagesFormatted to n/a if numberOfPages is undefined', () => {
    const result = runCompute(todaysOpinionsHelper, { state });
    expect(result.formattedOpinions).toMatchObject([
      {
        numberOfPagesFormatted: 'n/a',
      },
    ]);
  });

  it('sets numberOfPagesFormatted to n/a if numberOfPages is undefined', () => {
    state.todaysOpinions[0].numberOfPages = 0;
    const result = runCompute(todaysOpinionsHelper, { state });
    expect(result.formattedOpinions).toMatchObject([
      {
        numberOfPagesFormatted: 0,
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

  describe('formattedJudgeName', () => {
    it('should be set to opinion.judge when it is defined', () => {
      const result = runCompute(todaysOpinionsHelper, { state });

      expect(result.formattedOpinions[0].formattedJudgeName).toEqual('Fieri');
    });

    it('should be set to opinion.signedJudgeName when opinion.judge is undefined', () => {
      state.todaysOpinions[0].judge = undefined;
      state.todaysOpinions[0].signedJudgeName = 'Judge Dredd';

      const result = runCompute(todaysOpinionsHelper, { state });

      expect(result.formattedOpinions[0].formattedJudgeName).toEqual('Dredd');
    });
  });
});
