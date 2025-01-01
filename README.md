A simple CLI tool to validate JSON and YAML files.

## Installation

```bash
npm install -g jy-validator
```

## Usage

```bash
# Validate a JSON file
jy-validator example.json

# Validate a YAML file
jy-validator example.yaml

# Force specific format type
jy-validator example.txt -t json
jy-validator example.txt -t yaml
```

## Features

- Validates JSON and YAML files
- Automatic format detection based on file extension
- Manual format override with `-t` flag
- Clear error messages
- Colorized output

## License

MIT