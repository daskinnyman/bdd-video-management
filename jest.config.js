module.exports = {
    testMatch: ['**/*.steps.ts', '**/*.steps.tsx', '**/*.test.ts', '**/*.test.tsx'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
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
        'node_modules/(?!(@mantine|@tabler)/)'
    ]
};
