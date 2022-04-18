# remark-mdx-to-plain-text

Remove MDX formatting with **remark**. This essentially removes
everything but paragraphs and text nodes.

This plugin is a fork of <https://github.com/remarkjs/strip-markdown>, but for MDX. It completely removes `jsx`, `import`, and `export` nodes, leaving you with the text in the mdx file.

## What is this?

I (Ryan Kubik) found `remark-mdx-to-plain-text` on NPM and it solved an issue I was having with my personal blog. For my use case, I did not want images converted to their alt text values though. The GitHub link on NPM does not seem to link back to the original author's repository for this package. Because I could not find it, I opted to upload this copy of the project to my own GitHub and make the changes I need.

I was not sure how to reconstruct the existing build system. Instead, I opted to install Parcel and do it myself. There are a lot of bits of the pre-existing system hanging around still.

## Installation

npm:

```bash
npm install remark-mdx-to-plain-text remark-mdx
```

yarn:

```bash
yarn add remark-mdx-to-plain-text remark-mdx
```

**You'll need to have `remark-mdx` installed for this to work.**

## Usage

```javascript
let remark = require('remark')
let mdx = require('remark-mdx')
let strip = require('remark-mdx-to-plain-text')

let sample = [
  "import Bagel from './bagel';\n",
  'Some _emphasis_, **importance**, and `code`.',
  '<Bagel />'
].join('\n')

remark()
  .use(mdx)
  .use(strip)
  .process(sample, function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Yields:

```text
Some emphasis, importance, and code.
```

You might want to call `.trim()` on the result, since this can leave empty lines. It doesn't do that automatically because this shouldn't quite so opinionated.

## API

### `remark().use(mdx).use(strip)`

Modifies **remark** to expose plain-text.

- Removes `jsx`, `import`, `export`, `code`, `horizontalRule`, `table`, `yaml`, `toml`, and their
  content
- Render everything else as simple paragraphs without formatting
- Uses `alt` text for images

## License

MIT License © Jarred Sumner
