import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { dir } from 'i18next';

interface MyDocumentProps {
  lng: string;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const lng = ctx.query.lng || 'en'; // Default to 'en' if no lng is present
    return { ...initialProps, lng };
  }

  render() {
  
    const { lng } = this.props;
    return (
      <Html lang={lng} dir={dir(lng)}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
