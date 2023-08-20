import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/User/userSlice";
import articlesReducer from "../Features/Articles/articlesSlice";
import categoriesReducer from "../Features/Categories/categoriesSlice";
import tagsReducer from "../Features/Tags/tagsSlice";
import searchResultsReducer from "../Features/SearchResults/searchResultsSlice";
import optionsReducer from "../Features/Options/optionsSlice";
import showNotFoundReducer from "../Features/ShowNotFound/showNotFoundSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    articles: articlesReducer,
    categories: categoriesReducer,
    tags: tagsReducer,
    searchResults: searchResultsReducer,
    options: optionsReducer,
    showNotFound: showNotFoundReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
