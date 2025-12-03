// import Layout from "./Components/AdminLayout";
// import Login from "./Components/Admin/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import appStore, { persistor } from "./Utils/appStore";
import { Provider } from "react-redux";
// import AdminDashboard from "./Components/Admin/AdminDashboard";
import { PersistGate } from "redux-persist/integration/react";
import SuperAdminLogin from "./SuperAdmin/Login";
import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout";
import Home from "./SuperAdmin/Home";
import Plans from "./SuperAdmin/Plans";
import FitnessHubs from "./SuperAdmin/FitnessHubs";
import Coupon from "./SuperAdmin/Coupon";
import EmailTemplate from "./SuperAdmin/EmailTemplate";
import Settings from "./SuperAdmin/Settings";
import AdminLayout from "./admin/AdminLayout";

// import Plans from "./admin/Plans";
import AllDetails from "./admin/AllDetails";
import CreateMembers from "./admin/Components/CreateMembers";
import Classes from "./admin/Classes";
import CreateClasses from "./admin/Components/CreateClasses";
import EditClasses from "./admin/Components/EditClasses";
import AdminPlans from "./admin/Admin_Plans";
import CreatePlans from "./admin/Components/CreatePlans";
import EditPlan from "./admin/Components/EditPlan";
import Members from "./admin/Members";
import Instructors from "./admin/Instructors";
import CreateInstructor from "./admin/Components/CreateInstructor";
import EditInstructor from "./admin/Components/EditInstructor";

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
              <Route path="createClasses" element={<CreateClasses />} />
              <Route path="editClasses/:id" element={<EditClasses />} />
              <Route path="members" element={<Members />} />
              <Route path="createMember" element={<CreateMembers />} />
              <Route path="adminPlans" element={<AdminPlans />} />
              <Route path="createPlan" element={<CreatePlans />} />
              <Route path="editPlan/:id" element={<EditPlan />} />
              <Route path="instructors" element={<Instructors/>}/>
              <Route path="createInstructor" element={<CreateInstructor/>}/>
              <Route path="editInstructor/:id" element={<EditInstructor/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
