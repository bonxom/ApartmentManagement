import { Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Quanlydancu from "../pages/Admin/QuanLyDanCu/Quanlydancu";
import Profile from "../pages/Profile";
import DanhSachDangKyTaiKhoan from "../pages/Admin/PheDuyet/DanhSachDangKyTaiKhoan";
import DanhSachKhaiBaoSinhTu from "../pages/Admin/PheDuyet/DanhSachKhaiBaoSinhTu";
import DanhSachThuTien from "../pages/Admin/PheDuyet/DanhSachThuTien";
import DanhSachTamTruVang from "../pages/Admin/PheDuyet/DanhSachTamTruVang";
import FeeManagement from "../pages/Admin/ThuPhi/fee";
import FeeHouseholdPage from "../pages/Admin/ThuPhi/FeeHouseholdPage";
import ThongTinChiTietAdmin from "../pages/Admin/QuanLyDanCu/ProfileAdmin";
import ThongTinHoDanAdmin from "../pages/Admin/QuanLyDanCu/ThongTinHoDanAdmin";
import ThongTinChiTietMember from "../pages/Admin/QuanLyDanCu/ThongTinChiTietMember";
import ThemThongTinCuDan from "../pages/Admin/QuanLyDanCu/ThemThongTinCuDan";
import NhanKhau from "../pages/NhanKhau";
import Setting from "../feature/Setting";
import QuanLiTamTruVang from "../pages/Admin/DanhSachSauKhaiBaoTamTruVang/QuanLiTamTruVang";
import ChiTietTamTruVangAdmin from "../pages/Admin/DanhSachSauKhaiBaoTamTruVang/ChiTietTamTruVangAdmin";
import ThongTinNguoiTamTru from "../pages/Admin/DanhSachSauKhaiBaoTamTruVang/ThongTinNguoiTamTru";
import ThongTinNguoiTamVang from "../pages/Admin/DanhSachSauKhaiBaoTamTruVang/ThongTinNguoiTamVang";
import LichSuPheDuyetTaiKhoanHoDan from '../pages/Admin/LichSu/LichSuPheDuyet';
import LichSuGiaoDichTheoHoDan from '../pages/Admin/LichSu/LichSuGiaoDich';
import XemChiTietGiaoDichHoDan from '../pages/Admin/LichSu/LichSuChiTiet/LichSuGiaoDichChiTiet';
import LichSuThayDoiTheoHoDan from '../pages/Admin/LichSu/LichSuThayDoi';
import ChiTietLichSuThayDoiHoDan from '../pages/Admin/LichSu/LichSuChiTiet/LichSuThayDoiChiTiet';

// Routes cho Tổ trưởng (HAMLET LEADER)
export const leaderRoutes = (

  <Route path="leader" element={<MainLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="qldc" element={<Quanlydancu />} />
    <Route path="profile" element={<ThongTinChiTietAdmin />} />
    <Route path="dktk" element={<DanhSachDangKyTaiKhoan />} />
    <Route path="kbst" element={<DanhSachKhaiBaoSinhTu />} />
    <Route path="thutien" element={<DanhSachThuTien />} />
    <Route path="tamtruvang" element={<DanhSachTamTruVang />} />
    <Route path="nhankhau" element={<NhanKhau />} />
    <Route path="themcudan" element={<ThemThongTinCuDan />} />
    <Route path="fee" element={<FeeManagement />} />
    <Route path="qlnkskKhaiBaoTamtruvang" element={<QuanLiTamTruVang />} />
    <Route path="housefee" element={<FeeHouseholdPage />} />
    <Route path="ChiTietTamTruVangAdmin" element={<ChiTietTamTruVangAdmin />} />
    <Route path="lichsupheduyet" element={<LichSuPheDuyetTaiKhoanHoDan />} />
    <Route path="lichsugiaodich" element={<LichSuGiaoDichTheoHoDan />} />
    <Route path="lichsugiaodich/chi-tiet/:householdCode" element={<XemChiTietGiaoDichHoDan />} />
    <Route path="lichsuthaydoi" element={<LichSuThayDoiTheoHoDan />} />
    <Route path="lichsuthaydoi/chi-tiet/:householdCode" element={<ChiTietLichSuThayDoiHoDan />} />

    {/* <Route path="ThongTinChiTietadmin" element={<ThongTinChiTietAdmin />} /> */}

    <Route path="ThongTinHoDanadmin" element={<ThongTinHoDanAdmin />} />
    <Route path="ThongTinChiTietMember" element={<ThongTinChiTietMember />} />
    <Route path="ThongTinNguoiTamTru" element={<ThongTinNguoiTamTru />} />
    <Route path="ThongTinNguoiTamVang" element={<ThongTinNguoiTamVang />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
    <Route path="setting" element={<Setting />} />
  </Route>
);

export default leaderRoutes;
