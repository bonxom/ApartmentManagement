import Maintenance from "../models/Maintenance.js";

// @desc    Tạo lịch bảo trì mới (Chỉ dành cho Tổ trưởng)
// @route   POST /api/maintenances
export const createMaintenance = async (req, res) => {
  try {
    const { title, facilityName, description, startDate, endDate, assignedTo, cost } = req.body;

    if (!title || !facilityName || !description || !startDate || !endDate || !assignedTo) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ các trường bắt buộc" });
    }

    const maintenance = await Maintenance.create({
      title,
      facilityName,
      description,
      startDate,
      endDate,
      assignedTo,
      cost: cost ? Number(cost) : 0,
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách lịch bảo trì
// @route   GET /api/maintenances
export const getAllMaintenances = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const list = await Maintenance.find(filter).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật lịch bảo trì (Chỉ dành cho Tổ trưởng)
// @route   PUT /api/maintenances/:id
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, facilityName, description, startDate, endDate, status, assignedTo, cost } = req.body;

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Không tìm thấy lịch bảo trì" });
    }

    if (title) maintenance.title = title;
    if (facilityName) maintenance.facilityName = facilityName;
    if (description) maintenance.description = description;
    if (startDate) maintenance.startDate = startDate;
    if (endDate) maintenance.endDate = endDate;
    if (status) maintenance.status = status;
    if (assignedTo) maintenance.assignedTo = assignedTo;
    if (cost !== undefined) maintenance.cost = Number(cost);

    await maintenance.save();
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa lịch bảo trì (Chỉ dành cho Tổ trưởng)
// @route   DELETE /api/maintenances/:id
export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({ message: "Không tìm thấy lịch bảo trì" });
    }

    await Maintenance.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa lịch bảo trì thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
