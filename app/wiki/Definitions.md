### `TEST SUITE "string"`

Applies a name to the current suite of tests. Useful to group tests by functionality as well as to apply some settings for all tests.

Example:

    ' This is the iOS purchase flow
    TEST SUITE "Bobs Hardware Site - iPhone Purchase Flow"
    SET SCREENSIZE TO 320 BY 480
    SET USERAGENT TO "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7"

    TEST "Pick Inventory"
    ...
    TEST "Checkout"
    ...
    TEST "Payment"
    ...
    TEST "Confirmation"
    ...
    

### `TEST "string"`

Applies a name to each test in the suite. This is useful to be able to organise and locate errors down the line.

    TEST "Pick Inventory"
    GO TO "http://www.bobs-hardware.com/categories/tools"
    CLICK "div#product49271 a:contains('Add to basket')"