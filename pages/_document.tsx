import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html className="bg-neutral-900" lang="en">
                <Head>
                    <meta name="robots" content="noindex" />
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
