import utilStyles from "./index.module.css";

import Head from "next/head";

import { getPostData } from "../lib/markdown";


export async function getStaticProps() {
    const postData = await getPostData("home");

    return {
        props: {
            postData
        }
    };
}

export default function Post({ postData }: { postData: { id: string, contentHtml: string, title: string, titleHeader: string } }) {
    return (
        <>
            <Head>
                <title>{postData.titleHeader}</title>
            </Head>

            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </>
    );
}
