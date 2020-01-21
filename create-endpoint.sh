#!/bin/bash

if [ $1 == 'help' ] ; then
  echo ""
  echo ""
  echo "This wizard script can be ran to help create a new endpoint in ef-cms. The manual process of adding new endpoints typically includes includes:"
  echo ""
  echo "- updating the desired serverless.yml file to add the new function endpoint"
  echo "- creating a new *Lambda.js file"
  echo "- creating a new *Interactor.js file in the shared directory"
  echo "- updating the necessary *Handlers.js file to invoke the *Lambda.js file"
  echo "- creating a proxy for this new endpoint inside web-client"
  echo "- updating the web-client application context to use this new proxy"
  echo "- updating the web-api application context to use the interactor"
  echo ""
  echo ""
  exit 0
fi

echo "Please enter the name prefix of your interactor, i.g: 'updateMyAwesomeCase' if you want 'updateMyAwesomeCaseInteractor.js'"
# 1. specify endpoint `POST@/cases/{caseId}/something/{otherId}` and interactor name `updateAwesomeCase`
# name=$1
# endpoint=$2
# method=$3
# stack=$4
# dir=$5

# # 2. find matching .yml with basePath
# # grep --include $4\*.yml ./web-api

# # 3. find matching handler file
# handler=$(cat $4 | grep "handler:" | head -n 1)
# regex="[a-zA-Z]+Handlers"
# if [[ $handler =~ $regex ]]
# then
#     file="./web-api/${BASH_REMATCH[0]}.js"
# fi
# echo $file


# sed -i "s!};!${NAME}Lambda: require('./$dir/$nameLambda').handler,!g" $file


# # 4. create new endpoint with expected method and lambda endpoint
# # 5. create lambda file
# # 6. update handler file to append the new lambda
# # 7. create interactor 
# # 8. create proxy
# # 9. update application context on web-api
# # 10. update application context on web-client