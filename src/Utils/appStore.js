import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";

import membersReducer from "./membersSlice";
import plansReducer from "./plansSlice";
import classesRedducer from "./classesSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  admin: adminReducer,
  members: membersReducer,
  plans: plansReducer,
  classes: classesRedducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(appStore);
export default appStore;
