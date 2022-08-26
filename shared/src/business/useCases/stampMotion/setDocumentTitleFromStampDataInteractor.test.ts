import { applicationContext } from '../../test/createTestApplicationContext';
import { setDocumentTitleFromStampDataInteractor } from './setDocumentTitleFromStampDataInteractor';
import { formatDateString, FORMATS } from '../../utilities/DateHandler';
import { MOTION_DISPOSITIONS } from '../../entities/EntityConstants';

describe('setDocumentTitleFromStampDataInteractor', () => {
  const getDateISO = () =>
    applicationContext.getUtilities().createISODateString();

  const testCases = [
    [{ disposition: MOTION_DISPOSITIONS.GRANTED as string }, 'GRANTED'],
    [
      {
        disposition: MOTION_DISPOSITIONS.GRANTED as string,
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
        disposition: MOTION_DISPOSITIONS.DENIED as string,
      },
      'DENIED as moot without prejudice',
    ],
    [
      {
        disposition: MOTION_DISPOSITIONS.DENIED as string,
      },
      'DENIED',
    ],
    [
      {
        customText: 'amazing custom text',
        disposition: MOTION_DISPOSITIONS.GRANTED as string,
      },
      'GRANTED - amazing custom text',
    ],
    [
      {
        customText: 'amazing custom text',
        date: getDateISO(),
        disposition: MOTION_DISPOSITIONS.GRANTED as string,
        dueDateMessage: 'the parties shall file a status report by',
      },
      `GRANTED - the parties shall file a status report by ${formatDateString(
        getDateISO(),
        FORMATS.MMDDYYYY,
      )} - amazing custom text`,
    ],
  ];

  testCases.forEach(([input, output]) => {
    it(`should return ${output} as formattedDraftDocumentTitle`, () => {
      const formattedDraftDocumentTitle =
        setDocumentTitleFromStampDataInteractor({
          stampMotionForm: input as any,
        });

      expect(formattedDraftDocumentTitle).toEqual(output);
    });
  });
});
