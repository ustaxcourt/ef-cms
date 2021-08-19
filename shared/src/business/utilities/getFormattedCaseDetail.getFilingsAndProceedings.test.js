const { getFilingsAndProceedings } = require('./getFormattedCaseDetail');
const { OBJECTIONS_OPTIONS_MAP } = require('../entities/EntityConstants');

describe('getFilingsAndProceedings', () => {
  it('returns a value based on document properties (attachments, C/S,  objections, and lodged)', () => {
    const result = getFilingsAndProceedings({
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDateFormatted: '11/12/1999',
      lodged: true,
      objections: OBJECTIONS_OPTIONS_MAP.YES,
    });

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
    });

    expect(result).toEqual('(No Objection)');
  });
});
