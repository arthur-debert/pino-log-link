module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom", // Important for testing DOM manipulation
    transform: {
        "^.+.tsx?$": "ts-jest",
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node",
        "mjs",
        "mts",
    ],
    testRegex: "(/__tests__/.*|(.|/)(test|spec)).(jsx?|tsx?)$",
};
