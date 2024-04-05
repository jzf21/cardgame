import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gameSlice } from '../../../redux/features/game-slice';
import { Layout } from '@/Layout/GameLayout';
import { flipCard, resetGame } from '../../../redux/features/game-slice';
import { AppDispatch, useAppSelector } from '@/lib/store';
import Card from './Card';

export const Deck = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { deck, gameOver, message } = useAppSelector((state) => state.gameSliceReducer);
    const [currentCard, setCurrentCard] = useState(null);
    const [isBrowser, setIsBrowser] = useState(false);
     // New state for open cards

    const [openCards, setOpenCards] = useState<string[]>([]); // Add type annotation for openCards state variable

    useEffect(() => {
        setIsBrowser(true);
    }, []);
    useEffect(() => {
        console.log(message);
    }, [message]);
    const handleFlipCard = (index: number) => {
        dispatch(flipCard(index));
  
        setOpenCards([...openCards, deck[index]]); // Add the card to openCards
    };

    if (!isBrowser) {
        return null; // Render nothing on the server
    }

    return (
        <Layout>
            <div className='flex flex-col justify-center items-center'>
            <h2>Deck of Cards</h2>
            <div className='flex flex-row gap-4'>
                {/* Only render the top card of the deck */}
                {deck.length > 0 && (
                    <Card key={deck.length - 1} card={deck[deck.length - 1]} onClick={() => handleFlipCard(deck.length - 1)}></Card>
                )}
            </div>
            <h2>Open Cards</h2>
            <div className='flex flex-row gap-4 '>
                {/* Render the open cards */}
                {openCards.map((card, index) => (
                    <Card key={index} card={card} onClick={() => {}}></Card>
                ))}
            </div>
            <div className='flex flex-row gap-4'>
                <button onClick={() => {dispatch(resetGame());
                    setOpenCards([]); // Reset open cards}
                }} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                    Reset Game
                </button>
            </div>
            <p>{message}</p>
            <div className='w-full flex items-center justify-center'>
                 
            </div>
        </div>
        </Layout>
    );
};