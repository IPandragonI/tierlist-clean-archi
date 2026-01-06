package fr.esgi.tierlist.application.controller;

import fr.esgi.tierlist.application.dto.LogoDto;
import fr.esgi.tierlist.application.form.LogoForm;
import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.service.LogoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logos")
public class LogoController {
    private final LogoService logoService;

    public LogoController(LogoService logoService) {
        this.logoService = logoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create or retrieve a logo by domain")
    public ResponseEntity<LogoDto> getOrCreateLogo(@Valid @RequestBody LogoForm request) {
        Logo logo = logoService.getOrCreateLogo(request.getDomain());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(LogoDto.transfer(logo));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get logo by ID")
    public ResponseEntity<LogoDto> getLogoById(@PathVariable Long id) {
        Logo logo = logoService.getLogoById(id);
        return ResponseEntity.ok(LogoDto.transfer(logo));
    }

    @GetMapping("/domain/{domain}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get logo by domain")
    public ResponseEntity<LogoDto> getLogoByDomain(@PathVariable String domain) {
        return logoService.getLogoByDomain(domain)
                .map(logo -> ResponseEntity.ok(LogoDto.transfer(logo)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all logos")
    public ResponseEntity<List<LogoDto>> getAllLogos() {
        List<LogoDto> logos = logoService.getAllLogos().stream()
                .map(LogoDto::transfer)
                .collect(Collectors.toList());
        return ResponseEntity.ok(logos);
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Search logos by name")
    public ResponseEntity<List<LogoDto>> searchLogos(@RequestParam String name) {
        List<LogoDto> logos = logoService.searchLogosByName(name).stream()
                .map(LogoDto::transfer)
                .collect(Collectors.toList());
        return ResponseEntity.ok(logos);
    }

    @PutMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Refresh logo by domain")
    public ResponseEntity<LogoDto> refreshLogo(@Valid @RequestBody LogoForm request) {
        Logo logo = logoService.refreshLogo(request.getDomain());
        return ResponseEntity.ok(LogoDto.transfer(logo));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete logo by ID")
    public ResponseEntity<Void> deleteLogo(@PathVariable Long id) {
        logoService.deleteLogo(id);
        return ResponseEntity.noContent().build();
    }
}