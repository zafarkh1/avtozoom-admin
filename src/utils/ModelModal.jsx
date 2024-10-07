import { useEffect, useState } from "react";
import { useModal } from "../zustand/ModalStore";
import { Modal, message } from "antd";
import { apiRequest } from "./api";
import { useIdStore } from "../zustand/IdStore";

export function ModelModal({ getApi, data }) {
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const {
    isCreateModelOpen,
    isEditModelOpen,
    closeCreateModelModal,
    closeEditModelModal,
  } = useModal();
  const { modelId, setModelId } = useIdStore();

  const item = data.find((el) => el.id === modelId);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
    }
  }, [item]);

  const fetchBrands = async () => {
    try {
      const fetchedBrands = await apiRequest("brands");
      setBrands(fetchedBrands?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formValidation = () => {
    const formErrors = {};

    if (!name.trim()) {
      formErrors.name = "name is required";
    } else if (name.length < 2 || name.length > 50) {
      formErrors.name = "name must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(name)) {
      formErrors.name = "name must contain only letters and spaces";
    }

    if (!brandId) {
      formErrors.brand = "brand is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    console.log();

    if (formValidation()) {
      try {
        await apiRequest("models", "Post", {
          name: name,
          brand_id: brandId,
        });
        handleCloseModal();
        message.success("Modals added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add modals");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      try {
        await apiRequest(`models/${modelId}`, "Put", {
          name: name,
          brand_id: brandId,
        });
        handleCloseModal();
        message.success("Models updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated models");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setName("");
    setBrandId("");
    setErrors("");
    closeEditModelModal();
    closeCreateModelModal();
    setModelId("");
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div>
      <Modal
        name=""
        open={modelId ? isEditModelOpen : isCreateModelOpen}
        onOk={modelId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {modelId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* English Name */}
          <label htmlFor="name">* Name</label>
          <input
            type="text"
            id="name"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}

          {/* Brand */}
          <label htmlFor="brand">* Brand</label>
          <select
            id="brand"
            onChange={(e) => setBrandId(e.target.value)}
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
          >
            {brands.map((brand, i) => (
              <option key={i} value={brand.id}>
                {brand.title}
              </option>
            ))}
          </select>
          {errors.brand && (
            <span className="text-red-500 text-sm">{errors.brand}</span>
          )}
        </form>
      </Modal>
    </div>
  );
}
