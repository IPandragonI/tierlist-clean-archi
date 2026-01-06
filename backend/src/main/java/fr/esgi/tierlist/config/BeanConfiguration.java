package fr.esgi.tierlist.config;

import fr.esgi.tierlist.domain.port.*;
import fr.esgi.tierlist.domain.service.*;
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

    @Bean
    public TierListLogoMoveService tierListLogoService(TierListLogoMoveDatasourcePort tierListLogoDatasourcePort,
                                                       TierListDatasourcePort tierListDatasourcePort,
                                                       ColumnDatasourcePort columnDatasourcePort,
                                                       LogoDatasourcePort logoDatasourcePort,
                                                       LogoProviderPort logoProviderPort,
                                                       ObjectStoragePort objectStoragePort,
                                                       IAuthenticationFacade authenticationFacade) {
        return new TierListLogoMoveService(tierListLogoDatasourcePort,
                tierListService(tierListDatasourcePort, columnDatasourcePort, logoDatasourcePort, logoProviderPort, objectStoragePort, authenticationFacade),
                columnService(columnDatasourcePort),
                logoService(logoDatasourcePort, logoProviderPort, objectStoragePort),
                authenticationFacade);
    }
}
