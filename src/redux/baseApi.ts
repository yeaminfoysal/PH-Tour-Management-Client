import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'

export const baseApi = createApi({
    reducerPath: 'baseApi',
    // baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1", credentials: "include" }),
    tagTypes: ["TOUR"],
    baseQuery: axiosBaseQuery(),
    endpoints: () => ({}),
})
