import axiosInstance from "./axiosInstance";

export const getCategories = async () =>  await axiosInstance.get("/categories");
export const getColors = async () =>  await axiosInstance.get("/colors");
export const getSizes = async () =>  await axiosInstance.get("/sizes");
export const getMaterials = async () =>  await axiosInstance.get("/materials");
export const getPacks = async () =>  await axiosInstance.get("/packs");
export const getPatterns = async () =>  await axiosInstance.get("/patterns");
export const getDiscounts = async () =>  await axiosInstance.get("/discounts");
export const getCoupons = async () =>  await axiosInstance.get("/coupons");
