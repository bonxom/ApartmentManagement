package com.apartmentmanagement.service;

import com.apartmentmanagement.entity.Fee;
import com.apartmentmanagement.entity.Household;
import com.apartmentmanagement.entity.Transaction;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.FeeStatus;
import com.apartmentmanagement.enums.FeeType;
import com.apartmentmanagement.exception.BusinessException;
import com.apartmentmanagement.exception.ResourceNotFoundException;
import com.apartmentmanagement.repository.FeeRepository;
import com.apartmentmanagement.repository.HouseholdRepository;
import com.apartmentmanagement.repository.TransactionRepository;
import com.apartmentmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final HouseholdRepository householdRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Fee createFee(String name, String type, String description, Double unitPrice) {
        FeeType feeType;
        try {
            feeType = FeeType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid fee type: " + type);
        }

        if (feeType == FeeType.MANDATORY && (unitPrice == null || unitPrice < 0)) {
            throw new BusinessException("This mandatory fee should have unit price");
        }

        Fee fee = Fee.builder()
                .name(name)
                .type(feeType)
                .description(description)
                .unitPrice(unitPrice != null ? unitPrice : 0.0)
                .status(FeeStatus.ACTIVE)
                .build();
        return feeRepository.save(fee);
    }

    @Transactional(readOnly = true)
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getFeeStatistics(String feeId) {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee not found"));

        List<Household> households = householdRepository.findAll();
        List<Transaction> transactions = transactionRepository.findByFeeId(feeId);

        double totalExpected = 0;
        double totalCollected = 0;
        List<Map<String, Object>> details = new ArrayList<>();

        for (Household h : households) {
            int memberCount = (int) userRepository.countByHouseholdId(h.getId());
            double paidAmount = transactions.stream()
                    .filter(t -> t.getHousehold() != null && t.getHousehold().getId().equals(h.getId()))
                    .mapToDouble(Transaction::getAmount).sum();

            double requiredAmount = 0;
            String status;
            if (fee.getType() == FeeType.MANDATORY) {
                requiredAmount = fee.getUnitPrice() * 12 * memberCount;
                if (paidAmount == 0) status = "UNPAID";
                else if (paidAmount < requiredAmount) status = "PARTIAL";
                else status = "COMPLETED";
                totalExpected += requiredAmount;
            } else {
                status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
            }
            totalCollected += paidAmount;

            Map<String, Object> detail = new LinkedHashMap<>();
            detail.put("household_id", h.getId());
            detail.put("household_code", h.getHouseHoldID());
            detail.put("address", h.getAddress());
            detail.put("member_count", memberCount);
            detail.put("required", requiredAmount);
            detail.put("paid", paidAmount);
            detail.put("remaining", fee.getType() == FeeType.MANDATORY ? Math.max(0, requiredAmount - paidAmount) : 0);
            detail.put("status", status);
            details.add(detail);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("fee_info", fee);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("total_households", households.size());
        summary.put("total_expected", totalExpected);
        summary.put("total_collected", totalCollected);
        response.put("summary", summary);
        response.put("details", details);

        return response;
    }

    @Transactional
    public Fee updateFee(String feeId, String name, String description, String status, Double unitPrice) {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee not found"));

        if (name != null && !name.isEmpty()) fee.setName(name);
        if (description != null) fee.setDescription(description);
        if (status != null) {
            try { fee.setStatus(FeeStatus.valueOf(status.toUpperCase())); }
            catch (IllegalArgumentException e) { /* ignore invalid status */ }
        }
        if (unitPrice != null && fee.getType() == FeeType.MANDATORY) {
            fee.setUnitPrice(unitPrice);
        }

        return feeRepository.save(fee);
    }

    @Transactional
    public void deleteFee(String feeId) {
        if (!feeRepository.existsById(feeId)) {
            throw new ResourceNotFoundException("Fee not found");
        }
        if (transactionRepository.countByFeeId(feeId) > 0) {
            throw new BusinessException("Cannot delete fee with existing transactions");
        }
        feeRepository.deleteById(feeId);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyHouseholdFees(User user) {
        if (user.getHousehold() == null) {
            throw new BusinessException("Bạn chưa thuộc hộ khẩu nào.");
        }
        Household household = householdRepository.findById(user.getHousehold().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        return calculateHouseholdFees(household);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getHouseholdFeesByAdmin(String householdId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        List<Map<String, Object>> fees = calculateHouseholdFees(household);

        Map<String, Object> result = new LinkedHashMap<>();
        Map<String, Object> hhInfo = new LinkedHashMap<>();
        hhInfo.put("id", household.getId());
        hhInfo.put("name", household.getHouseHoldID());
        hhInfo.put("address", household.getAddress());
        hhInfo.put("leader", household.getLeader() != null ? household.getLeader().getId() : null);
        result.put("household", hhInfo);
        result.put("fees", fees);
        return result;
    }

    private List<Map<String, Object>> calculateHouseholdFees(Household household) {
        List<Fee> activeFees = feeRepository.findByStatus(FeeStatus.ACTIVE);
        int memberCount = (int) userRepository.countByHouseholdId(household.getId());
        List<Transaction> myTransactions = transactionRepository.findByHouseholdId(household.getId());

        return activeFees.stream().map(fee -> {
            double paidAmount = myTransactions.stream()
                    .filter(t -> t.getFee() != null && t.getFee().getId().equals(fee.getId()))
                    .mapToDouble(Transaction::getAmount).sum();

            double requiredAmount = 0;
            String status = "UNPAID";
            if (fee.getType() == FeeType.MANDATORY) {
                requiredAmount = fee.getUnitPrice() * 12 * memberCount;
                if (paidAmount == 0) status = "UNPAID";
                else if (paidAmount < requiredAmount) status = "PARTIAL";
                else status = "COMPLETED";
            } else {
                status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
            }

            Map<String, Object> feeMap = new LinkedHashMap<>();
            feeMap.put("feeId", fee.getId());
            feeMap.put("name", fee.getName());
            feeMap.put("type", fee.getType().toString());
            feeMap.put("description", fee.getDescription());
            feeMap.put("unitPrice", fee.getUnitPrice());
            feeMap.put("memberCount", memberCount);
            feeMap.put("requiredAmount", requiredAmount);
            feeMap.put("paidAmount", paidAmount);
            feeMap.put("remainingAmount", Math.max(0, requiredAmount - paidAmount));
            feeMap.put("status", status);
            return feeMap;
        }).collect(Collectors.toList());
    }
}
