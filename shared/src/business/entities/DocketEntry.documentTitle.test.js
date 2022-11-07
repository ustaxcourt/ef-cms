const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('document titles', () => {
  describe('getDocumentTitleForDocketRecord', () => {
    it('should return only the base document title when no additional info exists', () => {
      const docketEntry = new DocketEntry(
        { ...A_VALID_DOCKET_ENTRY, documentTitle: 'a title' },
        {
          applicationContext,
        },
      );

      const actual = docketEntry.getDocumentTitleForDocketRecord();

      expect(actual).toEqual('a title');
    });

    it('should return the base document title and additionalInfo when additionalInfo2 does not exist', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          additionalInfo: 'plus additional info',
          documentTitle: 'a title',
        },
        {
          applicationContext,
        },
      );

      const actual = docketEntry.getDocumentTitleForDocketRecord();

      expect(actual).toEqual('a title plus additional info');
    });

    it('should return the base document title and all additional info', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          additionalInfo: 'plus additional info',
          additionalInfo2: 'and more additional info',
          documentTitle: 'a title',
        },
        {
          applicationContext,
        },
      );

      const actual = docketEntry.getDocumentTitleForDocketRecord();

      expect(actual).toEqual(
        'a title plus additional info and more additional info',
      );
    });
  });

  describe('getDocumentTitleForCoverPage', () => {
    it('should return only the base document title when no additional info exists', () => {
      const docketEntry = new DocketEntry(
        { ...A_VALID_DOCKET_ENTRY, documentTitle: 'a title' },
        {
          applicationContext,
        },
      );

      const actual = docketEntry.getDocumentTitleForCoverPage();

      expect(actual).toEqual('a title');
    });

    it('should return only the base document title when addToCoversheet is false and additionalInfo exists', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          addToCoversheet: false,
          additionalInfo: 'superfluous info',
          documentTitle: 'a title',
        },
        {
          applicationContext,
        },
      );

      const actual = docketEntry.getDocumentTitleForCoverPage();

      expect(actual).toEqual('a title');
    });

    it('should return the base document title and additionalInfo when addToCoversheet is true', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          addToCoversheet: true,
          additionalInfo: 'plus additional info',
          documentTitle: 'a title',
        },
        {
          applicationContext,
        },
      );

      const actual = docketEntry.getDocumentTitleForCoverPage();

      expect(actual).toEqual('a title plus additional info');
    });
  });
});
