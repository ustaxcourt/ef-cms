## Block scoped variables
- In some places we are receiving the error "Cannot redeclare block-scoped variable"
- This exists because typescript is defaulting to using modules
  ```In TypeScript, just as in ECMAScript 2015, any file containing a top-level import or export is considered a module. Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well). ```
- When the files have no import statement their variables are available in the global scope which conflicts with other files. Every import of a constant into another file will cause an error.



## Steps to convert shared to Typescript
1. Pull latest from staging: ```git fetch --all```
1. branch off of staging to create the mass rename branch: ```gco -b convert-shared-to-typescript```
1. Merge in minimum change branch: ```git pull origin devex-typescript-shared-conversion```
1. Install rename command utility: ```brew install rename```
1. Rename all .jsx files to .tsx 
  - Navigate to shared/src in the terminal and run: ```find . -iname "*.jsx" -exec rename -f 's/\.jsx/\.tsx/' {} \;```
1. Rename all .js files to .ts files
  - Navigate to shared/src in the terminal and run: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```
1. Commit rename changes.
1. Find and replace .jsx' to .tsx' with big find in shared/src directory
  - Find: ``` .jsx' ```
  - Replace: ``` .tsx' ```
  - Files to inclide: ``` shared/src/** ```
1. Find and replace .js' to .ts' with big find in shared/src directory
1. In web-client/src/applicationContext.ts remove the ~.js~ on the import for sharedAppContext

## Steps For Deployment Day
1. Communicate that we are starting switch over.
1. Pause all merges into staging
1. Ask all current story branches or tech branches to merge in staging and resolve conflicts. Wait for everyone to give a thumbs up.
1. Follow steps in ```Steps to convert shared to Typescript```
1. Make a PR to test and staging. Verify that GitHub Actions are passing.
1. Have Mike + Jim immediately merge into staging + test
1. All currently active story branches merge staging into their branch to get the updated .ts files.
1. Story work resumes as normal