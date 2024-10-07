import { useEffect, useRef, useState } from "react";
import { Modal, Switch, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiRequest } from "./api";
import { useModal } from "../zustand/ModalStore";
import { useIdStore } from "../zustand/IdStore";

export function CarModal({ getApi, data }) {
  // Fetching data
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [modelsData, setModelsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

  // Data id
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [cityId, setCityId] = useState("");

  // Posting data
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [seconds, setSeconds] = useState(null);
  const [maxSpeed, setMaxSpeed] = useState(null);
  const [maxPeople, setMaxPeople] = useState(null);
  const [protection, setProtection] = useState(null);
  const [transmission, setTransmission] = useState("");
  const [motor, setMotor] = useState("");
  const [petrol, setPetrol] = useState("");
  const [limit, setLimit] = useState("");
  const [deposit, setDeposit] = useState("");
  const [driverSide, setDriverSide] = useState("");
  const [priceAed, setPriceAed] = useState("");
  const [priceAedSale, setPriceAedSale] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [priceUsdSale, setPriceUsdSale] = useState("");

  const [inclusive, setInclusive] = useState(false);
  const [firstImg, setFirstImg] = useState(null);
  const [secondImg, setSecondImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const [imgPreview, setImgPreview] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const firstImgRef = useRef(null);
  const secondImgRef = useRef(null);
  const coverImgRef = useRef(null);
  const [errors, setErrors] = useState({});
  const {
    isCreateCarOpen,
    isEditCarOpen,
    closeCreateCarModal,
    closeEditCarModal,
  } = useModal();
  const { carId, setCarId } = useIdStore();

  const item = data.find((el) => el.id === carId);

  async function fetchData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  useEffect(() => {
    const categoriesUrl =
      "https://autoapi.dezinfeksiyatashkent.uz/api/categories";
    const brandsUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/brands";
    const modelsUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/models";
    const locationdUrl =
      "https://autoapi.dezinfeksiyatashkent.uz/api/locations";
    const citiesUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/cities";

    Promise.all([
      fetchData(categoriesUrl),
      fetchData(brandsUrl),
      fetchData(modelsUrl),
      fetchData(locationdUrl),
      fetchData(citiesUrl),
    ])
      .then(
        ([
          categoriesItem,
          brandsItem,
          modelsItem,
          locationsItem,
          citiesItem,
        ]) => {
          setCategoriesData(categoriesItem);
          setModelsData(modelsItem);
          setBrandsData(brandsItem);
          setLocationsData(locationsItem);
          setCitiesData(citiesItem);
          // setLoading(false);
        }
      )
      .catch((error) => {
        // setError(error.message);
        // setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (item) {
      // Set initial values when editing
      setCategoryId(item.category_id || "");
      setBrandId(item.brand_id || "");
      setModelId(item.model_id || "");
      setLocationId(item.location_id || "");
      setCityId(item.city_id || "");

      setColor(item.color || "");
      setYear(item.year || "");
      setSeconds(item.seconds || "");
      setMaxSpeed(item.max_speed || "");
      setMaxPeople(item.max_people || "");
      setProtection(item.premium_protection || "");
      setTransmission(item.transmission || "");
      setMotor(item.motor || "");
      setPetrol(item.petrol || "");
      setLimit(item.limitperday || "");
      setDeposit(item.deposit || "");
      setDriverSide(item.drive_side || "");
      setPriceAed(item.price_in_aed || "");
      setPriceUsd(item.price_in_usd || "");
      setPriceAedSale(item.price_in_aed_sale || "");
      setPriceUsdSale(item.price_in_usd_sale || "");

      setImgPreview(null);
    }
  }, [item]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFirstImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setFirstImg(null);
    setImgPreview(null);
  };

  const formValidation = () => {
    const formErrors = {};

    if (!categoryId) formErrors.categoryId = "Category is required";
    if (!brandId) formErrors.brandId = "Brand is required";
    if (!modelId) formErrors.modelId = "Model is required";
    if (!locationId) formErrors.locationId = "Location is required";
    if (!cityId) formErrors.cityId = "City is required";
    if (!color) formErrors.color = "Color is required";
    if (!year || isNaN(year)) formErrors.year = "Valid year is required";
    if (!seconds || isNaN(seconds))
      formErrors.seconds = "Valid seconds are required";
    if (!maxSpeed || isNaN(maxSpeed))
      formErrors.maxSpeed = "Valid max speed is required";
    if (!maxPeople || isNaN(maxPeople))
      formErrors.maxPeople = "Valid number of people is required";
    if (!protection || isNaN(protection))
      formErrors.protection = "Valid protection price is required";
    if (!transmission) formErrors.transmission = "Transmission is required";
    if (!motor) formErrors.motor = "Motor is required";
    if (!petrol) formErrors.petrol = "Petrol is required";
    if (!limit || isNaN(limit))
      formErrors.limit = "Valid limit per day is required";
    if (!deposit || isNaN(deposit))
      formErrors.deposit = "Valid deposit is required";
    if (!priceAed || isNaN(priceAed))
      formErrors.priceAed = "Valid price in AED is required";
    if (!priceUsd || isNaN(priceUsd))
      formErrors.priceUsd = "Valid price in USD is required";
    if (!priceAedSale || isNaN(priceAedSale))
      formErrors.priceAedSale = "Valid sale price in AED is required";
    if (!priceUsdSale || isNaN(priceUsdSale))
      formErrors.priceUsdSale = "Valid sale price in USD is required";
    if (!firstImg) formErrors.firstImg = "First image is required";
    if (!secondImg) formErrors.secondImg = "Second image is required";
    if (!coverImg) formErrors.coverImg = "Cover image is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const getFormData = () => {
    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("brand_id", brandId);
    formData.append("model_id", modelId);
    formData.append("location_id", locationId);
    formData.append("city_id", cityId);
    formData.append("year", year);
    formData.append("seconds", seconds);
    formData.append("max_speed", maxSpeed);
    formData.append("max_people", maxPeople);
    formData.append("premium_protection", protection);
    formData.append("transmission", transmission);
    formData.append("color", color);
    formData.append("motor", motor);
    formData.append("drive_side", driverSide);
    formData.append("petrol", petrol);
    formData.append("limitperday", limit);
    formData.append("deposit", deposit);
    formData.append("price_in_aed", priceAed);
    formData.append("price_in_usd", priceUsd);
    formData.append("price_in_aed_sale", priceAedSale);
    formData.append("price_in_usd_sale", priceUsdSale);
    formData.append("inclusive", `${inclusive}`);
    formData.append("images", firstImg);
    formData.append("images", secondImg);
    formData.append("cover", coverImg);

    return formData;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = getFormData();

      try {
        await apiRequest("cars", "Post", formData);
        handleCloseModal();
        message.success("Car added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add car");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = getFormData();

      try {
        await apiRequest(`cars/${carId}`, "Put", formData);
        handleCloseModal();
        message.success("Car updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated car");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setImgPreview(null);
    setErrors("");
    closeEditCarModal();
    closeCreateCarModal();
    setCarId("");
  };

  return (
    <div>
      <Modal
        name=""
        open={carId ? isEditCarOpen : isCreateCarOpen}
        onOk={carId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {carId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          <label htmlFor="category">* Category</label>
          <select
            id="category"
            onChange={(e) => setCategoryId(e.target.value)}
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
          >
            {categoriesData?.data?.map((category, i) => (
              <option key={i} value={category.id}>
                {category.name_en}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className="text-red-500 text-sm">{errors.categoryId}</span>
          )}

          <label htmlFor="brand">* Brand</label>
          <select
            id="brand"
            onChange={(e) => setBrandId(e.target.value)}
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
          >
            {brandsData?.data?.map((brand, i) => (
              <option key={i} value={brand.id}>
                {brand.title}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <span className="text-red-500 text-sm">{errors.brandId}</span>
          )}

          <label htmlFor="model">* Model</label>
          <select
            id="model"
            onChange={(e) => setModelId(e.target.value)}
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
          >
            {modelsData?.data?.map((model, i) => (
              <option key={i} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {errors.modelsId && (
            <span className="text-red-500 text-sm">{errors.modelsId}</span>
          )}

          <label htmlFor="location">* Location</label>
          <select
            id="location"
            onChange={(e) => setLocationId(e.target.value)}
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
          >
            {locationsData?.data?.map((location, i) => (
              <option key={i} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errors.locationId && (
            <span className="text-red-500 text-sm">{errors.locationId}</span>
          )}

          <label htmlFor="city">* City</label>
          <select
            id="city"
            onChange={(e) => setCityId(e.target.value)}
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
          >
            {citiesData?.data?.map((city, i) => (
              <option key={i} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.cityId && (
            <span className="text-red-500 text-sm">{errors.cityId}</span>
          )}

          <label htmlFor="color">* Color</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setColor(e.target.value)}
            value={color}
          />
          {errors.color && (
            <span className="text-red-500 text-sm">{errors.color}</span>
          )}

          <label htmlFor="year">* Year</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
          {errors.year && (
            <span className="text-red-500 text-sm">{errors.year}</span>
          )}

          <label htmlFor="seconds">* Seconds</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setSeconds(e.target.value)}
            value={seconds}
          />
          {errors.seconds && (
            <span className="text-red-500 text-sm">{errors.seconds}</span>
          )}

          <label htmlFor="maxSpeed">* Max Speed</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setMaxSpeed(e.target.value)}
            value={maxSpeed}
          />
          {errors.maxSpeed && (
            <span className="text-red-500 text-sm">{errors.maxSpeed}</span>
          )}

          <label htmlFor="maxPeople">* Max People</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setMaxPeople(e.target.value)}
            value={maxPeople}
          />
          {errors.maxPeople && (
            <span className="text-red-500 text-sm">{errors.maxPeople}</span>
          )}

          <label htmlFor="protection">* Premium Protection Price</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setProtection(e.target.value)}
            value={protection}
          />
          {errors.protection && (
            <span className="text-red-500 text-sm">{errors.protection}</span>
          )}

          <label htmlFor="motor">* Motor</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setMotor(e.target.value)}
            value={motor}
          />
          {errors.motor && (
            <span className="text-red-500 text-sm">{errors.motor}</span>
          )}

          <label htmlFor="driverSide">* Driver Side</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setDriverSide(e.target.value)}
            value={driverSide}
          />
          {errors.driverSide && (
            <span className="text-red-500 text-sm">{errors.driverSide}</span>
          )}

          <label htmlFor="limit">* Limit per day</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setLimit(e.target.value)}
            value={limit}
          />
          {errors.limit && (
            <span className="text-red-500 text-sm">{errors.limit}</span>
          )}

          <label htmlFor="deposit">* Deposit</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setDeposit(e.target.value)}
            value={deposit}
          />
          {errors.deposit && (
            <span className="text-red-500 text-sm">{errors.deposit}</span>
          )}

          <label htmlFor="petrol">* Petrol</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setPetrol(e.target.value)}
            value={petrol}
          />
          {errors.petrol && (
            <span className="text-red-500 text-sm">{errors.petrol}</span>
          )}

          <label htmlFor="priceAed">* Price AED</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setPriceAed(e.target.value)}
            value={priceAed}
          />
          {errors.priceAed && (
            <span className="text-red-500 text-sm">{errors.priceAed}</span>
          )}

          <label htmlFor="priceUsd">* Price USD</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setPriceUsd(e.target.value)}
            value={priceUsd}
          />
          {errors.priceUsd && (
            <span className="text-red-500 text-sm">{errors.priceUsd}</span>
          )}

          <label htmlFor="priceAedSale">* Price AED Sale</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setPriceAedSale(e.target.value)}
            value={priceAedSale}
          />
          {errors.priceAedSale && (
            <span className="text-red-500 text-sm">{errors.priceAedSale}</span>
          )}

          <label htmlFor="priceUsdSale">* Price Usd Sale</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setPriceUsdSale(e.target.value)}
            value={priceUsdSale}
          />
          {errors.priceUsdSale && (
            <span className="text-red-500 text-sm">{errors.priceUsdSale}</span>
          )}

          <label htmlFor="transmission">* Transmission</label>
          <input
            type="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTransmission(e.target.value)}
            value={transmission}
          />
          {errors.transmission && (
            <span className="text-red-500 text-sm">{errors.transmission}</span>
          )}

          <label htmlFor="inclusive">Inclusive</label>
          <Switch onChange={(e) => setInclusive(e)} className="w-16" />
          {errors.inclusive && (
            <span className="text-red-500 text-sm">{errors.inclusive}</span>
          )}

          {/* First Image Upload */}
          <label htmlFor="firstImg">* Upload First Image</label>
          <input
            ref={firstImgRef}
            type="file"
            id="firstImg"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className={`border-2 rounded-lg py-2 px-4 hidden ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex gap-4">
            {imgPreview && ( // Display preview with icons
              <div className="relative border-2 border-dotted w-24 h-24 rounded-lg group">
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Overlay appears on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  {/* Preview icon */}
                  <EyeOutlined
                    onClick={() => setIsPreviewVisible(true)} // Open large preview modal
                    className="text-white cursor-pointer"
                  />
                  {/* Delete icon */}
                  <DeleteOutlined
                    onClick={handleImageDelete} // Remove image
                    className="text-white cursor-pointer"
                  />
                </div>
              </div>
            )}
            <div className="border-2 border-dotted w-24 h-24 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  firstImgRef?.current.click();
                }}
                className="bg-gray-200 w-full h-full rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
          {errors.firstImg && (
            <span className="text-red-500 text-sm">{errors.firstImg}</span>
          )}

          {/* Second Image Upload */}
          <label htmlFor="secondImg">* Upload Second Image</label>
          <input
            ref={secondImgRef}
            type="file"
            id="secondImg"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setSecondImg(e.target.files[0])}
            className={`border-2 rounded-lg py-2 px-4 hidden ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="border-2 border-dotted w-24 h-24 rounded-lg">
            <button
              type="button"
              onClick={() => {
                secondImgRef?.current.click();
              }}
              className="bg-gray-200 w-full h-full rounded-lg"
            >
              Upload
            </button>
          </div>
          {errors.secondImg && (
            <span className="text-red-500 text-sm">{errors.secondImg}</span>
          )}

          {/* Cover Image Upload */}
          <label htmlFor="image">* Upload Cover Image</label>
          <input
            ref={coverImgRef}
            type="file"
            id="image"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setCoverImg(e.target.files[0])}
            className={`border-2 rounded-lg py-2 px-4 hidden ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="border-2 border-dotted w-24 h-24 rounded-lg">
            <button
              type="button"
              onClick={() => {
                coverImgRef?.current.click();
              }}
              className="bg-gray-200 w-full h-full rounded-lg"
            >
              Upload
            </button>
          </div>
          {errors.coverImg && (
            <span className="text-red-500 text-sm">{errors.coverImg}</span>
          )}
        </form>
      </Modal>
      <Modal
        visible={isPreviewVisible}
        footer={null}
        onCancel={() => setIsPreviewVisible(false)}
        centered
      >
        <img
          src={imgPreview}
          alt="Preview"
          className="w-full h-full object-contain"
        />
      </Modal>
    </div>
  );
}
