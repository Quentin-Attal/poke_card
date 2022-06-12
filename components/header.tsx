import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./layout.module.css";

const defaultName = "Pokedex";

export default function Header({ children, name }: { children: React.ReactNode; name?: string }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Pokedex"
                />
                <title>{name || defaultName}</title>
                <meta name="og:title" content={name || defaultName} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <header className={styles.header}>
                <Link href="/">
                    <a>
                        <Image
                            priority
                            src="/images/rotom.jpg"
                            height={108}
                            width={300}
                            alt={name}
                        />
                    </a>
                </Link>
            </header >
            <main>{children}</main>
        </div >
    );
}
