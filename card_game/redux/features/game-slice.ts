import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
    deck: string[];
    hasDefuseCard: boolean;
    gameOver: boolean;
    message: string;
};

const shuffleArray = (array: any[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};
const startingDeck = ['CAT_CARD', 'DEFUSE_CARD', 'SHUFFLE_CARD', 'BOMB_CARD'];

const getRandomElements = (numElements: number) => {
    const array = ['CAT_CARD', 'DEFUSE_CARD', 'SHUFFLE_CARD', 'BOMB_CARD'];
    let result = [];
    for (let i = 0; i < numElements; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        result.push(array[randomIndex]);
    }
    return result;
};


const initialState: GameState = {
    deck: getRandomElements(5),
    hasDefuseCard: false,
    gameOver: false,
    message: '',
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        resetGame: (state) => {
            return {
                ...initialState,
                deck: getRandomElements(5),
            };
        },
        shuffleDeck: (state) => {
            return {
                ...state,
                deck: shuffleArray(state.deck),
            };
        },
        flipCard: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            const card = state.deck[index];
            const newDeck = [...state.deck.slice(0, index), ...state.deck.slice(index + 1)];
              if(newDeck.length === 0 ) {
                return {
                    ...state,
                    gameOver: true,
                    message: 'You WIn! Game Over!',
                };
            }
            switch (card) {
                case 'SHUFFLE_CARD':
                    return {
                        ...state,
                        deck: shuffleArray(initialState.deck),
                        message: 'Shuffle Card Drawn game restarted!',
                    };
                case 'BOMB_CARD':
                    if (state.hasDefuseCard) {
                        return {
                            ...state,
                            deck: newDeck,
                            hasDefuseCard: false,
                            message: 'Bomb Defused!',
                        };
                    } else {
                        return {
                            ...state,
                            gameOver: true,
                            message: 'Game Over!',
                        };
                    }
                case 'CAT_CARD':
                    return {
                        ...state,
                        deck: newDeck,
                        message: 'Cat Card Drawn!',
                    };
                case 'DEFUSE_CARD':
                    return {
                        ...state,
                        deck: newDeck,
                        hasDefuseCard: true,
                        message: 'Defuse Card Drawn!',
                    };
                default:
                    return state;
            }
          
        },
    },
});

export const { resetGame, shuffleDeck, flipCard } = gameSlice.actions;
export default gameSlice.reducer;
