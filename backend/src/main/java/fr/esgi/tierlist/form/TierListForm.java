package fr.esgi.tierlist.form;

import java.io.Serializable;
import java.util.Map;

/**
 * Form for {@link fr.esgi.tierlist.business.TierList}
 */
public record TierListForm(Long id, String name, Map<String, Object> configuration, Long creatorId) implements Serializable {
}