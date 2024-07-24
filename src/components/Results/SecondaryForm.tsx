import React, { useState, useEffect, ChangeEvent, FocusEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchChargerTypes, postResults } from '../../app/api';
import ChargingSchedule from './ChargingSchedule';
import { fetchTimeOfUseRates } from '../../app/api';
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
    chargingDaysPerWeek: string;
    season: string;
    timeOfDay: string;
    chargerEntries: ChargerEntry[];
    selectedHours: number[];
};

const defaultFormInputs: FormInputs = {
    numVehicles: '',
    milesDrivenPerDay: '',
    batterySize: '',
    vehicleEfficiency: '',
    chargingDaysPerWeek: '',
    season: '',
    timeOfDay: '',
    chargerEntries: [{ chargerType: '', chargerCount: '' }],
    selectedHours: []
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
    const [localFormData, setLocalFormData] = useState<FormInputs>(defaultFormInputs);
    const [timeOfUseRates, setTimeOfUseRates] = useState<any>(null);
    const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);


    useEffect(() => {
        const fetchFormData = async () => {
            const { formData } = router.query;
            if (formData) {
                const parsedFormData = JSON.parse(formData as string);
                setLocalFormData(parsedFormData);
            }
        };

        const loadTimeOfUseRates = async () => {
            try {
                const rates = await fetchTimeOfUseRates();
                setTimeOfUseRates(rates);
            } catch (error) {
                console.error('Error fetching time of use rates:', error);
            }
        };

        const loadChargerTypes = async () => {
            try {
                const types = await fetchChargerTypes();
                setChargerTypes(types);
            } catch (error) {
                console.error('Error fetching charger types:', error);
            }
        };

        fetchFormData();
        loadTimeOfUseRates();
        loadChargerTypes();
    }, [router.query]);

    const handleHoursSelected = (hours: number[]) => {
        setLocalFormData(prevData => ({
            ...prevData,
            selectedHours: hours
        }));
    };

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

    const validateChargingDaysPerWeek = (value: string) => {
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 7) {
            return 'Work days per week must be between 1 and 7.';
        }
        return '';
    };


    const [chargerEntries, setChargerEntries] = useState<ChargerEntry[]>(localFormData.chargerEntries || [{ chargerType: '', chargerCount: '' }]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadChargerTypes = async () => {
            const chargers = await fetchChargerTypes();
            setChargerTypes(chargers);
        };

        loadChargerTypes();
        // validateForm();
    }, []);

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        validateInput(e.target.name, e.target.value);
    };

    const validateInput = (field: string, value: any): string | null => {
        if (field === 'numVehicles' && (!value || value <= 0)) {
            return 'Number of vehicles is required';
        }
        if (field === 'milesDrivenPerDay' && (!value || value <= 0)) {
            return 'Miles driven per day is required';
        }
        if (field === 'batterySize' && (!value || value <= 0)) {
            return 'Battery size is required';
        }
        if (field === 'vehicleEfficiency' && (!value || value <= 0)) {
            return 'Vehicle efficiency is required';
        }
        if (field === 'chargingDaysPerWeek' && (!value || value <= 0)) {
            return 'Charging days per week is required';
        }
        if (field === 'chargerType' && !value) {
            return 'Charger type is required';
        }
        if (field === 'chargerCount' && (!value || value <= 0)) {
            return 'Charger count is required and must be greater than 0';
        }
        return null;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Validate all main form fields
        Object.keys(localFormData).forEach((key) => {
            if (key !== 'chargerEntries') { // Skip chargerEntries for now
                const value = localFormData[key as keyof FormInputs];
                const error = validateInput(key, value);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });

        // Validate each charger entry
        localFormData.chargerEntries.forEach((entry, index) => {
            const entryErrors: { [key: string]: string } = {};

            Object.keys(entry).forEach((field) => {
                const value = entry[field as keyof ChargerEntry];
                const error = validateInput(field, value);
                if (error) {
                    entryErrors[`${field}-${index}`] = error;
                }
            });

            // Merge entryErrors into newErrors
            Object.assign(newErrors, entryErrors);
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChargerEntryChange = (index: number, field: keyof ChargerEntry, value: string) => {
        const newEntries = [...localFormData.chargerEntries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        setLocalFormData({ ...localFormData, chargerEntries: newEntries });
    };

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

    const addCharger = () => {
        setLocalFormData({
            ...localFormData,
            chargerEntries: [...formData.chargerEntries, { chargerType: '', chargerCount: '' }],
        });
    };

    const addChargerEntry = () => {
        setLocalFormData(prevData => ({
            ...prevData,
            chargerEntries: [...prevData.chargerEntries, { chargerType: '', chargerCount: '' }]
        }));
    };

    const removeChargerEntry = (index: number) => {
        const newEntries = localFormData.chargerEntries.filter((_, i) => i !== index);
        setLocalFormData({ ...localFormData, chargerEntries: newEntries });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submit button clicked');
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        const payload = {
            ...localFormData,
            chargers: localFormData.chargerEntries
        };

        console.log('Submitting payload:', payload);

        try {
            setLoading(true);
            const results = await postResults(payload);
            console.log('Received results:', results); // Debug log
            const queryParams = new URLSearchParams({
                data: JSON.stringify(results),
                localFormData: JSON.stringify(payload)
            }).toString();
            router.push(`/Results?${queryParams}`);
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
                        name="chargingDaysPerWeek"
                        // min="1"
                        // max="7"
                        label="Working Days Per Week"
                        required
                        value={localFormData.chargingDaysPerWeek}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {errors.chargingDaysPerWeek && <p style={{ color: 'red' }}>{errors.chargingDaysPerWeek}</p>}

                    <FsTitle className="fs-title">Charger Selection</FsTitle>
                    <ChargerSelectionContainer className="charger-selection-container" id="charger-container">
                        <FsTitle className="fs-title">Charger Selection</FsTitle>
                        {localFormData.chargerEntries.map((entry, index) => (
                            <div key={index} className="charger-entry">
                                <Select
                                    name="chargerType"
                                    value={entry.chargerType}
                                    onChange={(e) => handleChargerEntryChange(index, 'chargerType', e.target.value)}
                                >
                                    <option value="" disabled>-- Select Charger Type --</option>
                                    {chargerTypes.map((charger) => (
                                        <option key={charger.charger_type_id} value={charger.charger_type_id}>
                                            {charger.type} - {charger.rating_kW} kW
                                        </option>
                                    ))}
                                </Select>
                                <StyledTextField2
                                    type="number"
                                    name="chargerCount"
                                    label="Count of Charger"
                                    required
                                    value={entry.chargerCount}
                                    onChange={(e) => handleChargerEntryChange(index, 'chargerCount', e.target.value)}
                                />
                                {localFormData.chargerEntries.length > 1 && (
                                    <RemoveButton
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removeChargerEntry(index)}
                                    >
                                        Remove
                                    </RemoveButton>
                                )}
                            </div>
                        ))}
                        <SecondaryButton type="button" onClick={addChargerEntry}>
                            Add Charger
                        </SecondaryButton>
                    </ChargerSelectionContainer>
                    <SecondaryButton type="button" className='secondary-button' onClick={addCharger}>Add Another Charger</SecondaryButton>
                    <br></br>
                    <div className="SecondaryForm">
                        <ChargingSchedule
                            timeOfUseRates={timeOfUseRates}
                            season="Summer"
                            dayType="Weekday"
                            onHoursSelected={handleHoursSelected}
                        />
                    </div>
                    <ActionButton type="submit" onClick={handleSubmit}>Calculate</ActionButton>
                    {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
                </Fieldset2>
            </div>
        </div>
    );
};

export default SecondaryForm;