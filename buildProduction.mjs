import fs from "fs";
import pkg from "shelljs";
const { exec } = pkg;
import inquirer from "inquirer";

const packageJsonPath = "./package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

async function main() {
    const currentVersion = packageJson.version;
    console.log(`Current version: ${currentVersion}`);

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "newVersion",
            message: "Enter the new version:",
            validate: function (input) {
                const valid = !!input.match(/^\d+\.\d+\.\d+$/);
                return (
                    valid || "Please enter a valid version number (e.g., 1.0.0)"
                );
            },
        },
    ]);

    const newVersion = answers.newVersion;

    // Build the project
    if (exec("npm run build").code !== 0) {
        console.error("Build failed");
        process.exit(1);
    }

    // Run tests
    if (exec("npm run test").code !== 0) {
        console.error("Tests failed");
        process.exit(1);
    }

    // Add dist to git
    exec("git add -f dist");

    // Update package.json version
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Commit and push changes
    exec(`git commit -am "Build version ${newVersion}"`);
    exec("git push");

    // Tag the commit
    exec(`git tag v${newVersion}`);
    exec("git push --tags");

    // Publish to npm
    if (exec("npm publish").code !== 0) {
        console.error("npm publish failed");
        process.exit(1);
    }

    console.log(
        `Build, release, and publish version ${newVersion} completed successfully.`
    );
}

main();
