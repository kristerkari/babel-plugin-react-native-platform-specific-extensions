# babel-plugin-react-native-platform-specific-extensions

Allow react-native platform specific extensions to be used for other file types than Javascript.

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

* Support imports with side effects, e.g. `import "./myfile.css";`.
* Support `require`.
