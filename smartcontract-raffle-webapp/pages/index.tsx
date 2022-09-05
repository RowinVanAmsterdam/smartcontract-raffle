import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Header } from "../components/Header";
import { RaffleEntrance } from "../components/RaffleEntrance";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Smart Contract Raffle</title>
                <meta name="description" content="A webapplication for the Raffle Smart Contract" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main>
              <RaffleEntrance />
            </main>
        </div>
    );
};

export default Home;
