const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  setDocumentTitleFromStampDataInteractor,
} = require('./setDocumentTitleFromStampDataInteractor');
const { formatDateString, FORMATS } = require('../../utilities/DateHandler');
const { MOTION_DISPOSITIONS } = require('../../entities/EntityConstants');

describe('setDocumentTitleFromStampDataInteractor', () => {
  const getDateISO = () =>
    applicationContext.getUtilities().createISODateString();

  const testCases = [
    [{ disposition: MOTION_DISPOSITIONS.GRANTED }, 'GRANTED'],
    [
      {
        disposition: MOTION_DISPOSITIONS.GRANTED,
        jurisdictionalOption: 'The case is restored to the general docket',
        strickenFromTrialSession:
          'This case is stricken from the trial session',
      },
      'GRANTED - this case is stricken from the trial session - the case is restored to the general docket',
    ],
    [
      {
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: MOTION_DISPOSITIONS.DENIED,
      },
      'DENIED as moot without prejudice',
    ],
    [
      {
        disposition: MOTION_DISPOSITIONS.DENIED,
      },
      'DENIED',
    ],
    [
      {
        customText: 'amazing custom text',
        disposition: MOTION_DISPOSITIONS.GRANTED,
      },
      'GRANTED amazing custom text',
    ],
    [
      {
        customText: 'amazing custom text',
        date: getDateISO(),
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'the parties shall file a status report by',
      },
      `GRANTED - the parties shall file a status report by ${formatDateString(
        getDateISO(),
        FORMATS.MMDDYYYY,
      )} amazing custom text`,
    ],
  ];

  testCases.forEach(([input, output]) => {
    it('should return ${output} as formattedDraftDocumentTitle', () => {
      const formattedDraftDocumentTitle =
        setDocumentTitleFromStampDataInteractor({
          stampMotionForm: input,
        });

      expect(formattedDraftDocumentTitle).toEqual(output);
    });
  });
});
