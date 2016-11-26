### `CHECK LOCATION IS [NOT] "string"`

Used to check the location URL, this assertion checks for an exact match as follows:

    TEST "Check iPhone Redirection"
    SET SCREENZISE TO 320 BY 480
    SET USERAGENT TO "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7"
    GO TO "http://www.bobs-hardware.com"
    CHECK LOCATION IS "http://www.bobs-hardware.com/mobile/"

### `CHECK LOCATION [NOT] LIKE "string"`

### `CHECK LOCATION [NOT] MATCHES "expression"`

### `CHECK "selector" [NOT] EXISTS`