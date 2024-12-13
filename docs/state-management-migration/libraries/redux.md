# Redux

## 1. Ease of Isolation

Q: Is the library easy to use in isolation from both React components and
business logic?

A: No.

Redux is tightly coupled to React components via the useSelector and useDispatch
hooks. While it is possible use Redux without React, its ecosystem is designed
primarily for tight integration with React, making it difficult to isolate Redux
from React components and vice versa.

To isolate business logic from React components, developers often need to
use middleware or external hooks (like redux-thunk or redux-saga), which adds
complexity to the design.

## 2. Conceptual Simplicity

Q: Does the library introduce as few novel abstractions as possible?

A: No. The core Redux library introduces Redux-specific abstractions such as
actions, action creators, reducers, and the store. Then, Redux Toolkit (RTK),
which has been the recommended approach for Redux since 2019, introduces further
abstractions such as slices on top of those core concepts. The result is a
layered and complex structure, which requires developers to learn and manage
multiple abstractions even for simple state management tasks.

## 3. Boilerplate Volume

Q: Does the library require a great deal of boilerplate code?

A: Yes. While RTK reduces the amount of boilerplate required compared to the
core Redux library, it still requires considerable setup, especially for
non-trivial applications. With RTK, developers still need to define slices,
which bundle actions and reducers into a single abstraction. Even though RTK
automates much of the repetitive work, like creating action creators and
reducers from a single slice definition, this still results in verbose code.
Plus, since asynchronous logic often requires middleware such as redux-thunk or
redux-saga, the baseline amount of boilerplate for an RTK project is
substantial. This adds further complexity as the application scales, especially
in scenarios where managing side effects and state transitions across multiple
slices becomes more involved.
