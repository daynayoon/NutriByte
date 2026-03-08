const fs = require('fs');

function loadEnvFile(filePath) {
    if (fs.existsSync(filePath)) {
        const envFile = fs.readFileSync(filePath, 'utf8');

        const envVars = envFile.split(/\r?\n/).reduce((acc, line) => {
            const eqIdx = line.indexOf('=');
            if (eqIdx === -1) return acc;
            const key = line.slice(0, eqIdx);
            const value = line.slice(eqIdx + 1);
            acc[key] = value;
            return acc;
        }, {});

        return envVars;
    } else {
        // In serverless environments (e.g. Vercel), fall back to process.env
        return process.env;
    }
}

module.exports = loadEnvFile;