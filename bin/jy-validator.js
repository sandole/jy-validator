#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { validateFile } from '../src/validator.js';

const program = new Command();

program
    .name('jy-validator')
    .description('CLI tool to validate JSON and YAML files')
    .version('1.0.0')
    .argument('<file>', 'file to validate')
    .option('-t, --type <type>', 'force specific format type (json/yaml)')
    .action(async (file, options) => {
        try {
            if (options.type && !['json', 'yaml'].includes(options.type.toLowerCase())) {
                console.error(chalk.red('Error: Type must be either "json" or "yaml"'));
                process.exit(1);
            }

            const result = await validateFile(file, options.type?.toLowerCase());
            console.log(chalk.green(`✓ Valid ${result.type.toUpperCase()}`));

        } catch (error) {
            console.error(chalk.red(`Error: ${error.message}`));
            process.exit(1);
        }
    });

program.parse();