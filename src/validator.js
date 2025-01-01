import * as fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';

const SUPPORTED_EXTENSIONS = {
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml'
};

export async function validateFile(filePath, forcedType = null) {
    const extension = path.extname(filePath).toLowerCase();
    const fileType = forcedType || SUPPORTED_EXTENSIONS[extension];

    if (!fileType) {
        throw new Error(`Unsupported file extension: ${extension}. Supported extensions are: .json, .yaml, .yml`);
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');

        if (fileType === 'json') {
            try {
                JSON.parse(content);
                return {
                    isValid: true,
                    type: 'json'
                };
            } catch (error) {
                throw new Error(`Invalid JSON: ${error.message}`);
            }
        }

        if (fileType === 'yaml') {
            try {
                yaml.load(content);
                return {
                    isValid: true,
                    type: 'yaml'
                };
            } catch (error) {
                throw new Error(`Invalid YAML: ${error.message}`);
            }
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`File not found: ${filePath}`);
        }
        throw error;
    }
}