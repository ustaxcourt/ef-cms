const {
  CASE_CAPTION_POSTFIX,
  PARTY_TYPES,
} = require('../entities/EntityConstants');
const { getCaseCaptionMeta } = require('./getCaseCaptionMeta');

describe('getCaseCaptionMeta', () => {
  it('returns an object with the case caption, case caption postfix, and the combined case caption with postfix', () => {
    const caseDetail = {
      caseCaption: 'Eve Brewer, Petitioner',
    };
    expect(getCaseCaptionMeta(caseDetail)).toMatchObject({
      CASE_CAPTION_POSTFIX: CASE_CAPTION_POSTFIX,
      caseCaption: 'Eve Brewer, Petitioner',
      caseCaptionWithPostfix: `Eve Brewer, Petitioner ${CASE_CAPTION_POSTFIX}`,
    });
  });

  it('returns an object with the case title', () => {
    const caseDetail = {
      caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
    };
    expect(getCaseCaptionMeta(caseDetail).caseTitle).toEqual(
      'Selma Horn & Cairo Harris',
    );
  });

  it('returns an object with the computed case caption extension for single petitioners', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
    };
    expect(getCaseCaptionMeta(caseDetail).caseCaptionExtension).toEqual(
      PARTY_TYPES.petitioner,
    );
  });

  it('returns an object with the computed case caption extension for multiple petitioners', () => {
    const caseDetail = {
      caseCaption: 'Garrett Carpenter, Leslie Bullock, Trustee, Petitioner(s)',
    };
    expect(getCaseCaptionMeta(caseDetail).caseCaptionExtension).toEqual(
      'Petitioner(s)',
    );
  });
});
