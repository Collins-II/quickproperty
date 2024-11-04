'use client';

import React, { useState } from 'react';

interface PricingPackage {
    label: string;
    price: number;
    duration: string; // e.g., "1 month", "3 months", "1 year"
}

interface PricingPackageSelectorProps {
    packages: PricingPackage[];
    selectedPackage: PricingPackage;
    onSelectPackage: (pkg: PricingPackage) => void;
}

const PricingPackageSelector: React.FC<PricingPackageSelectorProps> = ({
    packages,
    selectedPackage,
    onSelectPackage
}) => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Select a Package:</h3>
            <div className="grid grid-cols-1 gap-4">
                {packages.map((pkg) => (
                    <div
                        key={pkg.label}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition duration-300 ${selectedPackage.label === pkg.label
                                ? 'border-rose-500 bg-rose-100'
                                : 'border-gray-300'
                            }`}
                        onClick={() => onSelectPackage(pkg)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-lg font-bold">{pkg.label}</h4>
                                <p className="text-gray-500">{pkg.duration}</p>
                            </div>
                            <div className="text-rose-500 font-bold">ZMW{pkg.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPackageSelector;
