package com.pajedhow.backend.service;

import com.pajedhow.backend.entity.ActivityLog;
import com.pajedhow.backend.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository repository;

    public void record(String actor, String action, String target) {
        repository.save(ActivityLog.builder()
                .actor(actor)
                .action(action)
                .target(target)
                .build());
    }
}
