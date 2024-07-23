import React, { useState, useEffect, ChangeEvent, FocusEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchChargerTypes, postResults } from '../../app/api';
import {
    Msform,
    Fieldset2,
    Input,
    Select,
    ActionButton,
    SecondaryButton,
    RemoveButton,
    FsHeader,
    FsTitle,
    ChargerSelectionContainer,
    ChargerEntry,
    StyledTextField2,
} from '../../styles/myComponentStyles';



// Log the environment variable to ensure it's being picked up
console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

type FormInputs = {
    numVehicles: string;
    milesDrivenPerDay: string;
    batterySize: string;
    vehicleEfficiency: string;
    chargingHoursPerDay: string;
    chargingDaysPerWeek: string;
    season: string;
    timeOfDay: string;
    // chargers: ChargerEntry[];
    chargerEntries: ChargerEntry[];
};

type ChargerEntry = {
    chargerType: string;
    chargerCount: string;
}

type ChargerType = {
    charger_type_id: string;
    type: string;
    rating_kW: number;
};

const steps = ['Vehicle Selection', 'Charging Behavior', 'Charger Selection', 'Time of Year'];

const SecondaryForm = ({ formData }: { formData: FormInputs }) => {
    const router = useRouter();
    const [localFormData, setLocalFormData] = useState<FormInputs>(formData);
    const [chargerEntries, setChargerEntries] = useState<ChargerEntry[]>(formData.chargerEntries || [{ chargerType: '', chargerCount: '' }]);
    const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);
    // const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadChargerTypes = async () => {
            const chargers = await fetchChargerTypes();
            setChargerTypes(chargers);
        };
        loadChargerTypes();
        validateForm();
    }, []);

    const validateNumVehicles = (value: string) => {
        const numValue = parseInt(value, 10);
        if (numValue < 1) {
            return 'Number of vehicles must be at least 1.';
        }
        return '';
    };

    const validateMilesDrivenPerDay = (value: string) => {
        const numValue = parseFloat(value);
        if (numValue < 1) {
            return 'Miles driven per day must be at least 1.';
        }
        return '';
    };

    const validateBatterySize = (value: string) => {
        const numValue = parseFloat(value);
        if (numValue < 1) {
            return 'Battery size must be at least 1.';
        }
        return '';
    };

    const validateVehicleEfficiency = (value: string) => {
        const numValue = parseFloat(value);
        if (numValue < 0.01) {
            return 'Vehicle efficiency must be at least 0.01.';
        }
        return '';
    };

    const validateChargingHoursPerDay = (value: string) => {
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 24) {
            return 'Charging hours per day must be between 1 and 24.';
        }
        return '';
    };

    const validateChargingDaysPerWeek = (value: string) => {
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 7) {
            return 'Charging days per week must be between 1 and 7.';
        }
        return '';
    };


    // const [chargerEntries, setChargerEntries] = useState<ChargerEntry[]>(formData.chargers || [{ chargerType: '', chargerCount: '' }]);  
    // const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    useEffect(() => {
        const loadChargerTypes = async () => {
            const chargers = await fetchChargerTypes();
            setChargerTypes(chargers);
        };

        loadChargerTypes();
        validateForm();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number | null = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            const newEntries = [...chargerEntries];
            const name = e.target.name as keyof ChargerEntry;
            newEntries[index][name] = e.target.value;
            setChargerEntries(newEntries);
        } else {
            setLocalFormData({ ...localFormData, [e.target.name]: e.target.value });
            validateInput(e.target.name, e.target.value);
            //   setErrors({ ...errors, [name]: validationError });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalFormData({ ...localFormData, [name]: value });
        validateInput(name, value);
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFormData({ ...localFormData, [name]: value });
        validateInput(name, value);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        validateInput(e.target.name, e.target.value);
    };

    const validateInput = (name: string, value: string) => {
        switch (name) {
            case 'numVehicles':
                return validateNumVehicles(value);
            case 'milesDrivenPerDay':
                return validateMilesDrivenPerDay(value);
            case 'batterySize':
                return validateBatterySize(value);
            case 'vehicleEfficiency':
                return validateVehicleEfficiency(value);
            case 'chargingHoursPerDay':
                return validateChargingHoursPerDay(value);
            case 'chargingDaysPerWeek':
                return validateChargingDaysPerWeek(value);
            default:
                return 'Please fill in missing fields';
        }
    };

    //   const validateForm = () => {
    //     const newErrors: { [key: string]: string } = {};
    //     Object.keys(formData).forEach((key) => {
    //       const value = localFormData[key as keyof FormInputs];
    //       const error = validateInput(key, value);
    //       if (error) {
    //         newErrors[key] = error;
    //       }
    //     });

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    //   };

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};
        Object.keys(formData).forEach((key) => {
            const value = localFormData[key as keyof FormInputs];

            if (typeof value === 'string') {
                const error = validateInput(key, value);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [localFormData, formData]);

    const handleChargerEntryChange = (index: number, field: keyof ChargerEntry, value: string) => {
        const newEntries = [...chargerEntries];
        newEntries[index][field] = value;
        setChargerEntries(newEntries);
        setLocalFormData({ ...localFormData, chargerEntries: newEntries });
    };

    const addCharger = () => {
        setChargerEntries([...chargerEntries, { chargerType: '', chargerCount: '' }]);
    };

    const removeCharger = (index: number) => {
        const newEntries = chargerEntries.filter((_, i) => i !== index);
        setChargerEntries(newEntries);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const payload = {
            ...localFormData,
            chargers: chargerEntries
        }
        try {
            const results = await postResults(payload);
            router.push({
                pathname: '/Results', // Ensure the route matches the file name case
                query: { data: JSON.stringify(results), formData: JSON.stringify(payload) }
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
            {/* <FsHeader>EV Cost Calculator</FsHeader> */}
            <div onSubmit={handleSubmit}>
                <Fieldset2>
                    <FsTitle className="fs-title">Vehicle Selection</FsTitle>
                    <StyledTextField2
                        type="number"
                        name="numVehicles"
                        label="Number of Vehicles"
                        required
                        value={localFormData.numVehicles}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.numVehicles && <p style={{ color: 'red' }}>{errors.numVehicles}</p>}
                    <StyledTextField2
                        type="number"
                        name="milesDrivenPerDay"
                        label="Miles Driven Per Day"
                        required
                        value={localFormData.milesDrivenPerDay}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.milesDrivenPerDay && <p style={{ color: 'red' }}>{errors.milesDrivenPerDay}</p>}
                    <StyledTextField2
                        type="number"
                        name="batterySize"
                        label="Vehicle Battery Size"
                        required
                        value={localFormData.batterySize}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.batterySize && <p style={{ color: 'red' }}>{errors.batterySize}</p>}
                    <StyledTextField2
                        type="number"
                        name="vehicleEfficiency"
                        label="Vehicle Efficiency"
                        required
                        value={localFormData.vehicleEfficiency}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.vehicleEfficiency && <p style={{ color: 'red' }}>{errors.vehicleEfficiency}</p>}
                    <FsTitle className="fs-title">Charging Behavior</FsTitle>
                    <StyledTextField2
                        type="number"
                        name="chargingHoursPerDay"
                        // min="1"
                        // max="24"
                        label="Charging Hours Per Day"
                        required
                        value={localFormData.chargingHoursPerDay}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.chargingHoursPerDay && <p style={{ color: 'red' }}>{errors.chargingHoursPerDay}</p>}
                    <StyledTextField2
                        type="number"
                        name="chargingDaysPerWeek"
                        // min="1"
                        // max="7"
                        label="Charging Days Per Week"
                        required
                        value={localFormData.chargingDaysPerWeek}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.chargingDaysPerWeek && <p style={{ color: 'red' }}>{errors.chargingDaysPerWeek}</p>}

                    <FsTitle className="fs-title">Charger Selection</FsTitle>
                    <ChargerSelectionContainer className="charger-selection-container" id="charger-container">
                        {localFormData.chargerEntries?.map((chargerEntries, index) => (
                            <div key={index} className="charger-entry">
                                <Select name="chargerType" onChange={e => handleChange(e, index)} value={chargerEntries.chargerType}>
                                    <option value="" disabled>-- Select Charger Type --</option>
                                    {chargerTypes.map((charger) => (
                                        <option key={charger.charger_type_id} value={charger.charger_type_id}>
                                            {charger.type} - {charger.rating_kW} kW
                                        </option>
                                    ))}
                                </Select>
                                <StyledTextField2 type="number" name="chargerCount" label="Count of Charger" required value={chargerEntries.chargerCount} onChange={e => handleChargerEntryChange(index, 'chargerCount', e.target.value)} />
                                {localFormData.chargerEntries.length > 1 && (
                                    <RemoveButton type="button" className='remove-button' onClick={() => removeCharger(index)}>Remove</RemoveButton>
                                )}
                            </div>
                        ))}
                    </ChargerSelectionContainer>
                    <SecondaryButton type="button" className='secondary-button' onClick={addCharger}>Add Another Charger</SecondaryButton>
                    <br></br>

                    <FsTitle className="fs-title">Time of Year</FsTitle>
                    <Select name="season" value={localFormData.season} onChange={handleChange}>
                        <option value="" disabled>-- Select Time of Year --</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter (March and April)">Winter (March and April)</option>
                        <option value="Winter (excluding March and April)">Winter (excluding March and April)</option>
                    </Select>
                    <Select name="timeOfDay" value={localFormData.timeOfDay} onChange={handleChange}>
                        <option value="" disabled>-- Select Charging Time of Day --</option>
                        <option value="SOP">Super Off-Peak</option>
                        <option value="Off-Peak">Off-Peak</option>
                        <option value="On-Peak">On-Peak</option>
                    </Select>
                    <ActionButton type="submit" onClick={handleSubmit}>Calculate</ActionButton>
                    {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
                </Fieldset2>
            </div>
        </div>
    );
};

export default SecondaryForm;