# babel-plugin-react-native-platform-specific-extensions

[![NPM version](http://img.shields.io/npm/v/babel-plugin-react-native-platform-specific-extensions.svg)](https://www.npmjs.org/package/babel-plugin-react-native-platform-specific-extensions)
[![Build Status](https://travis-ci.org/kristerkari/babel-plugin-react-native-platform-specific-extensions.svg?branch=master)](https://travis-ci.org/kristerkari/babel-plugin-react-native-platform-specific-extensions)
[![Coverage Status](https://coveralls.io/repos/github/kristerkari/babel-plugin-react-native-platform-specific-extensions/badge.svg?branch=master)](https://coveralls.io/github/kristerkari/babel-plugin-react-native-platform-specific-extensions?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
[![Greenkeeper badge](https://badges.greenkeeper.io/kristerkari/babel-plugin-react-native-platform-specific-extensions.svg)](https://greenkeeper.io/)

Allow [react-native platform specific extensions](https://facebook.github.io/react-native/docs/platform-specific-code.html#platform-specific-extensions) to be used for other file types than Javascript.

Example:

`import styles from "./styles.css";`

* `styles.android.css` <- Android only
* `styles.ios.css` <- iOS only
* `styles.native.css` <- Both Android and iOS
* `styles.css` <- Default. Android, iOS and Web

## Usage

### Step 1: Install

```sh
yarn add --dev babel-plugin-react-native-platform-specific-extensions
```

or

```sh
npm install --save-dev babel-plugin-react-native-platform-specific-extensions
```

### Step 2: Configure `.babelrc`

You must give one or more file extensions inside an array in the plugin options.

```
{
  "presets": [
    "react-native"
  ],
  "plugins": [
    ["react-native-platform-specific-extensions", {
      "extensions": ["css", "scss", "sass"],
    }]
  ]
}
```

## TODO

* Support `require`.
