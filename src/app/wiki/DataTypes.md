### `selector`

A selector is a way to uniquely identify an item on a page (such as a button or a text field). 

When you want to automate a test step such as 'Click the "submit" button', you will need a way to identify the 'Submit' button on the page. This is done using a _selector_ (maybe there is more than one submit button?).

There are 2 types of selectors that can be used to accomplish this:

#### CSS Selectors

![CSS Selector Examples](https://raw.github.com/sdesalas/joyful/master/wiki/CSS.Selector.Example.png)

These are implemented by [SizzleJS](https://github.com/jquery/sizzle/wiki/Sizzle-Documentation#-selectors), so any selector used in CSS3 or [jQuery](http://api.jquery.com/category/selectors/) (version 1.10) will also work here.

Some examples are:

    ' Pick the "input" element inside a "form" whose "name" attribute is equal to "email"
    CLICK "form input[name='email']" AND WRITE "test@gmail.com"
    ' Pick the "button" element which contains text "Submit"
    CLICK "button:contains('Submit')"
    ' Pick the "h1" header element that has an "id" of "main-title"
    CHECK "h1#main-title" TEXT CONTAINS "Success"

Sometimes, a selector will point to more than one item on the page. In most cases the functionality will ignore this and only use the first item selected.

Here are some useful references:

* http://www.w3schools.com/cssref/css_selectors.asp
* http://api.jquery.com/category/selectors/

#### XPath Selectors

Based on XPath 1.0. This is an alternative way to identify an element in an XML document but it can be used for HTML as well. XPath selectors are normally full of forward slashes "/" as these are used for traversing down the HTML tree to the element we are after.

There is a handy way way to generate XPath selectors if you are using Chrome or Safari. You can right-click on a target element and selector 'Inspect Element', which will bring up the developer toolbar as follows:

![XPath Selector Generation](https://raw.github.com/sdesalas/joyful/master/wiki/XPath.Selector.Generation.png)

Some examples:

    ' Pick the "input" element inside the first "form" whose "name" attribute is equal to "email"
    CLICK "//form[1]/input[@name='email']" AND WRITE "test@gmail.com"
    ' Pick the "button" element which contains text "Submit"
    CLICK "//button//*[contains(text(), 'Submit')]"
    ' Pick the "h1" header element that has an "id" of "main-title"
    CHECK "//h1[@id='main-title']" TEXT CONTAINS "Success"

Here are some useful references:

* http://www.w3schools.com/xpath/xpath_syntax.asp: 

### `string`