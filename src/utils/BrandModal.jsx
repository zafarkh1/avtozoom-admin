import { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiRequest } from "./api";
import { useModal } from "../zustand/ModalStore";
import { useIdStore } from "../zustand/IdStore";

export function BrandModal({ getApi, data }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);
  const {
    isCreateBrandOpen,
    isEditBrandOpen,
    closeCreateBrandModal,
    closeEditBrandModal,
  } = useModal();
  const { brandId, setBrandId } = useIdStore();

  const item = data.find((el) => el.id === brandId);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setImage(null);
      setImgPreview(null);
    }
  }, [item]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setImage(null);
    setImgPreview(null);
  };

  const formValidation = () => {
    const formErrors = {};

    if (!title.trim()) {
      formErrors.title = "Title is required";
    } else if (title.length < 2 || title.length > 50) {
      formErrors.title = "Title must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(title)) {
      formErrors.title = "Title must contain only letters and spaces";
    }

    if (!image) {
      formErrors.image = "Image is required";
    } else if (!["image/jpeg", "image/png", "image/jpg"].includes(image.type)) {
      formErrors.image = "Only .jpg, .jpeg, or .png files are allowed";
    } else if (image.size > 5 * 1024 * 1024) {
      formErrors.image = "Image size must be less than 5MB";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("images", image);

      try {
        await apiRequest("brands", "Post", formData);
        handleCloseModal();
        message.success("Brands added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add brands");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("images", image);

      try {
        await apiRequest(`brands/${brandId}`, "Put", formData);
        handleCloseModal();
        message.success("Brands updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated brands");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setTitle("");
    setImage(null);
    setImgPreview(null);
    setErrors("");
    closeEditBrandModal();
    closeCreateBrandModal();
    setBrandId("");
  };

  return (
    <div>
      <Modal
        title=""
        open={brandId ? isEditBrandOpen : isCreateBrandOpen}
        onOk={brandId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {brandId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* English Name */}
          <label htmlFor="title">* Title</label>
          <input
            type="text"
            id="title"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          {errors.brand && (
            <span className="text-red-500 text-sm">{errors.brand}</span>
          )}

          {/* Image Upload */}
          <label htmlFor="image">* Upload Image</label>
          <input
            ref={imgRef}
            type="file"
            id="image"
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
                  imgRef?.current.click();
                }}
                className="bg-gray-200 w-full h-full rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image}</span>
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
