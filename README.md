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
2. Use `<code>` tags in your page

### Additional Options
1. Alternate row colors by adding data attributes: 
`<code class="rows-alternate">...<code>`
Then style as desired:
`code.rows-alternate li:nth-child(even) {
background: #E7E7E7;
}`

