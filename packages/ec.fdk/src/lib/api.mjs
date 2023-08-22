import * as actions from "./actions.mjs";
import { expect } from "./util.mjs";
export * from "./util.mjs";

const {
  entryList,
  getEntry,
  getAsset,
  assetList,
  createEntry,
  editEntry,
  loginPublic,
  loginEc,
  logoutEc,
  logoutPublic,
} = actions;

export function act(config) {
  const { action } = config;
  expect({ action });
  if (!actions[action]) {
    throw new Error(
      `"${action}" does not exist! try one of ${Object.keys(actions).join(
        ", "
      )}`
    );
  }
  return actions[action](config);
}

class Sdk {
  constructor(config) {
    this.config = config;
  }

  set(obj) {
    // "copy on write"
    return new Sdk({ ...this.config, ...obj });
  }

  handle(handlers) {
    const keys = Object.keys(this.config);
    const [_, handle] =
      Object.entries(handlers).find(([k, v]) => keys.includes(k)) || [];
    if (!handle) {
      throw new Error(
        `you need to first set ${Object.keys(handlers).join(" | ")}`
      );
    }
    return handle(this.config);
  }

  ///

  entries(options) {
    return entryList({ ...this.config, options });
  }

  assets(options) {
    return assetList({ ...this.config, options });
  }

  get() {
    return this.handle({
      assetID: getAsset,
      entryID: getEntry,
    });
  }

  del() {}

  createEntry(value) {
    return createEntry({ ...this.config, value });
  }
  editEntry(value) {
    return editEntry({ ...this.config, value });
  }

  create(value) {
    return this.set({ value }).handle({
      //assetID: createAsset,
      model: createEntry,
    });
  }

  edit(value) {
    return this.set({ value }).handle({
      //assetID: createAsset,
      entryID: editEntry,
    });
  }

  //

  loginPublic(config) {
    //
    return loginPublic({ ...this.config, ...config });
  }

  logoutPublic() {
    return logoutPublic(this.config);
  }

  loginEc(config) {
    return loginEc({ ...this.config, ...config });
  }

  logoutEc() {
    return logoutEc(this.config);
  }
}

const addSetter = (...args) => {
  const [main] = args;

  args.forEach((alias) => {
    Sdk.prototype[alias] = function (value) {
      return this.set({ [main]: value });
    };
  });
};

const addAlias = (a, b) => {
  Sdk.prototype[a] = Sdk.prototype[b];
};
// define setters with aliases
addSetter("dmShortID", "dm", "dmshortid");
addSetter("model");
addSetter("token");
addSetter("entryID", "entry");
addSetter("assetGroup");
addSetter("assetID", "asset");
addAlias("assetgroup", "assetGroup");
addAlias("entryList", "entries");
addAlias("assetList", "assets");

export const sdk = (env) => new Sdk({ env });
