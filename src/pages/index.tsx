import Head from 'next/head';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { ADD, useWindowContext } from '@/window_context/WindowContextAPI';
import GameMain from '@/game_context/components/GameMain';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { dispatch } = useWindowContext();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} win7`}>
        pain and suffering
        <button onClick={() => dispatch({
          type: ADD,
          payload: {
            type: 'custom',
            title: 'pfvr funcione',
            id: 'main_window',
            children: <GameMain />
          }
        })}>nova janela</button>
        {/* <WindowComponent /> */}
      </main>
    </>
  )
}
