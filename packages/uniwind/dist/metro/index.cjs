'use strict';

const FileStoreBase = require('metro-cache/private/stores/FileStore');
const os = require('os');
const path = require('path');
const node_path = require('node:path');
const types = require('../shared/uniwind.BZIuaszw.cjs');
const common = require('../shared/uniwind.DXJvW-Vd.cjs');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const FileStoreBase__default = /*#__PURE__*/_interopDefaultCompat(FileStoreBase);
const os__default = /*#__PURE__*/_interopDefaultCompat(os);
const path__default = /*#__PURE__*/_interopDefaultCompat(path);

class FileStore extends FileStoreBase__default {
  async set(key, value) {
    if (value?.output?.[0]?.data?.css?.skipCache) {
      return;
    }
    return super.set(key, value);
  }
}
const cacheStore = new FileStore({
  root: path__default.join(os__default.tmpdir(), "metro-cache")
});
const patchMetroGraphToSupportUncachedModules = () => {
  const { Graph } = require("metro/private/DeltaBundler/Graph");
  const original_traverseDependencies = Graph.prototype.traverseDependencies;
  if (original_traverseDependencies.__patched) {
    return;
  }
  original_traverseDependencies.__patched = true;
  function traverseDependencies(paths, options) {
    this.dependencies.forEach((dependency) => {
      if (dependency.output.find((file) => file.data.css?.skipCache === true) && !paths.includes(dependency.path)) {
        dependency.unstable_transformResultKey = `${dependency.unstable_transformResultKey}.`;
        paths.push(dependency.path);
      }
    });
    return original_traverseDependencies.call(this, paths, options);
  }
  Graph.prototype.traverseDependencies = traverseDependencies;
  traverseDependencies.__patched = true;
};

let cachedInternalBasePath = null;
const SUPPORTED_COMPONENTS = [
  "ActivityIndicator",
  "Button",
  "FlatList",
  "Image",
  "ImageBackground",
  "InputAccessoryView",
  "KeyboardAvoidingView",
  "Modal",
  "Pressable",
  "RefreshControl",
  "SafeAreaView",
  "ScrollView",
  "SectionList",
  "Switch",
  "Text",
  "TextInput",
  "TouchableHighlight",
  "TouchableNativeFeedback",
  "TouchableOpacity",
  "TouchableWithoutFeedback",
  "View",
  "VirtualizedList",
  "createOrderedCSSStyleSheet"
];
const nativeResolver = ({
  context,
  moduleName,
  platform,
  resolver
}) => {
  const resolution = resolver(context, moduleName, platform);
  if (cachedInternalBasePath === null) {
    const componentsResolution = resolver(context, "uniwind/components", platform);
    cachedInternalBasePath = componentsResolution.type === "sourceFile" ? node_path.join(node_path.dirname(componentsResolution.filePath), "../..") : "";
  }
  const isInternal = cachedInternalBasePath !== "" && context.originModulePath.startsWith(cachedInternalBasePath);
  const isFromNodeModules = context.originModulePath.includes(`${node_path.sep}node_modules${node_path.sep}`);
  const isFromReactNative = context.originModulePath.includes(`${node_path.sep}react-native${node_path.sep}`) || context.originModulePath.includes(`${node_path.sep}@react-native${node_path.sep}`);
  const isReactNativeAnimated = context.originModulePath.includes(`${node_path.sep}Animated${node_path.sep}components${node_path.sep}`);
  if (isInternal || resolution.type !== "sourceFile" || isFromReactNative && isFromNodeModules && !isReactNativeAnimated) {
    return resolution;
  }
  if (moduleName === "react-native") {
    return resolver(context, `uniwind/components`, platform);
  }
  if (resolution.filePath.includes(`${node_path.sep}react-native${node_path.sep}Libraries${node_path.sep}`)) {
    const filename = node_path.basename(resolution.filePath.split(node_path.sep).at(-1) ?? "");
    const module = filename.split(".").at(0);
    if (module !== void 0 && SUPPORTED_COMPONENTS.includes(module)) {
      return resolver(context, `uniwind/components/${module}`, platform);
    }
  }
  return resolution;
};
const webResolver = ({
  context,
  moduleName,
  platform,
  resolver
}) => {
  const resolution = resolver(context, moduleName, platform);
  if (cachedInternalBasePath === null) {
    const componentsResolution = resolver(context, "uniwind/components", platform);
    cachedInternalBasePath = componentsResolution.type === "sourceFile" ? node_path.join(node_path.dirname(componentsResolution.filePath), "../../../..") : "";
  }
  if (cachedInternalBasePath !== "" && context.originModulePath.startsWith(cachedInternalBasePath) || resolution.type !== "sourceFile" || !resolution.filePath.includes(`${node_path.sep}react-native-web${node_path.sep}`)) {
    return resolution;
  }
  const segments = resolution.filePath.split(node_path.sep);
  const filename = segments.at(-1) ?? "";
  const isIndex = filename.startsWith("index.");
  const module = segments.at(-2);
  if (filename.startsWith("createOrderedCSSStyleSheet.")) {
    return resolver(context, `uniwind/components/createOrderedCSSStyleSheet`, platform);
  }
  if (!isIndex || module === void 0 || !SUPPORTED_COMPONENTS.includes(module) || context.originModulePath.endsWith(`${module}${node_path.sep}index.js`)) {
    return resolution;
  }
  return resolver(context, `uniwind/components/${module}`, platform);
};

const withUniwindConfig = (config, uniwindConfig) => {
  uniwindConfig.themes = common.uniq([
    "light",
    "dark",
    ...uniwindConfig.extraThemes ?? []
  ]);
  patchMetroGraphToSupportUncachedModules();
  if (typeof uniwindConfig === "undefined") {
    throw new Error("Uniwind: You need to pass second parameter to withUniwindConfig");
  }
  if (typeof uniwindConfig.cssEntryFile === "undefined") {
    throw new Error(
      'Uniwind: You need to pass css css entry file to withUniwindConfig, e.g. withUniwindConfig(config, { cssEntryFile: "./global.css" })'
    );
  }
  return {
    ...config,
    cacheStores: [cacheStore],
    transformerPath: require.resolve("./metro-transformer.cjs"),
    transformer: {
      ...config.transformer,
      uniwind: uniwindConfig
    },
    resolver: {
      ...config.resolver,
      sourceExts: [
        ...config.resolver?.sourceExts ?? [],
        "css"
      ],
      assetExts: config.resolver?.assetExts?.filter(
        (ext) => ext !== "css"
      ),
      resolveRequest: (context, moduleName, platform) => {
        const resolver = config.resolver?.resolveRequest ?? context.resolveRequest;
        const platformResolver = platform === types.Platform.Web ? webResolver : nativeResolver;
        const resolved = platformResolver({
          context,
          moduleName,
          platform,
          resolver
        });
        return resolved;
      }
    }
  };
};

exports.withUniwindConfig = withUniwindConfig;
