# Typing all TSX files
Bringing types to all of the .tsx files has been difficult primarily because cerebral has wrapped all of our components with the connect() function and cerebral was not built with Typescript in mind. Cerebral's own instructions on how to get types into .tsx files is broken and does not work. Getting types into our frontend will involve coming up with our own system to effectively lie to cerebral. Creating our own system will involve compromises and there will likely be no silver bullet. With that in mind, here is an example of what we can do.

## Typing the connect function
The cerebral connect function is how we produce almost all of our components and it accepts two arguments. The first argument is the dependency map for what a particular component needs to render such as state, helpers, or sequences. The second argument to connect is a React functional component whose arguments include the dependency map of the first argument and any other props passed in from the parent component. We have typed the connect function to represent this. 

### Problems
- Helpers/Computeds: When we write helpers they are simple functions, however when we access them inside of a .tsx file cerebral wants us to access them as if they are objects or whatever the function is returning. This means that we will need to lie and treat our helpers like what they return. Because our helper functions are directly on state, but also rely on state to be calculated, we end up with a circular type dependency. The only way to stop this circular type dependency is to have all of our helpers have an explicit return type, without an explicit return type we lose all of our type help for state. If we forget to type the return of any our helpers we immediately break our ClientState type because of circular dependencies.
- Sequences: All of our sequences are arrays of actions when you look at the exported variables, but when we use them inside of a .tsx  cerebral wants us to call them like they are functions. So again we must lie. Inside of each sequence we can type them like functions, and if they accept arguments we can type them as functions which have an input type.
- Old Components where we pass in a string to access sequences: There are some components where we pass in a string of the name of the sequence we want the child component to call. This is us basically us just arbitrarily accessing sequences and so we lose all type hints. Instead we need to have the parent just pass in the sequence we want the child to call.


# TLDR. What do I have to do to maintain types on the frontend
- Helpers/Computeds: Every helper function needs an explicit return type or all typings for ClientState break.
- Sequences: If your sequence needs arguments to use, then when exporting the array, type it as a function which has a specific input type.
- Components w/ props passed in from parent: Create a type for the props which need to be passed into the child component, extract the dependency map of the connect function to a const, Call the cerebral connect function with two type hints, one from the type of props that need to be passed in, and one from the typeof dependency map.



## Example of Typical .tsx with no props
 - web-client/src/views/TrialSessionWorkingCopy/TrialSessionWorkingCopy.tsx

## Example of component w/ props passed in from parent
- web-client/src/views/DocketRecord/FilingsAndProceedings.tsx

## Example of Typed sequences
- web-client/src/presenter/sequences/sortTableSequence.ts