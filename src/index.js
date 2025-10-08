#!/usr/bin/env node
// Copyright 2025 Juspay Technologies
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import fs from "node:fs/promises";
import { Command } from "commander";
import path from "node:path";
import { startBuilder } from "./builder.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("smithy-cli-generator")
  .description(
    "Smithy CLI Generator => A CLI builder that builds a CLI on top of Smithy Client"
  )
  .requiredOption("--namespace <namespace>", "Service Namespace")
  .requiredOption("--service <service>", "Service Name")
  .requiredOption("--plugin <plugin>", "Smithy plugin to use in build JSON")
  .requiredOption(
    "--smithyBuildJSONPath <smithyBuildJSONPath>",
    "Path to Smithy build JSON"
  )
  .requiredOption(
    "--smithyModelJSONPath <smithyModelJSONPath>",
    "Path to Smithy build JSON"
  )
  .requiredOption(
    "--smithyTypescriptSdk <smithyTypescriptSdk>",
    "Path to Smithy TypeScript SDK or npm package number to use"
  )
  .requiredOption("--cliName <cliName>", "Name of the CLI")
  .requiredOption("--cliDescription <cliDescription>", "Description of the CLI")
  .option("--buildPath <buildPath>", "Path to output the built CLI")
  .action(async (options) => {
    try {
      const smithyBuildJSONFile = options.smithyBuildJSONPath;
      const smithyBuildJSON = await fs.readFile(smithyBuildJSONFile, {
        encoding: "utf8",
      });
      const smithyBuildObj = JSON.parse(smithyBuildJSON);
      const nModule = smithyBuildObj["plugins"][options.plugin]["package"];
      const nModuleVersion =
        smithyBuildObj["plugins"][options.plugin]["packageVersion"];
      if (!nModule || !nModuleVersion) {
        throw new Error(
          `Could not find package or packageVersion for plugin ${options.plugin} in smithy-build.json`
        );
      }
      const clientPath = options.smithyTypescriptSdk;
      const modelsJSON = options.smithyModelJSONPath;

      const buildPath = path.join(
        options.buildPath ? options.buildPath : path.resolve(__dirname, ".."),
        options.cliName.toLowerCase().replace(" ", "-")
      );
      const namespace = options.namespace;
      const service = options.service;

      console.log("Invoking CLI builder with:", {
        namespace,
        service,
        modelsJSON,
        clientPath,
        nModule,
        nModuleVersion,
        buildPath,
      });

      await startBuilder(
        namespace,
        service,
        modelsJSON,
        clientPath,
        nModule,
        nModuleVersion,
        buildPath,
        options.cliName.toLowerCase().replace(" ", "-"),
        options.cliDescription
      );
      process.exit(0);
    } catch (err) {
      console.log(
        "Error while building: ",
        err,
        "\n\nPossible fixes: Build your smithy project before running this, check smithy project url"
      );
      process.exit(1);
    }
  });

program.parse(process.argv);
