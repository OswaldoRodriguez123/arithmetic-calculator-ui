<template>
  <section>
    <div class="container py-7 card">
      <div class="row">
        <div class="col-lg-7 mx-auto d-flex justify-content-center flex-column">
          <form role="form" id="form" ref="form" autocomplete="off" @submit="submitForm">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12 mb-4">
                  <MaterialSelect class="input-group-dynamic" @change="(e) => operation_id = e.target.value"
                    :isDisabled="isGettingOperations">
                    <option v-for="item in operations" :value="item.id">{{ item.name }}</option>
                  </MaterialSelect>
                </div>
              </div>
              <div class="row" v-if="showFirstNumber || showLastNumber">
                <div class="col-md-6">
                  <MaterialInput ref="firstNumber" :value="firstNumber" @input="(e) => firstNumber = e.target.value"
                    class="input-group-dynamic mb-4" :label="{ text: 'First Number', class: 'form-label' }" type="text" />
                </div>
                <div class="col-md-6" v-if="showLastNumber">
                  <MaterialInput ref="lastNumber" class="input-group-dynamic" @input="(e) => lastNumber = e.target.value"
                    :label="{ text: 'Last Number', class: 'form-label' }" type="text" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 d-flex justify-content-center">
                <MaterialButton type="submit" variant="gradient" color="dark" :disabled="isProccessing">
                  Send Request
                </MaterialButton>
              </div>
            </div>
          </form>
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
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialSelect from "@/components/MaterialSelect.vue";
import MaterialToast from "@/components/MaterialToast.vue";

//assets
import setMaterialInput from "@/assets/js/material-input";

//services
import OperationService from "@/services/operations"
import RecordService from "@/services/records"

//types
import { OperationType } from "../types";

export default {
  components: {
    MaterialInput,
    MaterialButton,
    MaterialSelect,
    MaterialToast
  },
  data() {
    return {
      operationService: new OperationService(),
      recordService: new RecordService(),
      operations: [],
      operation_id: '',
      isGettingOperations: false,
      firstNumber: '',
      lastNumber: '',
      showFirstNumber: true,
      showLastNumber: true,
      isProccessing: false,
      toastMessage: '',
      toastVariant: 'success',
    }
  },
  mounted() {
    setMaterialInput();
    this.getOperations();
  },
  methods: {
    async getOperations() {
      this.isGettingOperations = true;
      try {
        const operations = await this.operationService.getOperations();
        this.operations = operations;
        this.operation_id = operations[0]?.id || '';
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isGettingOperations = false;
      }
    },
    async validateForm() {

      const validation = {
        showError: false,
        errorMessage: '',
      }

      if (this.showFirstNumber && this.firstNumber.trim().length === 0) {
        validation.showError = true;
        validation.errorMessage = "First number is required";
      }

      if(this.showLastNumber && this.lastNumber.trim().length === 0) {
        validation.showError = true;
        validation.errorMessage = "Last number is required";
      }
      return validation;
    },
    async submitForm(e) {
      e.preventDefault();
      const validation = await this.validateForm();
      if (validation.showError) {
        this.toastVariant = 'danger';
        this.toastMessage = validation.errorMessage;
        this.$refs["toast"].displayToast()
        return;
      }
      this.isProccessing = true;
      try {
        await this.recordService.createRecord({
          firstNumber: this.firstNumber,
          lastNumber: this.lastNumber,
          operation_id: this.operation_id
        })
        this.toastVariant = 'success';
        this.toastMessage = 'Record created successfully'
      } catch (e) {
        console.error(e.message);
        this.toastVariant = 'danger';
        this.toastMessage = 'Error trying to create the record'
      } finally {
        this.isProccessing = false;
        this.$refs["toast"].displayToast()
      }
    }
  },
  watch: {
    operation_id(value) {
      if (value === OperationType.SquareRoot) {
        this.showFirstNumber = true;
        this.showLastNumber = false;
        return;
      }

      if (value === OperationType.RandomString) {
        this.showFirstNumber = false;
        this.showLastNumber = false;
        return;
      }

      this.showFirstNumber = true;
      this.showLastNumber = true;
    }
  }
}
</script>