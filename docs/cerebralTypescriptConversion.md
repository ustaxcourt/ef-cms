1. Do a find and replace regex for imports with state from cerebral
  - Find: ```(import\s*\{[\s\S]*?\b)state(\b[\s\S]*?\}\s*from\s*['"]cerebral['"];)```
  - Replace: ```$1$2 import { state } from '@web-client/presenter/app.cerebral';```
1. Do a find and replace regex for imports with sequence from cerebral
  - Find: ```(import\s*\{[\s\S]*?\b)sequences(\b[\s\S]*?\}\s*from\s*['"]cerebral['"];)```
  - Replace: ```$1$2 import { sequences } from '@web-client/presenter/app.cerebral';```
1. Do a find and replace for empty imports from cerebral
  - Find: ```import {} from 'cerebral';```
  - Replace: ``````


1. Do a find and replace regex for imports with runAction from cerebral/test
  - Find: ```(import\s*\{[\s\S]*?\b)runAction(\b[\s\S]*?\}\s*from\s*['"]cerebral\/test['"];)```
  - Replace: ```$1$2 import { runAction } from '@web-client/presenter/test.cerebral';```
1. Do a find and replace regex for imports with sequence from cerebral/test
  - Find: ```(import\s*\{[\s\S]*?\b)runCompute(\b[\s\S]*?\}\s*from\s*['"]cerebral\/test['"];)```
  - Replace: ```$1$2 import { runCompute } from '@web-client/presenter/test.cerebral';```
1. Do a find and replace for empty imports from cerebral/test
  - Find: ```import {} from 'cerebral/test';```
  - Replace: ``````


1. Do a find and replace regex for computeds
  - Find: ```(export\sconst\s(\w+)\s*=\s*)\((get),\s(applicationContext)\)\s*=>```
  - Replace: ```import { Get } from 'cerebral';\nimport { ClientApplicationContext } from '@web-client/applicationContext';\n$1($3: Get, $4: ClientApplicationContext) =>```
  - Will need to fix imports on web-client/src/presenter/computeds/formattedCaseDetail.ts due to identical imports
1. Do a find and replace regex for remaining computeds
  - Find: ```(export\sconst\s(\w+)\s*=\s*)get\s*=>```
  - Replace: ```import { Get } from 'cerebral';\n$1(get: Get) =>```

1. remove eslint import
  - ```npm uninstall eslint-plugin-import```

