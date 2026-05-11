import { ReconciliationReportEntry } from './ReconciliationReportEntry';

describe('ReconciliationReportEntry entity', () => {
  it('create a valid report entity', () => {
    const reportEntity = new ReconciliationReportEntry({
      caseCaption: 'some case caption',
      docketEntryId: '29b8c134-bfba-42fe-86c8-0d58b63f1b36',
      docketNumber: '303-21',
      documentTitle: 'some description',
      eventCode: 'APLD',
      filedBy: 'Resp. & Petr. Mona Schultz, Brianna Noble',
      filingDate: '2020-01-04T05:00:00.000Z',
      index: '1',
      isFileAttached: 'true',
      servedAt: '2021-03-16T17:15:25.685Z',
      servedPartiesCode: 'B',
      isSealed: false,
    });

    expect(reportEntity.isValid()).toBe(true);
  });
});
