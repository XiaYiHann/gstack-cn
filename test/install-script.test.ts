import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
const INSTALL_SCRIPT = path.join(ROOT, 'install.sh');
const SKILL_BUNDLE = path.join(ROOT, 'dist', 'gstack-skill-bundle.tar.gz');

function makeTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFile(filePath: string, content: string, mode?: number): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  if (mode !== undefined) {
    fs.chmodSync(filePath, mode);
  }
}

function copyInstallScript(targetDir: string): void {
  fs.copyFileSync(INSTALL_SCRIPT, path.join(targetDir, 'install.sh'));
  fs.chmodSync(path.join(targetDir, 'install.sh'), 0o755);
}

function createSkillBundle(sourceDir: string): string {
  const parentDir = makeTempDir('gstack-install-bundle-src-');
  const bundleRootName = 'gstack-cn';
  const bundleSourceDir = path.join(parentDir, bundleRootName);
  fs.cpSync(sourceDir, bundleSourceDir, { recursive: true });

  const bundlePath = path.join(makeTempDir('gstack-install-bundle-out-'), `${bundleRootName}.tar.gz`);
  const result = Bun.spawnSync(['tar', '-czf', bundlePath, '-C', parentDir, bundleRootName], {
    stdout: 'pipe',
    stderr: 'pipe',
  });

  expect(result.exitCode).toBe(0);
  return bundlePath;
}

function runInstall(cwd: string, args: string[], env: Record<string, string> = {}) {
  return Bun.spawnSync(['bash', './install.sh', ...args], {
    cwd,
    env: { ...process.env, ...env },
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

describe('install.sh', () => {
  test('exists, is executable, and installs skill-only roots', () => {
    expect(fs.existsSync(INSTALL_SCRIPT)).toBe(true);
    const mode = fs.statSync(INSTALL_SCRIPT).mode;
    expect((mode & 0o111) !== 0).toBe(true);

    const content = fs.readFileSync(INSTALL_SCRIPT, 'utf-8');
    expect(content).toContain('copy_skill_tree');
    expect(content).toContain('dist/gstack-skill-bundle.tar.gz');
    expect(content).not.toContain('archive/refs/heads');
    expect(content).not.toContain('git clone --depth 1');
    expect(content).not.toContain('bun install');
    expect(content).not.toContain('bun run build');
    expect(content).toContain('copy_skill_tree "$SOURCE_ROOT" "$HOME/.claude/skills/gstack-cn"');
    expect(content).toContain('copy_skill_tree "$SOURCE_ROOT" "$HOME/.agents/skills/gstack-cn"');
    expect(content).toContain('inject_chinese_directive "$HOME/.claude/CLAUDE.md"');
    expect(content).toContain('inject_chinese_directive "$HOME/.agents/AGENTS.md"');
  });

  test('repository ships a prebuilt skill bundle', () => {
    expect(fs.existsSync(SKILL_BUNDLE)).toBe(true);
    expect(fs.statSync(SKILL_BUNDLE).size).toBeGreaterThan(0);

    const entries = Bun.spawnSync(['tar', '-tzf', SKILL_BUNDLE], {
      stdout: 'pipe',
      stderr: 'pipe',
    });

    expect(entries.exitCode).toBe(0);
    const archiveListing = entries.stdout.toString();
    expect(archiveListing).toContain('gstack-cn/');
    expect(archiveListing).toContain('gstack-cn/SKILL.md');
    expect(archiveListing).toContain('gstack-cn/browse/dist/browse');
    expect(archiveListing).not.toContain('gstack-cn/package.json');
    expect(archiveListing).not.toContain('gstack-cn/install.sh');
    expect(archiveListing).not.toContain('gstack-cn/scripts/');
    expect(archiveListing).not.toContain('gstack-cn/test/');
  });

  test('README documents the install.sh entry points', () => {
    const content = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf-8');
    expect(content).toContain('install.sh | bash');
    expect(content).toContain('raw.githubusercontent.com/XiaYiHann/gstack-cn/main/install.sh');
    expect(content).toContain('./install.sh');
  });

  test('default install keeps only skill files in ~/.claude/skills/gstack-cn and ~/.agents/skills/gstack-cn', () => {
    const sourceDir = makeTempDir('gstack-install-local-src-');
    const homeDir = makeTempDir('gstack-install-local-home-');

    writeFile(path.join(sourceDir, 'install.sh'), '#!/usr/bin/env bash\n');
    writeFile(path.join(sourceDir, 'package.json'), '{"name":"gstack","private":true}');
    writeFile(path.join(sourceDir, 'README.md'), '# gstack\n');
    writeFile(path.join(sourceDir, 'SKILL.md'), '---\nname: gstack\ndescription: test\n---\n');
    writeFile(path.join(sourceDir, 'ETHOS.md'), '# ethos\n');
    writeFile(path.join(sourceDir, 'VERSION'), '1.0.0\n');
    writeFile(path.join(sourceDir, 'CLAUDE.md'), '# gstack\n');
    writeFile(path.join(sourceDir, 'AGENTS.md'), '# gstack\n');
    writeFile(path.join(sourceDir, 'bin', 'tool'), '#!/usr/bin/env bash\necho tool\n', 0o755);
    writeFile(path.join(sourceDir, 'browse', 'SKILL.md'), '---\nname: browse\ndescription: test\n---\n');
    writeFile(path.join(sourceDir, 'browse', 'dist', 'browse'), '#!/usr/bin/env bash\necho browse\n', 0o755);
    writeFile(path.join(sourceDir, 'review', 'SKILL.md'), '---\nname: review\ndescription: test\n---\n');
    writeFile(path.join(sourceDir, 'scripts', 'ignored.ts'), 'export {}\n');
    writeFile(path.join(sourceDir, 'test', 'ignored.test.ts'), 'test("x", () => expect(true).toBe(true));\n');
    writeFile(path.join(sourceDir, '.git', 'config'), '[core]\nrepositoryformatversion = 0\n');
    copyInstallScript(sourceDir);

    const result = runInstall(sourceDir, [], {
      HOME: homeDir,
    });

    expect(result.exitCode).toBe(0);

    for (const targetRoot of [
      path.join(homeDir, '.claude', 'skills', 'gstack-cn'),
      path.join(homeDir, '.agents', 'skills', 'gstack-cn'),
    ]) {
      expect(fs.existsSync(path.join(targetRoot, 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'ETHOS.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'VERSION'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'bin', 'tool'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'browse', 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'browse', 'dist', 'browse'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'review', 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'README.md'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'CLAUDE.md'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'AGENTS.md'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'package.json'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'scripts'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'test'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'setup'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'install.sh'))).toBe(false);
    }

    const globalClaude = fs.readFileSync(path.join(homeDir, '.claude', 'CLAUDE.md'), 'utf-8');
    expect(globalClaude).toContain('gstack-cn: Chinese output');
    expect(globalClaude).toContain('always respond in Chinese');
    const globalAgent = fs.readFileSync(path.join(homeDir, '.agents', 'AGENTS.md'), 'utf-8');
    expect(globalAgent).toContain('gstack-cn: Chinese output');
    expect(globalAgent).toContain('always respond in Chinese');
  });

  test('remote bootstrap downloads archive and keeps only skill files in both roots', () => {
    const repoDir = makeTempDir('gstack-install-remote-repo-');
    const workDir = makeTempDir('gstack-install-remote-work-');
    const homeDir = makeTempDir('gstack-install-remote-home-');

    writeFile(path.join(repoDir, 'install.sh'), '#!/usr/bin/env bash\n');
    writeFile(path.join(repoDir, 'package.json'), '{"name":"gstack","private":true}');
    writeFile(path.join(repoDir, 'README.md'), '# gstack\n');
    writeFile(path.join(repoDir, 'SKILL.md'), '---\nname: gstack\ndescription: test\n---\n');
    writeFile(path.join(repoDir, 'ETHOS.md'), '# ethos\n');
    writeFile(path.join(repoDir, 'VERSION'), '1.0.0\n');
    writeFile(path.join(repoDir, 'CLAUDE.md'), '# gstack\n');
    writeFile(path.join(repoDir, 'AGENTS.md'), '# gstack\n');
    writeFile(path.join(repoDir, 'bin', 'tool'), '#!/usr/bin/env bash\necho tool\n', 0o755);
    writeFile(path.join(repoDir, 'browse', 'SKILL.md'), '---\nname: browse\ndescription: test\n---\n');
    writeFile(path.join(repoDir, 'browse', 'dist', 'browse'), '#!/usr/bin/env bash\necho browse\n', 0o755);
    writeFile(path.join(repoDir, 'review', 'SKILL.md'), '---\nname: review\ndescription: test\n---\n');
    writeFile(path.join(repoDir, 'scripts', 'ignored.ts'), 'export {}\n');
    writeFile(path.join(repoDir, 'test', 'ignored.test.ts'), 'test("x", () => expect(true).toBe(true));\n');
    const archivePath = createSkillBundle(repoDir);

    copyInstallScript(workDir);

    const result = runInstall(workDir, [], {
      HOME: homeDir,
      GSTACK_BUNDLE_URL: `file://${archivePath}`,
    });

    expect(result.exitCode).toBe(0);

    for (const targetRoot of [
      path.join(homeDir, '.claude', 'skills', 'gstack-cn'),
      path.join(homeDir, '.agents', 'skills', 'gstack-cn'),
    ]) {
      expect(fs.existsSync(path.join(targetRoot, 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'ETHOS.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'VERSION'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'bin', 'tool'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'browse', 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'browse', 'dist', 'browse'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'review', 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(targetRoot, 'README.md'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'CLAUDE.md'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'AGENTS.md'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'package.json'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'scripts'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'test'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'setup'))).toBe(false);
      expect(fs.existsSync(path.join(targetRoot, 'install.sh'))).toBe(false);
    }

    const globalClaude = fs.readFileSync(path.join(homeDir, '.claude', 'CLAUDE.md'), 'utf-8');
    expect(globalClaude).toContain('gstack-cn: Chinese output');
    expect(globalClaude).toContain('always respond in Chinese');
    const globalAgent = fs.readFileSync(path.join(homeDir, '.agents', 'AGENTS.md'), 'utf-8');
    expect(globalAgent).toContain('gstack-cn: Chinese output');
    expect(globalAgent).toContain('always respond in Chinese');
  });

  test('re-running install updates existing roots and keeps Chinese directives unique', () => {
    const repoDir = makeTempDir('gstack-install-update-repo-');
    const workDir = makeTempDir('gstack-install-update-work-');
    const homeDir = makeTempDir('gstack-install-update-home-');

    writeFile(path.join(repoDir, 'install.sh'), '#!/usr/bin/env bash\n');
    writeFile(path.join(repoDir, 'package.json'), '{"name":"gstack","private":true}');
    writeFile(path.join(repoDir, 'README.md'), '# gstack\n');
    writeFile(path.join(repoDir, 'SKILL.md'), '---\nname: gstack\ndescription: test\n---\n');
    writeFile(path.join(repoDir, 'ETHOS.md'), '# ethos\n');
    writeFile(path.join(repoDir, 'VERSION'), '1.0.0\n');
    writeFile(path.join(repoDir, 'CLAUDE.md'), '# gstack\n');
    writeFile(path.join(repoDir, 'AGENTS.md'), '# gstack\n');
    writeFile(path.join(repoDir, 'bin', 'tool'), 'v1\n', 0o755);
    writeFile(path.join(repoDir, 'browse', 'SKILL.md'), '---\nname: browse\ndescription: test\n---\n');
    writeFile(path.join(repoDir, 'browse', 'dist', 'browse'), 'v1-browse\n', 0o755);
    writeFile(path.join(repoDir, 'review', 'SKILL.md'), '---\nname: review\ndescription: test\n---\n');
    writeFile(path.join(repoDir, 'scripts', 'ignored.ts'), 'export {}\n');
    writeFile(path.join(repoDir, 'test', 'ignored.test.ts'), 'test("x", () => expect(true).toBe(true));\n');
    let archivePath = createSkillBundle(repoDir);

    copyInstallScript(workDir);

    const firstInstall = runInstall(workDir, [], {
      HOME: homeDir,
      GSTACK_BUNDLE_URL: `file://${archivePath}`,
    });

    expect(firstInstall.exitCode).toBe(0);

    const claudeRoot = path.join(homeDir, '.claude', 'skills', 'gstack-cn');
    const agentRoot = path.join(homeDir, '.agents', 'skills', 'gstack-cn');
    fs.writeFileSync(path.join(claudeRoot, 'stale.txt'), 'old\n', 'utf-8');
    fs.writeFileSync(path.join(agentRoot, 'stale.txt'), 'old\n', 'utf-8');

    writeFile(path.join(repoDir, 'bin', 'tool'), 'v2\n', 0o755);
    writeFile(path.join(repoDir, 'browse', 'dist', 'browse'), 'v2-browse\n', 0o755);
    archivePath = createSkillBundle(repoDir);

    const secondInstall = runInstall(workDir, [], {
      HOME: homeDir,
      GSTACK_BUNDLE_URL: `file://${archivePath}`,
    });

    expect(secondInstall.exitCode).toBe(0);

    expect(fs.readFileSync(path.join(claudeRoot, 'bin', 'tool'), 'utf-8')).toContain('v2');
    expect(fs.readFileSync(path.join(agentRoot, 'bin', 'tool'), 'utf-8')).toContain('v2');
    expect(fs.existsSync(path.join(claudeRoot, 'stale.txt'))).toBe(false);
    expect(fs.existsSync(path.join(agentRoot, 'stale.txt'))).toBe(false);

    const globalClaude = fs.readFileSync(path.join(homeDir, '.claude', 'CLAUDE.md'), 'utf-8');
    const globalAgent = fs.readFileSync(path.join(homeDir, '.agents', 'AGENTS.md'), 'utf-8');
    expect(globalClaude.match(/gstack-cn: Chinese output/g)?.length).toBe(1);
    expect(globalAgent.match(/gstack-cn: Chinese output/g)?.length).toBe(1);
  });
});
