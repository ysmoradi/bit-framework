module BitChangeSetManager.ViewModel.ViewModels {

    @SecureFormViewModelDependency({
        name: "CreateCategoryViewModel",
        template: `
<div>
    <category-dto-view-model model="vm.category"></category-dto-view-model>
    <br />
    <products-view-model category="vm.category"></products-view-model>
    <br />
    <md-button ng-click="vm.save()" ng-disabled="vm.category.IsSaved == true">Save</md-button>
</div>
`
    })
    export class CreateCategoryViewModel extends FormViewModel {

        public constructor( @Inject("EntityContextProvider") public entityContextProvider: IEntityContextProvider,
            @Inject("GuidUtils") public guidUtils: Bit.Implementations.DefaultGuidUtils) {
            super();
        }

        public categoryDtoViewModel: CategoryDtoViewModel;
        public productsViewModel: ProductsViewModel;
        public category: BitChangeSetManagerModel.CategoryDto;

        public $onInit() {
            this.category = new BitChangeSetManagerModel.CategoryDto();
            this.category.Id = this.guidUtils.newGuid();
        }

        @Command()
        public async save() {

            if (this.categoryDtoViewModel.isValid()) {

                let context = await this.entityContextProvider.getContext<BitChangeSetManagerContext>("BitChangeSetManager");

                context.categories.add(this.category);

                for (let product of this.productsViewModel.getProducts()) {
                    context.products.add(product);
                }

                await context.saveChanges();

                this.category.IsSaved = true;

            }

        }

    }

    @DtoRulesDependency({ name: "CategoryRules" })
    export class CategoryRules extends DtoRules<BitChangeSetManagerModel.CategoryDto> {

        public validateMember(memberName: keyof BitChangeSetManagerModel.CategoryDto, newValue: any, oldValue: any): void {

            if (memberName == "Name")
                this.setMemberValidaty("Name", "max-length", newValue == null || (newValue as string).length < 50);

            super.validateMember(memberName, newValue, oldValue);
        }

    }

    @DtoViewModelDependency({
        name: "CategoryDtoViewModel",
        template: `
<dto-form ng-model="vm.model" name="categoryForm">

    <md-input-container>
        <label>Name</label>
        <input type="text" name="Name" ng-model="vm.model.Name" />
        <error-messages field="categoryForm.Name">
            <error ng-message="max-length">Name is too long!</error>
        </error-messages>
    </md-input-container>

    <md-input-container>
        <label>Category type</label>
        <rad-combo-box name="CategoryTypeId"
                    rad-data-source="::vm.categoryTypesDataSource"
                    rad-text="vm.model.CategoryTypeName"
                    rad-value-field-name="Id"
                    rad-text-field-name="Name"
                    ng-model="vm.model.CategoryTypeId" />
    </md-input-container>

</dto-form>
`,
        require: {
            createCategoryViewModel: '^createCategoryViewModel'
        }
    })
    export class CategoryDtoViewModel extends DtoViewModel<BitChangeSetManagerModel.CategoryDto, CategoryRules> {

        public constructor( @Inject("$element") public $element: JQuery,
            @Inject("EntityContextProvider") public entityContextProvider: IEntityContextProvider,
            @Inject("CategoryRules") public rules: CategoryRules,
            @Inject("$mdDialog") public $mdDialog: ng.material.IDialogService) {
            super();
        }

        public createCategoryViewModel: CreateCategoryViewModel;

        public categoryTypesDataSource: kendo.data.DataSource;

        @Command()
        public async $onInit() {
            this.createCategoryViewModel.categoryDtoViewModel = this;
            let context = await this.entityContextProvider.getContext<BitChangeSetManagerContext>("BitChangeSetManager");
            this.categoryTypesDataSource = context.categoryTypes.asKendoDataSource({ serverFiltering: false, serverPaging: false, serverSorting: false, sort: { field: "Name", dir: true } });
        }

        public isValid(): boolean {

            if (this.form.isValid() == false || this.model.isValid() == false) {

                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .ok("Ok")
                        .title("Category data is invalid")
                        .parent(this.$element));

                return false;
            }
            else {
                return true;
            }
        }
    }

    @SecureFormViewModelDependency({
        name: "ProductsViewModel",
        template: `
<div>
    <rad-grid rad-data-source="::vm.productsDataSource" k-groupable="false">
        <toolbar-template>
            <rad-grid-add-button ng-disabled="vm.category.IsSaved == true">Add new product</rad-grid-add-button>
        </toolbar-template>
        <edit-template title="Add/Edit product" style="width:600px">
            <product-dto-view-model model="::dataItem" category="vm.category"></product-dto-view-model>
        </edit-template>
        <view-template>
            <columns>
                <column name="Name" title="Name"></column>
                <column name="Price" title="Price"></column>
                <column command title="Commands">
                    <rad-grid-edit-button ng-disabled="vm.category.IsSaved == true">Edit product</rad-grid-edit-button>
                </column>
            </columns>
        </view-template>
    </rad-grid>
</div>
`,
        require: {
            createCategoryViewModel: '^createCategoryViewModel'
        },
        bindings: {
            category: "<"
        }
    })
    export class ProductsViewModel extends FormViewModel {

        public createCategoryViewModel: CreateCategoryViewModel;
        public category: BitChangeSetManagerModel.CategoryDto;

        public productsDataSource: kendo.data.DataSource;

        @Command()
        public async $onInit() {
            this.createCategoryViewModel.productsViewModel = this;
            this.productsDataSource = new kendo.data.DataSource({
                schema: {
                    model: BitChangeSetManagerModel.ProductDto["asKendoModel"]()
                }
            });
        }

        public getProducts(): Array<BitChangeSetManagerModel.ProductDto> {
            return this.productsDataSource.dataView<BitChangeSetManagerModel.ProductDto>();
        }
    }

    @DtoRulesDependency({ name: "ProductRules" })
    export class ProductRules extends DtoRules<BitChangeSetManagerModel.ProductDto> {

        public validateMember(memberName: keyof BitChangeSetManagerModel.ProductDto, newValue: any, oldValue: any): void {

            if (memberName == "Name")
                this.setMemberValidaty("Name", "max-length", newValue == null || (newValue as string).length < 50);

            super.validateMember(memberName, newValue, oldValue);
        }

    }

    @DtoViewModelDependency({
        name: "ProductDtoViewModel",
        template: `
<dto-form ng-model="vm.model" name="productForm">

    <md-input-container>
        <label>Name</label>
        <input type="text" name="Name" ng-model="vm.model.Name" />
        <error-messages field="productForm.Name">
            <error ng-message="max-length">Name is too long!</error>
        </error-messages>
    </md-input-container>

    <md-input-container>
        <label>Price</label>
        <input name="Price" ng-model="vm.model.Price" />
    </md-input-container>

    <div>
        <rad-grid-save-button ng-click="vm.onSave()" ng-disabled="productForm.$invalid">Save</rad-grid-save-button>
        <rad-grid-cancel-button>Cancel</rad-grid-cancel-button>
    </div>

</dto-form>
`,
        bindings: {
            category: '<'
        }
    })
    export class ProductDtoViewModel extends DtoViewModel<BitChangeSetManagerModel.ProductDto, ProductRules> {

        public constructor( @Inject("$element") public $element: JQuery,
            @Inject("EntityContextProvider") public entityContextProvider: IEntityContextProvider,
            @Inject("ProductRules") public rules: ProductRules,
            @Inject("$mdDialog") public $mdDialog: ng.material.IDialogService,
            @Inject("GuidUtils") public guidUtils: Bit.Implementations.DefaultGuidUtils) {
            super();
        }

        public category: BitChangeSetManagerModel.CategoryDto;

        public $onInit() {
            this.model.Id = this.guidUtils.newGuid();
            this.model.CategoryId = this.category.Id;
        }

        public onSave() {

            if (this.form.isValid() == false || this.model.isValid() == false) {

                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .ok("Ok")
                        .title("Product data is invalid")
                        .parent(this.$element));

                throw new Error("Product's data is invalid.");
            }

        }
    }
}