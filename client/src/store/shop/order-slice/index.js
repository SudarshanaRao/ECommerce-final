import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderId: null,
  razorpayOrderId: null,
  amount: null,
  currency: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData) => {
    
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/create",
      orderData
    );
    

    return {
      order: {
        razorpayOrderId: response.data.razorpayOrderId,
        _id: response.data.orderId,
        amount: response.data.amount,
        currency: response.data.currency,
      },
    };
  }
);

export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/capture",
      {
        paymentId,
        payerId,
        orderId,
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/list/${userId}`
      );
      
      return response.data.data;
      
      
    } catch (error) {
      console.error("Error fetching orders:", error.response || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/details/${id}`
    );
    return response.data.data;  // Return the order details object directly
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createNewOrder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.order._id;
        state.razorpayOrderId = action.payload.order.razorpayOrderId;
        state.amount = action.payload.order.amount;
        state.currency = action.payload.order.currency;

        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.order._id)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
        state.razorpayOrderId = null;
        state.amount = null;
        state.currency = null;
      })

      // getAllOrdersByUserId
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })

      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        console.error("Failed to load orders:", action.payload);
      })


      // getOrderDetails
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;  // payload is single order object
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
  },
})

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
