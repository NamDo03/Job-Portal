import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Companies from "./pages/Companies";
import FindJobs from "./pages/FindJobs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ScrollToTop from "./hooks/ScrollToTop";
import CompanyDetail from "./pages/CompanyDetail";
import JobDetail from "./pages/JobDetail";
import { ToastContainer, Bounce } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import NotFounded from "./pages/NotFounded";
import AdminLayout from "./layouts/AdminLayout";
import CompanyList from "./pages/Dashboard/CompanyAdmin/CompanyList";
import CompanyDetailAdmin from "./pages/Dashboard/CompanyAdmin/CompanyDetail";
import SkillList from "./pages/Dashboard/Skill/SkillList";
import AddSkill from "./pages/Dashboard/Skill/AddSkill";
import UpdateSkill from "./pages/Dashboard/Skill/UpdateSkill";
import LevelList from "./pages/Dashboard/Level/LevelList";
import AddLevel from "./pages/Dashboard/Level/AddLevel";
import UpdateLevel from "./pages/Dashboard/Level/UpdateLevel";
import Profile from "./pages/Profile";
import AppliedJobs from "./pages/AppliedJobs";
import PositionList from "./pages/Dashboard/Position/PositionList";
import AddPosition from "./pages/Dashboard/Position/AddPosition";
import UpdatePosition from "./pages/Dashboard/Position/UpdatePosition";
import UpdateSalary from "./pages/Dashboard/Salary/UpdateSalary";
import SalaryList from "./pages/Dashboard/Salary/SalaryList";
import AddSalary from "./pages/Dashboard/Salary/AddSalary";
import UpdateCategory from "./pages/Dashboard/Category/UpdateCategory";
import CategoryList from "./pages/Dashboard/Category/CategoryList";
import AddCategory from "./pages/Dashboard/Category/AddCategory";
import UserList from "./pages/Dashboard/User/UserList";
import AddUser from "./pages/Dashboard/User/AddUser";
import UpdateUser from "./pages/Dashboard/User/UpdateUser";
import CreateCompany from "./pages/Dashboard/Company/CreateCompany";
import CompanySizeList from "./pages/Dashboard/CompanySize/CompanySizeList";
import AddCompanySize from "./pages/Dashboard/CompanySize/AddCompanySize";
import UpdateCompanySize from "./pages/Dashboard/CompanySize/UpdateCompanySize";
import UpdateCompany from "./pages/Dashboard/Company/UpdateCompany";
import Recruitment from "./pages/Dashboard/Company/Recruitment";
import EmployeeList from "./pages/Dashboard/Company/EmployeeList";
import { useSelector } from "react-redux";
import UpdateMemberRole from "./pages/Dashboard/Company/UpdateMemberRole";
import JobPostingList from "./pages/Dashboard/Job/JobPostingList";
import CreateJob from "./pages/Dashboard/Job/CreateJob";
// import JobList from "./components/jobList/JobList";
import JobListAdmin from "./pages/Dashboard/Job/JobList";
import JobDetailAdmin from "./pages/Dashboard/Job/JobDetail";
import SavedJobsPage from "./pages/SavedJobsPage";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const mainRoutes = [
    { path: "/", element: <Home /> },
    { path: "/jobs", element: <FindJobs /> },
    { path: "/jobs/:id", element: <JobDetail /> },
    { path: "/companies", element: <Companies /> },
    { path: "/companies/:id", element: <CompanyDetail /> },
  ];
  const adminRoutes = [
    { path: "user/list", element: <UserList /> },
    { path: "user/create", element: <AddUser /> },
    { path: "user/edit/:id", element: <UpdateUser /> },
    { path: "company", element: <CompanyList /> },
    { path: "company/:id", element: <CompanyDetailAdmin /> },
    { path: "job", element: <JobListAdmin /> },
    { path: "job/:jobId", element: <JobDetailAdmin /> },
    { path: "category/list", element: <CategoryList /> },
    { path: "category/create", element: <AddCategory /> },
    { path: "category/edit/:id", element: <UpdateCategory /> },
    { path: "skill/list", element: <SkillList /> },
    { path: "skill/create", element: <AddSkill /> },
    { path: "skill/edit/:id", element: <UpdateSkill /> },
    { path: "level/list", element: <LevelList /> },
    { path: "level/create", element: <AddLevel /> },
    { path: "level/edit/:id", element: <UpdateLevel /> },
    { path: "position/list", element: <PositionList /> },
    { path: "position/create", element: <AddPosition /> },
    { path: "position/edit/:id", element: <UpdatePosition /> },
    { path: "salary/list", element: <SalaryList /> },
    { path: "salary/create", element: <AddSalary /> },
    { path: "salary/edit/:id", element: <UpdateSalary /> },
    { path: "companySize/list", element: <CompanySizeList /> },
    { path: "companySize/create", element: <AddCompanySize /> },
    { path: "companySize/edit/:id", element: <UpdateCompanySize /> },
  ];
  const recruiterRoutes = currentUser?.companyMemberships[0]
    ? [
        { path: "company/manage", element: <UpdateCompany /> },
        { path: "company/recruitment", element: <Recruitment /> },
        { path: "company/employees", element: <EmployeeList /> },
        { path: "company/employees/edit/:id", element: <UpdateMemberRole /> },
        { path: "job/list", element: <JobPostingList /> },
        { path: "job/create", element: <CreateJob /> },
        { path: "job/:jobId", element: <JobDetailAdmin /> },
      ]
    : [{ path: "company/create", element: <CreateCompany /> }];

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Main Routes */}
        {mainRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<MainLayout>{element}</MainLayout>}
          />
        ))}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          element={
            <ProtectedRoute
              requiredRoles={["CANDIDATE", "ADMIN", "RECRUITER"]}
            />
          }
        >
          <Route
            path="/profile"
            element={
              <MainLayout>
                <Profile />
              </MainLayout>
            }
          />
          <Route
            path="/applied-jobs"
            element={
              <MainLayout>
                <AppliedJobs />
              </MainLayout>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <MainLayout>
                <SavedJobsPage />
              </MainLayout>
            }
          />
        </Route>

        {/* Recruiter Route */}
        <Route element={<ProtectedRoute requiredRoles={["RECRUITER"]} />}>
          <Route path="/recruiter-dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {recruiterRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>

        {/* Admin Route */}
        <Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {adminRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<NotFounded />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
}

export default App;
