import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repoBlob = 'https://github.com/ogulcancelik/herdr/blob/master/';

function rewriteHerdrLinks() {
  const docsLinks = new Map([
    ['README.md', '/docs/'],
    ['./README.md', '/docs/'],
    ['CONFIGURATION.md', '/docs/configuration/'],
    ['./CONFIGURATION.md', '/docs/configuration/'],
    ['INTEGRATIONS.md', '/docs/integrations/'],
    ['./INTEGRATIONS.md', '/docs/integrations/'],
    ['SOCKET_API.md', '/docs/socket-api/'],
    ['./SOCKET_API.md', '/docs/socket-api/'],
    ['SKILL.md', '/docs/agent-skill/'],
    ['./SKILL.md', '/docs/agent-skill/'],
  ]);

  return function transform(tree) {
    walk(tree, (node) => {
      if (!node || (node.type !== 'link' && node.type !== 'definition')) return;
      if (typeof node.url !== 'string') return;

      const [path, suffix = ''] = node.url.split(/(?=[#?])/);
      const mapped = docsLinks.get(path);
      if (mapped) {
        node.url = `${mapped}${suffix}`;
        return;
      }

      const sourcePath = path.startsWith('./') ? path.slice(2) : path;
      if (
        sourcePath.startsWith('src/') ||
        sourcePath.startsWith('scripts/') ||
        sourcePath.startsWith('assets/')
      ) {
        node.url = `${repoBlob}${sourcePath}${suffix}`;
      }
    });
  };
}

function walk(node, visitor) {
  visitor(node);
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) walk(child, visitor);
}

export default defineConfig({
  site: 'https://dontreadthisline.github.io/herdr',
  base: '/herdr/',
  integrations: [
    starlight({
      title: 'herdr',
      description: 'Terminal-native agent runtime and multiplexer.',
      favicon: '/assets/favicon.png?v=14',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/ogulcancelik/herdr',
        },
      ],
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
      },
      customCss: ['./src/styles/starlight.css'],
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://herdr.dev/assets/og-card-v6.png' },
        },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'Herdr documentation — One terminal. The whole herd.',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: 'https://herdr.dev/assets/og-card-v6.png' },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image:alt',
            content: 'Herdr documentation — One terminal. The whole herd.',
          },
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/ogulcancelik/herdr/edit/master/',
      },
      lastUpdated: true,
      disable404Route: true,
      sidebar: [
        {
          label: 'Start here',
          translations: { 'zh-CN': '入门' },
          items: [
            { label: 'Overview', translations: { 'zh-CN': '概览' }, slug: 'docs' },
            { label: 'Install', translations: { 'zh-CN': '安装' }, slug: 'docs/install' },
            { label: 'Quick start', translations: { 'zh-CN': '快速开始' }, slug: 'docs/quick-start' },
            { label: 'How to work with Herdr', translations: { 'zh-CN': '工作方式' }, slug: 'docs/how-to-work' },
            { label: 'Concepts', translations: { 'zh-CN': '核心概念' }, slug: 'docs/concepts' },
          ],
        },
        {
          label: 'Core guides',
          translations: { 'zh-CN': '核心指南' },
          items: [
            { label: 'Agents', translations: { 'zh-CN': 'Agent' }, slug: 'docs/agents' },
            { label: 'Integrations', translations: { 'zh-CN': '集成' }, slug: 'docs/integrations' },
            { label: 'Configuration', translations: { 'zh-CN': '配置' }, slug: 'docs/configuration' },
            { label: 'Persistence and remote access', translations: { 'zh-CN': '持久化与远程访问' }, slug: 'docs/persistence-remote' },
            { label: 'Session state and restore', translations: { 'zh-CN': '会话状态与恢复' }, slug: 'docs/session-state' },
          ],
        },
        {
          label: 'Reference',
          translations: { 'zh-CN': '参考' },
          items: [
            { label: 'CLI reference', translations: { 'zh-CN': 'CLI 参考' }, slug: 'docs/cli-reference' },
            { label: 'Socket API', translations: { 'zh-CN': 'Socket API' }, slug: 'docs/socket-api' },
            { label: 'Agent skill file', translations: { 'zh-CN': 'Agent 技能文件' }, slug: 'docs/agent-skill' },
          ],
        },
        {
          label: 'Updates',
          translations: { 'zh-CN': '更新' },
          items: [
            { label: 'Releases', translations: { 'zh-CN': '发布日志' }, link: '/releases/' },
            { label: 'Blog', translations: { 'zh-CN': '博客' }, link: '/blog/' },
          ],
        },
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [rewriteHerdrLinks],
  },
});
