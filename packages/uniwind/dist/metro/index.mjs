import FileStoreBase from 'metro-cache/private/stores/FileStore';
import os from 'os';
import path from 'path';
import { join, dirname, sep, basename } from 'node:path';
import { P as Platform } from '../shared/uniwind.CyoRUwOj.mjs';
import { u as uniq } from '../shared/uniwind.CHGq2Q6z.mjs';

class FileStore extends FileStoreBase {
  async set(key, value) {
    if (value?.output?.[0]?.data?.css?.skipCache) {
      return;
    }
    return super.set(key, value);
  }
}
const cacheStore = new FileStore({
  root: path.join(os.tmpdir(), "metro-cache")
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
    cachedInternalBasePath = componentsResolution.type === "sourceFile" ? join(dirname(componentsResolution.filePath), "../..") : "";
  }
  const isInternal = cachedInternalBasePath !== "" && context.originModulePath.startsWith(cachedInternalBasePath);
  const isFromNodeModules = context.originModulePath.includes(`${sep}node_modules${sep}`);
  const isFromReactNative = context.originModulePath.includes(`${sep}react-native${sep}`) || context.originModulePath.includes(`${sep}@react-native${sep}`);
  const isReactNativeAnimated = context.originModulePath.includes(`${sep}Animated${sep}components${sep}`);
  if (isInternal || resolution.type !== "sourceFile" || isFromReactNative && isFromNodeModules && !isReactNativeAnimated) {
    return resolution;
  }
  if (moduleName === "react-native") {
    return resolver(context, `uniwind/components`, platform);
  }
  if (resolution.filePath.includes(`${sep}react-native${sep}Libraries${sep}`)) {
    const filename = basename(resolution.filePath.split(sep).at(-1) ?? "");
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
    cachedInternalBasePath = componentsResolution.type === "sourceFile" ? join(dirname(componentsResolution.filePath), "../../../..") : "";
  }
  if (cachedInternalBasePath !== "" && context.originModulePath.startsWith(cachedInternalBasePath) || resolution.type !== "sourceFile" || !resolution.filePath.includes(`${sep}react-native-web${sep}`)) {
    return resolution;
  }
  const segments = resolution.filePath.split(sep);
  const filename = segments.at(-1) ?? "";
  const isIndex = filename.startsWith("index.");
  const module = segments.at(-2);
  if (filename.startsWith("createOrderedCSSStyleSheet.")) {
    return resolver(context, `uniwind/components/createOrderedCSSStyleSheet`, platform);
  }
  if (!isIndex || module === void 0 || !SUPPORTED_COMPONENTS.includes(module) || context.originModulePath.endsWith(`${module}${sep}index.js`)) {
    return resolution;
  }
  return resolver(context, `uniwind/components/${module}`, platform);
};

const withUniwindConfig = (config, uniwindConfig) => {
  uniwindConfig.themes = uniq([
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
        const platformResolver = platform === Platform.Web ? webResolver : nativeResolver;
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

export { withUniwindConfig };
