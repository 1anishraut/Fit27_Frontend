// import Layout from "./Components/AdminLayout";
// import Login from "./Components/Admin/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import appStore, { persistor } from "./Utils/appStore";
import { Provider } from "react-redux";
// import AdminDashboard from "./Components/Admin/AdminDashboard";
import { PersistGate } from "redux-persist/integration/react";
import Login from "./admin/Login";
import SuperAdminLogin from "./SuperAdmin/Login";
import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout";
import Home from "./SuperAdmin/Home";
import Companies from "./SuperAdmin/FitnessHubs";
import Plans from "./SuperAdmin/Plans";
import FitnessHubs from "./SuperAdmin/FitnessHubs";
import Coupon from "./SuperAdmin/Coupon";
import EmailTemplate from "./SuperAdmin/EmailTemplate";
import Settings from "./SuperAdmin/Settings";
import AdminLayout from "./admin/AdminLayout";

import AllDetails from "./admin/AllDetails";
// import Plans from "./admin/Plans";
import Feedbacks from "./admin/Feedbacks";
import CreateMembers from "./admin/Components/CreateMembers";
import CreatePlan from "./admin/CreatePlan";
import EditPlan from "./admin/EditPlan";
import Classes from "./admin/Classes";
import CreateClasses from "./admin/CreateClasses";

function App() {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/">
          <Routes>
            {/* -------- Admin Routes -------- */}
            <Route path="/superadmin" element={<SuperAdminLogin />} />
            <Route path="/superadminDashboard" element={<SuperAdminLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="fitnessHubs" element={<FitnessHubs />} />
              <Route path="plans" element={<Plans />} />
              <Route path="coupon" element={<Coupon />} />
              <Route path="emailTemplate" element={<EmailTemplate />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* -------- Client Routes -------- */}
            <Route path="/" element={""}></Route>
            {/* 
              <Route path="/" element={<LandingPage />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/stays" element={<Stays />} />
              <Route path="/adventures" element={<Adventures />} />
            </Route> */}

            {/* -------- Admin Routes -------- */}
            <Route path="/admin" element={<SuperAdminLogin />} />
            <Route path="/adminDashboard" element={<AdminLayout />}>
              <Route path="allDetails" element={<AllDetails />} />
              <Route path="classes" element={<Classes />} />
              <Route path="createMember" element={<CreateMembers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
