# Control UI [![Build Status](https://travis-ci.org/coolcrowd/control-ui.svg?branch=master)](https://travis-ci.org/coolcrowd/control-ui)

Web interface for [CrowdControl](https://github.com/coolcrowd/object-service).

## Installation

```bash
# Install gulp as global binary
sudo npm install -g gulp

# Clone git repository and change directory
git clone https://github.com/coolcrowd/control-ui && cd control-ui

# Install dependencies using npm
npm install

# Build production version
gulp production

# Configure your web server to serve ./build
```

## Development

During development, use `gulp` without any arguments to enter development mode.
Files are automatically watched and rebuilt on change.
Updated stylesheets will be injected automatically, no page reload required.

## Tests

We use [Karma](https://karma-runner.github.io/0.13/index.html) for running tests.

```bash
# Running tests on your local machine requires Google Chrome
gulp karma
```

Tests are automatically executed for every push and pull request.