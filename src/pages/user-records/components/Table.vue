<template>
  <section>
    <div class="container py-7 card">
      <div class="row">
        <div class="col-lg-12">
          <div class="card-body">
            <MaterialDataTable
              :headers="headers"
              :items="items"
              :filters="filters"
              :totalRecords="totalRecords"
              :getData="getData"
              :isLoading="isLoading"
              :onClickAction="onClickAction"
              :onUpdateFilters="onUpdateFilters"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  <MaterialToast ref="toast" :variant="toastVariant">
    {{toastMessage}}
  </MaterialToast>
</template>

<script>
//components
import MaterialDataTable from "@/components/MaterialDataTable.vue";
import MaterialToast from "@/components/MaterialToast.vue";

//services
import RecordService from "@/services/records"

import dayjs from 'dayjs';

export default {
  components: {
    MaterialDataTable,
    MaterialToast
  },
  data() {
    return {
      service: new RecordService(),
      items: [],
      headers: [
        {
          field: 'id',
          header: 'ID'
        },
        {
          field: 'name',
          header: 'Operation'
        },
        {
          field: 'operation_response',
          header: 'Response'
        },
        {
          field: 'date',
          header: 'Date'
        },
        {
          header: 'actions',
          field: '<i role="button" class="fa fa-trash" title="Delete record">',
          sortable: false,
        }
      ],
      totalRecords: 0,
      isLoading: false,
      filters: {
        page: 1,
        rowsPerPage: 10,
        sortField: 'id',
        sortOrder: 'asc',
        search: '',
      },
      toastMessage: '',
      toastVariant: 'success',
    }
  },
  mounted() {
    this.getData(this.filters);
  },
  methods: {
    async getData(filters) {
      this.isLoading = true;

      try {
        const { rows, count } = await this.service.getRecords(filters);
        this.items = rows.map(record => {
          return (
            {
              ...record,
              date: dayjs(record.date).format('YYYY-MM-DD')
            }
          )
        });
        this.totalRecords = count;
      } catch (e) {
        this.totalRecords = 0;
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    onUpdateFilters(filters) {
      this.filters = filters;
      this.getData(filters);
    },
    async onClickAction(id) {
      try {
        const response = await this.service.deleteRecord(id);
        if(response.data > 0){
          this.toastVariant = 'success';
          this.toastMessage = 'Record deleted successfully'
          this.getData(this.filters);
        } else {
          this.toastVariant = 'danger';
          this.toastMessage = 'Error trying to create the record'
        }
      } catch (e) {
        this.toastVariant = 'danger';
        this.toastMessage = 'Error trying to delete the record'
      } finally {
        this.$refs["toast"].displayToast()
      }
    }
  },
}
</script>