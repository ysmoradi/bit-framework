using Bit.Model.Contracts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BitChangeSetManager.Model
{
    public class Category : IEntityWithDefaultGuidKey
    {
        public virtual Guid Id { get; set; }

        public virtual string Name { get; set; }

        public virtual Guid CategoryTypeId { get; set; }

        [ForeignKey(nameof(CategoryTypeId))]
        public virtual CategoryType CategoryType { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }

    public class CategoryType : IEntityWithDefaultGuidKey
    {
        public virtual Guid Id { get; set; }

        public virtual string Name { get; set; }

        public virtual ICollection<Category> Categories { get; set; }
    }

    public class Product : IEntityWithDefaultGuidKey
    {
        public virtual Guid Id { get; set; }

        public virtual string Name { get; set; }

        public virtual int Price { get; set; }

        public virtual Guid CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category Category { get; set; }
    }
}