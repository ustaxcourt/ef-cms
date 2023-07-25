import {
  POLICY_DATE_IMPACTED_EVENTCODES,
  TRANSCRIPT_EVENT_CODE,
} from '../EntityConstants';
import { PublicCase } from './PublicCase';
import { createISODateString } from '../../utilities/DateHandler';

describe('PublicCase isPrivateDocument', () => {
  const visibilityChangeDate = createISODateString('2023-08-01', 'yyyy-MM-dd');

  it('should return true for a transcript document', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
        eventCode: TRANSCRIPT_EVENT_CODE,
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(true);
  });

  it('should return true for an order document that is not on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        documentType: 'Order',
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(true);
  });

  it('should return true for a court-issued order document that is not on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        documentType: 'Order',
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(true);
  });

  it('should return false for a court-issued order document that is on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: '123',
        documentType: 'Order',
        isOnDocketRecord: true,
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(false);
  });

  it('should return false for a document with hasPolicyDateImpactedEventCode true that is on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: '123',
        eventCode: POLICY_DATE_IMPACTED_EVENTCODES[0],
        isOnDocketRecord: true,
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(false);
  });

  it('should return true for an external document', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        documentType: 'Petition',
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(true);
  });

  it('should return true for a court-issued document that is stricken', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: '123',
        documentType: 'Order',
        isOnDocketRecord: true,
        isStricken: true,
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(true);
  });

  it('should return true when the docket entry is an amended brief that was filed before the docket entry visibility policy date change', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: '1451c228-49d6-44a9-ac02-d797be308661',
        documentType: 'Amended',
        eventCode: 'AMAT',
        filingDate: '2000-12-02T05:00:00.000Z',
        isOnDocketRecord: true,
        isStricken: false,
        previousDocument: {
          docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
          documentType: 'Seriatim Answering Brief',
        },
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(true);
  });

  it('should return false when the docket entry is an amended brief that was filed after the docket entry visibility policy date change', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: '1451c228-49d6-44a9-ac02-d797be308661',
        documentType: 'Amended',
        eventCode: 'AMAT',
        filingDate: '3000-12-02T05:00:00.000Z',
        isOnDocketRecord: true,
        isStricken: false,
        previousDocument: {
          docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
          documentType: 'Seriatim Answering Brief',
        },
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(false);
  });

  it('should return true when the docket entry is an amended petition that was filed after the docket entry visibility policy date change', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: '1451c228-49d6-44a9-ac02-d797be308661',
        documentType: 'Amended',
        eventCode: 'AMAT',
        filingDate: '3000-12-02T05:00:00.000Z',
        isOnDocketRecord: true,
        isStricken: false,
        previousDocument: {
          docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
          documentType: 'Petition',
        },
      },
      visibilityChangeDate,
    );

    expect(isPrivate).toEqual(false);
  });
});
