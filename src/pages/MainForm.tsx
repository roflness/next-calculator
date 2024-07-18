import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { fetchChargerTypes, postResults } from '../app/api';

type FormData = {
    numVehicles: string;
    milesDrivenPerDay: string;
    batterySize: string;
    vehicleEfficiency: string;
    chargingHoursPerDay: string;
    chargingDaysPerWeek: string;
    season: string;
    timeOfDay: string;
  };
  
  type ChargerEntry = {
    chargerType: string;
    chargerCount: string;
  };

  type ChargerType = {
    charger_type_id: string;
    type: string;
    rating_kW: number;
  };

const MainForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        numVehicles: '',
        milesDrivenPerDay: '',
        batterySize: '',
        vehicleEfficiency: '',
        chargingHoursPerDay: '',
        chargingDaysPerWeek: '',
        season: '',
        timeOfDay: ''
    });

    const [chargerEntries, setChargerEntries] = useState<ChargerEntry[]>([{ chargerType: '', chargerCount: '' }]);
  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadChargerTypes = async () => {
            const chargers = await fetchChargerTypes();
            setChargerTypes(chargers);
        };

        loadChargerTypes();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number | null = null) => {
        if (index !== null) {
          const newEntries = [...chargerEntries];
          const name = e.target.name as keyof ChargerEntry;
          newEntries[index][name] = e.target.value;
          setChargerEntries(newEntries);
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        }
      };

    const addCharger = () => {
        setChargerEntries([...chargerEntries, { chargerType: '', chargerCount: '' }]);
    };

    const removeCharger = (index: number) => {
        const newEntries = chargerEntries.filter((_, i) => i !== index);
        setChargerEntries(newEntries);
      };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step > 1 ? step - 1 : step);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
          ...formData,
          chargers: chargerEntries
        }
        try {
            const results = await postResults(payload);
            router.push({
              pathname: '/Results', // Ensure the route matches the file name case
              query: { data: JSON.stringify(results) }
            });
          } catch (error) {
            console.error('Failed to submit form data:', error);
            setError('Failed to submit form data. Please try again.');
          } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <h1 className="fs-header">EV Cost Calculator</h1>
            <form id="msform" onSubmit={handleSubmit}>
                {/* Conditional rendering for different form steps */}
                {step === 1 && (
                    <fieldset>
                        <h2 className="fs-title">Vehicle Selection</h2>
                        <input type="number" name="numVehicles" placeholder="Number of Vehicles" min="1" required value={formData.numVehicles} onChange={handleChange} />
                        <input type="number" name="milesDrivenPerDay" placeholder="Miles Driven Per Day" min="1" step="any" required value={formData.milesDrivenPerDay} onChange={handleChange} />
                        <input type="number" name="batterySize" step="any" placeholder="Vehicle Battery Size" min="1" required value={formData.batterySize} onChange={handleChange} />
                        <input type="number" name="vehicleEfficiency" step="any" placeholder="Vehicle Efficiency" min="0.01" required value={formData.vehicleEfficiency} onChange={handleChange} />
                        <button type="button" className="next action-button" onClick={nextStep}>Next</button>
                    </fieldset>
                )}
                {step === 2 && (
                    <fieldset>
                        <h2 className="fs-title">Charging Behavior</h2>
                        <input type="number" name="chargingHoursPerDay" min="1" max="24" placeholder="Charging Hours Per Day" required value={formData.chargingHoursPerDay} onChange={handleChange} />
                        <input type="number" name="chargingDaysPerWeek" min="1" max="7" placeholder="Charging Days Per Week" required value={formData.chargingDaysPerWeek} onChange={handleChange} />
                        <button type="button" className="previous action-button" onClick={prevStep}>Back</button>
                        <button type="button" className="next action-button" onClick={nextStep}>Next</button>
                    </fieldset>
                )}
                {step === 3 && (
                    <fieldset>
                        <h2 className="fs-title">Charger Selection</h2>
                        <div className="charger-selection-container" id="charger-container">
                            {chargerEntries.map((entry, index) => (
                                <div key={index} className="charger-entry">
                                    <select name="chargerType" onChange={e => handleChange(e, index)} value={entry.chargerType}>
                                        <option value="" disabled>-- Select Charger Type --</option>
                                        {chargerTypes.map((charger) => (
                                            <option key={charger.charger_type_id} value={charger.charger_type_id}>
                                                {charger.type} - {charger.rating_kW} kW
                                            </option>
                                        ))}
                                    </select>
                                    <input type="number" name="chargerCount" min="1" placeholder="Count of Charger" required value={entry.chargerCount} onChange={e => handleChange(e, index)} />
                                    {chargerEntries.length > 1 && (
                                        <button type="button" className='remove-button' onClick={() => removeCharger(index)}>Remove</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className='secondary-button' onClick={addCharger}>Add Another Charger</button>
                        <br></br>
                        <button type="button" className="previous action-button" onClick={prevStep}>Back</button>
                        <button type="button" className="next action-button" onClick={nextStep}>Next</button>
                    </fieldset>
                )}
                {step === 4 && (
                    <fieldset>
                        <h2 className="fs-title">Time of Year</h2>
                        <select name="season" value={formData.season} onChange={handleChange}>
                            <option value="Summer">Summer</option>
                            <option value="Winter (March and April)">Winter (March and April)</option>
                            <option value="Winter (excluding March and April)">Winter (excluding March and April)</option>
                        </select>
                        <select name="timeOfDay" value={formData.timeOfDay} onChange={handleChange}>
                            <option value="SOP">Super Off-Peak</option>
                            <option value="Off-Peak">Off-Peak</option>
                            <option value="On-Peak">On-Peak</option>
                        </select>
                        <button type="button" className="previous action-button" onClick={prevStep}>Back</button>
                        <button type="submit" className="submit action-button">Calculate</button>
                    </fieldset>
                )}
            </form>
        </div>
    );
};

export default MainForm;