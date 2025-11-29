import { configureStore } from "@reduxjs/toolkit";
import superAdminReducer from "./superAdminSlice"

import adminReducer from "./adminSlice";
import adminPlanReducer from "./adminPlansSlice"

import membersReducer from "./membersSlice";
import plansReducer from "./plansSlice";
import brandReducer from "./brandData"
import classesRedducer from "./classesSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  superAdmin: superAdminReducer,
  adminPlan: adminPlanReducer,
  admin: adminReducer,
  members: membersReducer,
  plans: plansReducer,
  classes: classesRedducer,
  brand: brandReducer
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
