import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    card: string;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ onClick, card }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
    const flipCard = () => {
        setIsFlipped(!isFlipped);
        onClick();
        setTimeout(() => {
            setIsFlipped(!isFlipped);
        }
        , 3000);
        
        
    };
    const cards = {
        'BOMB_CARD': '💣',
        'CAT_CARD': '😺',
        'DEFUSE_CARD' : '🛡️',
        'SHUFFLE_CARD' : '🔀',
    };


    return (
        <motion.button
            className='flip-card'
            onClick={flipCard}
            animate={{ rotateY: isFlipped ? 180 : 360}}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
            disabled={false} // Remove isAnimating state
        >
            <motion.div className='bg-blue-300 h-[100px] w-[60px] flex items-center justify-center flip-card-inner'>
                <motion.div className='bg-blue-600 h-[100px] w-[60px] flex items-center justify-center flip-card-front'>
            
                </motion.div>
                <motion.div className='bg-blue-300 h-[100px] w-[60px] flex items-center justify-center flip-card-back'>
                    {cards[card as keyof typeof cards]}
                </motion.div>
            </motion.div>
        </motion.button>
    );
};

export default React.memo(Card);
