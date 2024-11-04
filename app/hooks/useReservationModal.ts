import { create } from 'zustand';
import { CreateUserParams } from '../types';
import { IListing } from '../lib/database/models/listing.model';

interface ReservationModalStore {
  isOpen: boolean;
  propertyUserId: string,
  listingId: string,
  price: number,
  onOpen: () => void;
  onClose: () => void;
}

const useReservationModal = create<ReservationModalStore>((set) => ({
  isOpen: false,
  propertyUserId: '',
  listingId: "",
  price: 1,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useReservationModal;
