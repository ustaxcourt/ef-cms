const moment = require('moment');
const { DocketEntryFactory } = require('./DocketEntryFactory');

describe('DocketEntryFactory', () => {
  let rawEntity;

  const errors = () =>
    DocketEntryFactory(rawEntity).getFormattedValidationErrors();

  describe('Base', () => {
    beforeEach(() => {
      rawEntity = {};
    });

    it('should require a file', () => {
      expect(errors().primaryDocumentFile).toEqual('A file was not selected.');
      rawEntity.primaryDocumentFile = {};
      expect(errors().primaryDocumentFile).toEqual(undefined);
    });

    it('should not require a Filing Status selection', () => {
      expect(errors().lodged).toEqual(undefined);
    });

    it('should require received date be entered', () => {
      expect(errors().dateReceived).toEqual('Enter date received.');
      rawEntity.dateReceived = moment().format();
      expect(errors().dateReceived).toEqual(undefined);
    });

    it('should not allow received date be in the future', () => {
      rawEntity.dateReceived = moment()
        .add(1, 'days')
        .format();
      expect(errors().dateReceived).toEqual(
        'Received date is in the future. Please enter a valid date.',
      );
    });

    it('should require event code', () => {
      expect(errors().eventCode).toBeDefined();
    });

    describe('Document Type', () => {
      beforeEach(() => {
        rawEntity = {
          ...rawEntity,
          category: 'Answer',
          documentTitle: '[First, Second, etc.] Amendment to Answer',
          documentType: 'Amendment to Answer',
          scenario: 'Nonstandard G',
        };
      });

      it('should require non standard fields', () => {
        expect(errors().ordinalValue).toEqual('Select an iteration.');
        rawEntity.ordinalValue = 'First';
        expect(errors().ordinalValue).toEqual(undefined);
      });
    });

    it('should require one of [partyPrimary, partySecondary, partyRespondent] to be selected', () => {
      expect(errors().partyPrimary).toEqual('Select a filing party.');
      rawEntity.partySecondary = true;
      expect(errors().partyPrimary).toEqual(undefined);
    });

    it('should require one of [partyPrimary, partySecondary, partyRespondent, partyPractitioner] to be selected', () => {
      rawEntity.practitioner = [
        {
          name: 'Test Practitioner',
          partyPractitioner: false,
        },
        {
          name: 'Test Practitioner1',
          partyPractitioner: false,
        },
      ];
      rawEntity.partyPrimary = false;
      expect(errors().partyPrimary).toEqual('Select a filing party.');
    });

    it('should have no errors if a single partyPractitioner is true', () => {
      rawEntity.practitioner = [
        {
          name: 'Test Practitioner',
          partyPractitioner: true,
        },
        {
          name: 'Test Practitioner1',
          partyPractitioner: false,
        },
      ];
      rawEntity.partyPrimary = false;
      expect(errors().partyPrimary).toEqual(undefined);
    });

    it('should not require Additional Info 1', () => {
      expect(errors().additionalInfo).toEqual(undefined);
    });

    it('should not require Additional Info 2', () => {
      expect(errors().additionalInfo2).toEqual(undefined);
    });

    it('should not require add to cover sheet', () => {
      expect(errors().addToCoversheet).toEqual(undefined);
    });

    describe('Inclusions', () => {
      it('should not require Certificate of Service', () => {
        expect(errors().certificateOfService).toEqual(undefined);
      });

      describe('Has Certificate of Service', () => {
        beforeEach(() => {
          rawEntity.certificateOfService = true;
        });

        it('should require certificate of service date be entered', () => {
          expect(errors().certificateOfServiceDate).toEqual(
            'Enter a Certificate of Service Date.',
          );
          rawEntity.certificateOfServiceDate = moment().format();
          expect(errors().certificateOfServiceDate).toEqual(undefined);
        });

        it('should not allow certificate of service date be in the future', () => {
          rawEntity.certificateOfServiceDate = moment()
            .add(1, 'days')
            .format();
          expect(errors().certificateOfServiceDate).toEqual(
            'Certificate of Service date is in the future. Please enter a valid date.',
          );
        });
      });

      it('should not require Exhibits', () => {
        expect(errors().exhibits).toEqual(undefined);
      });

      it('should not require Attachments', () => {
        expect(errors().attachments).toEqual(undefined);
      });

      it('should not require Objections', () => {
        expect(errors().objections).toEqual(undefined);
      });

      describe('Motion Document', () => {
        beforeEach(() => {
          rawEntity.category = 'Motion';
        });

        it('should require Objections', () => {
          expect(errors().objections).toEqual(
            'Enter selection for Objections.',
          );
          rawEntity.objections = 'No';
          expect(errors().objections).toEqual(undefined);
        });
      });

      describe('Nonstandard H', () => {
        beforeEach(() => {
          rawEntity.scenario = 'Nonstandard H';
        });

        it('should require secondary file', () => {
          expect(errors().secondaryDocumentFile).toEqual(
            'A file was not selected.',
          );
          rawEntity.secondaryDocumentFile = {};
          expect(errors().secondaryDocumentFile).toEqual(undefined);
        });

        describe('Secondary Document', () => {
          beforeEach(() => {
            rawEntity.secondaryDocument = {};
          });

          it('should validate secondary document', () => {
            expect(errors().secondaryDocument).toEqual({
              category: 'Select a Category.',
              documentType: 'Select a Document Type.',
            });
          });
        });
      });
    });
  });
});
