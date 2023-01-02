import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '~/utilities/createEmotionCache'

class MyDocument extends Document {
	static async getInitialProps (ctx: DocumentContext) {
		const originalRenderPage = ctx.renderPage
		const cache = createEmotionCache()
		const { extractCriticalToChunks } = createEmotionServer(cache)

		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: (App) =>
					function EnhanceApp (props) {
						return (
							<App
								// @ts-ignore
								emotionCache={ cache }
								{ ...props }
							/>
						)
					}
			})

		const initialProps = await Document.getInitialProps(ctx)
		const emotionStyles = extractCriticalToChunks(initialProps.html)
		const emotionStyleTags = emotionStyles.styles.map((style) => (
			<style
				data-emotion={ `${style.key} ${style.ids.join(' ')}` }
				key={ style.key }
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={ { __html: style.css } }
			/>
		))
		return { ...initialProps, emotionStyleTags }
	}

	render (): JSX.Element {
		return (
			<Html>
				<Head>
					<link
						rel="icon"
						type="image/x-icon"
						href="/search/favicon.ico"
					/>
					{/* @ts-ignore */}
					{ this.props.emotionStyleTags }
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
