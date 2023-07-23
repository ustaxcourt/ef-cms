import { A_VALID_DOCKET_ENTRY, MOCK_PETITIONERS } from './DocketEntry.test';
import { DocketEntry } from './DocketEntry';
import {
  EXTERNAL_DOCUMENT_TYPES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from './EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('isAutoServed', () => {
  it('should return true if the documentType is an external document and the document is not a Simultaneous Document', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Answer to Second Amendment to Petition',
        documentType: 'Answer to Second Amendment to Petition',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeTruthy();
  });

  it('should return true if the documentType is a practitioner association document and the document is not a Simultaneous Document', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Notice of Election to Participate',
        documentType: 'Notice of Election to Participate',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
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

  it('should return false if the documentType is an external document and the document title includes "Simultaneous" as these could be modified simultaneous briefs, not directly simultaneous', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Second Amended Simultaneous Reply Brief',
        documentType: EXTERNAL_DOCUMENT_TYPES[0],
        eventCode: 'AMAT',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeFalsy();
  });

  it('should return false if the document type includes "Simultaneous"', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
        eventCode: 'SIAB',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
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
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeFalsy();
  });
});
