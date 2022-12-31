import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as StoreProvider } from 'react-redux'
import { store } from '~/store'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<StoreProvider store={store}>
			<Component {...pageProps} />
		</StoreProvider>
	)
}

export default MyApp
