import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        loading: false,
        error: false
    },
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        logoutAccount: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        updateProfile: (state, action) => {
            if (state.currentUser) {
                state.currentUser = {
                    ...state.currentUser,
                    ...action.payload,
                };
            }
        },
        updateUserCompany: (state, action) => {
            if (state.currentUser) {
                state.currentUser.companyMemberships = action.payload;
            }
        },
    }
})

export const { loginStart, loginSuccess, loginFailure, logoutAccount, updateProfile, updateUserCompany } = userSlice.actions;
export default userSlice.reducer;