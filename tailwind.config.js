module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./node_modules/@heroui/react/theme/dist/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@heroui/tailwindcss")({
      defaultTheme: "dark",
      addCommonColors: false,
    }),
  ],

  
};
