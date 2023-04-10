## Steps to create base branch
1. Pull latest from staging: ```git fetch --all```
1. Checkout staging ```gco ustc/staging```
1. branch off of staging to create the mass rename branch: ```gco -b convert-typescript-v3```
1. Merge in minimum change branch: ```git pull origin devex-typescript-conversion-v3```

## Steps to convert web-api to Typescript
1. Install rename command utility: ```brew install rename```
1. Rename all .js files to .ts files
  - Navigate to web-api/src in the terminal and run: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```
1. Commit all changes

## Steps to convert integration tests to Typescript
1. Install rename command utility: ```brew install rename```
1. Rename all .js files to .ts files in integration-tests
  - Navigate to web-client/integration-tests in the terminal and run: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```
1. Rename all .js files to .ts files in integration-tests-public
  - Navigate to web-client/integration-tests-public and run: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```
1. Commit all changes with a --no-verify.
1. Do a find and replace for .js file
  - Find: ```.js'```
  - Replace: ```'```
  - filesToInclude: ```web-client/integration-tests```
1. Commit all changes

## Steps to convert cypress tests to Typescript
1. Verify the only file in the ./cypress folder is tsconfig.json. Delete any other file or folder.
1. Move cypress-integration, cypress-readonly, cypress-smoketests into the cypress foleder
1. Commit all files with a --no-verify
1. Rename all .js files to .ts files in cypress
  - Navigate to cypress/ in the terminal and run: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```
1. commit files with a --no-verify
1. Do a find and replace for relative imports to shared
  - Find: ```../shared```
  - Replace: ```../../shared```
  - filesToInclude: ```cypress```
1. Do a find and replace for relative imports to web-api
  - Find: ```../web-api```
  - Replace: ```../../web-api```
  - filesToInclude: ```cypress```
1. Commit all changes


## Steps For Deployment Day
1. Communicate that we are starting switch over.
1. Pause all merges into staging
1. Ask all current story branches or tech branches to merge in staging and resolve conflicts. Wait for everyone to give a thumbs up.
1. Follow steps to migrate web-api, integration-tests, cypress
1. Make a PR to test and staging. Verify that GitHub Actions are passing.
1. Have Mike + Jim immediately merge into staging + test
1. All currently active story branches merge staging into their branch to get the updated .ts files.
1. Story work resumes as normal