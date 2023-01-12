

## Unit Tests
- Rename unit tests while in src/ sirectory: ``` find . -iname "*.test.js*" -exec rename -f 's/\.test.js/\.test.ts/' {} \;```

## Jsx 
- to rename jsx files: ``` find . -iname "*jsx*" -exec rename -f 's/\.jsx/\.tsx/' {} \; ```
- to rename all js files: ```find . -iname "*.js*" -exec rename -f 's/\.js/\.ts/' {} \;```

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

