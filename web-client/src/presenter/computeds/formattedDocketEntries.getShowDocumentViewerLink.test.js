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
  ];

  tests.forEach(({ inputs, output }) => {
    it(`returns expected output of '${output}' for inputs ${JSON.stringify(
      inputs,
    )}`, () => {
      const result = getShowDocumentViewerLink(inputs);
      expect(result).toEqual(output);
    });
  });
});
