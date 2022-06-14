import React from 'react';
import styled from 'styled-components';
import type { NextPage } from 'next'
import { useStarknet, InjectedConnector, useContract } from '@starknet-react/core'
import { Abi, number, shortString } from 'starknet';
import contractAbi from '../abi/MyToken_abi.json'

const contractAddress = '0x00dce4544ed826164bc01dd1ed5f086c2131f2e369502856b7ed17dcc2b204eb';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100vh;
    font-size: 18px;
`;

const Title = styled.div`
    font-size: 2rem;
    margin-top: 100px;
`;

const Button = styled.button`
    background-color: grey;
    border: none;
    border-radius: 15px;

    color: #ffffff;   
    font-weight: 600;
    
    padding: 20px;
    padding-left: 40px;
    padding-right: 40px;

    margin-top: 50px;

    &:hover {
        cursor: pointer;
    }
`;

const Account = styled.div`
    margin-top: 50px;
`

const Contract = styled.div`
    margin-top: 50px;
`

const YourBalance = styled.div`
    margin-top: 50px;
`

const Home: NextPage = () => {
    const { connect, connectors, account } = useStarknet()
    const [balance, setBalance] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)

    const abi = contractAbi as Abi;
    const address = contractAddress;
    const { contract } = useContract({ abi, address });
    const injected = React.useMemo(() => new InjectedConnector(), [])

    const getBalance = async () => {
        setIsLoading(true)
        const b = await contract?.call('balanceOf', [account as string])
        setBalance(b?.balance.low.toNumber())
        setIsLoading(false)
    }

    const mint = async () => {
        try {
            setIsLoading(true)
            const tx = await contract?.invoke('mint');
            console.log(tx);
            setIsLoading(false)
        } catch (err) {
            console.log(err);
            window.alert('Cancelled')
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        const f = async () => {
            if (account) {
                await getBalance();
            }
        }
        f();
    }, [account])

    // Query string example
    const call = async () => {
        const symbol = await contract?.call('symbol')
        const x = shortString.decodeShortString(number.toHex(symbol?.symbol))
        console.log(x);
    }

    return (
        <Container>
            <Title>StarkNet ERC721</Title>
            {
                connectors.map((connector) => {
                    return (
                        <>
                            {
                                connector.available() && connector.name() === 'Disconnected' ? (
                                    <Button key={connector.id()} onClick={() => connect(connector)}>
                                        Connect Wallet
                                    </Button>
                                ) : null
                            }
                        </>
                    )
                })
            }

            {
                account ? (
                    <>
                        <Account>
                            <div>Your Wallet Address:</div>
                            <div>{account}</div>
                        </Account>
                        <Contract>
                            <div>Contract Address:</div>
                            <div>{contractAddress}</div>
                        </Contract>
                        <YourBalance>
                            <div>Balance:</div>
                            <div>{balance}</div>
                            <Button onClick={getBalance}>
                                {
                                    isLoading ? 'Loading...' : 'Refresh Balance'
                                }
                            </Button>
                        </YourBalance>
                        <Button onClick={() => mint()} disabled={isLoading}>
                            {
                                isLoading ? 'Loading...' : 'Mint'
                            }
                        </Button>
                    </>
                ) : null
            }
        </Container>
    )
}

export default Home
