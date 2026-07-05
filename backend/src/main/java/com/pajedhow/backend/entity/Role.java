package com.pajedhow.backend.entity;

/**
 * System roles. The four admin roles mirror the admin team roles used by the
 * frontend (Super Admin, Manager, Editor, Support); CUSTOMER is the buyer role.
 */
public enum Role {
    SUPER_ADMIN,
    MANAGER,
    EDITOR,
    SUPPORT,
    CUSTOMER;

    /** Spring Security authority name, e.g. ROLE_SUPER_ADMIN. */
    public String authority() {
        return "ROLE_" + name();
    }

    /** True for any staff/admin role (everything except CUSTOMER). */
    public boolean isAdmin() {
        return this != CUSTOMER;
    }
}
