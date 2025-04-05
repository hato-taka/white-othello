// jest.config.js
export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest", // TypeScriptファイルをトランスパイル
  },
  extensionsToTreatAsEsm: [".ts"], // TypeScriptファイルをESモジュールとして扱う
  globals: {
    "ts-jest": {
      useESM: true, // ESモジュールを有効化
    },
  },
};