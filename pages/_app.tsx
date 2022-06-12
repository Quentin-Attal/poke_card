import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'


function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Component {...pageProps} style={{
      marginBottom: "14vh"
    }} />
    <footer style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}>
      <p>
        © 2022, Built with
        {` `}
        <a href="https://nextjs.org">Next.js</a>
      </p>
      <p style={{
        fontSize: '0.8rem',
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: '1rem',
        alignItems: 'center',
        justifyItems: 'center',
        marginBottom: '1rem',
      }}>
        <Link href="/">
          <a id="home">Home</a>
        </Link>
        <Link href="/cgu">
          <a id="cgu">About</a>
        </Link>
        <Link href="/contact">
          <a id="contact">Contact</a>
        </Link>
      </p>
    </footer>
  </>
}

export default MyApp
