'use strict'

var test = require('tape')
var remark = require('remark')
var mdx = require('remark-mdx')
var u = require('unist-builder')
var strip = require('.')

function proc(value) {
  return remark()
    .use(mdx)
    .use(strip)
    .processSync(value)
    .toString()
    .trimRight()
}

test('stripMarkdown()', function(t) {
  t.deepEqual(
    remark()
      .use(strip)
      .runSync(
        u('root', [
          u('unknown', [u('strong', [u('text', 'value')])]),
          u('anotherUnknown', 'with value')
        ])
      ),
    u('root', [
      u('unknown', [u('text', 'value')]),
      u('anotherUnknown', 'with value')
    ]),
    'should keep unknown nodes'
  )

  t.equal(proc('Alfred'), 'Alfred', 'text')
  t.equal(proc('*Alfred*'), 'Alfred', 'emphasis (1)')
  t.equal(proc('_Alfred_'), 'Alfred', 'emphasis (2)')
  t.equal(proc('**Alfred**'), 'Alfred', 'importance (1)')
  t.equal(proc('__Alfred__'), 'Alfred', 'importance (2)')
  t.equal(proc('~~Alfred~~'), 'Alfred', 'strikethrough')
  t.equal(proc('`Alfred`'), 'Alfred', 'inline code')
  t.equal(proc('[Hello](world)'), 'Hello', 'link')
  t.equal(proc('[**H**ello](world)'), 'Hello', 'importance in link')
  t.equal(
    proc('[Hello][id]\n\n[id]: http://example.com "optional title"'),
    'Hello',
    'reference-style link'
  )
  t.equal(proc('Hello.\n\nWorld.'), 'Hello.\n\nWorld.', 'paragraph')
  t.equal(proc('## Alfred'), 'Alfred', 'headings (atx)')
  t.equal(proc('Alfred\n====='), 'Alfred', 'headings (setext)')

  t.equal(
    proc('- Hello\n    * World\n        + !'),
    'Hello\n\nWorld\n\n!',
    'list item'
  )

  t.equal(proc('- Hello\n\n- World\n\n- !'), 'Hello\n\nWorld\n\n!', 'list')

  t.equal(proc('- Hello\n- \n- World!'), 'Hello\n\nWorld!', 'empty list item')

  t.equal(proc('> Hello\n> World\n> !'), 'Hello\nWorld\n!', 'blockquote')

  t.equal(proc('![An image](image.png "test")'), 'An image', 'image (1)')
  t.equal(proc('![](image.png "test")'), 'test', 'image (2)')
  t.equal(proc('![](image.png)'), '', 'image (3)')
  t.equal(
    proc('![An image][id]\n\n[id]: http://example.com/a.jpg'),
    'An image',
    'reference-style image'
  )

  t.equal(proc('---'), '', 'thematic break')
  t.equal(proc('A  \nB'), 'A\nB', 'hard line break')
  t.equal(proc('A\nB'), 'A\nB', 'soft line break')
  t.equal(proc('| A | B |\n| - | - |\n| C | D |'), '', 'table')
  t.equal(proc('\talert("hello");'), '', 'code (1)')
  t.equal(proc('```js\nconsole.log("world");\n```'), '', 'code (2)')
  t.equal(proc('<script>alert("world");</script>'), '', 'html (2)')
  t.equal(
    proc('[<img src="http://example.com/a.jpg" />](http://example.com)'),
    '',
    'html (3)'
  )

  // Tests for import
  t.equal(proc("import Bagel from 'noahs-bagels';"), '', 'import')
  t.equal(proc("import {Bagel} from 'noahs-bagels';"), '', 'import')
  t.equal(proc("import * as Bagel from 'noahs-bagels';"), '', 'import')

  t.equal(proc(`export const Bagel = "sesame"`), '', 'export')

  // Tests for jsx
  t.equal(proc('<Bagel />'), '', 'self-closing JSX tag')
  t.equal(proc('<Bagel>Sesame</Bagel>'), '', 'JSX tag with child')
  t.equal(proc('<Bagel></Bagel>'), '', 'JSX tag with no child')

  t.end()
})
