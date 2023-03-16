
## Steps to convert web-api to Typescript
1. Pull latest from staging: ```git fetch --all```
1. Checkout staging ```gco ustc/staging```
1. branch off of staging to create the mass rename branch: ```gco -b convert-api-to-typescript```
1. Merge in minimum change branch: ```git pull origin devex-typescript-api```
1. Install rename command utility: ```brew install rename```
1. Rename all .js files to .ts files
  - Navigate to web-api/src in the terminal and run: ```find . -iname "*.js" -exec rename -f 's/\.js/\.ts/' {} \;```

## Steps For Deployment Day
1. Communicate that we are starting switch over.
1. Pause all merges into staging
1. Ask all current story branches or tech branches to merge in staging and resolve conflicts. Wait for everyone to give a thumbs up.
1. Follow steps in ```Steps to convert web-api to Typescript```
1. Make a PR to test and staging. Verify that GitHub Actions are passing.
1. Have Mike + Jim immediately merge into staging + test
1. All currently active story branches merge staging into their branch to get the updated .ts files.
1. Story work resumes as normal