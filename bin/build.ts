import {execSync} from "child_process";
import { appBuildCommands } from './buildCommands';

/**
 * Script to execute all build commands locally for every environment
 */
appBuildCommands.forEach((command) => {
  execSync(command, { encoding: "utf-8" });
})
