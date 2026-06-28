package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.Fee;
import com.apartmentmanagement.entity.Household;
import com.apartmentmanagement.entity.Transaction;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.FeeStatus;
import com.apartmentmanagement.repository.FeeRepository;
import com.apartmentmanagement.repository.HouseholdRepository;
import com.apartmentmanagement.repository.RequestRepository;
import com.apartmentmanagement.repository.TransactionRepository;
import com.apartmentmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;
    private final TransactionRepository transactionRepository;
    private final FeeRepository feeRepository;
    private final RequestRepository requestRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        long totalUsers = userRepository.countByStatus("VERIFIED");
        long totalHouseholds = householdRepository.count();
        long males = userRepository.countBySex("Nam");
        long females = userRepository.countBySex("Nữ");

        Map<String, Object> response = new LinkedHashMap<>();
        Map<String, Object> demographics = new LinkedHashMap<>();
        demographics.put("total_users", totalUsers);
        demographics.put("total_households", totalHouseholds);
        Map<String, Long> gender = new LinkedHashMap<>();
        gender.put("male", males);
        gender.put("female", females);
        demographics.put("gender", gender);
        response.put("demographics", demographics);

        // Check if user can view fee stats
        boolean canViewFeeStats = currentUser.getRole() != null &&
                currentUser.getRole().getPermissions() != null &&
                currentUser.getRole().getPermissions().stream()
                        .anyMatch(p -> "VIEW FEE STATS".equals(p.getPermission_name()));

        Map<String, Object> financial = new LinkedHashMap<>();
        if (canViewFeeStats) {
            List<Transaction> allTransactions = transactionRepository.findAll();
            double totalRevenue = allTransactions.stream().mapToDouble(Transaction::getAmount).sum();
            long activeCampaigns = feeRepository.findByStatus(FeeStatus.ACTIVE).size();

            // Calculate required amounts
            List<Fee> activeFees = feeRepository.findByStatus(FeeStatus.ACTIVE);
            List<Household> allHouseholds = householdRepository.findAll();
            double totalRequired = 0;
            double totalPaid = 0;

            for (Fee fee : activeFees) {
                if (fee.getType() == com.apartmentmanagement.enums.FeeType.MANDATORY) {
                    for (Household household : allHouseholds) {
                        int memberCount = household.getMembers() != null ? household.getMembers().size() : 0;
                        totalRequired += fee.getUnitPrice() * 12 * memberCount;
                    }
                }
            }

            for (Transaction tx : allTransactions) {
                boolean isForActiveFee = activeFees.stream().anyMatch(f -> f.getId().equals(
                        tx.getFee() != null ? tx.getFee().getId() : null));
                if (isForActiveFee) {
                    totalPaid += tx.getAmount();
                }
            }

            double totalUnpaid = Math.max(0, totalRequired - totalPaid);

            financial.put("total_revenue", totalRevenue);
            financial.put("active_campaigns", activeCampaigns);
            Map<String, Double> paymentStatus = new LinkedHashMap<>();
            paymentStatus.put("paid_amount", totalPaid);
            paymentStatus.put("unpaid_amount", totalUnpaid);
            paymentStatus.put("total_required", totalRequired);
            financial.put("payment_status", paymentStatus);
        } else {
            financial.put("total_revenue", 0);
            financial.put("active_campaigns", 0);
            Map<String, Integer> paymentStatus = new LinkedHashMap<>();
            paymentStatus.put("paid_amount", 0);
            paymentStatus.put("unpaid_amount", 0);
            paymentStatus.put("total_required", 0);
            financial.put("payment_status", paymentStatus);
        }
        response.put("financial", financial);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-dashboard")
    public ResponseEntity<?> getUserDashboardStats() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (currentUser.getHousehold() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bạn chưa thuộc hộ gia đình nào"));
        }

        Household household = householdRepository.findById(currentUser.getHousehold().getId()).orElse(null);
        if (household == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy hộ gia đình"));
        }

        Map<String, Object> response = new LinkedHashMap<>();

        Map<String, Object> householdInfo = new LinkedHashMap<>();
        householdInfo.put("householdId", household.getHouseHoldID());
        householdInfo.put("address", household.getAddress());
        householdInfo.put("leaderName", household.getLeader() != null ? household.getLeader().getName() : "N/A");
        response.put("household", householdInfo);

        int memberCount = household.getMembers() != null ? household.getMembers().size() : 0;
        response.put("members", memberCount);

        // Finance
        List<Fee> activeFees = feeRepository.findByStatus(FeeStatus.ACTIVE);
        List<Transaction> paidTransactions = transactionRepository.findByHousehold(household.getId());

        double totalDue = 0;
        double totalPaid = 0;
        double totalUnpaid = 0;
        List<Map<String, Object>> unpaidFees = new ArrayList<>();
        List<Map<String, Object>> paidFees = new ArrayList<>();

        for (Fee fee : activeFees) {
            double paidAmount = paidTransactions.stream()
                    .filter(t -> t.getFee() != null && t.getFee().getId().equals(fee.getId()))
                    .mapToDouble(Transaction::getAmount).sum();

            double requiredAmount = 0;
            String status = "UNPAID";

            if (fee.getType() == com.apartmentmanagement.enums.FeeType.MANDATORY) {
                requiredAmount = fee.getUnitPrice() * 12 * memberCount;
                if (paidAmount == 0) status = "UNPAID";
                else if (paidAmount < requiredAmount) status = "PARTIAL";
                else status = "COMPLETED";
            } else {
                status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
            }

            double remaining = Math.max(0, requiredAmount - paidAmount);

            Map<String, Object> feeDetail = new LinkedHashMap<>();
            feeDetail.put("feeId", fee.getId());
            feeDetail.put("name", fee.getName());
            feeDetail.put("type", fee.getType().toString());
            feeDetail.put("description", fee.getDescription());
            feeDetail.put("unitPrice", fee.getUnitPrice());
            feeDetail.put("memberCount", memberCount);
            feeDetail.put("requiredAmount", requiredAmount);
            feeDetail.put("paidAmount", paidAmount);
            feeDetail.put("remainingAmount", remaining);
            feeDetail.put("remaining", remaining);
            feeDetail.put("status", status);

            if (fee.getType() == com.apartmentmanagement.enums.FeeType.MANDATORY) {
                totalDue += requiredAmount;
                totalPaid += paidAmount;
            }

            if (remaining > 0) {
                unpaidFees.add(feeDetail);
                if (fee.getType() == com.apartmentmanagement.enums.FeeType.MANDATORY) {
                    totalUnpaid += remaining;
                }
            }
            if (paidAmount > 0) {
                paidFees.add(feeDetail);
            }
        }

        Map<String, Double> finance = new LinkedHashMap<>();
        finance.put("total_due", totalDue);
        finance.put("total_paid", totalPaid);
        finance.put("total_unpaid", totalUnpaid);
        response.put("finance", finance);

        long pendingRequests = requestRepository.countByRequesterAndStatus(currentUser.getId(), "PENDING");
        response.put("pending_requests", pendingRequests);

        Map<String, Double> paymentStats = new LinkedHashMap<>();
        paymentStats.put("paid", totalPaid);
        paymentStats.put("unpaid", totalUnpaid);
        paymentStats.put("total", totalDue);
        response.put("payment_stats", paymentStats);

        Map<String, Object> feesDetail = new LinkedHashMap<>();
        feesDetail.put("unpaidFees", unpaidFees);
        feesDetail.put("paidFees", paidFees);
        response.put("fees_detail", feesDetail);

        return ResponseEntity.ok(response);
    }
}
