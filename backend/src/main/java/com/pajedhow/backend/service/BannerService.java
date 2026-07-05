package com.pajedhow.backend.service;

import com.pajedhow.backend.dto.MarketingDtos.BannerRequest;
import com.pajedhow.backend.dto.MarketingDtos.BannerResponse;
import com.pajedhow.backend.entity.Banner;
import com.pajedhow.backend.entity.enums.Enums.BannerStatus;
import com.pajedhow.backend.exception.BadRequestException;
import com.pajedhow.backend.exception.ResourceNotFoundException;
import com.pajedhow.backend.mapper.Mappers;
import com.pajedhow.backend.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> findAll() {
        return bannerRepository.findAll().stream().map(Mappers::toBanner).toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> findActive() {
        return bannerRepository.findByStatus(BannerStatus.ACTIVE).stream().map(Mappers::toBanner).toList();
    }

    @Transactional
    public BannerResponse create(BannerRequest req) {
        Banner b = Banner.builder()
                .title(req.title())
                .location(req.location())
                .image(req.image())
                .status(parseStatus(req.status()))
                .build();
        return Mappers.toBanner(bannerRepository.save(b));
    }

    @Transactional
    public BannerResponse update(Long id, BannerRequest req) {
        Banner b = get(id);
        b.setTitle(req.title());
        b.setLocation(req.location());
        b.setImage(req.image());
        b.setStatus(parseStatus(req.status()));
        return Mappers.toBanner(bannerRepository.save(b));
    }

    @Transactional
    public void delete(Long id) {
        bannerRepository.delete(get(id));
    }

    private Banner get(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found: " + id));
    }

    private BannerStatus parseStatus(String value) {
        if (value == null || value.isBlank()) return BannerStatus.ACTIVE;
        try {
            return BannerStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid banner status: " + value);
        }
    }
}
