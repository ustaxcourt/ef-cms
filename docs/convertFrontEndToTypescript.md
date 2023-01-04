
Install rename command utility with: ```brew install rename```
UNIX command to recursively rename all files in a folder:
``` find . -iname "*jsx*" -exec rename -f 's/\.jsx/\.tsx/' {} \; ```
