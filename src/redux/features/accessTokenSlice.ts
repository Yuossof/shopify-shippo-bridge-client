import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Token {
  shopifyAccessToken: string,
  shippoApiKey: string
}

const initialState: Token = {
  shopifyAccessToken: "",
  shippoApiKey: ""
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    getTokens: (state, action:PayloadAction<Token>) => {
        state.shopifyAccessToken = action.payload.shopifyAccessToken
        state.shippoApiKey = action.payload.shippoApiKey
    },
  },
})

// Action creators are generated for each case reducer function
export const { getTokens } = tokenSlice.actions

export default tokenSlice.reducer