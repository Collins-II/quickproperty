'use client';

import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Map from '../components/Map';
import { getDistricts, getProvinces, getTowns } from '../lib/utils';
import { ICity, IState,ICountry } from 'countries-states-cities';
import CountrySelect, { CountrySelectValue } from './inputs/CountrySelect';
import { Town, provincesArr } from '../data';
import CompoundSelect from './inputs/CompoundSelect';

interface LocationProps {
    setLocation: Dispatch<SetStateAction<CountrySelectValue | undefined>>;
    setSelectedCompound: Dispatch<SetStateAction<string | undefined>>;
}

const PlacesHome = ({ setLocation,setSelectedCompound }: LocationProps) => {
    const [provinces, setProvinces] = useState<IState[]>([]);
    const [districts, setDistricts] = useState<ICity[]>([]);
    const [subCompounds, setSubCompounds] = useState<Town[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<CountrySelectValue | undefined>(undefined);
    const [selectedDistrict, setSelectedDistrict] = useState<CountrySelectValue | undefined>(undefined);
    const [selectedSubCompound, setSelectedSubCompound] = useState<CountrySelectValue | undefined>(undefined);

    useEffect(() => {
        const fetchProvinces = async () => {
            const data = getProvinces();
            setProvinces(data);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                const province = provinces.find(p => p.name === selectedProvince.label);
                if (province) {
                    const data = getDistricts(province.id);
                    setDistricts(data);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince, provinces]);

    useEffect(() => {
        if (selectedDistrict) {
            const fetchSubCompounds = () => {
                // Ensure we loop through all provinces
                for (const province of provincesArr) {
                    const district = province.districts.find(
                        (d) => d.name.toLowerCase() === selectedDistrict.label.toLowerCase()
                    );
    
                    if (district) {
                        setSubCompounds(district.compounds || []);
                        return;
                    }
                }
    
                // If no match is found, reset to an empty array
                setSubCompounds([]);
            };
    
            fetchSubCompounds();
        } else {
            setSubCompounds([]); // Clear compounds if no district is selected
        }
    }, [selectedDistrict, provincesArr]);
    

    const handleProvinceChange = (value: CountrySelectValue | undefined) => {
        setSelectedProvince(value);
        setSelectedDistrict(undefined); // Reset selected district when province changes
        setSelectedSubCompound(undefined); // Reset sub-compounds when province changes
    };

    const handleDistrictChange = (value: CountrySelectValue | undefined) => {
        setSelectedDistrict(value);
        setSelectedSubCompound(undefined); // Reset sub-compounds when district changes
        setLocation(value);
    };

    const handleSubCompoundChange = (value: CountrySelectValue | undefined) => {
        setSelectedCompound(value?.label as string);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                    Select Province
                </label>
                <CountrySelect
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    options={provinces.map(province => ({
                        value: province.name,
                        label: province.name,
                        region: 'Zambia',
                        flag: '🇿🇲' // Example flag
                    }))}
                />
            </div>
            {selectedProvince && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">
                        Select District
                    </label>
                    <CountrySelect
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        options={districts.map(district => ({
                            value: district.name,
                            label: district.name,
                            latlng: [district.latitude, district.longitude],
                            region: 'Zambia',
                            flag: '🇿🇲' // Example flag
                        }))}
                    />
                </div>
            )}
            {selectedDistrict && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-compound">
                        Select Sub-Compound
                    </label>
                    <CompoundSelect
                        value={selectedSubCompound}
                        onChange={handleSubCompoundChange}
                        options={subCompounds.map(subCompound => ({
                            value: subCompound.name,
                            label: subCompound.name,
                            region: 'Zambia',
                            flag: '🇿🇲' // Example flag
                        }))}
                    />
                </div>
            )}
            {selectedDistrict && selectedDistrict.latlng && selectedSubCompound && (
                <div className="flex flex-col gap-2">
                    <Map center={[Number(selectedDistrict.latlng[0]), Number(selectedDistrict.latlng[1])]} />
                </div>
            )}
        </div>
    );
};

export default PlacesHome;
