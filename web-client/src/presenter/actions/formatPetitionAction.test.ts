import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatPetitionAction } from '@web-client/presenter/actions/formatPetitionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatPetitionAction', () => {
  const PROPS = {
    step1Data: {},
    step2Data: {
      contactPrimary: {},
    },
    step3Data: {
      irsNotices: [
        {
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          taxYear: 'TEST_taxYear',
        },
      ],
    },
    step4Data: {
      caseType: 'Disclosure1',
    },
    step5Data: {},
  };

  const TEST_CASE_CAPTION = 'TEST_CASE_CAPTION';
  const TEST_EMAIL = 'TEST_EMAIL';

  beforeEach(() => {
    applicationContext
      .getUtilities()
      .getCaseCaption.mockImplementation(() => TEST_CASE_CAPTION);

    applicationContext.getCurrentUser.mockImplementation(() => ({
      email: TEST_EMAIL,
    }));

    presenter.providers.applicationContext = applicationContext;
  });

  it('should set petitionFormatted correctly in state', async () => {
    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: PROPS,
      state: {
        petitionFormatted: undefined,
      },
    });

    expect(results.state.petitionFormatted).toEqual({
      caseCaption: 'TEST_CASE_CAPTION',
      caseCaptionExtension: '',
      caseTitle: 'TEST_CASE_CAPTION',
      caseType: 'Disclosure',
      contactPrimary: {
        email: 'TEST_EMAIL',
      },
      irsNotices: [
        {
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          taxYear: 'TEST_taxYear',
        },
      ],
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      taxYear: 'TEST_taxYear',
    });
  });

  it('should set petitionFormatted correctly in state using the default case caption', async () => {
    applicationContext
      .getUtilities()
      .getCaseCaption.mockImplementation(() => undefined);

    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: PROPS,
      state: {
        petitionFormatted: undefined,
      },
    });

    expect(results.state.petitionFormatted).toEqual({
      caseCaption: '',
      caseCaptionExtension: '',
      caseTitle: '',
      caseType: 'Disclosure',
      contactPrimary: {
        email: 'TEST_EMAIL',
      },
      irsNotices: [
        {
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          taxYear: 'TEST_taxYear',
        },
      ],
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      taxYear: 'TEST_taxYear',
    });
  });
});
