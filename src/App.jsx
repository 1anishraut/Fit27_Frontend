
// import Layout from "./Components/AdminLayout";
// import Login from "./Components/Admin/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import appStore, { persistor } from "./Utils/appStore";
import { Provider } from "react-redux";
// import AdminDashboard from "./Components/Admin/AdminDashboard";
import { PersistGate } from "redux-persist/integration/react";
import Login from "./admin/Login";
import AdminLayout from "./admin/AdminLayout";

import AllDetails from "./admin/AllDetails";
import Plans from "./admin/Plans";
import Feedbacks from "./admin/Feedbacks";
import CreateMembers from "./admin/CreateMembers";
import CreatePlan from "./admin/CreatePlan";
import EditPlan from "./admin/EditPlan";


function App() {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/">
          <Routes>
            {/* -------- Client Routes -------- */}
            <Route path="/" element={""}></Route>
            {/* 
              <Route path="/" element={<LandingPage />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/stays" element={<Stays />} />
              <Route path="/adventures" element={<Adventures />} />
            </Route> */}

            {/* -------- Admin Routes -------- */}
            <Route path="/admin" element={<Login />} />
            <Route path="/adminDashboard" element={<AdminLayout />}>
              <Route path="allDetails" element={<AllDetails />} />

              <Route path="plans" element={<Plans />} />
              <Route path="feedbacks" element={<Feedbacks />} />
              <Route path="createMember" element={<CreateMembers />} />
              <Route path="createPlan" element={<CreatePlan />} />
              <Route path="editPlan/:id" element={<EditPlan />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
