// src/core/api.urls.ts

export const baseUrl = "https://rvapi.ilhamdean.cloud/api/v1"

export const getApiEndpoint = (endpoint: string) => {

    return `${baseUrl}/${endpoint}`

}

export const endpoints = {

    login: getApiEndpoint("auth/login"),

    register: getApiEndpoint("auth/register"),

    getUserProfile: getApiEndpoint("user/me"),

    updateUserProfile: getApiEndpoint("user/profile/update"),

}

