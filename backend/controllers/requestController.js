import Request from "../models/Request.js";
import User from "../models/User.js";
import Fee from "../models/Fee.js";
import Transaction from "../models/Transaction.js";
import ResidentHistory from "../models/ResidentHistory.js";
import Household from "../models/Household.js";
import mongoose from "mongoose";
import { getMemberRoleId } from "../utils/roleUtils.js";

// @desc    Gửi yêu cầu cập nhật thông tin (Dành cho Người dân)
// @route   POST /api/requests/update-info
export const createUpdateRequest = async (req, res) => {
  try {
    const { newData } = req.body; // newData là object chứa các trường muốn sửa (vd: { job: "ABC", phoneNumber: "123" })

    if (!newData || typeof newData !== "object" || Array.isArray(newData)) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    
    // Validate: Không cho phép gửi yêu cầu sửa các trường nhạy cảm qua API này
    const forbiddenFields = ["password", "role", "household", "status", "userCardID"];
    const filteredData = Object.keys(newData).reduce((acc, key) => {
        if (!forbiddenFields.includes(key)) {
            acc[key] = newData[key];
        }
        return acc;
    }, {});

    if (Object.keys(filteredData).length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
    }

    const request = await Request.create({
      requester: req.user._id, // Lấy ID từ token đăng nhập
      type: "UPDATE_INFO",
      requestData: filteredData,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Gửi yêu cầu nộp tiền (Cư dân gửi)
// @route   POST /api/requests/payment
export const createPaymentRequest = async (req, res) => {
  try {
    const { feeId, amount, note, proofImage } = req.body;
    const user = req.user; // Lấy từ middleware protect

    // 1. Validate dữ liệu
    if (!feeId || !amount) {
        return res.status(400).json({ message: "Vui lòng chọn khoản thu và nhập số tiền" });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }

    if (!user.household) {
        return res.status(400).json({ message: "Bạn chưa thuộc hộ khẩu nào để nộp phí" });
    }

    // 2. Kiểm tra khoản thu có hợp lệ không
    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Khoản thu không tồn tại" });
    if (fee.status === "COMPLETED") {
        return res.status(400).json({ message: "Đợt thu này đã kết thúc" });
    }

    // 3. Tạo Request
    const request = await Request.create({
      requester: user._id,
      type: "PAYMENT",
      requestData: {
          feeId,
          householdId: user.household, // Lưu snapshot hộ khẩu lúc nộp
          amount: parsedAmount,
          note: note || "Nộp tiền Online",
          proofImage: proofImage || "" // URL ảnh chuyển khoản (nếu có)
      }
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Đăng ký Tạm Trú (Người nơi khác đến)
export const createTemporaryResidenceRequest = async (req, res) => {
  try {
    const { name, userCardID, dob, job, reason, startDate, endDate, sex, birthLocation, ethnic, phoneNumber, permanentAddress } = req.body;
    const user = req.user;

    if (!user.household) return res.status(400).json({ message: "Bạn chưa có hộ khẩu." });
    if (!name || !userCardID || !dob || !sex || !birthLocation || !ethnic || !phoneNumber || !job || !reason || !startDate || !endDate || !permanentAddress) {
      return res.status(400).json({ message: "Thiếu thông tin người tạm trú." });
    }
    // Tạm thời tránh trùng CCCD với user hiện có
    const existingUserCard = await User.findOne({ userCardID });
    if (existingUserCard) {
      return res.status(400).json({ message: "CCCD/ID đã tồn tại trong hệ thống." });
    }

    const request = await Request.create({
      requester: user._id,
      type: "TEMPORARY_RESIDENCE",
      requestData: {
        householdId: user.household,
        name,
        userCardID,
        dob,
        sex,
        birthLocation,
        ethnic,
        phoneNumber,
        job,
        permanentAddress,
        reason,
        startDate,
        endDate,
        isActive: true,
      }
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Báo Tạm Vắng (Người trong nhà đi vắng)
export const createTemporaryAbsenceRequest = async (req, res) => {
  try {
    const { userId, fromDate, toDate, reason, temporaryAddress } = req.body;
    const requester = req.user;

    if (!requester.household) return res.status(400).json({ message: "Bạn chưa có hộ khẩu." });
    if (!userId || !fromDate || !toDate || !reason || !temporaryAddress) {
      return res.status(400).json({ message: "Thiếu thông tin tạm vắng." });
    }

    // Kiểm tra thành viên có thuộc hộ không
    const absentUser = await User.findById(userId);
    if (!absentUser || absentUser.household?.toString() !== requester.household.toString()) {
        return res.status(400).json({ message: "Thành viên này không thuộc hộ của bạn" });
    }

    const request = await Request.create({
      requester: requester._id,
      type: "TEMPORARY_ABSENT",
      requestData: {
        householdId: requester.household,
        absentUserId: userId,
        fromDate, toDate, reason, temporaryAddress,
        isActive: true,
      }
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Khai Sinh (Bé mới sinh)
export const createBirthRequest = async (req, res) => {
  try {
    const { name, dob, sex, birthLocation, ethnic, birthCertificateNumber } = req.body;
    const user = req.user;
    const normalizedBirthCert = birthCertificateNumber?.toString().trim();

    if (!user.household) return res.status(400).json({ message: "Bạn chưa có hộ khẩu." });
    if (!name || !dob || !sex || !birthLocation || !ethnic || !normalizedBirthCert) {
      return res.status(400).json({ message: "Thiếu thông tin khai sinh." });
    }

    // Check trùng số giấy khai sinh đã lưu trong lịch sử hoặc yêu cầu đang chờ/đã duyệt
    const existingBirthHistory = await ResidentHistory.findOne({
      "births.birthCertificateNumber": normalizedBirthCert,
    });
    if (existingBirthHistory) {
      return res.status(400).json({ message: "Số giấy khai sinh này đã tồn tại trong hệ thống." });
    }

    const existingBirthRequest = await Request.findOne({
      type: "BIRTH_REPORT",
      status: { $in: ["PENDING", "APPROVED"] },
      "requestData.birthCertificateNumber": normalizedBirthCert,
    });
    if (existingBirthRequest) {
      return res.status(400).json({ message: "Số giấy khai sinh này đã tồn tại trong hệ thống." });
    }

    const request = await Request.create({
      requester: user._id,
      type: "BIRTH_REPORT",
      requestData: {
        householdId: user.household,
        name,
        dob,
        sex,
        birthLocation,
        ethnic,
        birthCertificateNumber: normalizedBirthCert,
      }
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Khai Tử (Người mất)
export const createDeathRequest = async (req, res) => {
  try {
    const { userId, dateOfDeath, reason, deathCertificateUrl } = req.body;
    const requester = req.user;

    if (!requester.household) return res.status(400).json({ message: "Bạn chưa có hộ khẩu." });
    if (!userId || !dateOfDeath || !reason || !deathCertificateUrl) {
      return res.status(400).json({ message: "Thiếu thông tin khai tử." });
    }

    const deceasedUser = await User.findById(userId);
    if (!deceasedUser) return res.status(404).json({ message: "Không tìm thấy thành viên này" });
    
    if (deceasedUser.household?.toString() !== requester.household.toString()) {
        return res.status(400).json({ message: "Người này không thuộc hộ của bạn" });
    }

    const request = await Request.create({
      requester: requester._id,
      type: "DEATH_REPORT",
      requestData: {
        householdId: requester.household,
        deceasedUserId: userId,
        dateOfDeath, reason, deathCertificateUrl
      }
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Lấy danh sách yêu cầu (Dành cho Tổ trưởng)
// @route   GET /api/requests
export const getAllRequests = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    let requests = await Request.find(filter)
      .populate({
        path: "requester",
        select:
          "name email userCardID household role dob sex phoneNumber job ethnic birthLocation relationshipWithHead status",
        populate: [
          { path: "role", select: "role_name" },
          { path: "household", select: "houseHoldID address" },
        ],
      }) // Hiện tên người gửi + thông tin cần hiển thị
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    // Enrich requests with related info
    const absentIds = requests
      .filter((r) => r.type === "TEMPORARY_ABSENT" && r.requestData?.absentUserId)
      .map((r) => r.requestData.absentUserId)
      .filter(Boolean);
    const deceasedIds = requests
      .filter((r) => r.type === "DEATH_REPORT" && r.requestData?.deceasedUserId)
      .map((r) => r.requestData.deceasedUserId)
      .filter(Boolean);
    const paymentFeeIds = requests
      .filter((r) => r.type === "PAYMENT" && r.requestData?.feeId)
      .map((r) => r.requestData.feeId)
      .filter(Boolean);

    const shouldEnrichUsers = absentIds.length || deceasedIds.length;
    const shouldEnrichFees = paymentFeeIds.length;

    let userMap = null;
    if (shouldEnrichUsers) {
      const ids = [...new Set([...absentIds, ...deceasedIds].map((id) => id.toString()))];
      const users = await User.find({ _id: { $in: ids } }).select("name userCardID");
      userMap = new Map(users.map((u) => [u._id.toString(), u]));
    }

    let feeMap = null;
    if (shouldEnrichFees) {
      const feeIds = [...new Set(paymentFeeIds.map((id) => id.toString()))];
      const fees = await Fee.find({ _id: { $in: feeIds } }).select("name");
      feeMap = new Map(fees.map((fee) => [fee._id.toString(), fee]));
    }

    if (shouldEnrichUsers || shouldEnrichFees) {
      requests = requests.map((r) => {
        if (r.type === "TEMPORARY_ABSENT" && r.requestData?.absentUserId && userMap) {
          const u = userMap.get(r.requestData.absentUserId.toString());
          if (u) {
            r.requestData = {
              ...r.requestData,
              absentUserName: u.name,
              absentUserCardID: u.userCardID,
            };
          }
        }
        if (r.type === "DEATH_REPORT" && r.requestData?.deceasedUserId && userMap) {
          const u = userMap.get(r.requestData.deceasedUserId.toString());
          if (u) {
            r.requestData = {
              ...r.requestData,
              deceasedUserName: u.name,
              deceasedUserCardID: u.userCardID,
            };
          }
        }
        if (r.type === "PAYMENT" && r.requestData?.feeId && feeMap) {
          const fee = feeMap.get(r.requestData.feeId.toString());
          if (fee) {
            r.requestData = {
              ...r.requestData,
              feeName: fee.name,
            };
          }
        }
        return r;
      });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách yêu cầu nộp tiền của hộ mình (Dành cho Cư dân)
// @route   GET /api/requests/my-household/payments
export const getMyHouseholdPaymentRequests = async (req, res) => {
  try {
    const user = req.user;
    if (!user.household) {
      return res.status(400).json({ message: "Bạn chưa thuộc hộ khẩu nào." });
    }

    const { status } = req.query;
    const filter = {
      type: "PAYMENT",
      "requestData.householdId": user.household,
    };
    if (status) filter.status = status;

    let requests = await Request.find(filter)
      .populate({
        path: "requester",
        select: "name email userCardID household",
        populate: [{ path: "household", select: "houseHoldID address" }],
      })
      .sort({ createdAt: -1 });

    const feeIds = requests
      .map((r) => r.requestData?.feeId)
      .filter(Boolean)
      .map((id) => id.toString());

    if (feeIds.length) {
      const uniqueFeeIds = [...new Set(feeIds)];
      const fees = await Fee.find({ _id: { $in: uniqueFeeIds } }).select("name");
      const feeMap = new Map(fees.map((fee) => [fee._id.toString(), fee]));

      requests = requests.map((r) => {
        if (r.requestData?.feeId) {
          const fee = feeMap.get(r.requestData.feeId.toString());
          if (fee) {
            r.requestData = {
              ...r.requestData,
              feeName: fee.name,
            };
          }
        }
        return r;
      });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách yêu cầu của hộ mình (Dành cho Cư dân)
// @route   GET /api/requests/my-household
export const getMyHouseholdRequests = async (req, res) => {
  try {
    const user = req.user;
    if (!user.household) {
      return res.status(400).json({ message: "Bạn chưa thuộc hộ khẩu nào." });
    }

    const { status, type } = req.query;
    const filter = {
      "requestData.householdId": user.household,
    };
    if (status) filter.status = status;

    const rawTypes = Array.isArray(type)
      ? type
      : typeof type === "string"
      ? type.split(",")
      : [];
    const types = rawTypes.map((t) => t.trim()).filter(Boolean);
    if (types.length) {
      filter.type = { $in: types };
    }

    let requests = await Request.find(filter)
      .populate({
        path: "requester",
        select: "name email userCardID household",
        populate: [{ path: "household", select: "houseHoldID address" }],
      })
      .sort({ createdAt: -1 });

    const absentIds = requests
      .filter((r) => r.type === "TEMPORARY_ABSENT" && r.requestData?.absentUserId)
      .map((r) => r.requestData.absentUserId)
      .filter(Boolean);
    const deceasedIds = requests
      .filter((r) => r.type === "DEATH_REPORT" && r.requestData?.deceasedUserId)
      .map((r) => r.requestData.deceasedUserId)
      .filter(Boolean);
    const feeIds = requests
      .filter((r) => r.type === "PAYMENT" && r.requestData?.feeId)
      .map((r) => r.requestData.feeId)
      .filter(Boolean);

    let userMap = null;
    if (absentIds.length || deceasedIds.length) {
      const ids = [...new Set([...absentIds, ...deceasedIds].map((id) => id.toString()))];
      const users = await User.find({ _id: { $in: ids } }).select("name userCardID");
      userMap = new Map(users.map((u) => [u._id.toString(), u]));
    }

    let feeMap = null;
    if (feeIds.length) {
      const uniqueFeeIds = [...new Set(feeIds.map((id) => id.toString()))];
      const fees = await Fee.find({ _id: { $in: uniqueFeeIds } }).select("name");
      feeMap = new Map(fees.map((fee) => [fee._id.toString(), fee]));
    }

    if (userMap || feeMap) {
      requests = requests.map((r) => {
        if (r.type === "TEMPORARY_ABSENT" && r.requestData?.absentUserId && userMap) {
          const u = userMap.get(r.requestData.absentUserId.toString());
          if (u) {
            r.requestData = {
              ...r.requestData,
              absentUserName: u.name,
              absentUserCardID: u.userCardID,
            };
          }
        }
        if (r.type === "DEATH_REPORT" && r.requestData?.deceasedUserId && userMap) {
          const u = userMap.get(r.requestData.deceasedUserId.toString());
          if (u) {
            r.requestData = {
              ...r.requestData,
              deceasedUserName: u.name,
              deceasedUserCardID: u.userCardID,
            };
          }
        }
        if (r.type === "PAYMENT" && r.requestData?.feeId && feeMap) {
          const fee = feeMap.get(r.requestData.feeId.toString());
          if (fee) {
            r.requestData = {
              ...r.requestData,
              feeName: fee.name,
            };
          }
        }
        return r;
      });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xử lý duyệt/từ chối yêu cầu (Dành cho Tổ trưởng)
// @route   PUT /api/requests/:id/review
export const reviewRequest = async (req, res) => {
  const { status, leaderComment } = req.body; // status = 'APPROVED' hoặc 'REJECTED'
  const requestId = req.params.id;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Review status is not valid" });
  }

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    
    if (request.status !== "PENDING") {
        return res.status(400).json({ message: "This request has been processed" });
    }
    const data = request.requestData || {};

    if (status === "APPROVED") {
      switch (request.type) {
        case "REGISTER": {
          const requesterUser = await User.findById(request.requester);
          if (!requesterUser) {
            return res.status(404).json({ message: "Requester account not found" });
          }
          requesterUser.status = "VERIFIED";
          await requesterUser.save();
          break;
        }

        // 2. Duyệt Cập nhật thông tin
        case "UPDATE_INFO":
          // Lấy data từ request đắp vào User
          await User.findByIdAndUpdate(
            request.requester,
            { 
              $set: data 
            },
            { runValidators: true }
          );
          break;

        // --- LOGIC MỚI: DUYỆT THANH TOÁN ---
        case "PAYMENT":
          {
            const { feeId, householdId, note } = data;
            const amount = Number(data.amount);
            if (!feeId || !householdId || !Number.isFinite(amount) || amount <= 0) {
              return res.status(400).json({ message: "Payment request is missing required data" });
            }
            const fee = await Fee.findById(feeId);
            if (!fee) return res.status(404).json({ message: "Fee not found" });
            if (fee.status === "COMPLETED") {
              return res.status(400).json({ message: "This fee collection has been closed" });
            }
            const household = await Household.findById(householdId);
            if (!household) {
              return res.status(404).json({ message: "Household not found" });
            }
            const isMember = household.leader?.toString() === request.requester.toString()
              || household.members?.some((member) => member?.toString() === request.requester.toString());
            if (!isMember) {
              return res.status(400).json({ message: "Requester does not belong to this household" });
            }
            const txNotes = note ? `${note} (Approved online)` : "Approved online";
            await Transaction.create({
              fee: feeId,
              household: householdId,
              amount,
              payer: request.requester,
              note: txNotes,
              status: "VERIFIED",
            });
          }
          break;
        // [New] Xử lý TẠM TRÚ
        case "TEMPORARY_RESIDENCE":
            let hist1 = await ResidentHistory.findOne({ houseHoldId: data.householdId });
            if (!hist1) hist1 = await ResidentHistory.create({ houseHoldId: data.householdId });
            
            hist1.temporaryResidents.push({
                name: data.name,
                userCardID: data.userCardID,
                dob: data.dob,
                sex: data.sex,
                birthLocation: data.birthLocation,
                ethnic: data.ethnic,
                phoneNumber: data.phoneNumber,
                job: data.job,
                permanentAddress: data.permanentAddress,
                reason: data.reason,
                startDate: data.startDate,
                endDate: data.endDate
            });
            await hist1.save();
            break;

        // [New] Xử lý TẠM VẮNG
        case "TEMPORARY_ABSENT":
            let hist2 = await ResidentHistory.findOne({ houseHoldId: data.householdId });
            if (!hist2) hist2 = await ResidentHistory.create({ houseHoldId: data.householdId });

            hist2.temporaryAbsent.push({
                user: data.absentUserId,
                startDate: data.fromDate,
                endDate: data.toDate,
                reason: data.reason,
                temporaryAddress: data.temporaryAddress
            });
            console.log("conchophucdu");
            await hist2.save();
            break;

        // [New] Xử lý KHAI SINH
        case "BIRTH_REPORT":
            // Cách cũ: Tạo User -> Lỗi vì thiếu Email
            // Cách mới: Lưu vào ResidentHistory
            
            if (!data.householdId || !mongoose.Types.ObjectId.isValid(data.householdId)) {
                return res.status(400).json({ message: "Invalid household for birth record" });
            }
            const birthHousehold = await Household.findById(data.householdId);
            if (!birthHousehold) {
                return res.status(404).json({ message: "Household not found for birth record" });
            }

            // 1. Tìm hoặc tạo lịch sử cư trú cho hộ này
            let histBirth = await ResidentHistory.findOne({ houseHoldId: data.householdId });
            if (!histBirth) {
                histBirth = await ResidentHistory.create({ houseHoldId: data.householdId });
            }

            // 2. Thêm thông tin bé vào mảng births
            histBirth.births.push({
                name: data.name,
                dob: data.dob,
                sex: data.sex,
                birthLocation: data.birthLocation,
                ethnic: data.ethnic,
                birthCertificateNumber: data.birthCertificateNumber, 
            });

            await histBirth.save();
            
            // Lưu ý: Không add vào Household.members nên sẽ không tăng phí vệ sinh
            break;

        // [New] Xử lý KHAI TỬ
        case "DEATH_REPORT":
            if (!data.householdId || !mongoose.Types.ObjectId.isValid(data.householdId)) {
                return res.status(400).json({ message: "Invalid household for death record" });
            }
            const household = await Household.findById(data.householdId);
            if (!household) {
                return res.status(404).json({ message: "Household not found for death record" });
            }
            // Nếu người mất là chủ hộ -> Chặn
            if (household.leader.toString() === data.deceasedUserId) {
                return res.status(400).json({ message: "Không thể duyệt báo tử cho Chủ hộ. Hãy yêu cầu đổi chủ hộ trước." });
            }
            const memberRoleId = await getMemberRoleId();
            // Update User thành DECEASED, Rời hộ
            await User.findByIdAndUpdate(data.deceasedUserId, {
                status: "DECEASED",
                household: null,
                relationshipWithHead: null,
                role: memberRoleId,
            });
            // Rút tên khỏi Household
            await Household.findByIdAndUpdate(data.householdId, {
                $pull: { members: data.deceasedUserId }
            });

            // Ghi lại lịch sử khai tử
            let histDeath = await ResidentHistory.findOne({ houseHoldId: data.householdId });
            if (!histDeath) histDeath = await ResidentHistory.create({ houseHoldId: data.householdId });
            histDeath.deaths.push({
                user: data.deceasedUserId,
                name: data.deceasedUserName,
                userCardID: data.deceasedUserCardID,
                dateOfDeath: data.dateOfDeath,
                reason: data.reason,
                deathCertificateUrl: data.deathCertificateUrl,
            });
            await histDeath.save();
            break;
        default:
          break;
      }
    }

    request.status = status;
    request.leaderComment = leaderComment || "";
    await request.save();

    res.status(200).json({ message: `${status} successful`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
