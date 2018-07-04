var fs = require("fs");
var nodePath = require("path");
var babelTemplate = require("@babel/template").default;

module.exports = function(babel) {
  var isPlatformImportInserted = false;
  return {
    visitor: {
      Program() {
        isPlatformImportInserted = false;
      },
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

        function astTernary(platform, valueTrue, valueFalse) {
          // Omit the var assignment when specifier is empty (global import case, executing for the side-effects only).
          const assignee = specifier ? `var ${specifier.local.name} = ` : "";
          const platformStr = `import { Platform } from "react-native";`;
          const platformImport = !isPlatformImportInserted ? platformStr : "";

          if (platformImport) {
            isPlatformImportInserted = true;
          }

          return babelTemplate.ast(
            platformImport +
              assignee +
              `Platform.OS === "${platform}" ? require("${valueTrue}") : require("${valueFalse}");`
          );
        }

        if (iosFileExists && androidFileExists) {
          ast = astTernary("ios", iosFileName, androidFileName);
          path.replaceWithMultiple(ast);
          return;
        } else if (iosFileExists && !androidFileExists && nativeFileExists) {
          ast = astTernary("ios", iosFileName, nativeFileName);
          path.replaceWithMultiple(ast);
          return;
        } else if (!iosFileExists && androidFileExists && nativeFileExists) {
          ast = astTernary("android", androidFileName, nativeFileName);
          path.replaceWithMultiple(ast);
          return;
        } else if (iosFileExists && !androidFileExists && !nativeFileExists) {
          ast = astTernary("ios", iosFileName, fileName);
          path.replaceWithMultiple(ast);
          return;
        } else if (!iosFileExists && androidFileExists && !nativeFileExists) {
          ast = astTernary("android", androidFileName, fileName);
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
