package fr.esgi.tierlist.config;

import fr.esgi.tierlist.domain.port.*;
import fr.esgi.tierlist.domain.service.ColumnService;
import fr.esgi.tierlist.domain.service.LogoService;
import fr.esgi.tierlist.domain.service.TierListService;
import fr.esgi.tierlist.domain.service.UserService;
import fr.esgi.tierlist.infrastructure.security.IAuthenticationFacade;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public UserService userService(UserDatasourcePort userDatasourcePort) {
        return new UserService(userDatasourcePort);
    }

    @Bean
    public TierListService tierListService(TierListDatasourcePort tierListDatasourcePort,
                                           ColumnDatasourcePort columnDatasourcePort,
                                           LogoDatasourcePort logoDatasourcePort,
                                           LogoProviderPort logoProviderPort,
                                           ObjectStoragePort objectStoragePort,
                                           IAuthenticationFacade authenticationFacade) {
        return new TierListService(tierListDatasourcePort, columnService(columnDatasourcePort),
                logoService(logoDatasourcePort, logoProviderPort, objectStoragePort), authenticationFacade);
    }

    @Bean
    public LogoService logoService(LogoDatasourcePort logoDatasourcePort, LogoProviderPort logoProviderPort, ObjectStoragePort objectStoragePort) {
        return new LogoService(logoDatasourcePort, logoProviderPort, objectStoragePort);
    }

    @Bean
    public ColumnService columnService(ColumnDatasourcePort columnDatasourcePort) {
        return new ColumnService(columnDatasourcePort);
    }
}
