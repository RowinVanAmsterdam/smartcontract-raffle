import { ConnectButton } from "web3uikit";

export const Header = () => {

    return (
        <header className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3xl">Smart Contract Raffle</h1>
            <div className="ml-auto py-2 px-4"><ConnectButton /></div>
        </header>
    )
}