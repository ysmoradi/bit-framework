using BitChangeSetManager.DataAccess;
using BitChangeSetManager.Dto;
using BitChangeSetManager.Model;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BitChangeSetManager.Api
{
    public class CategoriesController : BitChangeSetManagerDtoSetController<CategoryDto, Category, Guid>
    {
        public CategoriesController(IBitChangeSetManagerRepository<Category> repository)
            : base(repository)
        {

        }
    }

    public class ProductsController : BitChangeSetManagerDtoSetController<ProductDto, Product, Guid>
    {
        public ProductsController(IBitChangeSetManagerRepository<Product> repository)
            : base(repository)
        {

        }

        public override Task<ProductDto> Create(ProductDto dto, CancellationToken cancellationToken)
        {
            dto.Price += 10;

            return base.Create(dto, cancellationToken);
        }
    }

    public class CategoryTypesController : BitChangeSetManagerDtoSetController<CategoryTypeDto, CategoryType, Guid>
    {
        public CategoryTypesController(IBitChangeSetManagerRepository<CategoryType> repository)
            : base(repository)
        {

        }
    }
}