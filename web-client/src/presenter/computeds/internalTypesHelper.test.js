import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  getSortFunction,
  internalTypesHelper as internalTypesHelperComputed,
} from './internalTypesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('internalTypesHelper', () => {
  const INTERNAL_CATEGORY_MAP = {
    Answer: [
      {
        category: 'Answer (filed by respondent only)',
        documentTitle: 'Amended Answer',
        documentType: 'Amended Answer',
        eventCode: 'AA',
        labelFreeText: '',
        labelPreviousDocument: '',
        ordinalField: '',
        scenario: 'Standard',
      },
      {
        category: 'Answer (filed by respondent only)',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        labelFreeText: '',
        labelPreviousDocument: '',
        ordinalField: '',
        scenario: 'Standard',
      },
      {
        category: 'Answer (filed by respondent only)',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        eventCode: 'ATAN',
        labelFreeText: '',
        labelPreviousDocument: '',
        ordinalField: 'What iteration is this filing?',
        scenario: 'Nonstandard G',
      },
    ],
    'Seriatim Brief': [
      {
        category: 'Seriatim Brief',
        documentTitle: 'Seriatim Answering Memorandum Brief',
        documentType: 'Seriatim Answering Memorandum Brief',
        eventCode: 'SAMB',
        labelFreeText: '',
        labelPreviousDocument: '',
        ordinalField: '',
        scenario: 'Standard',
      },
    ],
  };

  const internalTypesHelper = withAppContextDecorator(
    internalTypesHelperComputed,
    {
      ...applicationContext,
      getConstants: () => {
        return {
          ...applicationContext.getConstants(),
          INTERNAL_CATEGORY_MAP,
        };
      },
    },
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

  describe('produces a list', () => {
    it('of value/label objects sorted by their label (default) when no search text is provided', () => {
      const expected = [
        { label: 'Amended Answer', value: 'AA' },
        { label: 'Amendment to Answer', value: 'ATAN' },
        { label: 'Answer', value: 'A' },
        { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
      ];

      const result = runCompute(internalTypesHelper, {
        state: {},
      });

      expect(result.internalDocumentTypesForSelect).toMatchObject(expected);
      expect(result.internalDocumentTypesForSelectSorted).toMatchObject(
        expected,
      );
    });

    describe('when searchText is defined', () => {
      it('and is an empty string', () => {
        const expected = [
          { label: 'Amended Answer', value: 'AA' },
          { label: 'Amendment to Answer', value: 'ATAN' },
          { label: 'Answer', value: 'A' },
          { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
        ];

        const result = runCompute(internalTypesHelper, {
          state: {
            screenMetadata: { searchText: '' },
          },
        });

        expect(result.internalDocumentTypesForSelectSorted).toMatchObject(
          expected,
        );
      });

      it('and is not matching an event code', () => {
        const expected = [
          { label: 'Amended Answer', value: 'AA' },
          { label: 'Amendment to Answer', value: 'ATAN' },
          { label: 'Answer', value: 'A' },
          { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
        ];

        const result = runCompute(internalTypesHelper, {
          state: {
            screenMetadata: { searchText: 'Seriatim' },
          },
        });

        expect(result.internalDocumentTypesForSelectSorted).toMatchObject(
          expected,
        );
      });

      it('and matches the beginning of an eventCode', () => {
        const expected = [
          { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
          { label: 'Amended Answer', value: 'AA' },
          { label: 'Amendment to Answer', value: 'ATAN' },
          { label: 'Answer', value: 'A' },
        ];

        const result = runCompute(internalTypesHelper, {
          state: {
            screenMetadata: { searchText: 'SA' },
          },
        });

        expect(result.internalDocumentTypesForSelectSorted).toMatchObject(
          expected,
        );
      });

      it('and matches an event code exactly', () => {
        const expected = [
          { label: 'Amendment to Answer', value: 'ATAN' },
          { label: 'Amended Answer', value: 'AA' },
          { label: 'Answer', value: 'A' },
          { label: 'Seriatim Answering Memorandum Brief', value: 'SAMB' },
        ];

        const result = runCompute(internalTypesHelper, {
          state: {
            screenMetadata: { searchText: 'ATAN' },
          },
        });

        expect(result.internalDocumentTypesForSelectSorted).toMatchObject(
          expected,
        );
      });
    });
  });

  describe('lodged', () => {
    let LODGED_EVENT_CODE;

    beforeAll(() => {
      ({ LODGED_EVENT_CODE } = applicationContext.getConstants());
    });

    it('does not show MISCL in dropdown', () => {
      const result = runCompute(internalTypesHelper, {
        state: {},
      });

      const miscellaneousLodgedType =
        result.internalDocumentTypesForSelectSorted.find(
          d => d.eventCode === LODGED_EVENT_CODE,
        );

      expect(miscellaneousLodgedType).toBeUndefined();
    });
  });
});
