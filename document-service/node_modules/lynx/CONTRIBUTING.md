# Contributing

Everyone is welcome to contribute with patches, bug-fixes and new features

1. Create an [issue][2] on github so the community can comment on your idea
2. Fork `lynx` in github
3. Create a new branch `git checkout -b my_branch`
4. Create tests for the changes you made
5. Make sure you pass both existing and newly inserted tests
6. Commit your changes
7. Push to your branch `git push origin my_branch`
8. Create a pull request

## Tests

Tests are written in `node-tap`. If you want to create a new test create a file named `my-test-name-test.js` under the `tests` directory and it will be automatically picked up by `tap`. Before you do that however please check if a test doesn't already exist.

Tests run against a udp ""server"", which is on `tests/macros.js`. If your test name is `foo-bar` this helper function will read a fixtures located in `tests/fixtures/foo-bar.json`.

Each fixture is an array containing strings, the strings that we expect the client to send when we issue certain commands.

Check `tests/counting-test.js` and `tests/fixtures/counting.js` for an example

[2]: http://github.com/dscape/lynx/issues