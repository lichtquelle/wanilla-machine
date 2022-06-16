# Wanilla Machine

Write your website using HTML and Markdown.

Run it on an express server as a middleware or pre-render it using [generate-static-site](https://www.npmjs.com/package/generate-static-site).

## Get Started

Get started with Wanilla Machine in 1 Minute.

1. Download this example as a starter template:

```bash
# download starter project
# (to the current directory)
npx wanilla-machine@latest --init

# start wanilla machine
npx wanilla-machine@latest

# open your browser
http://localhost:4500/
```

2. Pre-Render your site using [generate-static-site](https://www.npmjs.com/package/generate-static-site):

```bash
# pre-render your site
npx generate-static-site http://localhost:4500/ www
```
3. Publish your static site (inside www) to any host of your choice.

## Documentation

_Available soon._

## Development

_You can already do a lot of things, but you can't create dynamic blog posts, articles, products etc. just yet._

## CLI

```
Wanilla Machine

USAGE
  npx wanilla-machine <root> [options]

ARGUMENTS
  root                    FOLDER

OPTIONS
  --help                  Display help
  --init                  Initialize a starter project
  --open=<boolean>        Whether or not to open the browser
  --port=<number>         Set the server port
  --version -v            Print version
```
