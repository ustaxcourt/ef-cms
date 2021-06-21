const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  ExternalDocumentInformationFactory,
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { OBJECTIONS_OPTIONS_MAP } = require('../EntityConstants');

describe('ExternalDocumentInformationFactory', () => {
  let baseDoc;

  const errors = () =>
    ExternalDocumentInformationFactory.get(
      baseDoc,
    ).getFormattedValidationErrors();

  describe('Standard Document', () => {
    beforeEach(() => {
      baseDoc = {
        category: 'Application',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        filers: ['d85d07b7-fdb8-4f94-9a09-69c2a38e95d4'],
        scenario: 'Standard',
      };
    });

    it('should require primary document file', () => {
      expect(errors().primaryDocumentFile).toEqual(
        VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      );
      baseDoc.primaryDocumentFile = {};
      expect(errors().primaryDocumentFile).toEqual(undefined);
    });

    it('should require certificate of service radio be selected', () => {
      expect(errors().certificateOfService).toEqual(
        VALIDATION_ERROR_MESSAGES.certificateOfService,
      );
      baseDoc.certificateOfService = false;
      expect(errors().certificateOfService).toEqual(undefined);
    });

    it('should set a default value for attachments when a value has not been provided', () => {
      baseDoc.certificateOfService = false;
      baseDoc.primaryDocumentFile = {};
      baseDoc.partyIrsPractitioner = true;
      baseDoc.hasSupportingDocuments = false;
      baseDoc.attachments = undefined;
      expect(errors()).toBe(null);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        baseDoc.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        );
        baseDoc.certificateOfServiceDate = createISODateString();
        expect(errors().certificateOfServiceDate).toEqual(undefined);
      });

      it('should not allow certificate of service date to be in the future', () => {
        baseDoc.certificateOfServiceDate = calculateISODate({
          howMuch: 1,
          unit: 'days',
        });
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
        );
      });
    });

    it('should require attachments radio be selected', () => {
      baseDoc.attachments = false;
      expect(errors().attachments).toEqual(undefined);
    });

    describe('Motion Document', () => {
      beforeEach(() => {
        baseDoc = {
          category: 'Motion',
          documentType: 'Motion for Continuance',
          filers: ['d85d07b7-fdb8-4f94-9a09-69c2a38e95d4'],
        };
      });

      it('should require objections radio be selected', () => {
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        baseDoc.objections = OBJECTIONS_OPTIONS_MAP.YES;

        expect(errors().objections).toEqual(undefined);
      });

      it('should require objections for an Amended document with a Motion previousDocument', () => {
        baseDoc = {
          category: 'Miscellaneous',
          documentType: 'Amended',
          eventCode: 'AMAT',
          filers: ['d85d07b7-fdb8-4f94-9a09-69c2a38e95d4'],
          previousDocument: {
            documentType: 'Motion for Continuance',
          },
        };

        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        baseDoc.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(errors().objections).toEqual(undefined);
      });

      it('should not require objections for an Amended document without a Motion previousDocument', () => {
        baseDoc = {
          category: 'Miscellaneous',
          documentType: 'Amended',
          eventCode: 'AMAT',
          filers: ['d85d07b7-fdb8-4f94-9a09-69c2a38e95d4'],
          previousDocument: {
            documentType: 'Answer',
          },
        };

        expect(errors().objections).toBeUndefined();
      });
    });

    it('should require has supporting documents radio be selected', () => {
      expect(errors().hasSupportingDocuments).toEqual(
        VALIDATION_ERROR_MESSAGES.hasSupportingDocuments,
      );
      baseDoc.hasSupportingDocuments = false;
      expect(errors().hasSupportingDocuments).toEqual(undefined);
    });

    describe('Has Supporting Documents', () => {
      beforeEach(() => {
        baseDoc.hasSupportingDocuments = true;
        baseDoc.supportingDocuments = [
          { attachments: false, certificateOfService: false },
        ];
      });

      it('should require supporting document type be entered', () => {
        expect(errors().supportingDocuments[0].supportingDocument).toEqual(
          VALIDATION_ERROR_MESSAGES.supportingDocument,
        );
        baseDoc.supportingDocuments[0].supportingDocument = 'Brief';
        expect(errors().supportingDocuments).toEqual(undefined);
      });

      it('should require supporting document type be entered for second supporting doc if first supporting doc is valid', () => {
        baseDoc.supportingDocuments = [
          {
            attachments: false,
            certificateOfService: false,
            supportingDocument: 'brief',
          },
          { attachments: false, certificateOfService: false },
        ];
        expect(errors().supportingDocuments[0]).toEqual({
          index: 1,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        });
      });

      it('should require certificate of service date to be entered if certificateOfService is true', () => {
        baseDoc.supportingDocuments[0].certificateOfService = true;
        baseDoc.supportingDocuments[0].supportingDocument = 'brief';
        expect(
          errors().supportingDocuments[0].certificateOfServiceDate,
        ).toEqual(VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1]);
        baseDoc.supportingDocuments[0].certificateOfServiceDate =
          createISODateString();
        expect(errors().supportingDocuments).toEqual(undefined);
      });

      describe('Brief Supporting Document', () => {
        beforeEach(() => {
          baseDoc.supportingDocuments = [
            {
              attachments: false,
              certificateOfService: false,
              supportingDocument: 'Brief in Support',
            },
          ];
        });

        it('should require supporting document file to be selected', () => {
          expect(
            errors().supportingDocuments[0].supportingDocumentFile,
          ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocumentFile);
          baseDoc.supportingDocuments[0].supportingDocumentFile = {};
          expect(errors().supportingDocuments).toEqual(undefined);
        });
      });

      describe('Affidavit Supporting Document', () => {
        beforeEach(() => {
          baseDoc.supportingDocuments = [
            { supportingDocument: 'Affidavit in Support' },
          ];
        });

        it('should require supporting document file to be selected', () => {
          expect(
            errors().supportingDocuments[0].supportingDocumentFile,
          ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocumentFile);
          baseDoc.supportingDocuments[0].supportingDocumentFile = {};
          expect(
            errors().supportingDocuments[0].supportingDocumentFile,
          ).toEqual(undefined);
        });

        it('should require supporting document text to be added', () => {
          expect(
            errors().supportingDocuments[0].supportingDocumentFreeText,
          ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText);
          baseDoc.supportingDocuments[0].supportingDocumentFreeText =
            'Something';
          expect(
            errors().supportingDocuments[0].supportingDocumentFreeText,
          ).toEqual(undefined);
        });
      });
    });

    describe("Scenario 'Nonstandard H' Secondary Document", () => {
      beforeEach(() => {
        baseDoc.scenario = 'Nonstandard H';
      });

      describe('Motion for Leave to File', () => {
        beforeEach(() => {
          baseDoc.documentTitle = 'Motion for Leave to File';
          baseDoc.documentType = 'Motion for Leave to File';
        });

        it('should not require secondary document file be added', () => {
          expect(errors().secondaryDocumentFile).toEqual(undefined);
        });

        it('should not require objections for secondary document if file is not added and secondary document is a Motion', () => {
          baseDoc.secondaryDocument = {
            category: 'Motion',
            documentType: 'Motion for Continuance',
          };
          expect(errors().secondaryDocument).toBeUndefined();
        });

        it('should require objections for secondary document if file is added and secondary document is a Motion', () => {
          baseDoc.secondaryDocumentFile = {};
          baseDoc.secondaryDocument = {
            category: 'Motion',
            documentType: 'Motion for Continuance',
          };
          expect(errors().secondaryDocument.objections).toEqual(
            VALIDATION_ERROR_MESSAGES.objections,
          );
        });

        it("should not require 'has supporting secondary documents' radio be selected", () => {
          expect(errors().hasSecondarySupportingDocuments).toEqual(undefined);
        });

        describe('Secondary document file added', () => {
          beforeEach(() => {
            baseDoc.secondaryDocumentFile = {};
          });

          it("should require 'has supporting secondary documents' radio be selected", () => {
            expect(errors().hasSecondarySupportingDocuments).toEqual(
              VALIDATION_ERROR_MESSAGES.hasSecondarySupportingDocuments,
            );
            baseDoc.hasSecondarySupportingDocuments = false;
            expect(errors().hasSecondarySupportingDocuments).toEqual(undefined);
          });

          it('should require certificateOfServiceDate if secondary document file is selected and certificateOfService is true', () => {
            baseDoc.secondaryDocument = { certificateOfService: true };
            expect(errors().secondaryDocument.certificateOfServiceDate).toEqual(
              VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
            );
          });
        });
      });

      describe('Motion for Leave to File Out of Time', () => {
        beforeEach(() => {
          baseDoc.documentTitle = 'Motion for Leave to File Out of Time';
          baseDoc.documentType = 'Motion for Leave to File Out of Time';
        });

        it('should require secondary document file be added', () => {
          expect(errors().secondaryDocumentFile).toEqual(
            VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
          );
          baseDoc.secondaryDocumentFile = {};
          expect(errors().secondaryDocumentFile).toEqual(undefined);
        });

        it("should not require 'has supporting secondary documents' radio be selected", () => {
          expect(errors().hasSecondarySupportingDocuments).toEqual(undefined);
        });

        describe('Secondary document file added', () => {
          beforeEach(() => {
            baseDoc.secondaryDocumentFile = {};
          });

          it("should require 'has supporting secondary documents' radio be selected", () => {
            expect(errors().hasSecondarySupportingDocuments).toEqual(
              VALIDATION_ERROR_MESSAGES.hasSecondarySupportingDocuments,
            );
            baseDoc.hasSecondarySupportingDocuments = false;
            expect(errors().hasSecondarySupportingDocuments).toEqual(undefined);
          });
        });

        describe('Has Supporting Secondary Documents', () => {
          beforeEach(() => {
            baseDoc.hasSecondarySupportingDocuments = true;
            baseDoc.secondarySupportingDocuments = [
              {
                attachments: false,
                certificateOfService: false,
                filers: ['28374b33-b487-4dba-884d-070817465b68'],
              },
            ];
          });

          it('should require supporting secondary document type be entered', () => {
            expect(
              errors().secondarySupportingDocuments[0].supportingDocument,
            ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocument);
            baseDoc.secondarySupportingDocuments[0].supportingDocument =
              'brief';
            expect(errors().secondarySupportingDocuments).toEqual(undefined);
          });

          it('should require certificate of service date to be entered if certificateOfService is true', () => {
            baseDoc.secondarySupportingDocuments[0].certificateOfService = true;
            baseDoc.secondarySupportingDocuments[0].supportingDocument =
              'brief';
            expect(
              errors().secondarySupportingDocuments[0].certificateOfServiceDate,
            ).toEqual(VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1]);
            baseDoc.secondarySupportingDocuments[0].certificateOfServiceDate =
              createISODateString();
            expect(errors().secondarySupportingDocuments).toEqual(undefined);
          });

          describe('Memorandum Supporting Secondary Document', () => {
            beforeEach(() => {
              baseDoc.secondarySupportingDocuments = [
                {
                  attachments: false,
                  certificateOfService: false,
                  supportingDocument: 'Memorandum in Support',
                },
              ];
            });

            it('should require supporting secondary document file to be added', () => {
              expect(
                errors().secondarySupportingDocuments[0].supportingDocumentFile,
              ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocumentFile);
              baseDoc.secondarySupportingDocuments[0].supportingDocumentFile =
                {};
              expect(errors().secondarySupportingDocuments).toEqual(undefined);
            });
          });

          describe('Declaration Supporting Secondary Document', () => {
            beforeEach(() => {
              baseDoc.secondarySupportingDocuments = [
                {
                  attachments: false,
                  certificateOfService: false,
                  supportingDocument: 'Declaration in Support',
                },
              ];
            });

            it('should require supporting secondary document file to be selected', () => {
              expect(
                errors().secondarySupportingDocuments[0].supportingDocumentFile,
              ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocumentFile);
              baseDoc.secondarySupportingDocuments[0].supportingDocumentFile =
                {};
              expect(
                errors().secondarySupportingDocuments[0].supportingDocumentFile,
              ).toEqual(undefined);
            });

            it('should require supporting secondary document text to be added', () => {
              expect(
                errors().secondarySupportingDocuments[0]
                  .supportingDocumentFreeText,
              ).toEqual(VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText);
              baseDoc.secondarySupportingDocuments[0].supportingDocumentFreeText =
                'Something';
              expect(
                errors().secondarySupportingDocuments[0]
                  .supportingDocumentFreeText,
              ).toEqual(undefined);
            });
          });
        });
      });
    });

    it('should require one of [filers, partyIrsPractitioner] to be selected', () => {
      baseDoc.filers = [];
      expect(errors().filers).toEqual(VALIDATION_ERROR_MESSAGES.filers);
      baseDoc.partyIrsPractitioner = true;
      expect(errors().filers).toEqual(undefined);
    });

    describe('Consolidated Case filing to multiple cases', () => {
      beforeEach(() => {
        baseDoc.casesParties = {};
        baseDoc.selectedCases = ['101-19', '102-19'];
        baseDoc.filers = [];
      });

      it('should require a party per case or partyIrsPractitioner to be selected', () => {
        expect(errors().filers).toEqual(VALIDATION_ERROR_MESSAGES.filers);
      });

      describe('IRS Practitioner Selected', () => {
        beforeEach(() => {
          baseDoc.partyIrsPractitioner = true;
        });

        it('should allow having only an irsPractitioner as a party to all cases', () => {
          expect(errors().filers).toEqual(undefined);
        });
      });

      describe('Party per selected case not selected', () => {
        beforeEach(() => {
          baseDoc.casesParties = {
            '101-19': { filers: ['s234234-dfsdlkj'] },
          };
        });

        it('should not allow having a insufficient account of parties to all cases', () => {
          expect(errors().filers).toEqual(VALIDATION_ERROR_MESSAGES.filers);
        });
      });
    });
  });
});
