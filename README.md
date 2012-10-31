Kerning.js
==========

CSS, meet kerning. Kerning, meet CSS. Kern, style, transform, and scale your web type with real CSS rules, automatically.

Kerning.js is a single script, small, and has no dependencies. Add it to your page, add some CSS rules, and your text will be beautified.

Status
------

This project is currently stable. No major issues have been reported.

Version
-------

The current version is **0.2**.

Usage
-----
Include this file anywhere in your HTML

    <script src="kerning.js"></script>


Then, add any of the attributes following to your CSS, under any selectors you want modified:

    -letter-kern, -letter-size, -letter-weight, -letter-color, -letter-transform
    -word-kern, -word-size, -word-weight, -word-color, -word-transform


To use pairings (e.g., modify 'a' if 'ab' is paired):

    -letter-pairs('xy': [value], …)
    -word-pairs('cat mouse': [value], …)


To use multiple transforms, you need to use transform "groups":

    -transform-group([transform] [transform] …)


To add rules for a particular rendering engine, use a prefix on any of the attributes:

* Gecko engine (Firefox): `-moz`
* Webkit (Chrome, Safari): `-webkit`
* Opera: `-o`
* Microsoft: `-ms`

To add rules for a particular operating system, use a prefix on any of the attributes:

* Windows: `-win`
* Mac: `-mac`
* Linux: `-lin`

Note: Do not use a prefix on the attribute values (i.e., -letter-pairs does not need a prefix).

That's it! Attributes will be applied automagically.

Examples
--------
Alter first 3 letters:

    -letter-size: 100px 20px 30px;


Modify letter pairs:

    -letter-kern: -letter-pairs('ab': 1px,
                                'bc': 300px,
                                's ': 100px);


Transform the first two letters:

    -letter-transform: -transform-group(rotate3d(0,0,1,10deg) translate3d(0,10px,0))
                       -transform-group(translate3d(0,-10px,0) rotate3d(0,0,1,-10deg));


Modify word pairs:

    -word-size: -word-pairs('this is': 10em);


Modify the first 3 words:

    -word-size: 10em 0.1em 0.2em;


WebKit-only:

    -webkit-letter-kern: 0 1px 0;


Using repeat rules:

    -letter-color: -letter-repeats(even: #f0f0f0, odd: #cccccc);
    -letter-color: -letter-repeats(2n+1: #f0f0f0);


Using conditionals:

    -letter-kern: if-font('Helvetica Neue': 0 1px 1px, 'Helvetica': 0 -1px 0);


Using conditionals on existing properties for weight or size:

    font-size: 9.5em;
    font-size: if-font('Helvetica Neue': 10em, 'Helvetica': 9em);

Future
------

Right now, Kerning.js supports kerning, color, size, weight, and transforms per-letter, per-word, and per-font. In the future, it will include:

* More compact and refined CSS rules
* Visual kerning tool with automatic rule generation

License
-------

Copyright 2012 [Joshua Gross](http://unwieldy.net)

MIT license

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
