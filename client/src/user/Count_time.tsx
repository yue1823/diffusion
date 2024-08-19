import React, { useState, useEffect } from 'react';

interface TimeLeft{
    days:number;
    hours:number;
    minutes:number;
    seconds:number;
}
const CountdownTimer = ({ expiredDate }: { expiredDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days:0,
        hours:0,
        minutes:0,
        seconds:0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const day = parseInt(expiredDate.slice(0, 2), 10);
            const month = parseInt(expiredDate.slice(2, 4), 10) - 1; // JavaScript months are 0-based
            const year = parseInt(expiredDate.slice(4, 8), 10);

            const expirationDate = new Date(year, month, day);
            const currentDate = now;

            let timeDifference = expirationDate.getTime() - currentDate.getTime();
            if (timeDifference < 0) {
                timeDifference = 36 * 60 * 60 * 1000;
            }

            const totalSeconds = Math.floor(timeDifference / 1000);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setTimeLeft(({ days, hours, minutes, seconds }));
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [expiredDate]);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.5rem',
        flexWrap: 'wrap',
    };

    const itemStyle: React.CSSProperties = {
        textAlign: 'center',
        flex:'0 0 10%'
    };

    const numberStyle: React.CSSProperties = {
        color:"hsla(0,100%,100%,0.9)",
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '0.1rem',
    };

    const labelStyle: React.CSSProperties = {
        color:"hsla(0,100%,100%,0.9)",
        fontSize: '1rem',
        // color: '#555',
    };

    return (
        <div style={containerStyle}>
            <div style={{...itemStyle}}>
                <div style={numberStyle}>{timeLeft.days}</div>
                <div style={labelStyle}>Days</div>
            </div>
            <div style={{...itemStyle}}>
                <div style={numberStyle}>{timeLeft.hours}</div>
                <div style={labelStyle}>Hours</div>
            </div>
            <div style={{...itemStyle}}>
                <div style={numberStyle}>{timeLeft.minutes}</div>
                <div style={labelStyle}>Minutes</div>
            </div>
            <div style={{...itemStyle}}>
                <div style={numberStyle}>{timeLeft.seconds}</div>
                <div style={labelStyle}>Seconds</div>
            </div>
        </div>
    );
};

export default CountdownTimer;

