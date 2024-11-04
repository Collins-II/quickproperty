'use client';

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from 'date-fns';

import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

import Container from "@/app/components/Container";
import { categories, listingCategories, listingTypes } from "@/app/components/navbar/Categories";
import { useSession } from "next-auth/react";
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import dynamic from 'next/dynamic'
import useRentModal from '@/app/hooks/useRentModal';

import Modal from "@/app/components/modals/Modal";
import Counter from "@/app/components/inputs/Counter";
import CategoryInput from '@/app/components/inputs/CategoryInput';
import CountrySelect from "@/app/components/inputs/CountrySelect";
import ImageUpload from '@/app/components/inputs/ImageUpload';
import Input from '@/app/components/inputs/Input';
import Heading from '@/app/components/Heading';
import CountInput from '@/app/components/inputs/CountInput';
import BookingSlot from '@/app/components/inputs/CountInput';
import Button from "@/app/components/Button";
import { Actions } from "../components/actions";
import { Checkbox } from "@/app/components/ui/checkbox";
import AreaInput, { costRanges } from "@/app/components/inputs/AreaInput";
import { PremiumActions } from "../components/premium-action";
import PremiumInput from "@/app/components/inputs/PremiumInput";
import PremiumSubscriptionWrapper from "@/app/components/ui/premium-subscription";
import PremiumCard from "@/app/components/ui/premium-card";
import { CiBadgeDollar } from "react-icons/ci";
import { SlBadge } from "react-icons/sl";
import { useConfettiStore } from "@/app/hooks/use-confetti-store";
import PlacesHome from "@/app/components/places";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser
}) => {
  const rentModal = useRentModal();
  const confetti = useConfettiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(listingCategories);

  //const data = filterData(query);
  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return categories?.filter(
      (item: any) =>
        regex.test(item.label)
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredProducts = filterPrompts(query);
    console.log("Filter_Data", filteredProducts)
    setSearchResults(filteredProducts as any);
  };



  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: listing.category,
      location: listing.locationValue,
      startCountDate: listing.bookingStartDate,
      endCountDate: listing.bookingEndDate,
      guestCount: listing.guestCount,
      roomCount: listing.roomCount,
      bathroomCount: listing.bathroomCount,
      imageSrc: listing.imageSrc,
      price: listing.price,
      title: listing.title,
      description: listing.description,
      bookingStartDate: listing.bookingStartDate,
      bookingEndDate: listing.bookingEndDate,
      bookingDuration: listing.bookingDuration,
      bookingTotalCharge: listing.bookingTotalCharge,
      premiumTargetDate: listing.premiumTargetDate
    }
  });

  const location = watch('location');
  const category = watch('category');
  const costRange = watch('costRange');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const bookingDate = watch('bookingDate');
  const bookingDuration = watch('bookingDuration');
  const imageSrc = watch('imageSrc');
  const property_type = watch('property_type')

  const Map = useMemo(() => dynamic(() => import('../../components/Map'), {
    ssr: false
  }), [location]);


  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const handleBookingChange = (startDate: Date | undefined,
    endDate: Date | undefined,
    duration: number,
    totalCharge: number) => {
    // Handle the booking change here, e.g. save the data to the database
    setCustomValue('bookingStartDate', startDate)
    setCustomValue('bookingEndDate', endDate)
    setCustomValue('bookingDuration', duration)
    setCustomValue('bookingTotalCharge', totalCharge)
  };

  const handlePremiumDateChange = (startDate: Date | undefined,
    endDate: Date | undefined,
    duration: number,
    totalCharge: number) => {
    // Handle the booking change here, e.g. save the data to the database
    setCustomValue('premiumTargetDate', endDate)
    setCustomValue('bookingDuration', duration)
    setCustomValue('bookingTotalCharge', totalCharge)
  };

  const handleSubscribe = async (data: { premiumTargetDate: Date }) => {
    try {
      setIsLoading(true);

      if (listing.isPremium) {
        await axios.patch(`/api/properties/${listing._id}/unpremier`, { user, data });
        toast.success("Property premium unlisted succesfully!");
      } else {
        await axios.patch(`/api/properties/${listing._id}/premier`, { user, data });
        toast.success("Property premium listed succesfully!");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Submit_Data", data)
    setIsLoading(true);

    await axios.patch(`/api/listings/${listing._id}`, { ...data, email: user?.email })
      .then(() => {
        toast.success('Listing updated succesfully!');
        router.push("/properties");
        reset();
      })
      .catch((err) => {
        console.log("ERR", err)
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const loginModal = useLoginModal();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  /* const disabledDates = useMemo(() => {
     let dates: Date[] = [];
 
     reservations.forEach((reservation: any) => {
       const range = eachDayOfInterval({
         start: new Date(reservation.startDate),
         end: new Date(reservation.endDate)
       });
 
       dates = [...dates, ...range];
     });
 
     return dates;
   }, [reservations]);*/

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!user) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    axios.post('/api/reservations', {
      user,
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?._id
    })
      .then(() => {
        toast.success('Listing reserved!');
        setDateRange(initialDateRange);
        router.push('/trips');
      })
      .catch(() => {
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
  },
    [
      totalPrice,
      dateRange,
      listing?._id,
      router,
      user,
      loginModal
    ]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
          pt-10
        "
      >
        <div className="flex flex-col gap-6">
          <div className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-row justify-between w-full">
                <Heading
                  title="Add a photo of your place"
                  subtitle="Show guests what your place looks like!"
                />
                <Actions disabled={true} listingId={listing?._id} isReserved={listing.isReserved} />
              </div>

              <ImageUpload
                onChange={(value) => setCustomValue('imageSrc', value)}
                value={imageSrc}
              />
            </div>
          </div>
          <div
            className="
              flex
              flex-col-reverse
              md:flex-row
              gap-10
              w-full
             
            "
          >
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-8">
                <Heading
                  title="How would you describe your place?"
                  subtitle="Short and sweet works best!"
                />
                <Input
                  id="title"
                  label="Title"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <hr />
                <Input
                  id="description"
                  label="Description"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="flex flex-col gap-8">
                <Heading
                  title="Share some basics about your place"
                  subtitle="What amenitis do you have?"
                />
                <Counter
                  onChange={(value) => setCustomValue('guestCount', value)}
                  value={guestCount}
                  title="Guests"
                  subtitle="How many guests do you allow?"
                />
                <hr />
                <Counter
                  onChange={(value) => setCustomValue('roomCount', value)}
                  value={roomCount}
                  title="Rooms"
                  subtitle="How many rooms do you have?"
                />
                <hr />
                <Counter
                  onChange={(value) => setCustomValue('bathroomCount', value)}
                  value={bathroomCount}
                  title="Bathrooms"
                  subtitle="How many bathrooms do you have?"
                />
              </div>
              <div className="flex flex-col gap-8">
                <Heading
                  title="Now, set your price"
                  subtitle="How much do you charge per night?"
                />
                <Input
                  id="price"
                  label="Price"
                  formatPrice
                  type="number"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="flex flex-col gap-8">
                <Heading
                  title="Where is your place located?"
                  subtitle="Help guests find you!"
                />
                {/*<PlacesHome />*/}
              </div>

            </div>
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
                w-full
              "
            >
              <div className="flex flex-col gap-8 mb-8">
                <Heading
                  title="Which of these best describes your place?"
                  subtitle="Pick a listing type"
                />
                <div
                  className="
          grid 
          grid-cols-1 
          md:grid-cols-3 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
                >
                  {listingTypes.map((item) => (
                    <div key={item.label} className="col-span-1">
                      <CategoryInput
                        onClick={(category) =>
                          setCustomValue('category', category)}
                        selected={category === item.label}
                        label={item.label}
                        icon={item.icon}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-8 mb-8">
                <Heading
                  title="Which of these best describes your place?"
                  subtitle="Pick a category"
                />
                <div className='w-full flex flex-col justify-center gap-4 py-5'>
                  <input
                    type="text"
                    placeholder="Search property type"
                    className="w-full px-4 py-2 border-[0.5px] border-slate-300 font-semibold text-sm rounded-full focus:outline-none focus:border-slate-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className='w-full flex items-center justify-center'>
                    <hr className='h-[0.5px] bg-slate-700 w-full' />
                    <div
                      className="flex flex-row justify-center w-full px-2 py-2 bg-slate-900 font-semibold text-sm md:text-md text-white rounded-full"
                      onClick={() => handleSearch(searchQuery)}
                    >
                      <p
                        className="flex justify-center items-center h-full w-full text-white text-xs xs:text-[12px] font-bold rounded-sm"

                      >Search <span className='hidden sm:block ml-2'>results</span></p>
                    </div>
                    <hr className='h-[0.5px] bg-slate-700 w-full' />
                  </div>
                </div>
                <div
                  className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
          showed-scroll-bar
          pb-3
          pr-2
        "
                >

                  {searchResults.map((item) => (
                    <div key={item.label} className="col-span-1">
                      <CategoryInput
                        onClick={(property_type) =>
                          setCustomValue('property_type', property_type)}
                        selected={property_type === item.label}
                        label={item.label}
                        icon={item.icon}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <Heading
                  title="How would you describe your place?"
                  subtitle="Short and sweet works best!"
                />
                <BookingSlot onBookingChange={handleBookingChange} />

              </div>
              <div className="flex flex-col gap-8 mt-8">
                <Heading
                  title="Which of these best describes your place?"
                  subtitle="Pick a listing type"
                />
                <div
                  className="
          grid 
          grid-cols-1 
          md:grid-cols-3 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
                >
                  {costRanges.map((item) => (
                    <div key={item.label} className="col-span-1">
                      <AreaInput
                        onClick={(costRange) =>
                          setCustomValue('costRange', costRange)}
                        selected={costRange === item.path}
                        label={item.label}
                        path={item.path}
                      />
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
          <div className="w-full ">
            <PremiumCard
              title="Premium Property"
              icon={CiBadgeDollar}
              duration="week"
              description="Enjoy exclusive benefits with our premium subscription."
              price={29.99}
              imageUrl={listing.imageSrc[0]} // Replace with your image path
              isPremium={listing.isPremium}
              isLoading={isLoading}
              targetDate={listing.premiumTargetDate}
              onSubscribe={handleSubscribe}
            />
          </div>
          <div className="flex flex-row gap-4">
            <Button
              label={"Cancel"}
              onClick={() => router.push("/properties")}
            />
            <Button
              label={"Save"}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ListingClient;
