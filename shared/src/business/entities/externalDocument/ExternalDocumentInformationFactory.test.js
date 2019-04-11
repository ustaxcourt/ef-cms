const moment = require('moment');
const {
  ExternalDocumentInformationFactory,
} = require('./ExternalDocumentInformationFactory');

describe('ExternalDocumentInformationFactory', () => {
  let baseDoc;

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
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().primaryDocumentFile,
      ).toEqual('A file was not selected.');
      baseDoc.primaryDocumentFile = {};
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().primaryDocumentFile,
      ).toEqual(undefined);
    });

    it('should require certificate of service radio be selected', () => {
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().certificateOfService,
      ).toEqual('Certificate Of Service is required.');
      baseDoc.certificateOfService = false;
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().certificateOfService,
      ).toEqual(undefined);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        baseDoc.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().certificateOfServiceDate,
        ).toEqual('You must provide a service date.');
        baseDoc.certificateOfServiceDate = moment().format();
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().certificateOfServiceDate,
        ).toEqual(undefined);
      });

      it('should not allow certificate of service date be in the future', () => {
        baseDoc.certificateOfServiceDate = moment()
          .add(1, 'days')
          .format();
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().certificateOfServiceDate,
        ).toEqual('Service date is in the future. Please enter a valid date.');
      });
    });

    it('should require exhibits radio be selected', () => {
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().exhibits,
      ).toEqual('Exhibits is required.');
      baseDoc.exhibits = false;
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().exhibits,
      ).toEqual(undefined);
    });

    it('should require attachments radio be selected', () => {
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().attachments,
      ).toEqual('Attachments is required.');
      baseDoc.attachments = false;
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().attachments,
      ).toEqual(undefined);
    });

    describe('Motion Document', () => {
      beforeEach(() => {
        baseDoc.category = 'Motion';
      });

      it('should require objections radio be selected', () => {
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().objections,
        ).toEqual('Objections is required.');
        baseDoc.objections = 'Yes';
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().objections,
        ).toEqual(undefined);
      });
    });

    it('should require has supporting documents radio be selected', () => {
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().hasSupportingDocuments,
      ).toEqual('Has Supporting Documents is required.');
      baseDoc.hasSupportingDocuments = false;
      expect(
        ExternalDocumentInformationFactory.get(
          baseDoc,
        ).getFormattedValidationErrors().hasSupportingDocuments,
      ).toEqual(undefined);
    });

    describe('Has Supporting Documents', () => {
      beforeEach(() => {
        baseDoc.hasSupportingDocuments = true;
      });

      it('should require supporting document type be entered', () => {
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().supportingDocument,
        ).toEqual('You must select a supporting document type.');
        baseDoc.supportingDocument = 'Brief';
        expect(
          ExternalDocumentInformationFactory.get(
            baseDoc,
          ).getFormattedValidationErrors().supportingDocument,
        ).toEqual(undefined);
      });

      describe('Brief Supporting Document', () => {
        beforeEach(() => {
          baseDoc.supportingDocument = 'Brief in Support';
        });

        it('should require supporting document file to be selected', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().supportingDocumentFile,
          ).toEqual('A file was not selected.');
          baseDoc.supportingDocumentFile = {};
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().supportingDocumentFile,
          ).toEqual(undefined);
        });
      });

      describe('Affidavit Supporting Document', () => {
        beforeEach(() => {
          baseDoc.supportingDocument = 'Affidavit in Support';
        });

        it('should require supporting document file to be selected', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().supportingDocumentFile,
          ).toEqual('A file was not selected.');
          baseDoc.supportingDocumentFile = {};
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().supportingDocumentFile,
          ).toEqual(undefined);
        });
        it('should require supporting document text to be added', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().supportingDocumentFreeText,
          ).toEqual('Please provide a value.');
          baseDoc.supportingDocumentFreeText = 'Something';
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().supportingDocumentFreeText,
          ).toEqual(undefined);
        });
      });
    });

    describe(`Scenario 'Nonstandard H' Secondary Document`, () => {
      beforeEach(() => {
        baseDoc.scenario = 'Nonstandard H';
      });

      describe('Motion for Leave to File', () => {
        beforeEach(() => {
          baseDoc.documentTitle = 'Motion for Leave to File';
          baseDoc.documentType = 'Motion for Leave to File';
        });

        it('should not require secondary document file be added', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().secondaryDocumentFile,
          ).toEqual(undefined);
        });
        it('should require has supporting secondary documents radio be selected', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().hasSecondarySupportingDocuments,
          ).toEqual('Has Secondary Supporting Documents is required.');
          baseDoc.hasSecondarySupportingDocuments = false;
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().hasSecondarySupportingDocuments,
          ).toEqual(undefined);
        });
      });

      describe('Motion for Leave to File Out of Time', () => {
        beforeEach(() => {
          baseDoc.documentTitle = 'Motion for Leave to File Out of Time';
          baseDoc.documentType = 'Motion for Leave to File Out of Time';
        });

        it('should require secondary document file be added', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().secondaryDocumentFile,
          ).toEqual('A file was not selected.');
          baseDoc.secondaryDocumentFile = {};
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().secondaryDocumentFile,
          ).toEqual(undefined);
        });
        it('should require has supporting secondary documents radio be selected', () => {
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().hasSecondarySupportingDocuments,
          ).toEqual('Has Secondary Supporting Documents is required.');
          baseDoc.hasSecondarySupportingDocuments = false;
          expect(
            ExternalDocumentInformationFactory.get(
              baseDoc,
            ).getFormattedValidationErrors().hasSecondarySupportingDocuments,
          ).toEqual(undefined);
        });

        describe('Has Supporting Secondary Documents', () => {
          beforeEach(() => {
            baseDoc.hasSecondarySupportingDocuments = true;
          });

          it('should require supporting secondary document type be entered', () => {
            expect(
              ExternalDocumentInformationFactory.get(
                baseDoc,
              ).getFormattedValidationErrors().secondarySupportingDocument,
            ).toEqual('Secondary supporting document type is required.');
            baseDoc.secondarySupportingDocument =
              'Unsworn Declaration under Penalty of Perjury in Support';
            expect(
              ExternalDocumentInformationFactory.get(
                baseDoc,
              ).getFormattedValidationErrors().secondarySupportingDocument,
            ).toEqual(undefined);
          });

          describe('Memorandum Supporting Secondary Document', () => {
            beforeEach(() => {
              baseDoc.secondarySupportingDocument = 'Memorandum in Support';
            });

            it('should require supporting secondary document file to be added', () => {
              expect(
                ExternalDocumentInformationFactory.get(
                  baseDoc,
                ).getFormattedValidationErrors()
                  .secondarySupportingDocumentFile,
              ).toEqual('A file was not selected.');
              baseDoc.secondarySupportingDocumentFile = {};
              expect(
                ExternalDocumentInformationFactory.get(
                  baseDoc,
                ).getFormattedValidationErrors()
                  .secondarySupportingDocumentFile,
              ).toEqual(undefined);
            });
          });

          describe('Declaration Supporting Secondary Document', () => {
            beforeEach(() => {
              baseDoc.secondarySupportingDocument = 'Declaration in Support';
            });

            it('should require supporting secondary document file to be selected', () => {
              expect(
                ExternalDocumentInformationFactory.get(
                  baseDoc,
                ).getFormattedValidationErrors()
                  .secondarySupportingDocumentFile,
              ).toEqual('A file was not selected.');
              baseDoc.secondarySupportingDocumentFile = {};
              expect(
                ExternalDocumentInformationFactory.get(
                  baseDoc,
                ).getFormattedValidationErrors()
                  .secondarySupportingDocumentFile,
              ).toEqual(undefined);
            });
            it('should require supporting secondary document text to be added', () => {
              expect(
                ExternalDocumentInformationFactory.get(
                  baseDoc,
                ).getFormattedValidationErrors()
                  .secondarySupportingDocumentFreeText,
              ).toEqual('Please provide a value.');
              baseDoc.secondarySupportingDocumentFreeText = 'Something';
              expect(
                ExternalDocumentInformationFactory.get(
                  baseDoc,
                ).getFormattedValidationErrors()
                  .secondarySupportingDocumentFreeText,
              ).toEqual(undefined);
            });
          });
        });
      });
    });
  });
});
