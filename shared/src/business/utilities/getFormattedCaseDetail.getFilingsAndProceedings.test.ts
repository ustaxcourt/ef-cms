import { OBJECTIONS_OPTIONS_MAP } from '../entities/EntityConstants';
import { getFilingsAndProceedings } from './getFormattedCaseDetail';

type rawDocketEntryPlusCsDateFormatted = RawDocketEntry & {
  certificateOfServiceDateFormatted: string;
};

describe('getFilingsAndProceedings', () => {
  it('returns a value based on document properties (attachments, C/S,  objections, and lodged)', () => {
    const result = getFilingsAndProceedings({
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDateFormatted: '11/12/1999',
      lodged: true,
      objections: OBJECTIONS_OPTIONS_MAP.YES,
    } as rawDocketEntryPlusCsDateFormatted);

    expect(result).toEqual(
      '(C/S 11/12/1999) (Attachment(s)) (Objection) (Lodged)',
    );
  });

  it('returns a value based on document properties with no objections', () => {
    const result = getFilingsAndProceedings({
      attachments: false,
      certificateOfService: false,
      lodged: false,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
    } as rawDocketEntryPlusCsDateFormatted);

    expect(result).toEqual('(No Objection)');
  });
});
