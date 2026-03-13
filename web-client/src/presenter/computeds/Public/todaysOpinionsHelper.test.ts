import { applicationContextPublic } from '../../../applicationContextPublic';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { todaysOpinionsHelper as todaysOpinionsHelperComputed } from './todaysOpinionsHelper';
import { withAppContextDecorator } from '../../../withAppContext';
import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';

describe('todaysOpinionsHelper', () => {
  const todaysOpinionsHelper = withAppContextDecorator(
    todaysOpinionsHelperComputed,
    applicationContextPublic,
  );

  let state;

  beforeEach(() => {
    state = {
      todaysOpinionsTableSort: {
        sortField: 'filingDate',
        sortOrder: DESCENDING,
        stateKey: 'todaysOpinionsTableSort',
      },
      todaysOpinions: [
        {
          caseCaption: 'Sauceboss, Petitioner',
          docketEntryId: 'document-id-123',
          docketNumber: '123-20',
          documentType: 'MOP - Memorandum Opinion',
          filingDate: '2020-06-11T20:17:10.646Z',
          judge: 'Roslindis Angelino',
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
        formattedJudgeName: 'Angelino',
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

  it('sets numberOfPagesFormatted to 0 if numberOfPages is 0', () => {
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
      .formatDateString(currentDate, 'MONTH_DAY_YEAR');

    expect(result.formattedCurrentDate).toEqual(formattedCurrentDate);
  });

  it('should return sortOptions', () => {
    const result = runCompute(todaysOpinionsHelper, { state });
    expect(Array.isArray(result.sortOptions)).toBeTruthy();
    expect(result.sortOptions.length).toBeGreaterThan(0);
  });

  describe('formattedJudgeName', () => {
    it('should be set to opinion.judge when it is defined', () => {
      const result = runCompute(todaysOpinionsHelper, { state });

      expect(result.formattedOpinions[0].formattedJudgeName).toEqual(
        'Angelino',
      );
    });

    it('should be set to opinion.signedJudgeName when opinion.judge is undefined', () => {
      state.todaysOpinions[0].judge = undefined;
      state.todaysOpinions[0].signedJudgeName = 'Judge Dredd';

      const result = runCompute(todaysOpinionsHelper, { state });

      expect(result.formattedOpinions[0].formattedJudgeName).toEqual('Dredd');
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      state.todaysOpinions = [
        {
          caseCaption: 'Bravo, Petitioner',
          docketEntryId: 'id-2',
          docketNumber: '200-21',
          documentType: 'SOP - Summary Opinion',
          filingDate: '2021-03-01T10:00:00.000Z',
          judge: 'Bravo',
          numberOfPages: 5,
        },
        {
          caseCaption: 'Alpha, Petitioner',
          docketEntryId: 'id-1',
          docketNumber: '100-20',
          documentType: 'MOP - Memorandum Opinion',
          filingDate: '2020-06-11T20:17:10.646Z',
          judge: 'Angelino',
          numberOfPages: 10,
        },
        {
          caseCaption: 'Charlie, Petitioner',
          docketEntryId: 'id-3',
          docketNumber: '300-22',
          documentType: 'T - T Opinion',
          filingDate: '2022-01-15T08:00:00.000Z',
          judge: 'Chong',
          numberOfPages: 2,
        },
      ];
    });

    it('sorts by filingDate descending (newest first)', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'filingDate',
        sortOrder: DESCENDING,
        sortKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      const dates = result.formattedOpinions.map(o => o.filingDate);
      expect(dates[0]).toEqual('2022-01-15T08:00:00.000Z');
      expect(dates[2]).toEqual('2020-06-11T20:17:10.646Z');
    });

    it('sorts by filingDate ascending (oldest first)', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'filingDate',
        sortOrder: ASCENDING,
        stateKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      const dates = result.formattedOpinions.map(o => o.filingDate);
      expect(dates[0]).toEqual('2020-06-11T20:17:10.646Z');
      expect(dates[2]).toEqual('2022-01-15T08:00:00.000Z');
    });

    it('sorts by caseCaption ascending', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'caseCaption',
        sortOrder: ASCENDING,
        stateKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      expect(result.formattedOpinions[0].caseCaption).toEqual(
        'Alpha, Petitioner',
      );
      expect(result.formattedOpinions[2].caseCaption).toEqual(
        'Charlie, Petitioner',
      );
    });

    it('sorts by caseCaption descending', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'caseCaption',
        sortOrder: DESCENDING,
        stateKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      expect(result.formattedOpinions[0].caseCaption).toEqual(
        'Charlie, Petitioner',
      );
      expect(result.formattedOpinions[2].caseCaption).toEqual(
        'Alpha, Petitioner',
      );
    });

    it('sorts by numberOfPages ascending', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'numberOfPages',
        sortOrder: ASCENDING,
        stateKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      expect(result.formattedOpinions[0].numberOfPages).toEqual(2);
      expect(result.formattedOpinions[2].numberOfPages).toEqual(10);
    });

    it('sorts by numberOfPages descending', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'numberOfPages',
        sortOrder: DESCENDING,
        stateKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      expect(result.formattedOpinions[0].numberOfPages).toEqual(10);
      expect(result.formattedOpinions[2].numberOfPages).toEqual(2);
    });

    it('sorts by docketNumber ascending', () => {
      state.todaysOpinionsTableSort = {
        sortField: 'docketNumber',
        sortOrder: ASCENDING,
        sortKey: 'todaysOpinionsTableSort',
      };
      const result = runCompute(todaysOpinionsHelper, { state });
      expect(result.formattedOpinions[0].docketNumber).toEqual('100-20');
      expect(result.formattedOpinions[2].docketNumber).toEqual('300-22');
    });
  });
});
