Phantom Test Runner
-------

Another PhantonJS Test Runner

Create 1.Login.test

    TEST "Log into Bobs hardware"

    -- INITIALIZE
    SET @username_box = "#login input[name=username]"
    SET @password_box = "#login input[name=password]"
    SET @login_button = "#login input[type=submit]"
    SET @home_button = "nav > ul > li:nth-child(1)"
    SET @welcome_message = "div#wrapper H3.welcome"
    
    -- COMMENCE TESTS
    GO TO @url
    TAKE SCREENSHOT
    CLICK @username_box AND WRITE @user
    CLICK @password_box AND WRITE @password
    TAKE SCREENSHOT
    CLICK @login_button
    CHECK @home_button EXISTS
    CHECK @welcome_message TEXT CONTAINS "Welcome Bob"


In windows:

    run.bat tests\1.Login.test @url=http://dev.bobs-hardware.com/admin @user=bob @password=secret
    
In OSX:

    .\run.sh tests\1.Login.test @url=http://dev.bobs-hardware.com/admin @user=bob @password=secret
    
This will trigger off the test scenario using PhantomJS
