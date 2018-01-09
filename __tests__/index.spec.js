import pluginTester from "babel-plugin-tester";
import platformSpecific from "../index";
import fs from "fs";

let spy;

pluginTester({
  plugin: platformSpecific,
  pluginName: "babel-plugin-react-native-platform-specific-extensions",
  pluginOptions: {
    extensions: ["scss"]
  },
  snapshot: true,
  tests: [
    {
      title: "Should require ios and android files if they exits",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /styles\.ios\.scss/.test(path) || /styles\.android\.scss/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should require ios and native files if they exits",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /styles\.ios\.scss/.test(path) || /styles\.native\.scss/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should require android and native files if they exits",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /styles\.android\.scss/.test(path) ||
            /styles\.native\.scss/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should require ios and non prefixed file",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return /styles\.ios\.scss/.test(path);
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should require android and non prefixed file",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return /styles\.android\.scss/.test(path);
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should require native file if it exists",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return /styles\.native\.scss/.test(path);
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should preserve import name and filename transforming names",
      code: `import myStyles from "./myStylesFile.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /myStylesFile\.ios\.scss/.test(path) ||
            /myStylesFile\.android\.scss/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should not touch import if the files do not exist",
      code: `import styles from "./styles.scss"`
    },
    {
      title: "Should not do anything with a global import (to be implemented)",
      code: `import "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /styles\.ios\.scss/.test(path) || /styles\.android\.scss/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    }
  ]
});

pluginTester({
  plugin: platformSpecific,
  pluginName: "babel-plugin-react-native-platform-specific-extensions",
  pluginOptions: {
    extensions: ["txt", "json"]
  },
  snapshot: true,
  tests: [
    {
      title: "Should work with other extension types (.txt)",
      code: `import txt from "./something.txt"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /something\.ios\.txt/.test(path) ||
            /something\.android\.txt/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should work with other extension types (.json)",
      code: `import json from "./something.json"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /something\.ios\.json/.test(path) ||
            /something\.android\.json/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title:
        "Should not react to file types that are not defined in plugin options (.scss)",
      code: `import styles from "./styles.scss"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /styles\.ios\.scss/.test(path) || /styles\.android\.scss/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    },
    {
      title: "Should not do anything with a global import (to be implemented)",
      code: `import "./something.txt"`,
      setup() {
        spy = jest.spyOn(fs, "existsSync").mockImplementation(path => {
          return (
            /something\.ios\.txt/.test(path) ||
            /something\.android\.txt/.test(path)
          );
        });
      },
      teardown() {
        spy.mockRestore();
      }
    }
  ]
});
