import { apiConnector } from "../apiConnector";
import { catalogData } from "../APIs";
import { toast } from "react-hot-toast"

const { CATALOGPAGEDATA_API } = catalogData;

export const getCatalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading")
    let result = [];
    try {
        const response = await apiConnector(
            "POST",
            CATALOGPAGEDATA_API, // if not working then use catalogData.CATALOGPAGEDATA_API
            {
                categoryId: categoryId,
            }
        );

        if (!response?.data?.success) {
            throw new Error("Could not fetch Category page data");
        }

        result = response?.data;
    } catch (err) {
        console.log("CATALOG PAGE DATA API ERROR....", err);
        toast.error(err.message);
        result = err.response?.data;
    } finally{
        toast.dismiss(toastId)
    }
    return result;
};
