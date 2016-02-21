### `GO TO "url"`

Opens up a location URL in the browser, this can be either absolute or relative. 

Examples:

    ' Absolute:
    GO TO "http://www.bobs-hardware.com/Main.aspx"
    CHECK "input#search" EXISTS

    ' Relative to current page
    GO TO "categories/tools"
    CHECK "input#search" NOT EXISTS

    ' Relative to root
    GO TO "/tags/garden"
    CHECK "input#search" NOT EXISTS

    ' Traverse up path
    GO TO "../../"
    CHECK "input#search" EXISTS

NOTE: This command includes waiting until the page is fully loaded before moving on.

### `GO BACK`

Goes back one step in browser history. Equivalent to clicking the 'Back' button on the browser.

Example: 

    ' Navigate to Tools section 
    GO TO "http://www.bobs-hardware.com/Main.aspx"
    CLICK "ul#navigation li a:contains('Tools')" 

    ' Back to Main
    GO BACK
    CHECK LOCATION IS "http://www.babos-hardware.com/Main.aspx"

NOTE: This command includes waiting until the page is fully loaded before moving on.

### `REFRESH`

Refreshes the current page, resetting all form information and javascript functionality.

Example:

    ' Fill in the search box
    GO TO "http://www.bobs-hardware.com/Main.aspx"
    CLICK "input#search" AND TYPE "garden tools"
    CHECK "input#search" CONTAINS "garden tools"

    ' Form input should clear up when refreshing the page
    REFRESH
    CHECK "input#search" NOT CONTAINS "garden tools"

### `SET COOKIE "string" TO "string" [FOR "url"]`

Sets a browser cookie, this can either be for a specific domain or for the current one (if omitted).

* SET COOKIE "name": This is the name of the cookie.
* TO "value": This is the value we are giving the cookie
* FOR "domain": (Optional) This is the domain the cookie applies to (current domain if unavailable).

Example:

    ' Skip authentication for current suite
    TEST SUITE "Purchase History"
    SET COOKIE "auth_key" TO "BAh7DToQbGFzdF9hY3RpdmVNyV4cgNhR" FOR "bobs-hardware.com"

    TEST "View My Account"
    GO TO "https://my.bobs-hardware.com/account"
    CLICK "div#history a.button"

Cookies can also be applied to the current url by omitting the domain:

    TEST SUITE "Purchase History"
    GO TO "https://my.bobs-hardware.com/account"
    ' The following cookie will apply to 'my.bobs-hardware.com'
    SET COOKIE "auth_key" TO "BAh7DToQbGFzdF9hY3RpdmVNyV4cgNhR" 

### `SET SCREENSIZE TO number BY number`

Sets the size of the screen. Useful for testing a page under different resolutions. The first number is the horizontal resolution, the second number is the vertical resolution.

NOTE: There is a maximum resolution of 2560 by 2048, and minimum resolution of 240 BY 240.

    TEST SUITE "Inventory Picking for Various Devices" 
    GO TO "http://www.bobs-hardware.com/categories/tools"

    TEST "View on Desktop"
    SET SCREENSIZE TO 1042 BY 768
    TAKE SCREENSHOT "Desktop.png"

    TEST "View on Tablet (Vertical)"
    SET SCREENSIZE TO 600 BY 800
    TAKE SCREENSHOT "Tablet.png"

    TEST "View on Mobile (Vertical)"
    SET SCREENSIZE TO 320 BY 480
    TAKE SCREENSHOT "Mobile.png"


### `SET USERAGENT TO "string"`

This is useful for testing mobile redirection and other page behaviors that are determined by the browser user agent.

    TEST SUITE "Mobile Redirection" 

    TEST "iPhone"
    SET USERAGENT TO "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7"
    GO TO "http://www.bobs-hardware.com/"
    CHECK LOCATION IS "http://mobile.bobs-hardware.com/"

    TEST "Android"
    SET USERAGENT TO "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
    GO TO "http://www.bobs-hardware.com/"
    CHECK LOCATION IS "http://mobile.bobs-hardware.com/"

### `CLEAR CACHE`
### `CLEAR COOKIES`