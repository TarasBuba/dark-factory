// Secret Scanner for AI Dark Factory Invariant INV-001 (Node.js Cross-Platform)
const fs = require('fs');
const path = require('path');

console.log('[Dark Factory / Security] Scanning workspace for secret leaks...');

const suspiciousPatterns = [
  /postgresql:\/\/[^:]+:[^@]+@[^\s"']+/i,
  /AIzaSy[A-Za-z0-9_-]{33}/,
  /sbp_[A-Za-z0-9]{40}/,
  /ghp_[A-Za-z0-9]{36}/
];

const ignoredDirs = new Set(['node_modules', '.next', '.git', '.darkfactory', 'scripts']);
const allowedExts = new Set(['.ts', '.tsx', '.js', '.json', '.md']);

const violations = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExts.has(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pattern of suspiciousPatterns) {
            if (pattern.test(content)) {
              violations.push(`Violation in ${fullPath}: matched ${pattern}`);
            }
          }
        } catch (e) {
          // ignore unreadable
        }
      }
    }
  }
}

scanDir(process.cwd());

if (violations.length > 0) {
  console.error('[Security Auditor] FATAL: Secret patterns detected in source code!');
  violations.forEach(v => console.error('   - ' + v));
  process.exit(1);
}

console.log('[Security Auditor] Invariant INV-001 passed: Zero committed secrets.');
process.exit(0);
