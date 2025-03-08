/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#ff5722",
          600: "#e64a19",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideInDown: "slideInDown 0.4s ease-out forwards",
        slideOutDown: "slideOutDown 0.4s ease-out forwards",
        slideInUp: "slideInUp 0.4s ease-out forwards",
        slideOutUp: "slideOutUp 0.4s ease-out forwards",
        shake: "shake 0.5s ease-in-out",
        expandWidth: "expandWidth 0.3s ease-in-out forwards",
        ripple: "ripple 0.8s ease-out",
        slideInRight: "slideInRight 0.3s ease-out forwards",
        slideOutRight: "slideOutRight 0.3s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        slideInLeft: "slideInLeft 0.3s ease-out forwards",
        slideOutLeft: "slideOutLeft 0.3s ease-out forwards",
        toastSlideIn:
          "toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards",
        toastSlideOut:
          "toastSlideOut 0.35s cubic-bezier(0.06, 0.71, 0.55, 1) forwards",
        toastSlideInLeft:
          "toastSlideInLeft 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards",
        toastSlideOutLeft:
          "toastSlideOutLeft 0.35s cubic-bezier(0.06, 0.71, 0.55, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideOutDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(30px)", opacity: "0" },
        },
        slideInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideOutUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-30px)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        expandWidth: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".5",
          },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        toastSlideIn: {
          "0%": {
            transform: "translateX(calc(100% + 1.5rem))",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        toastSlideOut: {
          "0%": {
            transform: "translateX(0)",
            opacity: 1,
            maxHeight: "100%",
            marginTop: "1rem",
          },
          "100%": {
            transform: "translateX(calc(100% + 1.5rem))",
            opacity: 0,
            maxHeight: 0,
            marginTop: 0,
          },
        },
        toastSlideInLeft: {
          "0%": {
            transform: "translateX(calc(-100% - 1.5rem))",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        toastSlideOutLeft: {
          "0%": {
            transform: "translateX(0)",
            opacity: 1,
            maxHeight: "100%",
            marginTop: "1rem",
          },
          "100%": {
            transform: "translateX(calc(-100% - 1.5rem))",
            opacity: 0,
            maxHeight: 0,
            marginTop: 0,
          },
        },
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
  plugins: [],
};
