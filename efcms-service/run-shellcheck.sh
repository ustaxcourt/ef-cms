#!/bin/bash
find . -regex '.*\.sh' | grep -v 'node_modules' |xargs shellcheck