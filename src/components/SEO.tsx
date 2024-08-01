import Head from "next/head";

export interface SEOProps {
  title: string;
  description: string;
}

export default function SEO({ title, description }: SEOProps) {
  return (
    <Head>
      <title>{`${title} | get.innit.gg`}</title>
      <meta property="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/assets/logo/256x.png" />
      <meta property="og:site_name" content="get.innit.gg" />
      <link rel="shortcut icon" href="/assets/logo/32x.png" />
    </Head>
  );
}
