package com.realestate.messaging_service.mapper;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Entiteti cuvaju LocalDateTime u zoni servera (u Docker-u UTC). U odgovoru se salje Instant
 * ("...Z"), da browser tacno prikaze vreme poruke bez obzira na zonu servera.
 */
public final class TimeMapper {

    private TimeMapper() {}

    public static Instant toInstant(LocalDateTime dateTime) {
        return dateTime == null ? null : dateTime.atZone(ZoneId.systemDefault()).toInstant();
    }
}
