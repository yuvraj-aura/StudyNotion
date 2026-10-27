import { apiConnector } from "../apiConnector";
import { catalogData } from "../APIs";

const { CATALOGPAGEDATA_API } = catalogData;

export const getCatalogPageData = async (categoryId) => {
  let result = [];
  try {
    const response = await apiConnector("POST", CATALOGPAGEDATA_API, {
      categoryId: categoryId,
    });

    if (!response?.data?.success) {
      throw new Error("Could not fetch Category page data");
    }

    result = response?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    result = error.response?.data;
  }
  return result;
};
