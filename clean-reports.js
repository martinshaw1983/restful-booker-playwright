import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname since it does not exist natively in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directories = ['allure-results', 'allure-report'];

directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Successfully cleared old directory: ${dir}`);
    }
});