import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * returns array of valid case types and descriptions based
 * on whether there is an IRS notice or not
 *
 * @param {*} get cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} array of case types with descriptions
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseTypeDescriptionHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const form = get(state.form);
  const {
    CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
    CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
    CASE_TYPES,
  } = applicationContext.getConstants();

  let caseTypesWithDisclosure: string[] = cloneDeep(CASE_TYPES);
  caseTypesWithDisclosure.push('Disclosure1', 'Disclosure2');

  let caseTypesWithDescriptions: { description: string; type: string }[] = [];
  if (form.hasIrsNotice) {
    caseTypesWithDisclosure.forEach(caseType => {
      const caseDescription = CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[caseType];
      if (caseDescription) {
        caseTypesWithDescriptions.push({
          description: caseDescription,
          type: caseType,
        });
      }
    });
  } else {
    caseTypesWithDisclosure.forEach(caseType => {
      const caseDescription =
        CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[caseType];
      if (caseDescription) {
        caseTypesWithDescriptions.push({
          description: caseDescription,
          type: caseType,
        });
      }
    });
  }

  return {
    caseTypes: caseTypesWithDescriptions,
    caseTypesIrsNoticeUpload: reorderCaseTypesForIrsNoticeCaseTypes(
      caseTypesWithDescriptions,
    ),
  };
};

function reorderCaseTypesForIrsNoticeCaseTypes(
  caseTypes: { description: string; type: string }[],
) {
  const specificOrder = [
    'Notice of Deficiency',
    'Notice of Determination Concerning Collection Action',
    'Other',
  ];

  const orderedItems: { description: string; type: string }[] = [];
  const otherItems: { description: string; type: string }[] = [];

  caseTypes.forEach(item => {
    if (specificOrder.includes(item.description)) {
      orderedItems[specificOrder.indexOf(item.description)] = item;
    } else {
      otherItems.push(item);
    }
  });

  otherItems.sort((a, b) => a.description.localeCompare(b.description));

  return [...orderedItems, ...otherItems];
}
