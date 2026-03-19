



const apiUrl = "http://localhost:3000/products";

export const getProducts = async () => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getReviews = async (productId) => {
    try {
        const response = await fetch(`${apiUrl}/${productId}/reviews`);
        if (!response.ok) {
            throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
}