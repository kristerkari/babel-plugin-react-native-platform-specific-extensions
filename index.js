var fs = require("fs");
var nodePath = require("path");
var babelTemplate = require("@babel/template").default;

module.exports = function(babel) {
  return {
    visitor: {
      ImportDeclaration: function importResolver(path, state) {
        var extensions =
          state.opts != null &&
          Array.isArray(state.opts.extensions) &&
          state.opts.extensions;

        if (!extensions) {
          throw new Error(
            "You have not specified any extensions in the plugin options."
          );
        }

        var node = path.node;
        var fileName = node.source.value;
        var ext = nodePath.extname(fileName);
        var matchedExtensions = extensions.filter(e => `.${e}` === ext);
        var shouldMakePlatformSpecific = matchedExtensions.length === 1;

        if (!shouldMakePlatformSpecific) {
          return;
        }

        var specifier = node.specifiers[0];

        if (!specifier) {
          return;
        }

        var name = specifier.local.name;
        var iosFileName = fileName.replace(ext, `.ios${ext}`);
        var androidFileName = fileName.replace(ext, `.android${ext}`);
        var nativeFileName = fileName.replace(ext, `.native${ext}`);
        var transformedFileName = state.file.opts.filename;
        var currentDir = nodePath.dirname(transformedFileName);
        var iosFileExists = fs.existsSync(
          nodePath.resolve(currentDir, iosFileName)
        );
        var androidFileExists = fs.existsSync(
          nodePath.resolve(currentDir, androidFileName)
        );
        var nativeFileExists = fs.existsSync(
          nodePath.resolve(currentDir, nativeFileName)
        );
        var ast = null;

        if (iosFileExists && androidFileExists) {
          ast = babelTemplate.ast(`
              import { Platform } from "react-native";
              var ${name} = Platform.OS === "ios" ? require("${iosFileName}") : require("${androidFileName}");
            `);
          path.replaceWithMultiple(ast);
          return;
        } else if (iosFileExists && !androidFileExists && nativeFileExists) {
          ast = babelTemplate.ast(`
              import { Platform } from "react-native";
              var ${name} = Platform.OS === "ios" ? require("${iosFileName}") : require("${nativeFileName}");
            `);
          path.replaceWithMultiple(ast);
          return;
        } else if (!iosFileExists && androidFileExists && nativeFileExists) {
          ast = babelTemplate.ast(`
              import { Platform } from "react-native";
              var ${name} = Platform.OS === "android" ? require("${androidFileName}") : require("${nativeFileName}");
            `);
          path.replaceWithMultiple(ast);
          return;
        } else if (iosFileExists && !androidFileExists && !nativeFileExists) {
          ast = babelTemplate.ast(`
              import { Platform } from "react-native";
              var ${name} = Platform.OS === "ios" ? require("${iosFileName}") : require("${fileName}");
            `);
          path.replaceWithMultiple(ast);
          return;
        } else if (!iosFileExists && androidFileExists && !nativeFileExists) {
          ast = babelTemplate.ast(`
              import { Platform } from "react-native";
              var ${name} = Platform.OS === "android" ? require("${androidFileName}") : require("${fileName}");
            `);
          path.replaceWithMultiple(ast);
          return;
        }

        if (nativeFileExists) {
          node.source.value = nativeFileName;
        }
      }
    }
  };
};
