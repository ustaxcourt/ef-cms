import { DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE } from '../../../../shared/src/business/entities/EntityConstants';
import { getShowDocumentViewerLink } from './formattedDocketEntries';

describe('getShowDocumentViewerLink', () => {
  const tests = [
    {
      inputs: {
        hasDocument: true,
        isExternalUser: false,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: false,
        isExternalUser: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isExternalUser: true,
        isStricken: true,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isUnservable: true,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isServed: true,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: true,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: false,
        userHasAccessToCase: true,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: true,
        userHasAccessToCase: true,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isServed: false,
        isUnservable: true,
        userHasAccessToCase: true,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: false,
        userHasAccessToCase: true,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: true,
        userHasAccessToCase: true,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: true,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isServed: false,
        isUnservable: true,
        userHasAccessToCase: true,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: false,
        isUnservable: false,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isServed: false,
        isUnservable: true,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isExternalUser: true,
        userHasNoAccessToDocument: true,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isInitialDocument: true,
        isServed: false,
        isStricken: false,
        isUnservable: false,
        userHasAccessToCase: true,
        userHasNoAccessToDocument: false,
      },
      output: true,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: false,
        isExternalUser: true,
        isInitialDocument: true,
        isServed: false,
        isStricken: false,
        isUnservable: false,
        userHasAccessToCase: false,
        userHasNoAccessToDocument: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isInitialDocument: false,
        isServed: true,
        isStipDecision: true,
        isStricken: false,
        isUnservable: false,
        userHasAccessToCase: false,
        userHasNoAccessToDocument: false,
      },
      output: false,
    },
    {
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isInitialDocument: false,
        isServed: true,
        isStipDecision: true,
        isStricken: false,
        isUnservable: false,
        userHasAccessToCase: true,
        userHasNoAccessToDocument: false,
      },
      output: true,
    },
    {
      // User is external, with no access to case, document link is not publicly visible
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isHiddenToPublic: true,
        isUnservable: true,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      // User is external, with no access to case, docket entry is a sealed and served order, document link is not visible
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isSealed: true,
        isServed: true,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      // User is external, with access to case, docket entry is a sealed and served order, document link is visible
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isPassingAgeRequirement: true,
        isSealed: true,
        isServed: true,
        userHasAccessToCase: true,
      },
      output: true,
    },
    {
      // User is external, with access to case, document link is visible
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isHiddenToPublic: true,
        isUnservable: true,
        userHasAccessToCase: true,
      },
      output: true,
    },
    {
      description:
        'a sealed transcript that is under the 90 day threshold should not display a clickable link',
      inputs: {
        hasDocument: true,
        isCourtIssuedDocument: true,
        isExternalUser: true,
        isPassingAgeRequirement: false,
        isSealed: true,
        isServed: true,
        userHasAccessToCase: true,
      },
      output: false,
    },
    {
      description: `unsealed, unstricken practitioner e-filed briefs filed after ${DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE} should display a clickable link to external users`,
      inputs: {
        filedAfterPolicyChange: true,
        filedByPractitioner: true,
        hasDocument: true,
        isExternalUser: true,
        isSealed: false,
        isServed: true,
        isStricken: false,
        userHasAccessToCase: false,
      },
      output: true,
    },
    {
      description: `unsealed, unstricken practitioner e-filed briefs filed after ${DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE} should display a clickable link to internal users`,
      inputs: {
        filedAfterPolicyChange: true,
        filedByPractitioner: true,
        hasDocument: true,
        isExternalUser: false,
        isSealed: false,
        isServed: true,
        isStricken: false,
        userHasAccessToCase: false,
      },
      output: true,
    },
    {
      description: `sealed, practitioner e-filed briefs filed after ${DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE} should NOT display a clickable link to external users`,
      inputs: {
        filedAfterPolicyChange: true,
        filedByPractitioner: true,
        hasDocument: true,
        isExternalUser: true,
        isSealed: true,
        isServed: true,
        isStricken: false,
        userHasAccessToCase: false,
      },
      output: false,
    },
    {
      description: `stricken, practitioner e-filed briefs filed after ${DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE} should NOT display a clickable link to external users`,
      inputs: {
        filedAfterPolicyChange: true,
        filedByPractitioner: true,
        hasDocument: true,
        isExternalUser: true,
        isSealed: false,
        isServed: true,
        isStricken: true,
        userHasAccessToCase: false,
      },
      output: false,
    },
  ];

  tests.forEach(({ description, inputs, output }) => {
    it(`${description} - returns expected output of '${output}' for inputs ${JSON.stringify(
      inputs,
    )}`, () => {
      const result = getShowDocumentViewerLink(inputs);
      expect(result).toEqual(output);
    });
  });
});
