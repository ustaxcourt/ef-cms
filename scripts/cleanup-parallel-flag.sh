#!/bin/bash
FLAG_FILE=".run-is-cancelled"
if [ -f "$FLAG_FILE" ]; then
    echo "Removing parallel fail-fast flag file: $FLAG_FILE"
    rm "$FLAG_FILE"
else
    echo "No parallel fail-fast flag file found"
fi
