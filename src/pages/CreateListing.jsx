import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Spinner from '../components/Spinner';
import RadioGroup from '../components/RadioGroup';

const defaultValues = {
  type: 'rent',
  name: '',
  bedrooms: 1,
  bathrooms: 1,
  parking: false,
  furnished: false,
  address: '',
  offer: false,
  regularPrice: 0,
  discountedPrice: 0,
  images: {},
  latitude: '',
  longitude: '',
};

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  //const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  //const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues,
  });

  const watchType = watch('type');
  const watchOffer = watch('offer');

  useEffect(() => {
    if (watchOffer) {
      register('discountedPrice');
    } else {
      unregister('discountedPrice');
    }
    if (!geolocationEnabled) {
      register('longitude');
      register('latitude');
    } else {
      unregister('longitude');
      unregister('latitude');
    }
  }, [register, unregister, watchOffer, geolocationEnabled]);

  const onSubmit = (data) => {
    console.log(data);
    //setFormData({ ...data, userRef: currentUser.uid });
  };

  //console.log(formData);
  const formInputs = {
    name: {
      required: 'The name field is required',
      minLength: {
        value: 10,
        message: 'Name must have at least 10 characters',
      },
      maxLength: { value: 32, message: 'Max length 32 characters' },
    },
    bedrooms: {
      required: true,
      valueAsNumber: true,
      min: {
        value: 1,
        message: 'Minimum 1',
      },
      max: {
        value: 50,
        message: 'Maximum 50',
      },
    },
    bathrooms: {
      required: true,
      valueAsNumber: true,
      min: {
        value: 1,
        message: 'Minimum 1',
      },
      max: {
        value: 50,
        message: 'Maximum 50',
      },
    },
    address: {
      required: 'Please enter address',
    },
    longitude: { valueAsNumber: true },
    latitude: { valueAsNumber: true },
    regularPrice: {
      valueAsNumber: true,
      required: 'Please enter price',
      min: { value: 50, message: 'Min price is 50' },
      max: { value: 750000000, message: 'Max price is 750000000' },
    },
    discountedPrice: {
      valueAsNumber: true,
      min: { value: 50, message: 'Min price is 50' },
      max: { value: 750000000, message: 'Max price is 750000000' },
    },

    images: {
      required: 'Images are required',
      max: 6,
      multiple: true,
      accept: '.jpg,.png,.jpeg',
    },
  };

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="formLabel">Sell / Rent</label>
          <div className="radioButtons">
            <input
              type="radio"
              value="sale"
              label="Sell"
              {...register('type')}
            />

            <input
              type="radio"
              value="rent"
              label="Rent"
              {...register('type')}
            />
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            {...register('name', formInputs.name)}
          />
          <small className="textDanger">
            {errors?.name && errors.name.message}
          </small>

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputNumber"
                type="number"
                {...register('bedrooms', formInputs.bedrooms)}
              />
              <small className="textDanger">
                {errors?.bedrooms && errors.bedrooms.message}
              </small>
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputNumber"
                type="number"
                {...register('bathrooms', formInputs.bathrooms)}
              />
              <small className="textDanger">
                {errors?.bathrooms && errors.bathrooms.message}
              </small>
            </div>
          </div>

          <label className="formLabel">Parking spot</label>

          <div className="radioButtons">
            <RadioGroup control={control} name="parking" />
          </div>

          <label className="formLabel">Furnished</label>
          <div className="radioButtons">
            <RadioGroup control={control} name="furnished" />
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            {...register('address', formInputs.address)}
          />
          <small className="textDanger">
            {errors?.address && errors.address.message}
          </small>

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  placeholder="e.g. 41.20559"
                  {...register('latitude', formInputs.latitude)}
                  required={!geolocationEnabled}
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  placeholder="e.g. -73.15053"
                  {...register('longitude', formInputs.longitude)}
                  required={!geolocationEnabled}
                />
              </div>
            </div>
          )}

          <label className="formLabel">Offer</label>
          <div className="radioButtons">
            <RadioGroup control={control} name="offer" />
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              {...register('regularPrice', formInputs.regularPrice)}
            />
            {watchType === 'rent' && <p className="formPriceText">$ / Month</p>}
          </div>
          <small className="textDanger">
            {errors?.regularPrice && errors.regularPrice.message}
          </small>

          {watchOffer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                {...register('discountedPrice', formInputs.discountedPrice)}
                required={watchOffer}
              />
              <small className="textDanger">
                {errors?.discountedPrice && errors.discountedPrice.message}
              </small>
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            {...register('images', formInputs.images)}
          />
          <small className="textDanger">
            {errors?.images && errors.images.message}
          </small>

          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
