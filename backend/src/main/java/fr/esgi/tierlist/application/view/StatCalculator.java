package fr.esgi.tierlist.application.view;

import fr.esgi.tierlist.application.dto.StatDto;
import fr.esgi.tierlist.domain.model.Column;
import fr.esgi.tierlist.domain.model.Logo;
import fr.esgi.tierlist.domain.model.TierListLogoMove;
import fr.esgi.tierlist.domain.model.User;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class StatCalculator {

    public StatDto compute(List<TierListLogoMove> moves) {
        StatDto stats = new StatDto();

        if (moves == null || moves.isEmpty()) {
            return stats;
        }

        List<TierListLogoMove> validMoves = moves.stream()
                .filter(Objects::nonNull)
                .filter(m -> m.getLogo() != null)
                .filter(m -> m.getUser() != null)
                .filter(m -> m.getColumn() != null)
                .toList();

        if (validMoves.isEmpty()) {
            return stats;
        }

        Map<Logo, List<TierListLogoMove>> movesByLogo = validMoves.stream()
                .collect(Collectors.groupingBy(TierListLogoMove::getLogo));

        if (movesByLogo.isEmpty()) {
            return stats;
        }

        Map<Logo, Double> avgRankByLogo = movesByLogo.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().stream()
                                .map(TierListLogoMove::getColumn)
                                .filter(Objects::nonNull)
                                .mapToInt(Column::getPosition)
                                .average()
                                .orElse(Double.NaN)
                ));

        Map.Entry<Logo, Double> best = avgRankByLogo.entrySet().stream()
                .filter(e -> !e.getValue().isNaN())
                .min(Comparator.comparingDouble(Map.Entry::getValue))
                .orElse(null);

        Map.Entry<Logo, Double> worst = avgRankByLogo.entrySet().stream()
                .filter(e -> !e.getValue().isNaN())
                .max(Comparator.comparingDouble(Map.Entry::getValue))
                .orElse(null);

        Map.Entry<Logo, List<TierListLogoMove>> mostMovedEntry = movesByLogo.entrySet().stream()
                .max(Comparator.comparingInt(e -> e.getValue().size()))
                .orElse(null);

        Logo highestRankedLogo = best != null ? best.getKey() : null;
        Logo lowestRankedLogo = worst != null ? worst.getKey() : null;
        Logo mostMovedLogo = mostMovedEntry != null ? mostMovedEntry.getKey() : null;

        stats.setBestAverageRankLogo(highestRankedLogo);
        stats.setBestAverageRankValue(best != null ? best.getValue() : null);
        stats.setWorstAverageRankLogo(lowestRankedLogo);
        stats.setWorstAverageRankValue(worst != null ? worst.getValue() : null);
        stats.setMostMovedLogo(mostMovedLogo);

        Map<User, Long> userCountOnMostMoved = mostMovedEntry != null ? mostMovedEntry.getValue().stream()
                .collect(Collectors.groupingBy(TierListLogoMove::getUser, Collectors.counting())) : Map.of();

        User mostMovedLogoUser = userCountOnMostMoved.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
        stats.setMostMovedLogoUser(mostMovedLogoUser);

        if (lowestRankedLogo != null) {
            List<TierListLogoMove> movesOfLowest = movesByLogo.get(lowestRankedLogo);
            if (movesOfLowest != null && !movesOfLowest.isEmpty()) {
                Map<User, Long> userCountOnLowest = movesOfLowest.stream()
                        .collect(Collectors.groupingBy(TierListLogoMove::getUser, Collectors.counting()));
                User lowestRankedLogoUser = userCountOnLowest.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse(null);
                stats.setWorstAverageRankMainUser(lowestRankedLogoUser);
            }
        }

        return stats;
    }
}

