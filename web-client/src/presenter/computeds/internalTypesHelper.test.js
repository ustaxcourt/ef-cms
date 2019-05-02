import { internalTypesHelper } from './internalTypesHelper';
import { runCompute } from 'cerebral/test';

describe('internalTypesHelper', () => {
  it('should show search in header for non-practitioners', () => {
    const result = runCompute(internalTypesHelper, {
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: {
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
                ordinalField: 'What Iteration Is This Filing?',
                scenario: 'Nonstandard G',
              },
            ],
            'Seriatum Brief': [
              {
                category: 'Seriatum Brief',
                documentTitle: 'Amended Seriatim Sur-Reply Brief',
                documentType: 'Amended Seriatim Sur-Reply Brief',
                eventCode: 'ASRB',
                labelFreeText: '',
                labelPreviousDocument: '',
                ordinalField: '',
                scenario: 'Standard',
              },
            ],
          },
        },
      },
    });
    const expected = [
      { label: 'Amended Answer', value: 'AA' },
      { label: 'Amended Seriatim Sur-Reply Brief', value: 'ASRB' },
      { label: 'Amendment to Answer', value: 'ATAN' },
      { label: 'Answer', value: 'A' },
    ];
    expect(result.internalDocumentTypesForSelect).toEqual(expected);
  });
});
