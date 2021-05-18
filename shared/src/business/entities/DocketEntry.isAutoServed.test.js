const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('isAutoServed', () => {
  it('should return true if the documentType is an external document and the documentTitle does not contain Simultaneous', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Answer to Second Amendment to Petition',
        documentType: 'Answer to Second Amendment to Petition',
      },
      { applicationContext },
    );
    expect(docketEntry.isAutoServed()).toBeTruthy();
  });

  it('should return true if the documentType is a practitioner association document and the documentTitle does not contain Simultaneous', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Notice of Election to Participate',
        documentType: 'Notice of Election to Participate',
      },
      { applicationContext },
    );
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Entry of Appearance';
    docketEntry.documentType = 'Entry of Appearance';
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Notice of Election to Intervene';
    docketEntry.documentType = 'Notice of Election to Intervene';
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Notice of Election to Participate';
    docketEntry.documentType = 'Notice of Election to Participate';
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Notice of Intervention';
    docketEntry.documentType = 'Notice of Intervention';
    expect(docketEntry.isAutoServed()).toBeTruthy();
  });

  it('should return false if the documentType is an external document and the documentTitle contains Simultaneous', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Amended Simultaneous Memoranda of Law',
      },
      { applicationContext },
    );
    expect(docketEntry.isAutoServed()).toBeFalsy();
  });

  it('should return false if the documentType is an external document and the documentType contains Simultaneous', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: 'Amended Simultaneous Memoranda of Law',
      },
      { applicationContext },
    );
    expect(docketEntry.isAutoServed()).toBeFalsy();
  });

  it('should return false if the documentType is an internally-filed document', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Application for Examination Pursuant to Rule 73',
        documentType: 'Application for Examination Pursuant to Rule 73',
      },
      { applicationContext },
    );
    expect(docketEntry.isAutoServed()).toBeFalsy();
  });
});
