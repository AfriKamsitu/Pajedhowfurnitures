package com.pajedhow.backend.controller;

import com.pajedhow.backend.dto.MarketingDtos.BannerResponse;
import com.pajedhow.backend.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Public active banners for the storefront homepage/shop. */
@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/active")
    public List<BannerResponse> active() {
        return bannerService.findActive();
    }
}
