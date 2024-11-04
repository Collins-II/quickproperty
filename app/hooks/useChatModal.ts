import { create } from 'zustand';

interface ChatModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useChatModal = create<ChatModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));


export default useChatModal;
