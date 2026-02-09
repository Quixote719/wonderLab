// postcss.config.cjs（v4 极简配置，无 autoprefixer）
export default {
  plugins: {
    // 仅保留 Tailwind v4 专属插件
    "@tailwindcss/postcss": {},
  },
};