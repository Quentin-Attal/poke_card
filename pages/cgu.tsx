import utilStyles from "../styles/index.module.css";

import { getPostData } from "../lib/markdown";
import Header from "../components/header";

export async function getStaticProps() {
    const postData = await getPostData("cgu");

    return {
        props: {
            postData
        }
    };
}

export default function Post({ postData }: { postData: { id: string, contentHtml: string, title: string, titleHeader: string } }) {
    return (
        <Header name={postData.title}>
            <article>
                <h1 className={utilStyles.title}>{postData.title}</h1>
                <div className={utilStyles.markDown} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Header>
    );
}
