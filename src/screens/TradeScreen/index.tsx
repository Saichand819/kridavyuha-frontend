import React, { useEffect, useState } from 'react';
import { Card, Text, Image, Group, Badge, Button, Avatar, Tabs, RingProgress } from '@mantine/core';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { AiOutlineUnorderedList } from 'react-icons/ai';
import { MdAttachMoney } from 'react-icons/md';
import { LiaPiggyBankSolid } from 'react-icons/lia';
import axios from 'axios';
import CardLayout from '../../components/PlayerCard';
import { useWebSocket } from '../../hooks/useWebSocket';

import { useSearchParams } from 'react-router-dom';

interface CardProps {
    player_id: string;
    player_name: string;
    team : string;
    profile_pic: string,
    cur_price: number;
    last_change: string;
    shares: number;
  }



const handlePortfolio = (leagueId: string | null) => {
    window.location.href = `/portfolio?leagueId=${leagueId}`;
}


export const TradeScreen: React.FC = () => {

    const [cards,  setCards] = useState<CardProps[]>([]);
    const [searchParams] = useSearchParams();
    const leagueId:string|null = searchParams.get('leagueId'); 


        
    
    const teams = Array.from(new Set(cards.map(card => card.team)));
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
            
                const token :string|null = localStorage.getItem('token');
                console.log('token:', token);
                const response = await fetch(`http://localhost:8080/players?league_id=${leagueId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    }
                });
                const data: CardProps[] = await response.json();
                const players = data.map((player: CardProps) => ({
                    ...player,
                    cur_price: parseFloat(player.cur_price.toFixed(2)),
                }));
                setCards(players);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, [leagueId]);

    const { isConnected, messages, sendMessage } = useWebSocket({
        url: 'ws://localhost:8080/ws'
      });

      console.log('messages:', messages);

    useEffect(() => {
        if (messages.length > 0) {
            const updatedPlayers = cards.map((player) => {
                const message = messages[0].players[player.player_id];
                if (message) {
                    // new price
                    console.log("newPrice" ,message)
                    const lastPrice = player.cur_price;
                    const curPrice = message
                    // pos or neg
                    const lastChange = player.last_change;
                    const change = curPrice > 0 ? 'pos' : curPrice < 0 ? 'neg' : lastChange;
                    return {
                        ...player,
                        cur_price: lastPrice + (message),
                        last_change: change,
                    };
                }
                return player;
            });
            console.log('updatedPlayers:', updatedPlayers);
            setCards(updatedPlayers);
        }
    }, [messages]);

    console.log('Teams:', teams);

    return (
        <div className="container p-4">
            <div className="flex flex-wrap gap-2 justify-center items-center">
                <div className="flex flex-wrap gap-2">
                    {teams.map((team, index) => (
                        <Button
                            key={index}
                            variant={selectedTeam === team ? 'filled' : 'outline'}
                            onClick={() => setSelectedTeam(selectedTeam === team ? null : team)}
                        >
                            {team}
                        </Button>
                    ))}
                </div>
           
                <LiaPiggyBankSolid size={36} onClick={()=>handlePortfolio(leagueId)} style={{ marginLeft: '18px' }}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {cards
                    .filter(card => selectedTeam === null || card.team === selectedTeam)
                    .map((card, index) => (
                        <CardLayout key={index} {...card} />
                    ))}
            </div>
        </div>
    );
}