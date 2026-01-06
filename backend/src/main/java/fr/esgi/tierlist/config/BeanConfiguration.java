package fr.esgi.tierlist.config;

import fr.esgi.tierlist.domain.port.*;
import fr.esgi.tierlist.domain.service.LogoService;
import fr.esgi.tierlist.domain.service.TierListService;
import fr.esgi.tierlist.domain.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public UserService userService(UserDatasourcePort userDatasourcePort) {
        return new UserService(userDatasourcePort);
    }

    @Bean
    public TierListService tierListService(TierListDatasourcePort tierListDatasourcePort, UserDatasourcePort userDatasourcePort) {
        return new TierListService(tierListDatasourcePort, userService(userDatasourcePort));
    }

    @Bean
    public LogoService logoService(LogoDatasourcePort logoDatasourcePort, LogoProviderPort logoProviderPort, ObjectStoragePort objectStoragePort) {
        return new LogoService(logoDatasourcePort, logoProviderPort, objectStoragePort);
    }
}
