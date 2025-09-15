# Smithy CLI Generator

**Smithy CLI Generator** is a lightweight Node.js command-line tool that scaffolds a custom CLI on top of a Smithy-generated TypeScript client. It reads your Smithy project configuration and generates a CLI with the name and description you specify.

## Features

* Reads `smithy-build.json` to extract:
  * `namespace` and `service` identifiers  
  * NPM module name and version  
  * Model and client paths  
* Generates a new CLI project by invoking `startBuilder(...)` with:
  * `namespace`, `service`, `modelsJSON`, `clientPath`, `endpointURL`  
  * `nModule`, `nModuleVersion`, `buildPath`  
  * `cliName`, `cliDescription`  

## Prerequisites

* Node.js v20 or higher  
* A built Smithy project with artifacts in `build/smithy/typescript-sdk`  
* `smithy-build.json` present in the root of your Smithy project  

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Yash02Rajput/smithy-cli-generator
cd smithy-cli-generator
npm install
chmod +x index.js      # Ensure the script is executable
```

To use the CLI globally:

```bash
npm link            # or: npm install -g .
```

## Usage

```bash
cli-generator   --endpointUrl <API_BASE_URL>  \
  --smithyBuildJsonPath <PATH/TO/SMITHY/BUILDJSON>  \
  --smithyTypescriptSdkPath <PATH/TO/SMITHY/BUILD/SMITHY/TYPESCRIPTSDK>  \
  --cliName <YOUR_CLI_NAME>  \
  --cliDescription "<YOUR_CLI_DESCRIPTION>"  \
  [--buildPath <PATH/TO/CLI>]  # optional
```

### Example

```bash
cli-generator   --endpointUrl http://localhost:8081/api \
  --smithyBuildJsonPath /Users/yash.rajput.001/Desktop/Repos/FE/airborne/smithy/smithy-build.json \
  --smithyTypescriptSdkPath /Users/yash.rajput.001/Desktop/Repos/FE/airborne/smithy/build/smithy/typescript-sdk \
  --cliName airborne-ota-cli   --cliDescription "Command-line interface for Airborne OTA operations" \
  --buildPath /Users/yash.rajput.001/Desktop/Repos/FE/airborne-ota-cli
```

This will:

1. Read the Smithy build configuration from `smithy-build.json`.  
2. Extract service metadata (`namespace`, `service`, module name/version).  
3. Call `startBuilder(...)` to scaffold a new CLI in the specified path.  
4. Exit with code `0` on success or `1` on error.  

After generation:

```bash
cd /Users/yash.rajput.001/Desktop/Repos/FE/airborne-ota-cli
npm install
chmod +x bin.js
npm link            # optional: to use globally
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `endpointUrl` | string | Base URL of your API (e.g., `http://localhost:8081/api`). |
| `smithyProjectPath` | string | Path to the root of your Smithy project (must contain `smithy-build.json`). |
| `smithyBuildJsonPath` | string | Path to your Smithy `smithy-build.json` file. |
| `smithyTypescriptSdkPath` | string | Path to the generated Smithy TypeScript SDK. |
| `cliName` | string | Desired NPM package name and binary name for the CLI (e.g., `airborne-ota-cli`). |
| `cliDescription` | string | Short description for the generated CLI’s help output. |
| `buildPath` | string (optional) | Directory where the generated CLI project will be created. |

## Troubleshooting

* **Missing parameters**: Ensure all required `--key value` pairs are supplied.  
* **Smithy not built**: Run `smithy build` in your project before invoking the generator.  
* **Invalid paths**: Verify that `smithyBuildJsonPath` and `smithyTypescriptSdkPath` point to the correct locations.  
* **Permission errors**: Make sure `index.js` is executable (`chmod +x index.js`).  
* **Running the generated CLI**: Navigate to the CLI folder, run `npm link`, and then execute your CLI binary.
