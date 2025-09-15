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
import {startBuilder} from "./builder.js";


const program = new Command();


program
  .name("juspay-cli-builder")
  .description(
    "Juspay CLI Builder => A CLI builder that builds a CLI on top of Smithy Client"
  )
  .requiredOption("--endpointUrl <endpointUrl>", "Endpoint URL")
  .requiredOption(
    "--smithyBuildJsonPath <smithyBuildJsonPath>",
    "Path to Smithy build JSON"
  )
  .requiredOption(
    "--smithyTypescriptSdkPath <smithyTypescriptSdkPath>",
    "Path to Smithy TypeScript SDK"
  )
  .requiredOption("--cliName <cliName>", "Name of the CLI")
  .requiredOption("--cliDescription <cliDescription>", "Description of the CLI")
  .option("--buildPath <buildPath>", "Path to output the built CLI")
  .action(async (options) => {
    try {
      const smithyBuildJSONFile = options.smithyBuildJsonPath;
      const smithyBuildJSON = await fs.readFile(smithyBuildJSONFile, {
        encoding: "utf8",
      });
      const smithyBuildObj = JSON.parse(smithyBuildJSON);
      const namespace =
        smithyBuildObj["projections"]["typescript-sdk"]["plugins"][
          "typescript-codegen"
        ]["service"].split("#")[0];
      const service =
        smithyBuildObj["projections"]["typescript-sdk"]["plugins"][
          "typescript-codegen"
        ]["service"].split("#")[1];
      const endpointURL = options.endpointUrl;
      const nModule =
        smithyBuildObj["projections"]["typescript-sdk"]["plugins"][
          "typescript-codegen"
        ]["package"];
      const nModuleVersion =
        smithyBuildObj["projections"]["typescript-sdk"]["plugins"][
          "typescript-codegen"
        ]["packageVersion"];
      const clientPath =
        options.smithyTypescriptSdkPath + "/typescript-codegen/";
      const modelsJSON = options.smithyTypescriptSdkPath + "/model/model.json";

      console.log("Invoking CLI builder with:", {
        namespace,
        service,
        modelsJSON,
        clientPath,
        endpointURL,
        nModule,
        nModuleVersion,
        buildPath: options.buildPath,
      });

      await startBuilder(
        namespace,
        service,
        modelsJSON,
        clientPath,
        endpointURL,
        nModule,
        nModuleVersion,
        options.buildPath,
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
