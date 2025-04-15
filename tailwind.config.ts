process.env.TAILWIND_DISABLE_OXIDE = '1';

module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          'primary-dark': '#your-color-code', // Replace with your actual color code
        },
      },
    },
    plugins: [],
  };
  