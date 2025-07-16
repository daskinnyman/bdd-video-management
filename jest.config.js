module.exports = {
    testMatch: ['**/*.steps.ts', '**/*.steps.tsx'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jsdom'
};
