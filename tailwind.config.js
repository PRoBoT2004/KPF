module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "scroll-up": "scrollUp 10s linear infinite",
      },
      keyframes: {
        scrollUp: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" }, // Move up half the height of duplicated images
        },
      },
    },
  },
  plugins: [],
};
