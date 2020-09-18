
# Steps to do a migration in DEV from GREEN to BLUE
- update circle env DEPLOYING_COLOR=blue
- run a circle deploy normally
- deploy the migration infrastructure using 
  `DESTINATION_TABLE=b SOURCE_TABLE=a STREAM_ARN=abc npm run deploy:migration -- dev`
- run the migration using 
  `ENV=dev SOURCE_TABLE=a AWS_ACCOUNT_ID=abc npm run start:migration -- dev`
- manually verify the migration is done
- verify the application works at 
  - https://blue-dev.ustc-case-mgmt.flexion.us
  - https://app-blue-dev.ustc-case-mgmt.flexion.us
- switch the colors over
  `CURRENT_COLOR=blue DEPLOYING_COLOR=green ENV=dev ./web-client/switch-ui-colors.js`