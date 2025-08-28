import { darken } from 'polished';

const primaryColor = '#17ac04ff';

const theme = {
    colors: {
        primary: primaryColor,
        primaryDark: darken(0.15, primaryColor),   
        primaryDarkTwo: darken(0.3, primaryColor),
        primaryTransparent1: 'rgba(10, 66, 171, 0.5)',
        primaryTransparent2: 'rgba(10, 66, 171, 0.15)',

        span: '#78d64cff',

        background: '#000000b2',
        text: '#FFFFFF',
        inputBg: '#121212',
        inputBorder: darken(0.1, primaryColor),
        placeholder: '#AAAAAA',
        linkPlaceholder: '#FFFFFF',

        disabledBg: '#1F1F1F',
        disabledBorder: '#333333',
        disabledText: '#777777',

        danger: "#dc3545",
        dangerDark: "#a71d2a",
        warning: "#ffc107",
        warningDark: "#c79100",
        info: "#17a2b8",
        infoDark: "#11707f",
    },
};

export default theme;
