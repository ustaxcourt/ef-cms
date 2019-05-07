const moment = require('moment');
const {
  CaseAssociationRequestFactory,
} = require('./CaseAssociationRequestFactory');

describe('CaseAssociationRequestFactory', () => {
  let rawEntity;

  const errors = () =>
    CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors();

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

    it('should require document title template', () => {
      expect(errors().documentTitleTemplate).toEqual('Select a document.');
      rawEntity.documentTitleTemplate =
        'Entry of Appearance for [Petitioner Names]';
      expect(errors().documentTitleTemplate).toEqual(undefined);
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

      it('should require certificate of service date to be entered', () => {
        expect(errors().certificateOfServiceDate).toEqual(
          'Enter a Certificate of Service Date.',
        );
        rawEntity.certificateOfServiceDate = moment().format();
        expect(errors().certificateOfServiceDate).toEqual(undefined);
      });

      it('should not allow certificate of service date to be in the future', () => {
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
        rawEntity.documentTitleTemplate =
          'Substitution of Counsel for [Petitioner Names]';
        rawEntity.documentType = 'Substitution of Counsel';
      });

      it('should require objections be selected', () => {
        expect(errors().objections).toEqual('Enter selection for Objections.');
        rawEntity.objections = 'No';
        expect(errors().objections).toEqual(undefined);
      });
    });

    it('should require one of [representingPrimary, representingSecondary] to be selected', () => {
      expect(errors().representingPrimary).toEqual('Select a party.');
      rawEntity.representingSecondary = true;
      expect(errors().representingPrimary).toEqual(undefined);
    });

    describe('title generation', () => {
      it('should generate valid title for representingPrimary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          representingPrimary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual('Substitution of Counsel for Petr. Test Petitioner');
      });

      it('should generate valid title for representingSecondary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          representingSecondary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual('Substitution of Counsel for Petr. Another Petitioner');
      });

      it('should generate valid title for representingPrimary and representingSecondary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          representingPrimary: true,
          representingSecondary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual(
          'Substitution of Counsel for Petrs. Test Petitioner & Another Petitioner',
        );
      });
    });
  });
});
