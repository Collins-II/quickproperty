import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
import LoginModal from '@/app/components/modals/LoginModal';
import RegisterModal from '@/app/components/modals/RegisterModal';
import SearchModal from '@/app/components/modals/SearchModal';
import RentModal from '@/app/components/modals/RentModal';

import ToasterProvider from '@/app/providers/ToasterProvider';

import './globals.css'
import ClientOnly from './components/ClientOnly';
import getCurrentUser from './actions/getCurrentUser';
import Provider from './lib/providers/session-provider';
import { ReactNode } from 'react';
import ChatModal from './components/modals/ChatModal';
import ReservationModal from './components/modals/ReservationModal';

import { Metadata } from 'next';
import LoadingProvider from './components/modals/Loader';
import SuggestionModal from './components/modals/SuggestionModal';
import SuggestionBox from './components/SuggestionBox';
import { PropertyProvider } from './context/PropertyContext';
import { RescheduleProvider } from './context/RescheduleContext';
import { ViewReserveProvider } from './context/ViewReserveContext';

export const metadata: Metadata = {
  title: 'Homes.Com',
  description: 'Sale And Rent Estates, Farms, Houses, etc..',
  icons: {
    icon: '/images/logo1.png',
  },
};

const font = Nunito({
  subsets: ['latin'],
});

interface LayoutProps {
  children: ReactNode;
  session: never;
}

const RootLayout: React.FC<LayoutProps> = ({ children, session }) => {
  //const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <Provider session={session as never}>
          <PropertyProvider>
          <RescheduleProvider>
          <ViewReserveProvider>
            <LoadingProvider>
              <ClientOnly>
                <ToasterProvider />
                <LoginModal />
                <RegisterModal />
                <SearchModal />
                <ReservationModal />
                <ChatModal />
                <RentModal />
                <SuggestionModal />
                <SuggestionBox />
                <Navbar currentUser={null} />
              </ClientOnly>
              <div className="pb-20 pt-28 showed-scroll-bar">
                {children}
              </div>
            </LoadingProvider>
            </ViewReserveProvider>
            </RescheduleProvider >
          </PropertyProvider>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout