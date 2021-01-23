import { createGlobalStyle } from "styled-components";
import chroma from "chroma-js";

const GlobalStyle = createGlobalStyle`
	:root{
		--disstreamchat-blue: #2d688d;
		--disstreamchat-purple: #462b45;
		--background-dark-gray: #17181b;
		--background-light-gray: #24252a;
		--header-height: 134px;
		--youtube-background: linear-gradient(320.75deg, rgb(255, 0, 0) 8.4%, rgb(182, 0, 52) 100.11%);
		--twitch-background: linear-gradient(
			198.87deg,
			rgb(162, 58, 195) -17.84%,
			rgb(106, 69, 173) 114.96%
		);
	}

    html,
    body {
    	padding: 0;
        margin: 0;
		font-family: 'Poppins', sans-serif;
        /* overflow: hidden; */
		color: white;
		min-height: 100vh;
		background: var(--background-light-gray);
        box-sizing: border-box !important;
		margin-top: 40px;
    }

	#__next{
		z-index: 1;
	}

	*[role="presentation"]{
		z-index: 1000000000000000 !important;
	}


    a {
    	color: inherit;
    	text-decoration: none;
		outline: none !important;
    }


    * {
    	box-sizing: border-box;
	}
	
	::-webkit-scrollbar {
		width: 1rem;
		border-radius: 100px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #24252a;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: var(--disstreamchat-blue);
		border-radius: 100px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: ${chroma("#2d688d").darken(0.1).hex()}
	}

	.MuiFormHelperText-contained{
		margin-left: 0px !important;
	}
	
	#nprogress{
		z-index: 100000000000000000;
		.bar{
			z-index: 100000000000000000 !important;
		}
	}

	.MuiOutlinedInput-adornedStart {
		overflow: hidden !important;
	}
`;

export default GlobalStyle;
