module.exports = {
    testMatch: ['**/*.steps.ts', '**/*.steps.tsx', '**/*.test.ts', '**/*.test.tsx'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json'
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@mantine|@tabler)/)'
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: 'tsconfig.jest.json'
        }
    }
};
