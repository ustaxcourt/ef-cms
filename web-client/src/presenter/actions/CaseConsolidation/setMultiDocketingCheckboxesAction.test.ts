import {
  MOCK_CASE_WITH_SECONDARY_OTHERS,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setMultiDocketingCheckboxesAction } from './setMultiDocketingCheckboxesAction';

describe('setMultiDocketingCheckboxesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should format petitioner names and create consolidated checkbox items on modal state', async () => {
    const { state } = await runAction(setMultiDocketingCheckboxesAction, {
      modules: {
        presenter,
      },
      props: {
        consolidatedCases: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          {
            ...MOCK_CASE_WITH_SECONDARY_OTHERS,
            leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          },
        ],
      },
      state: {
        caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      },
    });

    const mockCaseSinglePetitioner =
      MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners[0].name +
      ' & ' +
      MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners[1].name;
    const mockCaseMultiplePetitioners =
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[0].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[1].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[2].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[3].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[4].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[5].name;
    expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
      {
        checkboxDisabled: true,
        checked: true,
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        docketNumberWithSuffix:
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumberWithSuffix,
        formattedPetitioners: mockCaseSinglePetitioner,
        leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      },
      {
        checkboxDisabled: true,
        checked: true,
        docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
        docketNumberWithSuffix:
          MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumberWithSuffix,
        formattedPetitioners: mockCaseMultiplePetitioners,
        leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      },
    ]);
    expect(state.modal.form.consolidatedCaseAllCheckbox).toEqual(true);
  });

  it('should get consolidated cases from state when they are not available in props', async () => {
    const mockConsolidatedCases = [
      MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      MOCK_CASE_WITH_SECONDARY_OTHERS,
    ];

    const { state } = await runAction(setMultiDocketingCheckboxesAction, {
      modules: {
        presenter,
      },
      props: {
        consolidatedCases: undefined,
      },
      state: {
        caseDetail: {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          consolidatedCases: mockConsolidatedCases,
        },
      },
    });

    expect(state.modal.form.consolidatedCasesToMultiDocketOn.length).toEqual(
      mockConsolidatedCases.length,
    );
  });

  describe('createOrderAddedDocketNumbers', () => {
    it('should use the createOrderAddedDocketNumbers in state to determine the properties', async () => {
      const CASE_DETAILS = {
        docketNumber: '109-19',
        docketNumberWithSuffix: '109-19',
        leadDocketNumber: '109-19',
        petitioners: [],
      };

      const mockConsolidatedCases = [
        CASE_DETAILS,
        {
          docketNumber: '110-19',
          docketNumberWithSuffix: '110-19',
          leadDocketNumber: '109-19',
          petitioners: [],
        },
        {
          docketNumber: '111-19',
          docketNumberWithSuffix: '111-19',
          leadDocketNumber: '109-19',
          petitioners: [],
        },
      ];

      const { state } = await runAction(setMultiDocketingCheckboxesAction, {
        modules: {
          presenter,
        },
        props: {
          consolidatedCases: undefined,
        },
        state: {
          caseDetail: {
            ...CASE_DETAILS,
            consolidatedCases: mockConsolidatedCases,
          },
          createOrderAddedDocketNumbers: ['109-19', '111-19'],
        },
      });

      expect(state.modal.form.consolidatedCaseAllCheckbox).toEqual(false);
      expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
        {
          checkboxDisabled: false,
          checked: true,
          docketNumber: '109-19',
          docketNumberWithSuffix: '109-19',
          formattedPetitioners: '',
          leadDocketNumber: '109-19',
        },
        {
          checkboxDisabled: false,
          checked: false,
          docketNumber: '110-19',
          docketNumberWithSuffix: '110-19',
          formattedPetitioners: '',
          leadDocketNumber: '109-19',
        },
        {
          checkboxDisabled: false,
          checked: true,
          docketNumber: '111-19',
          docketNumberWithSuffix: '111-19',
          formattedPetitioners: '',
          leadDocketNumber: '109-19',
        },
      ]);
    });

    it('should use the createOrderAddedDocketNumbers in props to determine the properties', async () => {
      const CASE_DETAILS = {
        docketNumber: '109-19',
        docketNumberWithSuffix: '109-19',
        leadDocketNumber: '109-19',
        petitioners: [],
      };

      const mockConsolidatedCases = [
        CASE_DETAILS,
        {
          docketNumber: '110-19',
          docketNumberWithSuffix: '110-19',
          leadDocketNumber: '109-19',
          petitioners: [],
        },
        {
          docketNumber: '111-19',
          docketNumberWithSuffix: '111-19',
          leadDocketNumber: '109-19',
          petitioners: [],
        },
      ];

      const { state } = await runAction(setMultiDocketingCheckboxesAction, {
        modules: {
          presenter,
        },
        props: {
          consolidatedCases: undefined,
          createOrderAddedDocketNumbers: ['109-19', '111-19'],
        },
        state: {
          caseDetail: {
            ...CASE_DETAILS,
            consolidatedCases: mockConsolidatedCases,
          },
        },
      });

      expect(state.modal.form.consolidatedCaseAllCheckbox).toEqual(false);
      expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
        {
          checkboxDisabled: false,
          checked: true,
          docketNumber: '109-19',
          docketNumberWithSuffix: '109-19',
          formattedPetitioners: '',
          leadDocketNumber: '109-19',
        },
        {
          checkboxDisabled: false,
          checked: false,
          docketNumber: '110-19',
          docketNumberWithSuffix: '110-19',
          formattedPetitioners: '',
          leadDocketNumber: '109-19',
        },
        {
          checkboxDisabled: false,
          checked: true,
          docketNumber: '111-19',
          docketNumberWithSuffix: '111-19',
          formattedPetitioners: '',
          leadDocketNumber: '109-19',
        },
      ]);
    });
  });
});
