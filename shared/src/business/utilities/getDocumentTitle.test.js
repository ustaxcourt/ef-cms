const { getDocumentTitle } = require('./getDocumentTitle');

describe('getDocumentTitle', () => {
  it('returns an object with the case caption, case caption postfix, and the combined case caption with postfix', () => {
    const caseDetail = {
      caseCaption: 'Eve Brewer, Petitioner',
    };
    expect(getDocumentTitle(caseDetail)).toMatchObject({
      CASE_CAPTION_POSTFIX: CASE_CAPTION_POSTFIX,
      caseCaption: 'Eve Brewer, Petitioner',
      caseCaptionWithPostfix: `Eve Brewer, Petitioner ${CASE_CAPTION_POSTFIX}`,
    });
  });

  it('returns an object with the case title', () => {
    const caseDetail = {
      caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
    };
    expect(getDocumentTitle(caseDetail).caseTitle).toEqual(
      'Selma Horn & Cairo Harris',
    );
  });

  it('returns an object with the computed case caption extension for single petitioners', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
    };
    expect(getDocumentTitle(caseDetail).caseCaptionExtension).toEqual(
      PARTY_TYPES.petitioner,
    );
  });

  it('returns an object with the computed case caption extension for multiple petitioners', () => {
    const caseDetail = {
      caseCaption: 'Garrett Carpenter, Leslie Bullock, Trustee, Petitioner(s)',
    };
    expect(getDocumentTitle(caseDetail).caseCaptionExtension).toEqual(
      'Petitioner(s)',
    );
  });
});
