const moment = require('moment');
const { CaseAssociationRequest } = require('./CaseAssociationRequest');

describe('CaseAssociationRequest', () => {
  let rawEntity;

  const errors = () =>
    CaseAssociationRequest(rawEntity).getFormattedValidationErrors();

  describe('Base', () => {
    beforeEach(() => {
      rawEntity = {};
    });

    it('should require a file', () => {
      expect(errors().primaryDocumentFile).toEqual('A file was not selected.');
      rawEntity.primaryDocumentFile = {};
      expect(errors().primaryDocumentFile).toEqual(undefined);
    });

    it('should require a certificate Of Service selection', () => {
      expect(errors().certificateOfService).toEqual(
        'Enter selection for Certificate of Service.',
      );
      rawEntity.certificateOfService = false;
      expect(errors().certificateOfService).toEqual(undefined);
    });

    it('should require document type', () => {
      expect(errors().documentType).toEqual('Select a document.');
      rawEntity.documentType = 'Entry of Appearance';
      expect(errors().documentType).toEqual(undefined);
    });

    it('should require document title', () => {
      expect(errors().documentTitle).toEqual('Select a document.');
      rawEntity.documentTitle = 'Entry of Appearance';
      expect(errors().documentTitle).toEqual(undefined);
    });

    it('should require event code', () => {
      expect(errors().eventCode).toEqual('Select a document.');
      rawEntity.eventCode = '345';
      expect(errors().eventCode).toEqual(undefined);
    });

    it('should require scenario title', () => {
      expect(errors().scenario).toEqual('Select a document.');
      rawEntity.scenario = 'Standard';
      expect(errors().scenario).toEqual(undefined);
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

    describe('Substitution of Counsel', () => {
      beforeEach(() => {
        rawEntity.documentTitle = 'Substitution of Counsel';
        rawEntity.documentType = 'Substitution of Counsel';
      });

      it('should require objections be selected', () => {
        expect(errors().objections).toEqual('Enter selection for Objections.');
        rawEntity.objections = 'No';
        expect(errors().objections).toEqual(undefined);
      });
    });

    it('should require one of [partyPrimary, partySecondary] to be selected', () => {
      expect(errors().partyPrimary).toEqual('Select a party.');
      rawEntity.partySecondary = true;
      expect(errors().partyPrimary).toEqual(undefined);
    });
  });
});
