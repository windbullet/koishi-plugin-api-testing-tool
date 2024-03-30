/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  safelist: [ { pattern: /alert-+/ } ]
}

