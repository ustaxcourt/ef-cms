import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatPetitionAction } from '@web-client/presenter/actions/formatPetitionAction';
import {
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
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
        user: {
          ...mockPetitionerUser,
          email: TEST_EMAIL,
        },
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
        user: {
          ...mockPetitionerUser,
          email: TEST_EMAIL,
        },
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
        user: {
          ...mockPetitionerUser,
          email: TEST_EMAIL,
        },
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

  it('should set counsel contact if user is a private practitioner', async () => {
    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: PROPS,
      state: {
        petitionFormatted: undefined,
        user: {
          ...mockPrivatePractitionerUser,
          barNumber: 'TEST_barNumber',
          contact: {
            address1: 'TEST_address1',
            address2: 'TEST_address2',
            address3: 'TEST_address3',
            city: 'TEST_city',
            phone: 'TEST_phone',
            postalCode: 'TEST_postalCode',
            state: 'TEST_state',
          },
          firmName: 'TEST_firmName',
        },
      },
    });

    expect(results.state.petitionFormatted.contactCounsel).toEqual({
      address1: 'TEST_address1',
      address2: 'TEST_address2',
      address3: 'TEST_address3',
      barNumber: 'TEST_barNumber',
      city: 'TEST_city',
      email: 'mockPrivatePractitioner@example.com',
      firmName: 'TEST_firmName',
      name: 'Reginald Barclay',
      phone: 'TEST_phone',
      postalCode: 'TEST_postalCode',
      state: 'TEST_state',
    });
  });

  it('should set primary contact email to user email when the user is a petitioner', async () => {
    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: PROPS,
      state: {
        petitionFormatted: undefined,
        user: mockPetitionerUser,
      },
    });

    expect(results.state.petitionFormatted?.contactPrimary?.email).toEqual(
      'mockPetitioner@example.com',
    );
  });

  it('should not set primary contact email to user email when the user is a private practitioner', async () => {
    const results = await runAction(formatPetitionAction, {
      modules: {
        presenter,
      },
      props: {
        ...PROPS,
        createPetitionStep1Data: {
          contactPrimary: { email: 'test@example.com' },
        },
      },
      state: {
        petitionFormatted: undefined,
        user: mockPrivatePractitionerUser,
      },
    });

    expect(results.state.petitionFormatted?.contactPrimary?.email).toEqual(
      'mockPrivatePractitioner@example.com',
    );
  });
});
