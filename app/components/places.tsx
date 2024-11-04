'use client';

import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Map from '../components/Map';
import { getDistricts, getProvinces, getTowns } from '../lib/utils';
import { ICity, IState } from 'countries-states-cities';
import CountrySelect, { CountrySelectValue } from './inputs/CountrySelect';
import Input from './inputs/Input';

interface LocationProps {
    setLocation: Dispatch<SetStateAction<CountrySelectValue | undefined>>;
}

const PlacesHome = ({ setLocation }: LocationProps) => {
    const [provinces, setProvinces] = useState<IState[]>([]);
    const [districts, setDistricts] = useState<ICity[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<CountrySelectValue | undefined>(undefined);
    const [selectedDistrict, setSelectedDistrict] = useState<CountrySelectValue | undefined>(undefined);

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

    const handleProvinceChange = (value: CountrySelectValue | undefined) => {
        setSelectedProvince(value);
        setSelectedDistrict(undefined); // Reset selected district when province changes
    };

    const handleDistrictChange = (value: CountrySelectValue | undefined) => {
        setSelectedDistrict(value);
        setLocation(value)
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
                        //latlng: [province.latitude, province.longitude],
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
            {selectedDistrict && selectedDistrict.latlng && (
                <div className='flex flex-col gap-2'>
                    <Map center={[Number(selectedDistrict.latlng[0]), Number(selectedDistrict.latlng[1])]} />

                </div>
            )}
        </div>
    );
};

export default PlacesHome;
