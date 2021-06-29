import {
  CONTACT_TYPES,
  PARTY_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_USERS } from '../../../../shared/src/test/mockUsers';
import { applicationContext } from '../../applicationContext';
import { capitalize } from 'lodash';
import { fileDocumentHelper as fileDocumentHelperComputed } from './fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

applicationContext.getCurrentUser = () =>
  MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'];

const fileDocumentHelper = withAppContextDecorator(
  fileDocumentHelperComputed,
  applicationContext,
);

describe('fileDocumentHelper', () => {
  beforeEach(() => {
    state.form = {};
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

  it('does not show secondary objection if secondary document type is a motion and secondary document file is not selected', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        documentType: 'Motion for Continuance',
      },
    };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.primaryDocument.showObjection).toBeTruthy();
    expect(result.secondaryDocument.showObjection).toBeFalsy();
  });

  it('shows secondary objection if secondary document type is a motion and secondary document file is selected', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        documentType: 'Motion for Continuance',
      },
      secondaryDocumentFile: 'something',
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

  it('shows secondary party for petitionerSpouse or petitionerDeceasedSpouse', () => {
    state.caseDetail.partyType = PARTY_TYPES.petitionerSpouse;
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
    state.validationErrors = { filers: 'You did something bad.' };
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  describe('supporting documents', () => {
    beforeEach(() => {
      state.form.hasSupportingDocuments = true;
      state.form.hasSecondarySupportingDocuments = true;
    });

    it('shows Add Supporting Document button and not limit reached message when supportingDocuments is undefined', () => {
      const result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeTruthy();
      expect(result.showAddSupportingDocumentsLimitReached).toBeFalsy();
    });

    it('shows Add Supporting Document button and not limit reached message when supportingDocuments length is less than 5', () => {
      state.form.supportingDocuments = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
      ];
      const result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeTruthy();
      expect(result.showAddSupportingDocumentsLimitReached).toBeFalsy();
    });

    it('does not show Add Supporting Document button and shows limit reached message when supportingDocuments length is 5 or greater', () => {
      state.form.supportingDocuments = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ];
      let result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeFalsy();
      expect(result.showAddSupportingDocumentsLimitReached).toBeTruthy();
      state.form.supportingDocuments = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        { id: '6' },
      ];
      result = runCompute(fileDocumentHelper, { state });
      expect(result.showAddSupportingDocuments).toBeFalsy();
      expect(result.showAddSupportingDocumentsLimitReached).toBeTruthy();
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
        { supportingDocument: 'Some Document type' },
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

    describe('selected cases (consolidated cases)', () => {
      it('formats nothing if none are selected', () => {
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.formattedDocketNumbers).toEqual(null);
      });

      it('formats one selected case', () => {
        state.form.selectedCases = ['101-19'];
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.formattedDocketNumbers).toEqual('101-19');
      });

      it('formats two selected cases', () => {
        state.form.selectedCases = ['100-19', '101-19'];
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.formattedDocketNumbers).toEqual('100-19 & 101-19');
      });

      it('formats three selected cases', () => {
        state.form.selectedCases = ['100-19', '101-19', '102-19'];
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.formattedDocketNumbers).toEqual(
          '100-19, 101-19 & 102-19',
        );
      });

      it('formats three, out-of-order selected cases', () => {
        state.form.selectedCases = ['104-19', '101-19', '102-19'];
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.formattedDocketNumbers).toEqual(
          '101-19, 102-19 & 104-19',
        );
      });
    });

    describe('for secondary supporting document', () => {
      it('shows Add Secondary Supporting Document button and not limit reached message when secondarySupportingDocuments is undefined', () => {
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeTruthy();
        expect(
          result.showAddSecondarySupportingDocumentsLimitReached,
        ).toBeFalsy();
      });

      it('does not show Add Secondary Supporting Document button or limit reached message when primary document type is Motion for Leave to File and secondary file is not selected', () => {
        state.form.documentType = 'Motion for Leave to File';
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeFalsy();
        expect(
          result.showAddSecondarySupportingDocumentsLimitReached,
        ).toBeFalsy();
      });

      it('shows Add Secondary Supporting Document button and not limit reached message when secondarySupportingDocuments length is less than 5', () => {
        state.form.secondarySupportingDocuments = [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
        ];
        const result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeTruthy();
        expect(
          result.showAddSecondarySupportingDocumentsLimitReached,
        ).toBeFalsy();
      });

      it('does not show Add Secondary Supporting Document button and shows limit reached message when secondarySupportingDocuments length is 5 or greater', () => {
        state.form.secondarySupportingDocuments = [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ];
        let result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeFalsy();
        expect(
          result.showAddSecondarySupportingDocumentsLimitReached,
        ).toBeTruthy();
        state.form.secondarySupportingDocuments = [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
          { id: '6' },
        ];
        result = runCompute(fileDocumentHelper, { state });
        expect(result.showAddSecondarySupportingDocuments).toBeFalsy();
        expect(
          result.showAddSecondarySupportingDocumentsLimitReached,
        ).toBeTruthy();
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

  it('shows the multi select form and map cases when there are many cases to file', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      selectedCases: ['101-19', '102-19'],
    };
    state.caseDetail.consolidatedCases = [
      {
        ...MOCK_CASE,
        docketEntries: null,
        docketNumber: '101-19',
        docketRecord: null,
      },
      {
        ...MOCK_CASE,
        docketEntries: null,
        docketNumber: '102-19',
        docketRecord: null,
      },
    ];
    const result = runCompute(fileDocumentHelper, { state });
    expect(result.showMultiDocumentFilingPartyForm).toBeTruthy();
    expect(result.selectedCasesAsCase).toMatchObject([
      { docketNumber: '101-19' },
      { docketNumber: '102-19' },
    ]);
  });

  describe('filingPartiesNames', () => {
    const mockPrimaryContactId = '4e53fade-4966-4efe-8b01-0cb5f587eb47';
    const mockTaxMattersContactId = 'd5a09816-f01e-4c1f-bf81-f96c55c2eef5';
    const mockIntervenorContactId = '68a1e378-6e96-4e61-b06g-2cb4e6c22f47';

    beforeEach(() => {
      state.form = {
        filersMap: {
          [mockIntervenorContactId]: true,
          [mockPrimaryContactId]: true,
          [mockTaxMattersContactId]: false,
        },
      };

      state.caseDetail = {
        petitioners: [
          {
            contactId: mockPrimaryContactId,
            contactType: CONTACT_TYPES.primary,
            name: 'bob',
          },
          {
            contactId: mockTaxMattersContactId,
            contactType: CONTACT_TYPES.participant,
            name: 'sally',
          },
          {
            contactId: mockIntervenorContactId,
            contactType: CONTACT_TYPES.intervenor,
            name: 'rick',
          },
        ],
      };
    });

    it('should be set to the names of all filing petitioners and their titles', () => {
      const { formattedFilingParties } = runCompute(fileDocumentHelper, {
        state,
      });

      expect(formattedFilingParties).toEqual([
        `rick, ${capitalize(CONTACT_TYPES.intervenor)}`,
        'bob, Petitioner',
      ]);
    });
  });
});
