using Bit.Model.Contracts;
using System;

namespace BitChangeSetManager.Dto
{
    public class CategoryDto : IDto
    {
        public virtual Guid Id { get; set; }

        public virtual string Name { get; set; }

        public virtual Guid CategoryTypeId { get; set; }

        public virtual string CategoryTypeName { get; set; }
    }

    public class CategoryTypeDto : IDto
    {
        public virtual Guid Id { get; set; }

        public virtual string Name { get; set; }
    }

    public class ProductDto : IDto
    {
        public virtual Guid Id { get; set; }

        public virtual string Name { get; set; }

        public virtual int Price { get; set; }

        public virtual Guid CategoryId { get; set; }
    }
}