import React, { useState, useEffect, ChangeEvent, FocusEvent } from 'react';
import { useRouter } from 'next/router';
import FormStepper from '../components/shared/FormStepper';
import { fetchChargerTypes, postResults } from '../app/api';
import {
    Msform,
    Fieldset,
    Input,
    Textarea,
    Select,
    ActionButton,
    SecondaryButton,
    RemoveButton,
    FsHeader,
    FsTitle,
    FsSecondTitle,
    FsSubtitle,
    Progressbar,
    ProgressbarItem,
    ChargerSelectionContainer,
    ChargerEntry,
    Label,
    ErrorMessage,
    StyledTextField,
    InvalidInput,
    DisabledButton,
} from '../styles/myComponentStyles';
import { TextField } from '@mui/material';



// Log the environment variable to ensure it's being picked up
console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

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

const steps = ['Vehicle Selection', 'Charging Behavior', 'Charger Selection', 'Time of Year'];

const MainForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const router = useRouter();
    // const [step, setStep] = useState(1);
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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

    const [chargerEntries, setChargerEntries] = useState<ChargerEntry[]>([{ chargerType: '', chargerCount: '' }]);
    const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


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
                return '';
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        Object.keys(formData).forEach((key) => {
            const value = formData[key as keyof FormData];
            const error = validateInput(key, value);
            if (error) {
                newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addCharger = () => {
        setChargerEntries([...chargerEntries, { chargerType: '', chargerCount: '' }]);
    };

    const removeCharger = (index: number) => {
        const newEntries = chargerEntries.filter((_, i) => i !== index);
        setChargerEntries(newEntries);
    };

    // const nextStep = () => setStep(step + 1);
    // const prevStep = () => setStep(step > 1 ? step - 1 : step);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const payload = {
            ...formData,
            chargers: chargerEntries
        }
        try {
            // const results = await postResults(payload);
            // router.push({
            //   pathname: '/Results', // Ensure the route matches the file name case
            //   query: { data: JSON.stringify(results) }
            // });

            setLoading(true);
            const results = await postResults(payload);
            const queryParams = new URLSearchParams({
                data: JSON.stringify(results),
                formData: JSON.stringify(payload)
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
            <FsHeader>EV Cost Calculator</FsHeader>
            <Msform onSubmit={handleSubmit}>
                <FormStepper steps={steps} activeStep={activeStep} />
                {activeStep === 0 && (
                    <Fieldset>
                        <FsTitle className="fs-title">Vehicle Selection</FsTitle>
                        <StyledTextField type="number" name="numVehicles" label="Number of Vehicles" required value={formData.numVehicles} onChange={handleChange} onBlur={handleBlur} />
                        <StyledTextField type="number" name="milesDrivenPerDay" label="Miles Driven Per Day" required value={formData.milesDrivenPerDay} onChange={handleChange} onBlur={handleBlur} />
                        <StyledTextField type="number" name="batterySize" step="any" label="Vehicle Battery Size" required value={formData.batterySize} onChange={handleChange} onBlur={handleBlur} />
                        <StyledTextField type="number" name="vehicleEfficiency" step="any" label="Vehicle Efficiency" required value={formData.vehicleEfficiency} onChange={handleChange} onBlur={handleBlur} />
                        <ActionButton type="button" className="next action-button" onClick={() => setActiveStep(1)}>Next</ActionButton>
                    </Fieldset>
                )}
                {activeStep === 1 && (
                    <Fieldset>
                        <FsTitle className="fs-title">Charging Behavior</FsTitle>
                        <StyledTextField type="number" name="chargingHoursPerDay" label="Charging Hours Per Day" required value={formData.chargingHoursPerDay} onChange={handleChange} onBlur={handleBlur} />
                        <StyledTextField type="number" name="chargingDaysPerWeek" label="Charging Days Per Week" required value={formData.chargingDaysPerWeek} onChange={handleChange} onBlur={handleBlur} />
                        <ActionButton type="button" className="previous action-button" onClick={() => setActiveStep(0)}>Back</ActionButton>
                        <ActionButton type="button" className="next action-button" onClick={() => setActiveStep(2)}>Next</ActionButton>
                    </Fieldset>
                )}
                {activeStep === 2 && (
                    <Fieldset>
                        <FsTitle className="fs-title">Charger Selection</FsTitle>
                        <ChargerSelectionContainer className="charger-selection-container" id="charger-container">
                            {chargerEntries.map((entry, index) => (
                                <div key={index} className="charger-entry">
                                    <Select name="chargerType" onChange={e => handleChange(e, index)} value={entry.chargerType}>
                                        <option value="" disabled>-- Select Charger Type --</option>
                                        {chargerTypes.map((charger) => (
                                            <option key={charger.charger_type_id} value={charger.charger_type_id}>
                                                {charger.type} - {charger.rating_kW} kW
                                            </option>
                                        ))}
                                    </Select>
                                    <StyledTextField type="number" name="chargerCount" label="Count of Charger" required value={entry.chargerCount} onChange={e => handleChange(e, index)} />
                                    {chargerEntries.length > 1 && (
                                        <RemoveButton type="button" className='remove-button' onClick={() => removeCharger(index)}>Remove</RemoveButton>
                                    )}
                                </div>
                            ))}
                        </ChargerSelectionContainer>
                        <SecondaryButton type="button" className='secondary-button' onClick={addCharger}>Add Another Charger</SecondaryButton>
                        <br></br>
                        <ActionButton type="button" className="previous action-button" onClick={() => setActiveStep(1)}>Back</ActionButton>
                        <ActionButton type="button" className="next action-button" onClick={() => setActiveStep(3)}>Next</ActionButton>
                    </Fieldset>
                )}
                {activeStep === 3 && (
                    <Fieldset>
                        <FsTitle className="fs-title">Time of Year</FsTitle>
                        <Select name="season" value={formData.season} onChange={handleChange}>
                            <option value="" disabled>-- Select Time of Year --</option>
                            <option value="Summer">Summer</option>
                            <option value="Winter (March and April)">Winter (March and April)</option>
                            <option value="Winter (excluding March and April)">Winter (excluding March and April)</option>
                        </Select>
                        <Select name="timeOfDay" value={formData.timeOfDay} onChange={handleChange}>
                            <option value="" disabled>-- Select Charging Time of Day --</option>
                            <option value="SOP">Super Off-Peak</option>
                            <option value="Off-Peak">Off-Peak</option>
                            <option value="On-Peak">On-Peak</option>
                        </Select>
                        <ActionButton type="button" className="previous action-button" onClick={() => setActiveStep(2)}>Back</ActionButton>
                        <ActionButton type="submit" onClick={handleSubmit}>Calculate</ActionButton>
                        {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
                    </Fieldset>
                )}
            </Msform>
        </div>
    );
};

export default MainForm;