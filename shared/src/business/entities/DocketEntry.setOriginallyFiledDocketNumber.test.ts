import { DocketEntry } from './DocketEntry';

describe('setOriginallyFiledDocketNumber', () => {
  it('should set the originallyFiledDocketNumber on the docket entry to the passed in docket number', () => {
    const mockDocketNumber = '101-23';
    const docketEntry = new DocketEntry(
      {
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '9000-01-01T00:00:00.000Z',
        index: 1,
      },
      { authorizedUser: undefined },
    );
    docketEntry.setOriginallyFiledDocketNumber(mockDocketNumber);
    expect(docketEntry.originallyFiledDocketNumber).toEqual(mockDocketNumber);
  });
});
