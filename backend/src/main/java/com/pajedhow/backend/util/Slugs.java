package com.pajedhow.backend.util;

import com.pajedhow.backend.exception.BadRequestException;

import java.util.Locale;

public final class Slugs {

    private Slugs() {}

    public static String slugify(String input) {
        if (input == null || input.isBlank()) return "";
        return input.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("(^-|-$)", "");
    }

    /** Parse an enum by name, case-insensitively, with a clear error message. */
    public static <E extends Enum<E>> E parseEnum(Class<E> type, String value, E fallback) {
        if (value == null || value.isBlank()) return fallback;
        try {
            return Enum.valueOf(type, value.trim().toUpperCase(Locale.ROOT).replace(' ', '_'));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid value '" + value + "' for " + type.getSimpleName());
        }
    }
}
