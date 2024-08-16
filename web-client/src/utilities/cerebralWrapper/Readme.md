### README for `cerebralWrapper` Module

## About

The `cerebralWrapper` module is designed to wrap the functionality of the Cerebral state management library. Given that Cerebral is no longer maintained upstream, this module provides a centralized place in the codebase to manage and mitigate any breakages related to Cerebral. By using this wrapper, we can ensure that our state management code remains robust and maintainable, even as the underlying library becomes outdated.

## General Direction

The `cerebralWrapper` module acts as a humble object/local module that serves as a liaison for any state management-related code in our project. This module is intended to be built out in stages and/or as needs arise. The primary goals of this module are:

1. **Centralized State Management**: Provide a single point of control for all state management-related code, reducing the risk of breakages and inconsistencies.
2. **Flexibility**: Allow for easy integration of fixes or patches, whether by adding custom code within the module, patching the forked version of the legacy Cerebral library, or even switching to a different state management library altogether.
3. **Scalability**: Enable the module to grow and evolve as the project's needs change, ensuring that it remains a robust and reliable solution for state management.

## Usage

### Example Usage

Below is an example of how to use the `cerebralWrapper` module in your project:

```typescript
import { Get, parallel, props, sequences, state } from './cerebralWrapper';
import App from './cerebralWrapper';

// eslint-disable-next-line import/no-default-export
export default App;
export { parallel, props, sequences, state, Get };
```

### Example Test File

Here’s an example of how the `cerebralWrapper` module is used in a test file:

```typescript
import { applicationContext } from '../../applicationContext';
import { documentViewerLinksHelper as documentViewerLinksHelperComputed } from './documentViewerLinksHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('documentViewerLinksHelper', () => {
  const mockDocketNumber = '101-20';
  const mockDocketEntryId = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const documentViewerLinksHelper = withAppContextDecorator(
    documentViewerLinksHelperComputed,
    applicationContext,
  );

  it('should return an empty object when state.viewerDocumentToDisplay is undefined', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {},
        viewerDocumentToDisplay: undefined,
      },
    });

    expect(result).toEqual({});
  });
});
```

test.cerebral.ts
```typescript
import {
  runAction as cerebralRunAction,
  runCompute as cerebralRunCompute,
} from '../utilities/cerebralWrapper/test';
import type { ClientState } from '@web-client/presenter/state';

type FakeRunComputeType = <T>(
  compute: (get: any) => T,
  state: { state: any },
) => T;
export const runCompute = cerebralRunCompute as unknown as FakeRunComputeType;

type FakeRunActionType = <T>(
  action: (actionProps: any) => Promise<T> | T,
  fixtures: { modules?: { presenter: any }; props?: any; state?: any },
) => { state: ClientState; props: any; output: T };
export const runAction = cerebralRunAction as unknown as FakeRunActionType;
```

### Future Development

As the project evolves, the `cerebralWrapper` module will be expanded to include additional functionality and support for various state management scenarios. This may involve:

- Adding new helper functions and utilities to handle specific state management tasks.
- Patching or extending the forked version of the legacy Cerebral library to address any issues or limitations.
    - cerbralWrapper will eventually pull from a fork of legacy lib
- Evaluating and potentially integrating alternative state management libraries to ensure the best possible performance and maintainability.

By adopting this modular approach, we can ensure that our state management code remains organized, maintainable, and adaptable to future changes.


### Importance of Centralized Breakage Mitigation

Addressing any breakages as they come up in one location, rather than having to search the entire codebase for breakages each time there is a breaking event, is crucial. By leveraging some upfront work to replace all references to the legacy library with the wrapper, we create a more linear path to mitigation in the future. This approach not only simplifies the process of fixing breakages but also provides more options for remediation paths for each breakage event. This centralized approach ensures that our state management remains consistent and easier to maintain over time.