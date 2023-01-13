

## Unit Tests
- Rename unit tests while in src/ sirectory: ``` find . -iname "*.test.js*" -exec rename -f 's/\.test.js/\.test.ts/' {} \;```

## Jsx 
- to rename jsx files: ``` find . -iname "*.jsx" -exec rename -f 's/\.jsx/\.tsx/' {} \; ```
- to rename all js files: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```

## Renaming Files Utility
- Install rename command utility with: ```brew install rename```
- UNIX command to recursively rename all files in a folder:
``` find . -iname "*jsx*" -exec rename -f 's/\.jsx/\.tsx/' {} \; ```
- To just see what the utility would do you can use the -n flag. This is like a dryrun flag: 
``` find . -iname "*jsx*" -exec rename -n 's/\.jsx/\.tsx/' {} \; ```



## Typescript Build steps
The way typescript works is generally in three steps
1. Run type check on the project. Throw error if there are type problems.
1. Transpile typescript to javascript.
1. Run Javacsript.

Currently Having difficulty with step 2 in transpiling as many tests use the shared directory. The shared directory has javascript files that may not be compatible with how we build frontend.


## Cerebral W/ typescript and Babel
- Cerebral currently requires a transpile step in order for us to run our javascript. It is using the plugin: babel-plugin-cerebral
- What this plugin does is add an extra transpile step which converts how we use cerebral. It changes all get(state.modal.penalties) => get(state`modal.penalties`). 
- We can either always have this build step or just start using the syntax that cerebral would like us to use.

1. Delete dist folder in root directory
1. Temporarliy comment out ./babel.config.js at root so there are no options.
1. run command at root directory ```npx babel web-client/src --out-dir dist --ignore "**/*.jsx","**/*.test.js" --no-babelrc --plugins=babel-plugin-cerebral```
1. Copy files from dist to web-client using command: ```ditto -V dist/ web-client/src/```
1. Run a format on all files so that the only changes are the babel-cerebral changes by running : ```npm run lint:js/ts:fix```
