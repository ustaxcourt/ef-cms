import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { Document } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { fileDocumentHelper as fileDocumentHelperComputed } from './fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP: Document.CATEGORY_MAP,
    PARTY_TYPES: ContactFactory.PARTY_TYPES,
  },
  form: {},
  validationErrors: {},
};

const fileDocumentHelper = withAppContextDecorator(fileDocumentHelperComputed);

describe('fileDocumentHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns empty object when caseDetail is empty', () => {
    let testState = {
      caseDetail: {},
      constants: {
        CATEGORY_MAP: Document.CATEGORY_MAP,
        PARTY_TYPES: ContactFactory.PARTY_TYPES,
      },
    };

    const result = runCompute(fileDocumentHelper, {
      state: testState,
    });
    expect(result).toMatchObject({});
  });

  it('returns correct values when documentType is undefined', () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      isSecondaryDocumentUploadOptional: false,
      primaryDocument: { showObjection: false },
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
      showSecondaryParty: false,
    };

    const result = runCompute(fileDocumentHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });

  it('returns a correctly-formatted list of supporting documents', () => {
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.supportingDocumentTypeList.length > 0).toBeTruthy();

    expect(
      result.supportingDocumentTypeList[0].documentTypeDisplay,
    ).not.toMatch('in Support');
  });

  it('has optional secondary document upload when motion for leave to file', () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.isSecondaryDocumentUploadOptional).toBeTruthy();
  });

  it('does not show secondary inclusions if document type is motion for leave to file and a secondary document has not been selected', () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showSecondaryDocumentInclusionsForm).toBeFalsy();
  });

  it('shows secondary inclusions if document type is motion for leave to file and a secondary document has been selected', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocumentFile: 'something',
    };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showSecondaryDocumentInclusionsForm).toBeTruthy();
  });

  it('shows primary objection if primary document type is a motion', () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
  });

  it('shows secondary objection if secondary document type is a motion', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        documentType: 'Motion for Continuance',
      },
    };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
    expect(result.secondaryDocument.showObjection).toBeTruthy();
  });

  it('does not show primary objection if primary document type is not a motion', () => {
    state.form = {
      documentType: 'Supplemental Brief',
    };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeFalsy();
    expect(result.secondaryDocument.showObjection).toBeFalsy();
  });

  it('does not show secondary objection if secondary document type is not a motion', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        documentType: 'Supplemental Brief',
      },
    };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
    expect(result.secondaryDocument.showObjection).toBeFalsy();
  });

  it('indicates file uploads are valid', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      primaryDocumentFile: { some: 'file' },
      secondaryDocumentFile: { some: 'file' },
    };

    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
    expect(result.showSecondaryDocumentValid).toBeTruthy();
  });

  it('shows secondary party for petionerSpouse or petitionerDeceasedSpouse', () => {
    state.caseDetail.partyType = ContactFactory.PARTY_TYPES.petitionerSpouse;
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('generates correctly formatted service date', () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('generates correctly formatted service date for secondary document', () => {
    state.form.secondaryDocument = {
      certificateOfService: true,
      certificateOfServiceDate: '2012-06-30',
    };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.secondaryDocument.certificateOfServiceDateFormatted).toEqual(
      '06/30/12',
    );
  });

  it('does not generate a formatted service date if a service date is not entered on the form', () => {
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('does not generate a formatted service date for secondary document if a service date is not entered on the form', () => {
    state.form.secondaryDocument = undefined;
    const result = runCompute(fileDocumentHelper, { state });
    expect(
      result.secondaryDocument.certificateOfServiceDateFormatted,
    ).toBeUndefined();
  });

  it('shows Filing Includes on review page if certificateOfService is true', () => {
    state.form.certificateOfService = true;
    state.form.certificateOfServiceDate = '2018-01-01';
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);
  });

  it('does not show Filing Includes if certOfService and attachments are false', () => {
    state.form.certificateOfService = false;
    state.form.attachments = false;
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showFilingIncludes).toEqual(false);
  });

  it('does not show party validation error if none of the party validation errors exists', () => {
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('does not show practitioner option under Parties Filing if caseDetail contains undefined or empty practitioners array', () => {
    let result = runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();

    state.caseDetail.practitioners = [];
    result = runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();
  });

  it('shows practitioner option under Parties Filing if caseDetail contains practitioners', () => {
    state.caseDetail.practitioners = [
      { name: 'Test Practitioner', role: 'practitioner' },
    ];
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeTruthy();
  });

  describe('supporting documents', () => {
    beforeEach(() => {
      state.form.hasSupportingDocuments = true;
      state.form.hasSecondarySupportingDocuments = true;
    });

    it('shows Add Supporting Document button when supportingDocumentCount is undefined', () => {
      const result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeTruthy();
    });

    it('shows Add Supporting Document button when supportingDocumentCount is less than 5', () => {
      state.form.supportingDocumentCount = 4;
      const result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeTruthy();
    });

    it('does not show Add Supporting Document button when supportingDocumentCount is 5 or greater', () => {
      state.form.supportingDocumentCount = 5;
      let result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeFalsy();
      state.form.supportingDocumentCount = 6;
      result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeFalsy();
    });

    it('upload and free text not shown if no type selected', () => {
      state.form.supportingDocuments = [{ supportingDocument: '' }];
      const result = runCompute(fileDocumentHelper, { state });
      expect(
        result.supportingDocuments[0].showSupportingDocumentFreeText,
      ).toBeFalsy();
      expect(
        result.supportingDocuments[0].showSupportingDocumentUpload,
      ).toBeFalsy();
    });

    it('upload file is shown when supporting type is not empty', () => {
      state.form.supportingDocuments = [
        { supportingDocument: 'Some Document Type' },
      ];
      const result = runCompute(fileDocumentHelper, { state });
      expect(
        result.supportingDocuments[0].showSupportingDocumentFreeText,
      ).toBeFalsy();
      expect(
        result.supportingDocuments[0].showSupportingDocumentUpload,
      ).toBeTruthy();
    });

    it('upload file and signature are shown for type Affidavit in Support', () => {
      state.form.supportingDocuments = [
        { supportingDocument: 'Affidavit in Support' },
      ];
      const result = runCompute(fileDocumentHelper, { state });
      expect(
        result.supportingDocuments[0].showSupportingDocumentFreeText,
      ).toBeTruthy();
      expect(
        result.supportingDocuments[0].showSupportingDocumentUpload,
      ).toBeTruthy();
    });

    it('filing includes is shown if attachments is true', () => {
      state.form.supportingDocuments = [{ attachments: true }];
      const result = runCompute(fileDocumentHelper, { state });
      expect(result.supportingDocuments[0].showFilingIncludes).toBeTruthy();
    });

    it('certificate of service date is properly formatted', () => {
      state.form.supportingDocuments = [
        {
          certificateOfService: true,
          certificateOfServiceDate: '2019-01-01',
        },
      ];
      const result = runCompute(fileDocumentHelper, { state });
      expect(result.supportingDocuments[0].showFilingIncludes).toBeTruthy();
      expect(
        result.supportingDocuments[0].certificateOfServiceDateFormatted,
      ).toEqual('01/01/19');
    });

    describe('for secondary supporting document', () => {
      it('shows Add Secondary Supporting Document button when secondarySupportingDocumentCount is undefined', () => {
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeTruthy();
      });

      it('does not show Add Secondary Supporting Document button when primary document type is Motion for Leave to File and secondary file is not selected', () => {
        state.form.documentType = 'Motion for Leave to File';
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeFalsy();
      });

      it('shows Add Secondary Supporting Document button when secondarySupportingDocumentCount is less than 5', () => {
        state.form.secondarySupportingDocumentCount = 4;
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeTruthy();
      });

      it('does not show Add Secondary Supporting Document button when secondarySupportingDocumentCount is 5 or greater', () => {
        state.form.secondarySupportingDocumentCount = 5;
        let result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeFalsy();
        state.form.secondarySupportingDocumentCount = 6;
        result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeFalsy();
      });

      it('upload and free text not shown if no type selected', () => {
        state.form.secondarySupportingDocuments = [{ supportingDocument: '' }];
        const result = runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0].showSupportingDocumentFreeText,
        ).toBeFalsy();
        expect(
          result.secondarySupportingDocuments[0].showSupportingDocumentUpload,
        ).toBeFalsy();
      });

      it('upload file is shown when supporting type is not empty', () => {
        state.form.secondarySupportingDocuments = [
          { supportingDocument: 'Declaration of Undying Love' },
        ];
        const result = runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0].showSupportingDocumentFreeText,
        ).toBeFalsy();
        expect(
          result.secondarySupportingDocuments[0].showSupportingDocumentUpload,
        ).toBeTruthy();
      });

      it('upload file and signature are shown for type Affidavit in Support', () => {
        state.form.secondarySupportingDocuments = [
          { supportingDocument: 'Affidavit in Support' },
        ];
        const result = runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0].showSupportingDocumentFreeText,
        ).toBeTruthy();
        expect(
          result.secondarySupportingDocuments[0].showSupportingDocumentUpload,
        ).toBeTruthy();
      });

      it('filing includes is shown if attachments is true', () => {
        state.form.secondarySupportingDocuments = [{ attachments: true }];
        const result = runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0].showFilingIncludes,
        ).toBeTruthy();
      });

      it('certificate of service date is properly formatted', () => {
        state.form.secondarySupportingDocuments = [
          {
            certificateOfService: true,
            certificateOfServiceDate: '2019-01-01',
          },
        ];
        const result = runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0].showFilingIncludes,
        ).toBeTruthy();
        expect(
          result.secondarySupportingDocuments[0]
            .certificateOfServiceDateFormatted,
        ).toEqual('01/01/19');
      });
    });
  });
});
