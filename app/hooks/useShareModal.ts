import { create } from 'zustand';
import { IListing } from '../lib/database/models/listing.model';
import { SafeListing } from '../types';

interface ShareModalStore {
  isOpen: boolean;
  data?: SafeListing | {
    imageSrc: [],
    property_type: string,
    roomCount: number,
    price: number
  },
  onOpen: () => void;
  onClose: () => void;
}

const useShareModal = create<ShareModalStore>((set) => ({
  isOpen: false,
  data: {
    imageSrc: [],
    property_type: "",
    roomCount: 1,
    price: 1
  },
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useShareModal;
