import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Image from 'next/image'
import theme from '~/styles/theme'
import createEmotionCache from '~/utilities/createEmotionCache'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/react'
import { Provider as StoreProvider } from 'react-redux'
import { store } from '~/store'

const clientSideEmotionCache = createEmotionCache()

interface IProps extends AppProps {
	emotionCache: EmotionCache
}

const MyApp = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: IProps): JSX.Element => {

	return (
		<>
			<Head>
				<title>4 Seasons Gamers</title>
				<link
					rel="icon"
					href="./favicon.ico"
				/>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<StoreProvider store={store}>
				<CacheProvider value={ emotionCache }>
					<ThemeProvider theme={theme}>
							<CssBaseline />
							<Component {...pageProps} />
					</ThemeProvider>
				</CacheProvider>
			</StoreProvider>
			<footer>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{' '}
					<span>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</>
	)
}

export default MyApp
