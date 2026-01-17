package fr.esgi.tierlist.config;

import fr.esgi.tierlist.application.view.ExportStatPdfView;
import fr.esgi.tierlist.domain.port.*;
import fr.esgi.tierlist.domain.service.*;
import fr.esgi.tierlist.infrastructure.security.IAuthenticationFacade;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.View;

@Configuration
public class BeanConfiguration {

    @Bean
    public View exportSyntheseTierListsPdfView() {
        return new ExportStatPdfView();
    }
}
