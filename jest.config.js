module.exports = {
    testMatch: ['**/*.steps.ts', '**/*.steps.tsx', '**/*.test.ts', '**/*.test.tsx'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@mantine/(.*)$': '<rootDir>/node_modules/@mantine/$1'
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
    },
    moduleDirectories: ['node_modules', 'src']
};
