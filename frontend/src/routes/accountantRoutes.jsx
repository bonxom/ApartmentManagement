import { Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import Profile from '../pages/Profile';
import DanhSachThuTien from '../pages/Admin/PheDuyet/DanhSachThuTien';
import FeeManagement from '../pages/Admin/ThuPhi/fee';
import FeeHouseholdPage from '../pages/Admin/ThuPhi/FeeHouseholdPage';
import Setting from '../feature/Setting';
import MainLayoutForAccountant from "../layout/MainLayoutForAccountant";
import LichSuGiaoDich from '../pages/Admin/LichSu/LichSuGiaoDich';

// Import các trang của bạn
import AccountantDashboard from "../pages/Accountant/AccountantDashboard";
import ThongTinHoDanPage from "../pages/Accountant/ThongTinHoDanPage"; // Giả sử đây là nơi bạn để file mới
export const accountantRoutes = (
  <Route path="accountant" element={<MainLayoutForAccountant />}>
    {/* Khi vào /accountant sẽ tự động nhảy sang /accountant/dashboard */}
    <Route index element={<Navigate to="dashboard" replace />} />

    {/* Trang chủ Dashboard */}
    <Route path="dashboard" element={<AccountantDashboard />} />
    <Route path="ThongTinHoDan" element={<ThongTinHoDanPage />} />

    {/* Các trang khác sau này bạn thêm ở đây */}
    <Route path="fee" element={<FeeManagement />} />
    <Route path="pheduyet" element={<DanhSachThuTien />} />
    <Route path="lichsugiaodich" element={<LichSuGiaoDich />} />
    {/* Trang 404 cho riêng phân hệ accountant */}
    <Route path="*" element={<Navigate to="dashboard" replace />} />
    <Route path="setting" element={<Setting />} />
  </Route>
);

export default accountantRoutes;
