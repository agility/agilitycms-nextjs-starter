import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  // figure out how to get the lang dynamically instead of hardcode
  render() {
    return (
      <Html lang="en-us">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
