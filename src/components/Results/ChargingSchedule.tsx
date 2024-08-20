import React, { useState, useEffect } from 'react';
import '../../styles/ChargingSchedule.css';
import { FsSubtitle, FsTitle, SecondaryButton } from '@/styles/myComponentStyles';


interface Rate {
    hours: number[];
    rate: number;
}

interface TimeOfUseRates {
    [key: string]: {
        [key: string]: {
            [key: string]: Rate;
        };
    };
}

interface ChargingScheduleProps {
    timeOfUseRates: TimeOfUseRates;
    // season: string;
    // dayType: string;
    onHoursSelected: (selectedHours: number[]) => void;
}

const hours = [
    '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
    '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
];

const middayHours = [8, 9, 10, 11, 12, 13, 14, 15]; // 8am to 3pm
const overnightHours = [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7]; // 9pm to 5am

const ChargingSchedule: React.FC<ChargingScheduleProps> = ({ timeOfUseRates, onHoursSelected }) => {
    const [selectedHours, setSelectedHours] = useState<number[]>([]);
    const [middayChecked, setMiddayChecked] = useState(false);
    const [overnightChecked, setOvernightChecked] = useState(false);

    useEffect(() => {
        onHoursSelected(selectedHours);
    }, [selectedHours, onHoursSelected]);

    const toggleHour = (hour: number) => {
        setSelectedHours(prev =>
            prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
        );
    };

    const clearHours = () => {
        setSelectedHours([]);
        setMiddayChecked(false);
        setOvernightChecked(false);
    };

    const handleMiddayChange = () => {
        setMiddayChecked(prevChecked => {
            const newChecked = !prevChecked;
            if (newChecked) {
                setSelectedHours(prev => Array.from(new Set([...prev, ...middayHours])));
            } else {
                setSelectedHours(prev => prev.filter(hour => !middayHours.includes(hour)));
            }
            return newChecked;
        });
    };

    const handleOvernightChange = () => {
        setOvernightChecked(prevChecked => {
            const newChecked = !prevChecked;
            if (newChecked) {
                setSelectedHours(prev => Array.from(new Set([...prev, ...overnightHours])));
            } else {
                setSelectedHours(prev => prev.filter(hour => !overnightHours.includes(hour)));
            }
            return newChecked;
        });
    };
    return (
        <div className="charging-schedule">
            <FsTitle className="fs-title">Charging Schedule</FsTitle>
            <FsSubtitle className="fs-subtitle">What time of day will you charge your vehicles?</FsSubtitle>
            <div className="checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        checked={middayChecked}
                        onChange={handleMiddayChange}
                    />
                    Mid-day
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={overnightChecked}
                        onChange={handleOvernightChange}
                    />
                    Overnight
                </label>
            </div>
            <div className="hour-grid">
                {hours.map((label, index) => (
                    <div
                        key={index}
                        className={`hour-box ${selectedHours.includes(index) ? 'selected' : ''}`}
                        onClick={() => toggleHour(index)}
                    >
                        {label}
                    </div>
                ))}
            </div>
            <SecondaryButton type="button" className='secondary-button' onClick={clearHours}>Clear All Hours</SecondaryButton>
        </div>
    );
};

export default ChargingSchedule;