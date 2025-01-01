import { jest } from '@jest/globals';

jest.unstable_mockModule('fs/promises', () => ({
    readFile: jest.fn()
}));

const validator = await import('../src/validator.js');
const fsPromises = await import('fs/promises');

describe('JY Validator', () => {
    const validJson = '{"name": "test", "value": 123}';
    const invalidJson = '{"name": "test", value: 123}';
    const validYaml = 'name: test\nvalue: 123';
    const invalidYaml = 'name: test\n  value: : 123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rejects unsupported file extensions', async () => {
        await expect(validator.validateFile('test.txt')).rejects.toThrow('Unsupported file extension');
    });

    test('accepts .yml extension for yaml files', async () => {
        fsPromises.readFile.mockResolvedValue(validYaml);
        const result = await validator.validateFile('test.yml');
        expect(result).toEqual({ isValid: true, type: 'yaml' });
    });

    test('validates JSON successfully', async () => {
        fsPromises.readFile.mockResolvedValue(validJson);
        const result = await validator.validateFile('test.json');
        expect(result).toEqual({ isValid: true, type: 'json' });
    });

    test('fails on invalid JSON with specific error', async () => {
        fsPromises.readFile.mockResolvedValue(invalidJson);
        await expect(validator.validateFile('test.json')).rejects.toThrow('Invalid JSON');
    });

    test('validates YAML successfully', async () => {
        fsPromises.readFile.mockResolvedValue(validYaml);
        const result = await validator.validateFile('test.yaml');
        expect(result).toEqual({ isValid: true, type: 'yaml' });
    });

    test('fails on invalid YAML with specific error', async () => {
        fsPromises.readFile.mockResolvedValue(invalidYaml);
        await expect(validator.validateFile('test.yaml')).rejects.toThrow('Invalid YAML');
    });

    test('respects forced JSON type', async () => {
        fsPromises.readFile.mockResolvedValue(validJson);
        const result = await validator.validateFile('test.txt', 'json');
        expect(result).toEqual({ isValid: true, type: 'json' });
    });

    test('handles file not found error', async () => {
        fsPromises.readFile.mockRejectedValue({ code: 'ENOENT' });
        await expect(validator.validateFile('nonexistent.json')).rejects.toThrow('File not found');
    });
});