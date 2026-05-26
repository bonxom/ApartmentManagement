import { Route, Navigate } from "react-router-dom";
import MainLayoutForUser from "../layout/MainLayoutForUser";
import ProtectedRoute from "../components/ProtectedRoute";
import UserDashboard from "../pages/User/UserDashboard";
import Profile from "../pages/Profile";
import ThongTinHoDan from "../pages/User/NhanKhau/thongtinhodan";
import ThongTinChiTiet from "../pages/User/NhanKhau/thongtinchitiet";
import ThongTinMember from "../pages/User/NhanKhau/ThongTinMember";
import KhoanNop from "../pages/User/ThuPhi/khoannop.jsx";
import RequestSinhTu from "../pages/User/Request/requestsinhtu";
import RequestTamTruVang from "../pages/User/Request/requesttamtruvang";
import YeuCauTamTruVang from "../pages/UserTemp";
import LichSuThayDoi from "../pages/User/LichSu/lichsuthaydoi_ofuser";
import Setting from "../feature/Setting";
import Lichsugiaodich from "../pages/User/LichSu/Lichsugiaodich_ofuser";
import Lichsupheduyet from "../pages/User/LichSu/Lichsupheduyet_ofuser";

// Routes cho Dân cư (MEMBER + HOUSE MEMBER)
export const memberRoutes = (
  <Route path="member" element={<MainLayoutForUser />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="profile" element={<Profile />} />
    <Route path="setting" element={<Setting />} />
    <Route
      element={
        <ProtectedRoute
          allowedRoles={["HOUSE MEMBER"]}
          redirectTo="/member/dashboard"
        />
      }
    >
      <Route path="ThongTinHoDan" element={<ThongTinHoDan />} />
      <Route path="ThongTinChiTiet" element={<ThongTinChiTiet />} />
      <Route path="ThongTinMember" element={<ThongTinMember />} />
      <Route path="feeuser" element={<KhoanNop />} />
      <Route path="requestsinhtu" element={<RequestSinhTu />} />
      <Route path="requesttamtruvang" element={<RequestTamTruVang />} />
      <Route path="yeucau/tamtruvang" element={<YeuCauTamTruVang />} />
      <Route path="lichsuthaydoi" element={<LichSuThayDoi />} />
      <Route path="lichsugiaodich" element={<Lichsugiaodich />} />
      <Route path="lichsupheduyet" element={<Lichsupheduyet />} />
    </Route>
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Route>
);

export default memberRoutes;
