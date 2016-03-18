#Syntax Chroma JavaScript Library

_A modern, lightweight, unobtrusive, themable syntax highlighter extension with no dependencies_.

## Features
Syntax Chroma is currently in alpha, so don't be surprised to find various bugs. All currently known issues are listed towards the bottom. Please do report unknown issues to improve Syntax Chroma. That said, there are still good reasons why this particular solution is a good choice for syntax highlighting on web pages. Some of the features that makes it so are as follows:
* Simple - easy to set up and use
* Beautiful - code does not need to look ugly
* Lightweight - < 5K
* Fast - quick rendering with no highlighting lag due to processing
* Legible - use of stylistic monospace fonts
* Semantic - no weird file inclusions, workarounds, odd markup as with other highlighters
* Support for `HTML`, `CSS`, `JS`, `PHP`
* Themes - you may use any of the pre-built themes provided or write your own
 
Coming Soon!

* Ability to extend the dictionary to add your own languages and keyword scopes.
* Ability to copy all of the code inside the tag.

### Under the Hood
Syntax Chroma utilizes the following:

* HTML5
* CSS3
* JS

## Usage

### Quick Start
1. Simply include the compressed version of the JS file in your document.
2. Use `<code>` tags in your page (although this is a setting that can be customized - see Additional Options).
3. Add the language of the code that you're going to put inside the tag as a data attribute: `data-lang="JS"`. Your minimal code should look like this:
```` HTML
<code data-lang="JS">
  JS code here...
</code>
````
If `data-lang` is not provided, Syntax Highlighter will assume plain text, and though some of the styles will be applied to make the code inside look like a bit of code, there will be no highlighting of any keywords.

#### Notes
1. By default Syntax Chroma applies syntax highlighting to all the `<code>` tags it finds on the page. If you need to do inline code blocks, please use another tag other than the one used by this extension.
2. Because of the way HTML wraps text, for best results, try to avoid having lone, unbroken strings that have no white space characters. Doing so will push the code outside its wrappers and create a horizontal scroll.
3. For most consistent indentation results, it's best to start the code from the beginning of the line, like so:
```` HTML
  <code id="chroma3" data-lang="JS" data-code-wrapper="1">
(function($){
    "use strict";
    $(function() {
        $(this).changeUriParam("param3","77");
    });
})(jQuery); // ensure $ = jQuery
  </code>
````

### Options and Customizations
#### Fonts
Research into the best fonts to use for code, and the availability of those fonts on various platforms, yielded the best set of font faces to use: `Consolas, Monaco, "Droid Sans Mono", "Liberation Mono", "Courier New", sans-serif;` There are numerous fallback fonts specified, the fallback order following the pattern of most supported to least.

#### Custom Tags
You may customize the tags that will have highlighting applied by doing the following:
```` JS
SChroma.codeTags = 'pre' // or
SChroma.codeTags = 'code.highlighter' // code tags with the class="highlighter"
````
Keep in mind that if you choose to use a different tag entirely, you will need to modify the CSS styling acordingly.

#### Alternating Rows
You may alternate row colors by adding data attributes to the tag, like this: 
`<code class="rows-alternate">...<code>`
Then style as desired:
```` CSS
code.rows-alternate li:nth-child(even) {
  background: #E7E7E7;
}
````
#### Indentation Rules
Though in some cases this may get ignored by the script, you may customize the number of spaces to use for indentation, like so:
```` JS
SChroma.indentSpaces = 2; // default is 4
````
#### Automatic Code Wrappers
In some cases, you may need the code wrapping tags included and colored as well. Since everything that goes into the code tag needs to be HTML-escaped, this might make things a bit comberson. To eliviate this, Syntax Chroma also allows for the automiatic inclusion of the opening and closing tags of various languages, currently `CSS`, `JS` and `PHP`. By doing this in your code:
```` HTML
<code data-lang="JS" data-code-wrapper="1">
var me = "Arthur";
</code>
````
You will see Syntax Chroma render this on the web page:
```` HTML
<script type="text/javascript">
var me = "Arthur";
</script>
````

#### Themes
The base stylesheet of Syntax Chroma comes with a default look and feel. However, you may apply a different theme, if you'd like. Look inside `/themes/` for all the themes provided. You may apply a theme by including the additional theme CSS file, and this will impact all the places on your page where Syntax Chroma is highlighting syntax. 

To write your own theme simply follow the patterns you will find in the provided themes. Please bare in mind that the `chroma-base.css` file needs to remain as-is, otherwise you may start seeing odd things on your web pages. The base styling was separated from the themable stylesheet to provide flexibility where available, while at the same time to retain the styling critical to the proper functioning of the extension.

### Known Issues
* Because no 100% failsafe regular expression exists for HTML markup, some HTML highlighting will be off. Some tags will fail to get highlighted. In other instances highlighting will be incomplete. There are currently known bugs, and there are improvements that can be made to shorten the gap between what is possible and what is perfect.
* Currently `&&` is not highlighting in JS.
* If any of the code includes regular expressions, especially ones similar to the ones used in the various portions of this extension, you can expect quite a bit of weirdness - missing words, characters, weird highlighting, etc.
* Dash (`-`) and minus (`-`) are matched interchangeably, so in whatever context the character appears, it will be highlighted.
* Currently values inside single quotes (') are not highlighted.
* Though indentation rules have been established to keep code aligned properly, sometimes those rules may get a bid muddled, and odd line indentations may result.
