import { runCompute } from 'cerebral/test';

import { CATEGORY_MAP } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/contacts/PetitionContact';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP,
    PARTY_TYPES,
  },
  form: {},
};

import { fileDocumentHelper } from './fileDocumentHelper';

describe('fileDocumentHelper', () => {
  it('should be sane', () => {
    expect(fileDocumentHelper).toBeDefined();
  });
  it('returns correct values when documentType is undefined', async () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      isSecondaryDocumentUploadOptional: false,
      showObjection: false,
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
      showSecondaryParty: false,
    };

    const result = await runCompute(fileDocumentHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });
  it('returns a correctly-formatted list of supporting documents', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.supportingDocumentTypeList.length > 0).toBeTruthy();

    expect(
      result.supportingDocumentTypeList[0].documentTypeDisplay,
    ).not.toMatch('in Support');
  });
  it('has optional secondary document upload when motion for leave to file', () => {});
  it('shows objection if document type is a motion', () => {});
  it('indicates file uploads are valid', () => {});
  it('shows secondary party for petionerSpouse or petitionerDeceasedSpouse', () => {});
  it('shows supporting document fields when required', () => {});
});
