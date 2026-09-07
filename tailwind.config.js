/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            50: "#f0f4f9",
            100: "#dbe5f1",
            200: "#b9cde3",
            300: "#8baecc",
            400: "#5c8eb3",
            500: "#3d739c",
            600: "#2a5980",
            700: "#1e4466",
            800: "#15334d",
            900: "#0b233a",
            950: "#071726",
          },
          blue: {
            primary: "#0B2545",
            secondary: "#133E87",
            light: "#EEF4FB",
            border: "#C8D9ED",
          },
          saffron: {
            DEFAULT: "#D97706",
            dark: "#B45309",
            light: "#FEF3C7",
            border: "#FDE68A",
          },
          green: {
            DEFAULT: "#15803D",
            dark: "#166534",
            light: "#DCFCE7",
            border: "#BBF7D0",
          },
          status: {
            approved: {
              bg: "#DCFCE7",
              text: "#14532D",
              border: "#86EFAC",
            },
            inprogress: {
              bg: "#DBEAFE",
              text: "#1E3A8A",
              border: "#93C5FD",
            },
            action: {
              bg: "#FEF3C7",
              text: "#78350F",
              border: "#FCD34D",
            },
            rejected: {
              bg: "#FEE2E2",
              text: "#7F1D1D",
              border: "#FCA5A5",
            },
            waiting: {
              bg: "#F1F5F9",
              text: "#334155",
              border: "#CBD5E1",
            },
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        gov: "0 1px 3px 0 rgba(11, 37, 69, 0.08), 0 1px 2px -1px rgba(11, 37, 69, 0.04)",
        govCard: "0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 4px 6px -1px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
