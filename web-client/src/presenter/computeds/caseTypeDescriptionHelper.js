import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * returns array of valid case types and descriptions based
 * on whether there is an IRS notice or not
 *
 * @param {*} get cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} array of case types with descriptions
 */
export const caseTypeDescriptionHelper = (get, applicationContext) => {
  const form = get(state.form);
  const { CASE_TYPES, CASE_TYPES_MAP } = applicationContext.getConstants();

  let caseTypesWithDisclosure = cloneDeep(CASE_TYPES);
  caseTypesWithDisclosure.push('Disclosure1', 'Disclosure2');

  let caseTypesMapWithDisclosure = cloneDeep(CASE_TYPES_MAP);
  caseTypesMapWithDisclosure.disclosure1 = 'Disclosure1';
  caseTypesMapWithDisclosure.disclosure2 = 'Disclosure2';

  let caseTypesWithDescriptions = [];
  if (form.hasIrsNotice) {
    caseTypesWithDisclosure.forEach(caseType => {
      let caseDescription = '';
      switch (caseType) {
        case caseTypesMapWithDisclosure.deficiency:
          caseDescription = 'Notice of Deficiency';
          break;
        case caseTypesMapWithDisclosure.cdp:
          caseDescription =
            'Notice of Determination Concerning Collection Action';
          break;
        case caseTypesMapWithDisclosure.innocentSpouse:
          caseDescription =
            'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015';
          break;
        case caseTypesMapWithDisclosure.disclosure1:
          caseDescription = 'Notice of Intention to Disclose';
          break;
        case caseTypesMapWithDisclosure.disclosure2:
          caseDescription =
            'Notice - We Are Going To Make Your Determination Letter Available for Public Inspection';
          break;
        case caseTypesMapWithDisclosure.partnershipSection6226:
          caseDescription =
            'Readjustment of Partnership Items Code Section 6226';
          break;
        case caseTypesMapWithDisclosure.partnershipSection6228:
          caseDescription = 'Adjustment of Partnership Items Code Section 6228';
          break;
        case caseTypesMapWithDisclosure.partnershipSection1101:
          caseDescription = 'Partnership Action Under BBA Section 1101';
          break;
        case caseTypesMapWithDisclosure.whistleblower:
          caseDescription =
            'Notice of Determination Under Section 7623 Concerning Whistleblower Action';
          break;
        case caseTypesMapWithDisclosure.workerClassification:
          caseDescription = 'Notice of Determination of Worker Classification';
          break;
        case caseTypesMapWithDisclosure.passport:
          caseDescription =
            'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State';
          break;
        case caseTypesMapWithDisclosure.interestAbatement:
          caseDescription =
            'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim';
          break;
        case caseTypesMapWithDisclosure.other:
          caseDescription = 'Other';
          break;
        default:
          break;
      }
      if (caseDescription !== '') {
        caseTypesWithDescriptions.push({
          description: caseDescription,
          type: caseType,
        });
      }
    });
  } else {
    caseTypesWithDisclosure.forEach(caseType => {
      let caseDescription = '';
      switch (caseType) {
        case caseTypesMapWithDisclosure.cdp:
          caseDescription = 'CDP (Lien/Levy)';
          break;
        case caseTypesMapWithDisclosure.innocentSpouse:
          caseDescription = 'Innocent Spouse';
          break;
        case caseTypesMapWithDisclosure.whistleblower:
          caseDescription = 'Whistleblower';
          break;
        case caseTypesMapWithDisclosure.workerClassification:
          caseDescription = 'Worker Classification';
          break;
        case caseTypesMapWithDisclosure.djRetirementPlan:
          caseDescription = 'Declaratory Judgment (Retirement Plan)';
          break;
        case caseTypesMapWithDisclosure.djExemptOrg:
          caseDescription = 'Declaratory Judgment (Exempt Organization)';
          break;
        case caseTypesMapWithDisclosure.disclosure:
          caseDescription = 'Disclosure';
          break;
        case caseTypesMapWithDisclosure.interestAbatement:
          caseDescription =
            'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement';
          break;
        case caseTypesMapWithDisclosure.other:
          caseDescription = 'Other';
          break;
        default:
          break;
      }
      if (caseDescription !== '') {
        caseTypesWithDescriptions.push({
          description: caseDescription,
          type: caseType,
        });
      }
    });
  }

  return { caseTypes: caseTypesWithDescriptions };
};
