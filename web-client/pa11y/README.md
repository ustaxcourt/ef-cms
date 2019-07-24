# README
  When developing new views or URLs, please add a check for accessibility as seen below. If further actions are required at a given URL, use the `actions` array to carry out the necessary steps. If tests fail due to timeouts, try walking through tests manually. See info on actions here: [https://github.com/pa11y/pa11y#actions](https://github.com/pa11y/pa11y#actions)

  To fire onChange when altering a select menu, use `set field` followed by `check field`. To check a checkbox or radio, use `click element` on the element label.

## EXAMPLE
 ```
    'http://example.com/simple-url-with-no-actions-to-set-up',
    {
      actions: [
        'wait for #something-in-page to be visible',
        'click on element #something-in-page',
        'wait for #something-else to be visible',
      ],
      notes:
        'an optional note explaining the intent for this particular url, in which all actions must complete successfully before pa11y tests the page content',
      url:
        'http://example.com/my-url?parameter=value&info=(optional string to distinguish this case from others if it should fail)',
    },
  ```
