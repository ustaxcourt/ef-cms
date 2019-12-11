const moment = require('moment');
const {
  ExternalDocumentInformationFactory,
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

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

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        baseDoc.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        );
        baseDoc.certificateOfServiceDate = moment().format();
        expect(errors().certificateOfServiceDate).toEqual(undefined);
      });

      it('should not allow certificate of service date to be in the future', () => {
        baseDoc.certificateOfServiceDate = moment()
          .add(1, 'days')
          .format();
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
        );
      });
    });

    it('should require attachments radio be selected', () => {
      expect(errors().attachments).toEqual(
        VALIDATION_ERROR_MESSAGES.attachments,
      );
      baseDoc.attachments = false;
      expect(errors().attachments).toEqual(undefined);
    });

    describe('Motion Document', () => {
      beforeEach(() => {
        baseDoc.category = 'Motion';
      });

      it('should require objections radio be selected', () => {
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        baseDoc.objections = 'Yes';
        expect(errors().objections).toEqual(undefined);
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
        baseDoc.supportingDocuments[0].certificateOfServiceDate = moment().format();
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
            baseDoc.secondarySupportingDocuments[0].certificateOfServiceDate = moment().format();
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
              baseDoc.secondarySupportingDocuments[0].supportingDocumentFile = {};
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
              baseDoc.secondarySupportingDocuments[0].supportingDocumentFile = {};
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

    it('should require one of [partyPrimary, partySecondary, partyRespondent] to be selected', () => {
      expect(errors().partyPrimary).toEqual(
        VALIDATION_ERROR_MESSAGES.partyPrimary,
      );
      baseDoc.partyRespondent = true;
      expect(errors().partyPrimary).toEqual(undefined);
    });

    describe('Consolidated Case filing to multiple cases', () => {
      beforeEach(() => {
        baseDoc.casesParties = {};
        baseDoc.selectedCases = ['101-19', '102-19'];
      });

      it('should require a party per case or partyRespondent to be selected', () => {
        expect(errors().partyPrimary).toEqual(
          VALIDATION_ERROR_MESSAGES.partyPrimary,
        );
      });

      describe('Responent Selected', () => {
        beforeEach(() => {
          baseDoc.partyRespondent = true;
        });

        it('should allow having only a respondent as a party to all cases', () => {
          expect(errors().partyPrimary).toEqual(undefined);
        });
      });

      describe('Party per case Selected', () => {
        beforeEach(() => {
          baseDoc.casesParties = {
            '101-19': { partyPrimary: true },
            '102-19': { partySecondary: true },
          };
        });

        it('should allow having a party to all cases', () => {
          expect(errors().partyPrimary).toEqual(undefined);
        });
      });

      describe('Party per selected case not selected', () => {
        beforeEach(() => {
          baseDoc.casesParties = {
            '101-19': { partyPrimary: true },
            '103-19': { partySecondary: true },
          };
        });

        it('should not allow having a insufficient account of parties to all cases', () => {
          expect(errors().partyPrimary).toEqual(
            VALIDATION_ERROR_MESSAGES.partyPrimary,
          );
        });
      });
    });
  });
});
