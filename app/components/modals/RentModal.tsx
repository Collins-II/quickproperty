'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import dynamic from 'next/dynamic'
import { useRouter } from "next-nprogress-bar";
import { useEffect, useMemo, useState } from "react";

import useRentModal from '@/app/hooks/useRentModal';

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import { categories, listingCategories, listingTypes } from '../navbar/Categories';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import Heading from '../Heading';
import { useSession } from 'next-auth/react';
import CountInput from '../inputs/CountInput';
import { Range } from 'react-date-range';
import BookingSlot from '../inputs/CountInput';
import AddressSelect, { AddressSelectValue } from '../inputs/AddressSelect';
import { AMENITIES_LIST, District, Province, Town, provinces, provincesNames } from '@/app/data';
import PlacesHome from '../places';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PROPERTY = 5,
  COUNT = 6,
  PRICE = 7,
}

const initialDateRange = {
  startCountDate: new Date(),
  endCountDate: new Date(),
};
const initialRange = {
  startDate: new Date(),
  endDate: new Date(),
};

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const { data: session } = useSession();
  const user = session?.user

  const [location, setLocation] = useState<CountrySelectValue>();
  //const [compound, setCompound] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProvince, setFilteredProvince] = useState<Province[]>([]);
  const [filteredDistrict, setFilteredDistrict] = useState<District[]>([]);
  const [filteredTown, setFilteredTown] = useState<Town[]>([]);

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(listingCategories);
  const [selectedProvinceValue, setSelectedProvinceValue] = useState<AddressSelectValue | undefined>(undefined);
  const [selectedDistrictValue, setSelectedDistrictValue] = useState<AddressSelectValue | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState<AddressSelectValue | undefined>(undefined);

  const filterProvince = (filtertext: string) => {
    const province = provinces?.filter(
      (item: any) => {
        return filtertext === item.name
      }
    );
    province && setFilteredProvince(province);
    province && setFilteredDistrict(province[0]?.districts)
  };

  const filterDistrict = (filtertext: string) => {
    const district = filteredDistrict?.filter(
      (item: any) => {
        return filtertext === item.name
      }
    );
    district && setFilteredTown(district[0].compounds);
  };



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
    control,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      startCountDate: '',
      endCountDate: '',
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
      amenities: AMENITIES_LIST.reduce((acc, amenity) => {
        acc[amenity] = false;
        return acc;
      }, {} as { [key: string]: boolean }),
    }
  });

  const category = watch('category');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const province = watch('province');
  const district = watch('district');
  const compound = watch('compound');
  const property_type = watch('property_type');
  const images = watch('imageSrc');

  const [imageSrc, setImageSrc] = useState<string[]>([]);

  const setCustomImgValue = (key: string, value: string[]) => {
    // Handle setting the custom value for the key.
    // For example, you might update the form state here.
    if (key === 'imageSrc') {
      setValue(key, value);
    }
  };

  /*const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
  }), [location]);*/


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

  const handleProvinceChange = (value: AddressSelectValue) => {
    setSelectedProvinceValue(value);
    filterProvince(value.label)
    setCustomValue('province', value.label)
  };

  const handleDistrictChange = (value: AddressSelectValue) => {
    setSelectedDistrictValue(value);
    filterDistrict(value.label)
    setCustomValue('district', value.label)
  };

  const handleChange = (value: AddressSelectValue) => {
    setSelectedValue(value);
    setCustomValue('compound', value.label)
  };


  useEffect(() => {
    setCustomValue('province', location?.label)
    setCustomValue('district', location?.label)
  }, [location])

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    // Convert the amenities object to an array of selected amenities
    const selectedAmenities = Object.entries(data.amenities)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);
    console.log("LISTED_AMENITIES", selectedAmenities)

    setIsLoading(true);

    axios.post('/api/listings', { ...data, amenities: selectedAmenities, email: user?.email, user: user })
      .then((res) => {
        toast.success('Listing created!');
        router.push(`/properties/${res.data._id}`)
        router.refresh();
        reset();
        // setStep(STEPS.CATEGORY)
        rentModal.onClose();
      })
      .catch((err) => {
        console.log("ERR", err)
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create'
    }

    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Back'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
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
  )

  if (step === STEPS.PROPERTY) {
    bodyContent = (
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
              className="flex flex-row justify-center w-full px-2 py-2 bg-slate-900 font-semibold text-sm md:text-md text-white rounded-full cursor-pointer"
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
    )
  }

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where do you wanna go?"
          subtitle="Find the perfect location!"
        />
        <PlacesHome setLocation={setLocation} />
        {location && (
          <div className='px-3'>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="compound">
              Enter compound
            </label>
            <div className="w-full relative">

              <input
                id="compound"
                placeholder="Enter compound"
                type="text"
                className={`
             peer
             w-full
             p-4
             pt-6 
             font-light 
             bg-white 
             border-2
             rounded-md
             outline-none
             transition
             disabled:opacity-70
             disabled:cursor-not-allowed
           
           `}
                onChange={(e) => setCustomValue('compound', e.target.value)}
              />

            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share basic details about your property"
          subtitle="What amenities do you have?"
        />
        <div className='grid 
            grid-cols-1 
            sm:grid-cols-1 
            md:grid-cols-2
            lg:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-8 '>
          {AMENITIES_LIST.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <Controller
                name={`amenities.${amenity}`}
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id={amenity}
                    checked={field.value}
                    onChange={field.onChange}
                    ref={field.ref}
                    className="mr-2"
                  />
                )}
              />
              <label htmlFor={amenity} className="text-gray-700">
                {amenity}
              </label>
            </div>
          ))}
        </div>
        <hr />
        {category === "Booking" && (
          <>
            <Counter
              onChange={(value) => setCustomValue('guestCount', value)}
              value={guestCount}
              title="Guests"
              subtitle="How many guests do you allow?"
            />
            <hr />
            <Counter
              onChange={(value) => setCustomValue('bathroomCount', value)}
              value={bathroomCount}
              title="Bathrooms"
              subtitle="How many bathrooms do you have?"
            />
            <hr />
          </>
        )}
        <Counter
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you have?"
        />

      </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomImgValue('imageSrc', value)}
          value={images}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
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
    )
  }

  if (category === "Booking" && step === STEPS.COUNT) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <BookingSlot onBookingChange={handleBookingChange} />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
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
    )
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="List your home!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
}

export default RentModal;
