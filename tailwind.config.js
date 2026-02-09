// tailwind.config.js（v4 极简配置）
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        "gradient-shift": "gradientShift 15s ease infinite",
        "number-pulse": "numberPulse 1s ease infinite alternate",
      },
      keyframes: {
        gradientShift: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        numberPulse: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        }
      }
    }
  },
  plugins: [],
};