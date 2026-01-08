package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.model.Category;
import fr.esgi.tierlist.domain.port.CategoryDatasourcePort;
import fr.esgi.tierlist.infrastructure.persistence.mapper.CategoryMapper;
import fr.esgi.tierlist.infrastructure.persistence.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class CategoryJpaAdapter implements CategoryDatasourcePort {

    private final CategoryRepository categoryRepository;

    @Override
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id).map(CategoryMapper::toDomain);
    }

    @Override
    public List<Category> findAll() {
        var categoryEntities = categoryRepository.findAll();
        return categoryEntities.stream().map(CategoryMapper::toDomain).toList();
    }

    @Override
    public Category save(Category column) {
        var categoryEntity = CategoryMapper.toEntity(column);
        var savedEntity = categoryRepository.save(categoryEntity);
        return CategoryMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }
}
