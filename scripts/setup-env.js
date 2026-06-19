#!/usr/bin/env node

/**
 * Setup script to generate environment configuration from .env.local
 * Run: npm run setup
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Use process.cwd() to get the actual project root
const projectRoot = process.cwd();
const envLocalPath = path.join(projectRoot, '.env.local');
const envExamplePath = path.join(projectRoot, '.env.example');

console.log('📁 Project root:', projectRoot);
console.log('🔍 Looking for .env.local at:', envLocalPath);

// Check if .env.local exists
if (!fs.existsSync(envLocalPath)) {
  console.warn('⚠️  .env.local no encontrado. Usando .env.example como referencia...');
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copia .env.example a .env.local y completa los valores:');
    console.log(`   cp .env.example .env.local`);
  }
  process.exit(0);
}

// Load environment variables
const env = dotenv.parse(fs.readFileSync(envLocalPath));

// Validate required variables
const required = ['NG_APP_SUPABASE_URL', 'NG_APP_SUPABASE_KEY'];
const missing = required.filter(key => !env[key]);

if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes en .env.local: ${missing.join(', ')}`);
  process.exit(1);
}

// Generate environment.ts
const environmentContent = `// GENERATED FROM .env.local - DO NOT EDIT MANUALLY
export const environment = {
  supabaseUrl: '${env.NG_APP_SUPABASE_URL}',
  supabaseKey: '${env.NG_APP_SUPABASE_KEY}',
};
`;

const envPath = path.join(projectRoot, 'src/environments/environment.ts');
fs.writeFileSync(envPath, environmentContent);

console.log('✅ environment.ts generado correctamente desde .env.local');

