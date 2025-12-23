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
import EditMember from "./admin/Components/EditMember";
import AllClassScheduleList from "./admin/AllClassScheduleList";
import CreateDaysSchedule from "./admin/Components/CreateDaysTemplate";
import CreateWeeklySchedule from "./admin/Components/CreateWeeklySchedule";
import AdminSettings from "./admin/AdminSettings";
import ScanQR from "./admin/Components/ScanQR";
import UserLayout from "./client/UserLayout";
import UserDashboard from "./client/UserAllDetails";
import MemberCard from "./client/Components/Dashboard/MemberCard";
import BookClass from "./client/BookClass";
import BookedClass from "./client/BookedClass";
import UserEnquery from "./client/UserEnquery";
import CreateUserEnquery from "./client/Components/CreateUserEnquery";
import Enquiry from "./admin/Enquiry";
import ReplyEnquiry from "./admin/Components/ReplyEnquiry";
import CheckInHistory from "./client/CheckInHistory";
import GuestPass from "./client/GuestPass";
import GuestPassReview from "./admin/GuestPassReview";
import AdminCreateEnquiry from "./admin/AdminCreateEnquiry";
import AdminEnquery from "./client/AdminEnquery";



function App() {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/">
          <Routes>
            {/* -------- Super Admin Routes -------- */}
            <Route path="/login" element={<SuperAdminLogin />} />
            <Route path="/superadminDashboard" element={<SuperAdminLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="fitnessHubs" element={<FitnessHubs />} />
              <Route path="plans" element={<Plans />} />
              <Route path="coupon" element={<Coupon />} />
              <Route path="emailTemplate" element={<EmailTemplate />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* -------- Client Routes -------- */}
            <Route path="/login" element={<SuperAdminLogin />} />
            <Route path="/userDashboard" element={<UserLayout />}>
              <Route path="userAllDetails" element={<UserDashboard />} />
              <Route path="myCard" element={<MemberCard/>}/>
              <Route path="bookClass" element={<BookClass/>}/>
              <Route path="bookedClasses" element={<BookedClass/>}/>
              <Route path="userEnquery" element={<UserEnquery/>}/>
              <Route path="adminEnquiries" element={<AdminEnquery/>}/>
              <Route path="createUserEnquery" element={<CreateUserEnquery/>}/>
              <Route path="guestPass" element={<GuestPass/>}/>
              <Route path="checkInHistory" element={<CheckInHistory/>}/>
            </Route>

            {/* -------- Admin Routes -------- */}
            <Route path="/login" element={<SuperAdminLogin />} />
            <Route path="/adminDashboard" element={<AdminLayout />}>
              <Route path="allDetails" element={<AllDetails />} />
              <Route path="scanQR" element={<ScanQR />} />
              <Route path="classes" element={<Classes />} />
              <Route path="createClasses" element={<CreateClasses />} />
              <Route path="editClasses/:id" element={<EditClasses />} />
              <Route
                path="allClassScheduleList"
                element={<AllClassScheduleList />}
              />
              <Route
                path="createDaysSchedule"
                element={<CreateDaysSchedule />}
              />
              <Route
                path="createWeeklySchedule"
                element={<CreateWeeklySchedule />}
              />
              <Route path="createEnquiry" element={<AdminCreateEnquiry/>}/>
              <Route path="members" element={<Members />} />
              <Route path="createMember" element={<CreateMembers />} />
              <Route path="editMember/:id" element={<EditMember />} />
              <Route path="enquiry" element={<Enquiry/>}/>
              <Route path="replyEnquiry/:id" element={<ReplyEnquiry/>}/>
              <Route path="guestPassReview" element={<GuestPassReview/>}/>
              <Route path="adminPlans" element={<AdminPlans />} />
              <Route path="createPlan" element={<CreatePlans />} />
              <Route path="editPlan/:id" element={<EditPlan />} />
              <Route path="instructors" element={<Instructors />} />
              <Route path="createInstructor" element={<CreateInstructor />} />
              <Route path="editInstructor/:id" element={<EditInstructor />} />
              <Route path="adminSettings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
