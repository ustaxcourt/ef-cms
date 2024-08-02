import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatPetitionAction } from '@web-client/presenter/actions/formatPetitionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatPetitionAction', () => {
  const PROPS = {
    createPetitionStep1Data: {
      contactPrimary: {},
    },
    createPetitionStep2Data: {},
    createPetitionStep3Data: {
      caseType: CASE_TYPES_MAP.cdp,
      irsNotices: [
        {
          caseType: CASE_TYPES_MAP.cdp,
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          taxYear: 'TEST_taxYear',
        },
      ],
    },
    createPetitionStep4Data: {},
    createPetitionStep5Data: {},
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
      caseType: CASE_TYPES_MAP.cdp,
      contactPrimary: {
        email: 'TEST_EMAIL',
      },
      irsNotices: [
        {
          caseType: CASE_TYPES_MAP.cdp,
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          originalCaseType: CASE_TYPES_MAP.cdp,
          taxYear: 'TEST_taxYear',
        },
      ],
      originalCaseType: CASE_TYPES_MAP.cdp,
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
      caseType: CASE_TYPES_MAP.cdp,
      contactPrimary: {
        email: 'TEST_EMAIL',
      },
      irsNotices: [
        {
          caseType: CASE_TYPES_MAP.cdp,
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          originalCaseType: CASE_TYPES_MAP.cdp,
          taxYear: 'TEST_taxYear',
        },
      ],
      originalCaseType: CASE_TYPES_MAP.cdp,
    });
  });

  it('should update caseType if caseType is a disclosure', async () => {
    const propsWithDisclosure = {
      ...PROPS,
      createPetitionStep3Data: {
        caseType: 'Disclosure1',
        irsNotices: [
          {
            caseType: 'Disclosure1',
            noticeIssuedDate: 'TEST_noticeIssuedDate',
            taxYear: 'TEST_taxYear',
          },
        ],
      },
    };
    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: propsWithDisclosure,
      state: {
        petitionFormatted: undefined,
      },
    });

    expect(results.state.petitionFormatted).toEqual({
      caseCaption: 'TEST_CASE_CAPTION',
      caseCaptionExtension: '',
      caseTitle: 'TEST_CASE_CAPTION',
      caseType: CASE_TYPES_MAP.disclosure,
      contactPrimary: {
        email: 'TEST_EMAIL',
      },
      irsNotices: [
        {
          caseType: CASE_TYPES_MAP.disclosure,
          noticeIssuedDate: 'TEST_noticeIssuedDate',
          originalCaseType: 'Disclosure1',
          taxYear: 'TEST_taxYear',
        },
      ],
      originalCaseType: 'Disclosure1',
    });
  });

  it('should set noticeIssuedDate and taxYear as undefined if there is no irsNotice', async () => {
    const propsWithoutIrsNotice = {
      ...PROPS,
      createPetitionStep3Data: {
        caseType: CASE_TYPES_MAP.deficiency,
        irsNotices: [],
      },
    };
    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: propsWithoutIrsNotice,
      state: {
        petitionFormatted: undefined,
      },
    });

    expect(results.state.petitionFormatted).toEqual({
      caseCaption: 'TEST_CASE_CAPTION',
      caseCaptionExtension: '',
      caseTitle: 'TEST_CASE_CAPTION',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: {
        email: 'TEST_EMAIL',
      },
      irsNotices: [],
      originalCaseType: CASE_TYPES_MAP.deficiency,
    });
  });
});
