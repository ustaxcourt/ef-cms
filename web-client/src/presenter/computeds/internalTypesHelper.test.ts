import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  getSortFunction,
  internalTypesHelper as internalTypesHelperComputed,
} from './internalTypesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { LODGED_EVENT_CODE } from '@shared/business/entities/EntityConstants';

describe('internalTypesHelper', () => {
  const internalTypesHelper = withAppContextDecorator(
    internalTypesHelperComputed,
    applicationContext,
  );

  describe('custom search function', () => {
    it('correctly sorts a list with two items (coverage)', () => {
      const searchString = 'a';
      const sortFunc = getSortFunction(searchString);
      const objectList = [
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];
      const sortedList = [
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];

      const result = objectList.sort(sortFunc);

      expect(result).toEqual(sortedList);
    });

    it('correctly sorts when an item matches the value exactly (A)', () => {
      const searchString = 'a';
      const sortFunc = getSortFunction(searchString);
      const objectList = [
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];
      const sortedList = [
        { label: 'Answer', value: 'A' },
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];

      const result = objectList.sort(sortFunc);

      expect(result).toEqual(sortedList);
    });

    it('correctly sorts when value starts with search string (AT)', () => {
      const searchString = 'at';
      const sortFunc = getSortFunction(searchString);
      const objectList = [
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];
      const sortedList = [
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];

      const result = objectList.sort(sortFunc);

      expect(result).toEqual(sortedList);
    });

    it('correctly sorts according to label when no values start with search string (X)', () => {
      const searchString = 'X';
      const sortFunc = getSortFunction(searchString);
      const objectList = [
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];
      const sortedList = [
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];

      const result = objectList.sort(sortFunc);

      expect(result).toEqual(sortedList);
    });
  });

  describe('search sorting', () => {
    it('sorts on documentType Alphabetical when no search text is provided', () => {
      const result = runCompute(internalTypesHelper, {
        state: {},
      });

      expect(
        result.internalDocumentTypesForSelectWithLegacySorted[0].eventCode,
      ).toEqual('ADMR');
    });

    it('sorts on documentType Alphabeticaland when the search text is an empty string', () => {
      const result = runCompute(internalTypesHelper, {
        state: {
          screenMetadata: { searchText: '' },
        },
      });

      expect(
        result.internalDocumentTypesForSelectWithLegacySorted[0].eventCode,
      ).toEqual('ADMR');
    });

    it('and is not matching an event code, then should organize by documentType Alphabetical', () => {
      const result = runCompute(internalTypesHelper, {
        state: {
          screenMetadata: { searchText: 'blah' },
        },
      });

      expect(
        result.internalDocumentTypesForSelectWithLegacySorted[0].eventCode,
      ).toEqual('ADMR');
    });

    it('sorts on eventCode when the search matches the beginning of an eventCode', () => {
      const result = runCompute(internalTypesHelper, {
        state: {
          screenMetadata: { searchText: 'AAP' },
        },
      });

      expect(
        result.internalDocumentTypesForSelectWithLegacySorted[0].eventCode,
      ).toEqual('AAPN');
    });

    it('sorts on eventCode when the search matches an event code exactly', () => {
      const result = runCompute(internalTypesHelper, {
        state: {
          screenMetadata: { searchText: 'AAPN' },
        },
      });

      expect(
        result.internalDocumentTypesForSelectWithLegacySorted[0].value,
      ).toEqual('AAPN');
    });
  });

  describe('lodged', () => {
    it('does not show MISCL in dropdown', () => {
      const result = runCompute(internalTypesHelper, {
        state: {},
      });

      const miscellaneousLodgedType =
        result.internalDocumentTypesForSelectWithLegacySorted.find(
          d => d.eventCode === LODGED_EVENT_CODE,
        );

      expect(miscellaneousLodgedType).toBeUndefined();
    });
  });

  describe('Deprecated document', () => {
    it('does not show any deprecated document types in dropdown', () => {
      const result = runCompute(internalTypesHelper, {
        state: {},
      });

      const deprecatedDoc =
        result.internalDocumentTypesForSelectWithLegacySorted.find(
          d => d.eventCode === 'M129',
        );
      const deprecatedDocIsNotSelectable =
        result.internalDocumentTypesForSelectSorted.find(
          d => d.eventCode === 'M129',
        );
      expect(deprecatedDoc).toBeDefined();
      expect(deprecatedDocIsNotSelectable).toBeUndefined();
    });
  });
});
