<template>
  <DataTable
    ref="myDataTable"
    :value="items"
    :lazy="true"
    :paginator="true"
    :rows="filters.rowsPerPage"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    :total-records="totalRecords"
    :isLoading="isLoading"
    @page="onChangeFilter"
    @sort="onChangeFilter"
    @filter="onChangeFilter"
  >
    <template #header>
      <div class="d-flex justify-content-end">
        <span class="p-input-icon-left">
          <i class="fa fa-search" />
          <InputText @input="onSearch" placeholder="Search" />
        </span>
      </div>
    </template>
    <Column v-for="header in headers.filter((header) => header?.sortable !== false)" :field="header.field" :header="header.header" :sortable="header?.sortable ?? true">
    </Column>
    <Column field="actions">
      <template #body="slotProps">
        <div @click="() => onClickAction(slotProps.data.id)" v-html="headers.find(header => header?.sortable === false)?.field"></div>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

export default {
  components: {
    DataTable,
    Column,
    InputText
  },
  props: {
    headers: Array,
    items: Array,
    filters: Object,
    totalRecords: Number,
    isLoading: Boolean,
    onClickAction: Function,
    onUpdateFilters: Function,
  },
  methods: {
    async onChangeFilter(event) {
      const filters = {
        page: (event.page + 1) || this.filters.page,
        rowsPerPage: event.rows,
        sortField: event.sortField && event.sortField,
        sortOrder: event.sortOrder && (event.sortOrder === 1 ? 'asc' : 'desc'),
        search: this.filters.search
      }
      this.onUpdateFilters(filters);
    },
    async onSearch(event) {
      const filters = {
        ...this.filters,
        search: event.target.value
      }
      this.onUpdateFilters(filters);
    },
  },
};
</script>