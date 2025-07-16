module.exports = {
    testMatch: ['**/*.steps.ts', '**/*.steps.tsx', '**/*.test.ts', '**/*.test.tsx'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json'
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@mantine|@tabler|msw)/)'
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons'],
    }
};
