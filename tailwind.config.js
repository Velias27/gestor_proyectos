module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./node_modules/@heroui/react/theme/dist/**/*.{js,jsx}",
    "./node_modules/@heroui/theme/dist/components/(button|table|ripple|spinner|checkbox|form|spacer).js"
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
