import { Case } from './Case';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('addDocketEntry', () => {
  it('should throw when docket entry to be added to the docket record is a STIN', () => {
    const caseToVerify = new Case(
      { docketNumber: '123-45' },
      {
        applicationContext,
      },
    );
    expect(() => {
      caseToVerify.addDocketEntry({
        docketEntryId: '123',
        documentType: 'Statement of Taxpayer Identification',
        eventCode: 'STIN',
        isOnDocketRecord: true,
        userId: 'petitionsClerk',
      });
    }).toThrow('STIN documents should not be on the docket record.');
  });

  it('should attach the docket entry to the case', () => {
    const caseToVerify = new Case(
      { docketNumber: '123-45' },
      {
        applicationContext,
      },
    );
    caseToVerify.addDocketEntry({
      docketEntryId: '123',
      documentType: 'Answer',
      userId: 'irsPractitioner',
    });
    expect(caseToVerify.docketEntries.length).toEqual(1);
    expect(caseToVerify.docketEntries[0]).toMatchObject({
      docketEntryId: '123',
      docketNumber: '123-45',
      documentType: 'Answer',
      userId: 'irsPractitioner',
    });
  });

  it("should assign docket entry index of '0' to the STIN when not being added to the docket record", () => {
    const caseToVerify = new Case(
      { docketNumber: '123-45' },
      {
        applicationContext,
      },
    );
    caseToVerify.addDocketEntry({
      docketEntryId: '123',
      documentType: 'Statement of Taxpayer Identification',
      eventCode: 'STIN',
      isOnDocketRecord: false,
      userId: 'petitionsClerk',
    });
    expect(caseToVerify.docketEntries.length).toEqual(1);
    expect(caseToVerify.docketEntries[0]).toMatchObject({
      docketEntryId: '123',
      docketNumber: '123-45',
      documentType: 'Statement of Taxpayer Identification',
      eventCode: 'STIN',
      index: 0,
      userId: 'petitionsClerk',
    });
  });
});
