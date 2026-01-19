#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function logUserPrompt(sessionId, inputData) {
    // Ensure logs directory exists
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'user_prompt_submit.json');

    // Read existing log data or initialize empty array
    let logData = [];
    if (fs.existsSync(logFile)) {
        try {
            const content = fs.readFileSync(logFile, 'utf8');
            logData = JSON.parse(content);
        } catch {
            logData = [];
        }
    }

    // Remove transcript_path and cwd from the data before logging
    const { transcript_path: _tp, cwd: _cwd, ...filteredData } = inputData;

    // Append the filtered input data
    logData.push(filteredData);

    // Write back to file with formatting
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
}

function manageSessionData(sessionId, prompt, _nameAgent = false) {
    // Ensure sessions directory exists
    const sessionsDir = 'logs/data/sessions';
    if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir, { recursive: true });
    }

    // Load or create session file
    const sessionFile = path.join(sessionsDir, `${sessionId}.json`);

    let sessionData;
    if (fs.existsSync(sessionFile)) {
        try {
            const content = fs.readFileSync(sessionFile, 'utf8');
            sessionData = JSON.parse(content);
        } catch {
            sessionData = { session_id: sessionId, prompts: [] };
        }
    } else {
        sessionData = { session_id: sessionId, prompts: [] };
    }

    // Add the new prompt (preserve existing prompts list)
    if (!sessionData.prompts) {
        sessionData.prompts = [];
    }
    sessionData.prompts.push(prompt);

    // Save the updated session data (preserve other fields like initial_git_status)
    try {
        fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
    } catch {
        // Silently fail if we can't write the file
    }
}

function validatePrompt(prompt) {
    // Example validation rules (customize as needed)
    const blockedPatterns = [
        // Add any patterns you want to block
        // Example: ['rm -rf /', 'Dangerous command detected'],
    ];

    const promptLower = prompt.toLowerCase();

    for (const [pattern, reason] of blockedPatterns) {
        if (promptLower.includes(pattern.toLowerCase())) {
            return [false, reason];
        }
    }

    return [true, null];
}

function parseArgs(argv) {
    const args = {
        validate: false,
        logOnly: false,
        storeLastPrompt: false,
        nameAgent: false
    };

    for (const arg of argv.slice(2)) {
        switch (arg) {
            case '--validate':
                args.validate = true;
                break;
            case '--log-only':
                args.logOnly = true;
                break;
            case '--store-last-prompt':
                args.storeLastPrompt = true;
                break;
            case '--name-agent':
                args.nameAgent = true;
                break;
        }
    }

    return args;
}

function main() {
    try {
        // Parse command line arguments
        const args = parseArgs(process.argv);

        // Read JSON input from stdin
        const stdin = fs.readFileSync(0, 'utf8');
        const inputData = JSON.parse(stdin);

        // Extract session_id and prompt
        const sessionId = inputData.session_id || 'unknown';
        const prompt = inputData.prompt || '';

        // Log the user prompt
        logUserPrompt(sessionId, inputData);

        // Manage session data with JSON structure
        if (args.storeLastPrompt || args.nameAgent) {
            manageSessionData(sessionId, prompt, args.nameAgent);
        }

        // Validate prompt if requested and not in log-only mode
        if (args.validate && !args.logOnly) {
            const [isValid, reason] = validatePrompt(prompt);
            if (!isValid) {
                // Exit code 2 blocks the prompt with error message
                console.error(`Prompt blocked: ${reason}`);
                process.exit(2);
            }
        }

        // Success - prompt will be processed
        process.exit(0);

    } catch (e) {
        if (e instanceof SyntaxError) {
            // Handle JSON decode errors gracefully
            process.exit(0);
        }
        // Handle any other errors gracefully
        process.exit(0);
    }
}

main();
