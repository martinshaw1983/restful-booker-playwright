# Restful-Booker API Automation Suite

This repository contains an automated API testing framework built to validate the endpoints of the Restful-Booker platform. Scenarios include authentication, booking creation, search validation, updates, and deletion.

API docs: https://restful-booker.herokuapp.com/apidoc/index.html

## Tech Stack & Tools

* Automation Framework: [Playwright Test](https://playwright.dev/)
* Language: TypeScript
* Reporting: Allure Report
* Runtime Environment: Node.js

## Prerequisites

Before running the tests, ensure you have Node.js (LTS version recommended) installed on your system. You will also need the Allure CLI installed globally to compile and view the visual reporting dashboard. Follow the instructions for your specific operating system below.

### Installing Allure CLI on macOS

Using Homebrew:

```bash
brew install allure
```

### Installing Allure CLI on Windows
Using Scoop:
```bash
scoop install allure
```

Alternatively, Windows users can install the global npm package wrapper:

```bash
npm install -g allure-commandline
```

### Installing Allure CLI on Linux

On Debian/Ubuntu systems, use the following commands to install via the official automated package manager:

```bash
sudo apt-add-repository ppa:qameta/allure
sudo apt-get update
sudo apt-get install allure
```

### Getting Started
Clone the repository:

```bash
git clone https://github.com/martinshaw183/restful-booker-playwright.git
cd restful-booker-playwright
```

Install dependencies:

```bash
npm install
```

### Running the Tests
The framework includes a built-in pre-test script that automatically wipes out stale Allure results before running a fresh suite.

Execute the full test suite:

```bash
npm run test
```

Generate and view the Allure Dashboard:

```bash
npm run report
```