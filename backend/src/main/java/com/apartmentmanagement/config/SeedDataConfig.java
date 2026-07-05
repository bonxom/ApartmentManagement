package com.apartmentmanagement.config;

import com.apartmentmanagement.entity.*;
import com.apartmentmanagement.enums.*;
import com.apartmentmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeedDataConfig implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;
    private final FeeRepository feeRepository;
    private final TransactionRepository transactionRepository;
    private final ResidentHistoryRepository residentHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Map<String, String> INIT_PERMISSIONS = new LinkedHashMap<>();
    static {
        INIT_PERMISSIONS.put("CREATE USER", "Create a user account");
        INIT_PERMISSIONS.put("DELETE USER", "Delete a user account");
        INIT_PERMISSIONS.put("EDIT USER", "Update user information");
        INIT_PERMISSIONS.put("VIEW USER LIST", "See the list of users");
        INIT_PERMISSIONS.put("VIEW USER", "See a user's profile");
        INIT_PERMISSIONS.put("DEACTIVATE USER", "Disable an account without deleting");
        INIT_PERMISSIONS.put("VERIFY USER", "Verify user information");
        INIT_PERMISSIONS.put("RESET USER PASSWORD", "Reset a user's password");
        INIT_PERMISSIONS.put("ASSIGN ROLES", "Assign roles to a user");
        INIT_PERMISSIONS.put("CREATE ACCOUNT", "Create accountant or user account");
        INIT_PERMISSIONS.put("MANAGE USER PERMISSIONS", "Grant/revoke permissions");
        INIT_PERMISSIONS.put("VIEW PERMISSIONS", "See all permissions");
        INIT_PERMISSIONS.put("CREATE PERMISSION", "Create a permission");
        INIT_PERMISSIONS.put("EDIT PERMISSION", "Edit permission details");
        INIT_PERMISSIONS.put("DELETE PERMISSION", "Delete a permission");
        INIT_PERMISSIONS.put("VIEW ROLES", "See all roles");
        INIT_PERMISSIONS.put("CREATE ROLE", "Create a role");
        INIT_PERMISSIONS.put("EDIT ROLE", "Edit role details");
        INIT_PERMISSIONS.put("DELETE ROLE", "Delete a role");
        INIT_PERMISSIONS.put("CHANGE HOUSEHOLD LEADER", "Change household leader");
        INIT_PERMISSIONS.put("VIEW HOUSEHOLD LIST", "See households");
        INIT_PERMISSIONS.put("VIEW HOUSEHOLD", "See household details");
        INIT_PERMISSIONS.put("CREATE HOUSEHOLD", "Create a household");
        INIT_PERMISSIONS.put("EDIT HOUSEHOLD", "Edit/Split/Move household");
        INIT_PERMISSIONS.put("DELETE HOUSEHOLD", "Delete a household");
        INIT_PERMISSIONS.put("VIEW FEES", "See all fees");
        INIT_PERMISSIONS.put("CREATE FEE", "Create a fee");
        INIT_PERMISSIONS.put("EDIT FEE", "Edit fee information");
        INIT_PERMISSIONS.put("DELETE FEE", "Delete a fee");
        INIT_PERMISSIONS.put("CALCULATE FEE", "Calculate household fee");
        INIT_PERMISSIONS.put("RECORD PAYMENT", "Record payment transaction");
        INIT_PERMISSIONS.put("VIEW FEE STATS", "View fee stats");
        INIT_PERMISSIONS.put("VIEW BASIC STATS", "View basic dashboard stats");
        INIT_PERMISSIONS.put("READ REQUESTS LIST", "View request list");
        INIT_PERMISSIONS.put("REJECT REQUEST", "Reject a request");
        INIT_PERMISSIONS.put("APPROVE REQUEST", "Approve a request");
    }

    @Override
    public void run(String... args) {
        try {
            cleanExistingData();
            initPermissions();
            initRoles();
            initUsers();
            initHouseholds();
            initFees();
            initTransactions();
            log.info("Seed data initialization completed successfully!");
        } catch (Exception e) {
            log.error("Seed data initialization failed", e);
        }
    }

    @Transactional
    private void cleanExistingData() {
        log.info("Cleaning existing data for fresh seed...");
        transactionRepository.deleteAll();
        feeRepository.deleteAll();

        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            user.setHousehold(null);
            user.setRole(null);
        });
        userRepository.saveAll(users);

        List<Household> households = householdRepository.findAll();
        households.forEach(household -> household.setLeader(null));
        householdRepository.saveAll(households);

        residentHistoryRepository.deleteAll();
        userRepository.deleteAll();
        householdRepository.deleteAll();
        roleRepository.deleteAll();
        permissionRepository.deleteAll();
        log.info("All existing data cleaned.");
    }

    @Transactional
    private void initPermissions() {
        for (var entry : INIT_PERMISSIONS.entrySet()) {
            if (permissionRepository.findByPermission_name(entry.getKey()).isEmpty()) {
                permissionRepository.save(Permission.builder()
                        .permission_name(entry.getKey())
                        .description(entry.getValue())
                        .build());
                log.debug("Created permission: {}", entry.getKey());
            }
        }
    }

    private List<Permission> getPermissions(List<String> names) {
        List<Permission> perms = new ArrayList<>();
        for (String name : names) {
            permissionRepository.findByPermission_name(name).ifPresent(perms::add);
        }
        return perms;
    }

    @Transactional
    private void initRoles() {
        Map<String, List<String>> rolePerms = new LinkedHashMap<>();
        rolePerms.put("HAMLET LEADER", Arrays.asList(
                "CREATE USER", "DELETE USER", "EDIT USER", "VIEW USER LIST", "VIEW USER",
                "DEACTIVATE USER", "VERIFY USER", "RESET USER PASSWORD", "ASSIGN ROLES",
                "CREATE ACCOUNT", "MANAGE USER PERMISSIONS",
                "VIEW PERMISSIONS", "CREATE PERMISSION", "EDIT PERMISSION", "DELETE PERMISSION",
                "VIEW ROLES", "CREATE ROLE", "EDIT ROLE", "DELETE ROLE",
                "CHANGE HOUSEHOLD LEADER", "VIEW HOUSEHOLD LIST", "VIEW HOUSEHOLD",
                "CREATE HOUSEHOLD", "EDIT HOUSEHOLD", "DELETE HOUSEHOLD",
                "VIEW FEES", "CREATE FEE", "EDIT FEE", "DELETE FEE",
                "CALCULATE FEE", "RECORD PAYMENT", "VIEW FEE STATS",
                "READ REQUESTS LIST", "REJECT REQUEST", "APPROVE REQUEST"
        ));
        rolePerms.put("ACCOUNTANT", Arrays.asList(
                "VIEW USER LIST", "VIEW USER", "VIEW PERMISSIONS", "VIEW ROLES",
                "VIEW HOUSEHOLD LIST", "VIEW HOUSEHOLD",
                "VIEW FEES", "CALCULATE FEE", "RECORD PAYMENT", "VIEW FEE STATS",
                "READ REQUESTS LIST", "APPROVE REQUEST"
        ));
        rolePerms.put("HOUSE MEMBER", Arrays.asList("VIEW USER", "VIEW HOUSEHOLD", "VIEW BASIC STATS"));
        rolePerms.put("MEMBER", Arrays.asList("VIEW USER", "VIEW BASIC STATS"));

        for (var entry : rolePerms.entrySet()) {
            Optional<Role> existingRole = roleRepository.findByRole_name(entry.getKey());

            if (existingRole.isEmpty()) {
                List<Permission> perms = getPermissions(entry.getValue());
                roleRepository.save(Role.builder()
                        .role_name(entry.getKey())
                        .permissions(perms)
                        .build());
                log.debug("Created role: {}", entry.getKey());
            } else {
                Role role = existingRole.get();
                role.setPermissions(getPermissions(entry.getValue()));
                roleRepository.save(role);
            }
        }
    }

    @Transactional
    private void initUsers() {
        Role hamletRole = roleRepository.findByRole_name("HAMLET LEADER").orElse(null);
        Role accountantRole = roleRepository.findByRole_name("ACCOUNTANT").orElse(null);
        Role houseMemberRole = roleRepository.findByRole_name("HOUSE MEMBER").orElse(null);
        Role memberRole = roleRepository.findByRole_name("MEMBER").orElse(null);

        // Admin
        createUserIfNotExists("admin@res.com", 1L, "123456", "Administrator",
                "Nam", "1985-06-12", "TP. Test", hamletRole, UserStatus.VERIFIED);
        // Leader
        createUserIfNotExists("leader@resident.test", 689123456010L, "123456", "Lãnh đạo thôn",
                "Nam", "1985-06-12", "Tổ 1, Phường Seed, TP. Test", hamletRole, UserStatus.VERIFIED);

        // Accountants
        createUserIfNotExists("accountant@resident.test", 689123456002L, "123456", "Trần Quốc Huy",
                "Nam", "1990-11-02", "Tổ 3, Khu phố 1, Phường An Phú", accountantRole, UserStatus.VERIFIED);
        createUserIfNotExists("accountant2@resident.test", 689123456102L, "123456", "Nguyễn Thị Mai",
                "Nữ", "1992-04-15", "Tổ 4, Khu phố 2, Phường Hiệp Thành", accountantRole, UserStatus.VERIFIED);

        // Household 1 members
        createUserIfNotExists("household.leader1@resident.test", 689123456201L, "123456", "Nguyễn Văn Chủ",
                "Nam", "1980-01-10", "Tổ 1, Phường Seed, TP. Test", houseMemberRole, UserStatus.VERIFIED);
        createUserIfNotExists("household.member1@resident.test", 689123456202L, "123456", "Lê Thị Thành Viên",
                "Nữ", "1985-04-12", "Tổ 1, Phường Seed, TP. Test", houseMemberRole, UserStatus.VERIFIED);
        createUserIfNotExists("household.member2@resident.test", 689123456203L, "123456", "Nguyễn Văn Thành Viên",
                "Nam", "2005-09-15", "Tổ 1, Phường Seed, TP. Test", houseMemberRole, UserStatus.VERIFIED);

        // Household 2 members
        createUserIfNotExists("household.leader2@resident.test", 689123456204L, "123456", "Trần Thị Chủ",
                "Nữ", "1978-03-20", "Tổ 2, Phường Seed, TP. Test", houseMemberRole, UserStatus.VERIFIED);
        createUserIfNotExists("household.member3@resident.test", 689123456205L, "123456", "Phạm Văn Thành Viên",
                "Nam", "1999-12-01", "Tổ 2, Phường Seed, TP. Test", houseMemberRole, UserStatus.VERIFIED);

        // Unassigned members
        createUserIfNotExists("member@resident.test", 689123456004L, "123456", "Đặng Hoài Nam",
                "Nam", "2002-09-09", "Tổ 2, Phường Chánh Nghĩa", memberRole, UserStatus.VERIFIED);
    }

    private void createUserIfNotExists(String email, Long userCardID, String password, String name,
                                        String sex, String dob, String birthLocation, Role role, UserStatus status) {
        if (userRepository.findByEmail(email).isPresent()) {
            return;
        }

        User user = User.builder()
                .email(email)
                .userCardID(userCardID)
                .password(passwordEncoder.encode(password))
                .name(name)
                .sex(sex)
                .birthLocation(birthLocation)
                .role(role)
                .status(status)
                .build();
        userRepository.save(user);
        log.debug("Created user: {}", email);
    }

    @Transactional
    private void initHouseholds() {
        if (householdRepository.findByHouseHoldID("SEED-HH-001").isEmpty()) {
            User leader = userRepository.findByEmail("household.leader1@resident.test").orElse(null);
            User member1 = userRepository.findByEmail("household.member1@resident.test").orElse(null);
            User member2 = userRepository.findByEmail("household.member2@resident.test").orElse(null);
            Role houseMemberRole = roleRepository.findByRole_name("HOUSE MEMBER").orElse(null);

            if (leader != null) {
                Household hh = Household.builder()
                        .houseHoldID("SEED-HH-001")
                        .address("Tổ 1, Phường Seed, TP. Test")
                        .leader(leader)
                        .build();
                hh = householdRepository.save(hh);

                // Update users to associate with this household
                leader.setHousehold(hh);
                leader.setRelationshipWithHead("Chủ hộ");
                if (houseMemberRole != null) leader.setRole(houseMemberRole);
                userRepository.save(leader);

                if (member1 != null) {
                    member1.setHousehold(hh);
                    member1.setRelationshipWithHead("Vợ");
                    if (houseMemberRole != null) member1.setRole(houseMemberRole);
                    userRepository.save(member1);
                }
                if (member2 != null) {
                    member2.setHousehold(hh);
                    member2.setRelationshipWithHead("Con");
                    if (houseMemberRole != null) member2.setRole(houseMemberRole);
                    userRepository.save(member2);
                }

                // Create ResidentHistory
                residentHistoryRepository.save(ResidentHistory.builder()
                        .household(hh)
                        .build());

                log.debug("Created household: SEED-HH-001");
            }
        }

        if (householdRepository.findByHouseHoldID("SEED-HH-002").isEmpty()) {
            User leader = userRepository.findByEmail("household.leader2@resident.test").orElse(null);
            User member = userRepository.findByEmail("household.member3@resident.test").orElse(null);
            Role houseMemberRole = roleRepository.findByRole_name("HOUSE MEMBER").orElse(null);

            if (leader != null) {
                Household hh = Household.builder()
                        .houseHoldID("SEED-HH-002")
                        .address("Tổ 2, Phường Seed, TP. Test")
                        .leader(leader)
                        .build();
                hh = householdRepository.save(hh);

                leader.setHousehold(hh);
                leader.setRelationshipWithHead("Chủ hộ");
                if (houseMemberRole != null) leader.setRole(houseMemberRole);
                userRepository.save(leader);

                if (member != null) {
                    member.setHousehold(hh);
                    member.setRelationshipWithHead("Em");
                    if (houseMemberRole != null) member.setRole(houseMemberRole);
                    userRepository.save(member);
                }

                residentHistoryRepository.save(ResidentHistory.builder()
                        .household(hh)
                        .build());

                log.debug("Created household: SEED-HH-002");
            }
        }
    }

    @Transactional
    private void initFees() {
        if (feeRepository.findByName("Phí vệ sinh 2024").isEmpty()) {
            feeRepository.save(Fee.builder()
                    .name("Phí vệ sinh 2024")
                    .type(FeeType.MANDATORY)
                    .description("Thu theo đầu người trong năm 2024")
                    .unitPrice(6000.0)
                    .status(FeeStatus.ACTIVE)
                    .build());
        }
        if (feeRepository.findByName("Phí an ninh 2024").isEmpty()) {
            feeRepository.save(Fee.builder()
                    .name("Phí an ninh 2024")
                    .type(FeeType.MANDATORY)
                    .description("Khoản thu an ninh khu phố năm 2024")
                    .unitPrice(5000.0)
                    .status(FeeStatus.ACTIVE)
                    .build());
        }
        if (feeRepository.findByName("Quỹ thiện nguyện 2024").isEmpty()) {
            feeRepository.save(Fee.builder()
                    .name("Quỹ thiện nguyện 2024")
                    .type(FeeType.VOLUNTARY)
                    .description("Ủng hộ quỹ thiện nguyện của khu phố")
                    .status(FeeStatus.ACTIVE)
                    .build());
        }
        if (feeRepository.findByName("Ủng hộ thiên tai 2024").isEmpty()) {
            feeRepository.save(Fee.builder()
                    .name("Ủng hộ thiên tai 2024")
                    .type(FeeType.VOLUNTARY)
                    .description("Đóng góp hỗ trợ thiên tai năm 2024")
                    .status(FeeStatus.ACTIVE)
                    .build());
        }
        if (feeRepository.findByName("Phí bảo trì 2023").isEmpty()) {
            feeRepository.save(Fee.builder()
                    .name("Phí bảo trì 2023")
                    .type(FeeType.MANDATORY)
                    .description("Khoản thu đã chốt sổ năm 2023")
                    .unitPrice(8000.0)
                    .status(FeeStatus.COMPLETED)
                    .build());
        }
    }

    @Transactional
    private void initTransactions() {
        Fee feeMandatory = feeRepository.findByName("Phí vệ sinh 2024").orElse(null);
        Fee feeVoluntary = feeRepository.findByName("Quỹ thiện nguyện 2024").orElse(null);
        Household hh1 = householdRepository.findByHouseHoldID("SEED-HH-001").orElse(null);
        Household hh2 = householdRepository.findByHouseHoldID("SEED-HH-002").orElse(null);

        if (feeMandatory != null && hh1 != null) {
            int memberCount = (int) userRepository.countByHouseholdId(hh1.getId());
            double required = feeMandatory.getUnitPrice() * 12 * Math.max(1, memberCount);
            Transaction tx = Transaction.builder()
                    .fee(feeMandatory)
                    .household(hh1)
                    .payer(hh1.getLeader())
                    .amount(Math.max(1, required / 2))
                    .note("seed:tx:hh1:mandatory-partial")
                    .status(TransactionStatus.VERIFIED)
                    .build();
            transactionRepository.save(tx);
        }

        if (feeMandatory != null && hh2 != null) {
            int memberCount = (int) userRepository.countByHouseholdId(hh2.getId());
            double required = feeMandatory.getUnitPrice() * 12 * Math.max(1, memberCount);
            Transaction tx = Transaction.builder()
                    .fee(feeMandatory)
                    .household(hh2)
                    .payer(hh2.getLeader())
                    .amount(Math.max(1, required))
                    .note("seed:tx:hh2:mandatory-full")
                    .status(TransactionStatus.VERIFIED)
                    .build();
            transactionRepository.save(tx);
        }

        if (feeVoluntary != null && hh1 != null) {
            Transaction tx = Transaction.builder()
                    .fee(feeVoluntary)
                    .household(hh1)
                    .payer(hh1.getLeader())
                    .amount(200000.0)
                    .note("seed:tx:hh1:voluntary")
                    .status(TransactionStatus.VERIFIED)
                    .build();
            transactionRepository.save(tx);
        }
    }
}
