import { CASE_CAPTION_POSTFIX, PARTY_TYPES } from '../entities/EntityConstants';
import { getCaseCaptionMeta } from './getCaseCaptionMeta';

describe('getCaseCaptionMeta', () => {
  it('returns an empty string for caseCaptionWithPostfix if the case caption on case detail is undefined or empty, such as when the info is not available on a sealed case', () => {
    expect(getCaseCaptionMeta({}).caseCaptionWithPostfix).toEqual('');
    expect(getCaseCaptionMeta({}).caseCaptionWithPostfix.trim()).not.toEqual(
      CASE_CAPTION_POSTFIX,
    );
    expect(
      getCaseCaptionMeta({ caseCaption: '' }).caseCaptionWithPostfix,
    ).toEqual('');
  });

  it('returns an object with the case caption, case caption postfix, and the combined case caption with postfix', () => {
    const caseDetail = {
      caseCaption: 'Eve Brewer, Petitioner',
    };
    expect(getCaseCaptionMeta(caseDetail)).toMatchObject({
      CASE_CAPTION_POSTFIX,
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
