

## Unit Tests
- Rename unit tests while in src/ sirectory: ``` find . -iname "*.test.js*" -exec rename -f 's/\.test.js/\.test.ts/' {} \;```

## Jsx 
- to rename jsx files: ``` find . -iname "*jsx*" -exec rename -f 's/\.jsx/\.tsx/' {} \; ```
- to rename all js files: ```find . -iname "*.js*" -exec rename -f 's/\.js/\.ts/' {} \;```

## Renaming Files

- Install rename command utility with: ```brew install rename```
- UNIX command to recursively rename all files in a folder:
``` find . -iname "*jsx*" -exec rename -f 's/\.jsx/\.tsx/' {} \; ```
- To just see what the utility would do you can use the -n flag. This is like a dryrun flag: 
``` find . -iname "*jsx*" -exec rename -n 's/\.jsx/\.tsx/' {} \; ```

