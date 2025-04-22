const fs = require('fs');
const { execSync } = require('child_process');

// Function to read .env file
function readEnvFile() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

// Function to push env vars to Vercel
async function pushToVercel(envVars) {
  try {
    console.log('Pushing environment variables to Vercel...');

    // Add each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      try {
        // Add to production environment
        execSync(`vercel env add ${key} production`, { 
          input: value,
          stdio: ['pipe', 'inherit', 'inherit']
        });
        console.log(`Added ${key} to production environment`);

        // Add to preview environment
        execSync(`vercel env add ${key} preview`, {
          input: value,
          stdio: ['pipe', 'inherit', 'inherit']
        });
        console.log(`Added ${key} to preview environment`);

        // Add to development environment
        execSync(`vercel env add ${key} development`, {
          input: value,
          stdio: ['pipe', 'inherit', 'inherit']
        });
        console.log(`Added ${key} to development environment`);
      } catch (error) {
        console.error(`Error adding ${key}:`, error.message);
      }
    }

    console.log('Successfully pushed all environment variables to Vercel');
  } catch (error) {
    console.error('Error pushing to Vercel:', error.message);
  }
}

// Main execution
const envVars = readEnvFile();
if (Object.keys(envVars).length > 0) {
  pushToVercel(envVars);
} else {
  console.log('No environment variables found in .env file');
} 