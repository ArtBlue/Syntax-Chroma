#Syntax Chroma jQuery Extension

_A modern, lightweight, unobtrusive, themable jQuery syntax highlighter extension_.

## Features
* simple to use
* lightweight (only 4K)
* fast rendering (no highlighting lag)
* semantic (no weird file inclusions, workarounds, odd markup as with other highlighters)
* support for 
  * `HTML`
  * `CSS`
  * `JS`
  * `PHP`
* COMING SOON! Ability to extend syntax highlighting to add your own languages and keyword scopes.

### Under the Hood
Syntax Chroma utilizes the following:

* HTML5
* CSS3
* JS
* jQuery (mostly for DOM manipulation)

## Usage

### Quick Start
1. Simply include the compressed version of the JS file in your document.
2. Use `<code>` tags in your page (although this is a setting that can be customized - see Additional Options).

#### Notes
1. By default Syntax Chroma applies syntax highlighting to all the `<code>` tags it finds on the page. If you need to do inline code blocks, please use another tag other than the one used by this extension.
2. Because of the way HTML wraps text, for best results, try to avoid having lone, unbroken strings that have no white space characters. Doing so will push the code outside its wrappers and create a horizontal scroll.

### Additional Options
Customize the tags that will have highlighting applied:
```` JS
SChroma.codeTags = 'pre' // or
SChroma.codeTags = 'code.highlighter' // code tags with the class="highlighter"
````
Alternate row colors by adding data attributes: 
`<code class="rows-alternate">...<code>`
Then style as desired:
```` CSS
code.rows-alternate li:nth-child(even) {
  background: #E7E7E7;
}
````

### Known Issues
* Because no 100% failsafe regular expression exists for HTML markup, some HTML highlighting will be off. Some tags will fail to get highlighted. In other instances highlighting will be incomplete. There are currently known bugs, and there are improvements that can be made to shorten the gap between what is possible and what is perfect.
* Currently `&&` is not highlighting in JS.
* If any of the code includes regular expressions, especially ones similar to the ones used in the various portions of this extension, you can expect quite a bit of weirdness - missing words, characters, weird highlighting, etc.
* Dash (`-`) and minus (`-`) are matched interchangeably, so in whatever context the character appears, it will be highlighted.
* Currently values inside single quotes (') are not highlighted.

