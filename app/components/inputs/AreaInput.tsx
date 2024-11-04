'use client';

export const costRanges = [
  {
    label: 'Low Cost',
    path: "Low",
    description: 'This property is listed for low cost areas!',
  },
  {
    label: 'Medium Cost',
    path: "Medium",
    description: 'This property is listed for medium cost areas!',
  },
  {
    label: 'High Cost',
    path: "High",
    description: 'This property is listed for high cost areas!'
  },
]

interface AreaInputProps {
  label: string;
  path: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const AreaInput: React.FC<AreaInputProps> = ({
  label,
  path,
  selected,
  onClick
}) => {
  return (
    <div
      onClick={() => onClick(path)}
      className={`
        rounded-xl
        border-2
        p-4
        flex
        flex-col
        gap-3
        hover:border-black
        transition
        cursor-pointer
        ${selected ? 'border-black' : 'border-neutral-200'}
      `}
    >
      <div className="font-semibold">
        {label}
      </div>
    </div>
  );
}

export default AreaInput;