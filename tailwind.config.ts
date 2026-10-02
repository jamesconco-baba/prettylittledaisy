import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { blush: "#F9E4E1", petal: "#F3CFCB", rose: "#C26B77", taupe: "#9C7B67", cocoa: "#5A4137", cream: "#FFF9F6" },
    fontFamily: { display: ["var(--f-display)", "serif"], body: ["var(--f-body)", "sans-serif"], script: ["var(--f-script)", "cursive"] },
  } },
} satisfies Config;
