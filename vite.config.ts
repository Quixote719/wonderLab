import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 修改 react 插件配置，添加 React Compiler
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              // 只优化 src 目录下的代码（推荐）
              sources: (filename: string) => filename.includes('src/'),
              // 可选：开发环境也启用优化（默认仅生产环境）
              // environment: { development: true, production: true }
            },
          ],
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
