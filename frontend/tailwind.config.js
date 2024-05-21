/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                mainOrange: "#fb7000",
                lightOrange: "#ffebcf",
                darkOrange: "#732901",
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
          {
            'bumblebee': {
               'primary' : '#fb7000',
               'primary-focus' : '#b35000',
               'primary-content' : '#ffffff',
    
               'secondary' : '#dfa62a',
               'secondary-focus' : '#be8b1e',
               'secondary-content' : '#ffffff',
    
               'accent' : '#18182f',
               'accent-focus' : '#111122',
               'accent-content' : '#ffffff',
    
               'neutral' : '#18182f',
               'neutral-focus' : '#111122',
               'neutral-content' : '#ffffff',
    
               'base-100' : '#ffffff',
               'base-200' : '#f5f5f5',
               'base-300' : '#e3e3e3',
               'base-content' : '#000000',
    
               'info' : '#1c92f2',
               'success' : '#009485',
               'warning' : '#ff9900',
               'error' : '#ff3c00',
    
              '--rounded-box': '1rem',          
              '--rounded-btn': '.5rem',        
              '--rounded-badge': '1.9rem',      
    
              '--animation-btn': '.25s',       
              '--animation-input': '.2s',       
    
              '--btn-text-case': 'uppercase',   
              '--navbar-padding': '.5rem',      
              '--border-btn': '1px',            
            },
          },
        ],
      },
};
