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

  it('returns correct values when documentType is undefined', async () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      isSecondaryDocumentUploadOptional: false,
      primaryDocument: { showObjection: false },
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

  it('has optional secondary document upload when motion for leave to file', async () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.isSecondaryDocumentUploadOptional).toBeTruthy();
  });

  it('shows primary objection if primary document type is a motion', async () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
  });

  it('shows secondary objection if secondary document type is a motion', async () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        documentType: 'Motion for Continuance',
      },
    };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
    expect(result.secondaryDocument.showObjection).toBeTruthy();
  });

  it('does not show primary objection if primary document type is not a motion', async () => {
    state.form = {
      documentType: 'Supplemental Brief',
    };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeFalsy();
    expect(result.secondaryDocument.showObjection).toBeFalsy();
  });

  it('does not show secondary objection if secondary document type is not a motion', async () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        documentType: 'Supplemental Brief',
      },
    };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
    expect(result.secondaryDocument.showObjection).toBeFalsy();
  });

  it('indicates file uploads are valid', async () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      primaryDocumentFile: { some: 'file' },
      secondaryDocumentFile: { some: 'file' },
    };

    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
    expect(result.showSecondaryDocumentValid).toBeTruthy();
  });

  it('shows secondary party for petionerSpouse or petitionerDeceasedSpouse', async () => {
    state.caseDetail.partyType = ContactFactory.PARTY_TYPES.petitionerSpouse;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('generates correctly formatted service date', async () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('shows Filing Includes on review page if certificateOfService is true', async () => {
    state.form.certificateOfService = true;
    state.form.certificateOfServiceDate = '2018-01-01';
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);
  });

  it('does not show Filing Includes if certOfService, exhibits, and attachments are all false', async () => {
    state.form.certificateOfService = false;
    state.form.attachments = false;
    state.form.exhibits = false;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingIncludes).toEqual(false);
  });

  it('shows Filing Does Not Include if exhibits is false', async () => {
    state.form.exhibits = false;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);
  });

  it('does not show Filing Does Not Include if certOfService, exhibits, attachments, and hasSupportingDocuments are all true', async () => {
    state.form.certificateOfService = true;
    state.form.attachments = true;
    state.form.exhibits = true;
    state.form.hasSupportingDocuments = true;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(false);
  });

  it('does not show party validation error if none of the party validation errors exists', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', async () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('does not show practitioner option under Parties Filing if caseDetail contains undefined or empty practitioners array', async () => {
    let result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();

    state.caseDetail.practitioners = [];
    result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();
  });

  it('shows practitioner option under Parties Filing if caseDetail contains practitioners', async () => {
    state.caseDetail.practitioners = [
      { name: 'Test Practitioner', role: 'practitioner' },
    ];
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeTruthy();
  });

  describe('supporting documents', () => {
    beforeEach(() => {
      state.form.hasSupportingDocuments = true;
      state.form.hasSecondarySupportingDocuments = true;
    });

    it('not shown if no type selected', async () => {
      state.form.supportingDocuments = [{ supportingDocument: '' }];
      const result = await runCompute(fileDocumentHelper, { state });
      expect(
        result.supportingDocuments[0].showSupportingDocumentFreeText,
      ).toBeFalsy();
      expect(
        result.supportingDocuments[0].showSupportingDocumentUpload,
      ).toBeFalsy();
    });

    it('upload file is shown when supporting type is not empty', async () => {
      state.form.supportingDocuments = [
        { supportingDocument: 'Some Document Type' },
      ];
      const result = await runCompute(fileDocumentHelper, { state });
      expect(
        result.supportingDocuments[0].showSupportingDocumentFreeText,
      ).toBeFalsy();
      expect(
        result.supportingDocuments[0].showSupportingDocumentUpload,
      ).toBeTruthy();
    });

    it('upload file and signature are shown for type Affidavit in Support', async () => {
      state.form.supportingDocuments = [
        { supportingDocument: 'Affidavit in Support' },
      ];
      const result = await runCompute(fileDocumentHelper, { state });
      expect(
        result.supportingDocuments[0].showSupportingDocumentFreeText,
      ).toBeTruthy();
      expect(
        result.supportingDocuments[0].showSupportingDocumentUpload,
      ).toBeTruthy();
    });

    describe('for secondary supporting document', () => {
      it('not shown if no type selected', async () => {
        state.form.secondarySupportingDocuments = [
          { secondarySupportingDocument: '' },
        ];
        const result = await runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0]
            .showSecondarySupportingDocumentFreeText,
        ).toBeFalsy();
        expect(
          result.secondarySupportingDocuments[0]
            .showSecondarySupportingDocumentUpload,
        ).toBeFalsy();
      });

      it('upload file is shown when supporting type is not empty', async () => {
        state.form.secondarySupportingDocuments = [
          { secondarySupportingDocument: 'Declaration of Undying Love' },
        ];
        const result = await runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0]
            .showSecondarySupportingDocumentFreeText,
        ).toBeFalsy();
        expect(
          result.secondarySupportingDocuments[0]
            .showSecondarySupportingDocumentUpload,
        ).toBeTruthy();
      });

      it('upload file and signature are shown for type Affidavit in Support', async () => {
        state.form.secondarySupportingDocuments = [
          { secondarySupportingDocument: 'Affidavit in Support' },
        ];
        const result = await runCompute(fileDocumentHelper, { state });
        expect(
          result.secondarySupportingDocuments[0]
            .showSecondarySupportingDocumentFreeText,
        ).toBeTruthy();
        expect(
          result.secondarySupportingDocuments[0]
            .showSecondarySupportingDocumentUpload,
        ).toBeTruthy();
      });
    });
  });
});
