#!/bin/bash

if [ "${READONLY_SMOKETESTS_RESULT}" -ne 0 ]; then 
    exit 1 
fi

