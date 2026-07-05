package com.pajedhow.backend.service;

import com.pajedhow.backend.entity.ActivityLog;
import com.pajedhow.backend.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository repository;

    @Transactional
    public void record(String actor, String action, String target) {
        repository.save(ActivityLog.builder()
                .actor(actor)
                .action(action)
                .target(target)
                .build());
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> recent(int limit) {
        return repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit)).getContent();
    }
}
