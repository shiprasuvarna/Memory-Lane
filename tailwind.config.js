/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    container:{
      padding:{
        DEFAULT : '15px',
      },
    },
    screens:{
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    fontFamily:{
      primary: 'DM Serif Display',
      secondary: 'Jost'
    },
    backgroundImage:{
        hero: 'url(/assets/bg-hero.jpg)',
        grid: 'url(/assets/grid.png)',
      },
    extend: {
      colors:{
        primary: {
          DEFAULT:'#292f36',
          hover:'#343e4a'
        },
        secondary: '#184E77',
        accent: {
          DEFAULT:'#0166ff',
          secondary:'#E0ECFF',
          hover:'#99D98C',
        },
      },
    },
  },
  plugins: [],
}
