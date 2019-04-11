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

    it('should require primary document file', () => {});

    it('should require certificate of service radio be selected', () => {});

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        baseDoc.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {});

      it('should require certificate of service date be in the past', () => {});
    });

    it('should require exhibits radio be selected', () => {});

    it('should require attachments radio be selected', () => {});

    describe('Motion Document', () => {
      beforeEach(() => {
        baseDoc.category = 'Motion';
      });

      it('should require objections radio be selected', () => {});
    });

    it('should require has supporting documents radio be selected', () => {});

    describe('Has Supporting Documents', () => {
      beforeEach(() => {
        baseDoc.hasSupportingDocuments = true;
      });

      it('should require supporting document type be entered', () => {});

      describe('Brief Supporting Document', () => {
        beforeEach(() => {
          baseDoc.supportingDocument = 'Brief';
        });

        it('should require supporting document file to be selected', () => {});
      });

      describe('Affidavit Supporting Document', () => {
        beforeEach(() => {
          baseDoc.supportingDocument = 'Affidavit';
        });

        it('should require supporting document file to be selected', () => {});
        it('should require supporting document text to be added', () => {});
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

        it('should not require secondary document file be added', () => {});
        it('should require has supporting secondary documents radio be selected', () => {});
      });

      describe('Motion for Leave to File Out of Time', () => {
        beforeEach(() => {
          baseDoc.documentTitle = 'Motion for Leave to File Out of Time';
          baseDoc.documentType = 'Motion for Leave to File Out of Time';
        });

        it('should require supporting document type be entered', () => {});
        it('should require has supporting secondary documents radio be selected', () => {});

        describe('Has Supporting Secondary Documents', () => {
          beforeEach(() => {
            baseDoc.hasSecondarySupportingDocuments = true;
          });

          it('should require supporting secondary document type be entered', () => {});

          describe('Memorandum Supporting Secondary Document', () => {
            beforeEach(() => {
              baseDoc.secondarySupportingDocument = 'Memorandum';
            });

            it('should require supporting secondary document file to be selected', () => {});
          });

          describe('Declaration Supporting Secondary Document', () => {
            beforeEach(() => {
              baseDoc.secondarySupportingDocument = 'Declaration';
            });

            it('should require supporting secondary document file to be selected', () => {});
            it('should require supporting secondary document text to be added', () => {});
          });
        });
      });
    });
  });
});
