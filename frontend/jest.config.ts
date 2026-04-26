import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  setupFilesAfterFramework: [],
  setupFiles: [],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: {
        jsx: "react-jsx",
      },
    }],
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/vite-env.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};

export default config;
