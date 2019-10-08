#!/bin/bash

if [ ! -z $CIRCLE_PR_NUMBER ]; then
    echo $(curl -fsSL https://api.github.com/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/pulls/$CIRCLE_PR_NUMBER | jq -r '.base.ref')
else
    echo "develop"
fi