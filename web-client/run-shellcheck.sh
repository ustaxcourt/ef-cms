#!/bin/bash -e
find . -regex '.*\.sh' | grep -v 'node_modules' |xargs shellcheck