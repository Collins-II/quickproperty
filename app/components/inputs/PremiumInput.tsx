'use client';

import { useCallback, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import { format, differenceInDays } from "date-fns";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface PremiumInputProps {
    onPremiumChange: (startDate: Date | undefined,
        endDate: Date | undefined, duration: number, totalCharge: number) => void;
}

const PremiumInput: React.FC<PremiumInputProps> = ({ onPremiumChange }) => {
    const [selectedRange, setSelectedRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const handleRangeChange = useCallback((item: RangeKeyDict) => {
        setSelectedRange(item.selection);
        if (item.selection.endDate && item.selection.startDate) {
            const duration = (differenceInDays(item.selection.endDate, item.selection.startDate) + 1);
            const totalCharge = duration * 1; // $1 per day
            onPremiumChange(item?.selection?.startDate, item.selection.endDate, duration * 24 * 60, totalCharge);
        }
    }, [onPremiumChange]);

    return (
        <div className="flex flex-col items-center">
            <DateRange
                rangeColors={['#262626']}
                ranges={[selectedRange]}
                onChange={handleRangeChange}
                direction="vertical"
                showDateDisplay={false}
                minDate={new Date()}
            />
            <div className="flex flex-row justify-between items-center w-full px-2">
                <div className="mt-4 font-light text-gray-600">
                    {selectedRange?.startDate && selectedRange.endDate
                        ? `${format(selectedRange.startDate, "yyyy-MM-dd")} - ${format(selectedRange.endDate, "yyyy-MM-dd")}`
                        : ''}
                </div>
                <div className="mt-2 font-medium">
                    {selectedRange?.startDate && selectedRange.endDate
                        ? `${differenceInDays(selectedRange.endDate, selectedRange.startDate) + 1} Day${differenceInDays(selectedRange.endDate, selectedRange.startDate) !== 0 ? 's' : ''}`
                        : ''}
                </div>
                <div className="mt-2 font-medium">
                    {selectedRange?.startDate && selectedRange.endDate
                        ? `Total Charge: $${differenceInDays(selectedRange.endDate, selectedRange.startDate) + 1}`
                        : ''}
                </div>
            </div>
        </div>
    );
};

export default PremiumInput;
