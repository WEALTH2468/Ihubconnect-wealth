/** @type {import('jest').Config} */
const config = {
    moduleDirectories: ['node_modules', 'src'],
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    setupFiles: ['./jest.setup.js'],
};

module.exports = config;
