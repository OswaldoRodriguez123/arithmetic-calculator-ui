import ApiService from "../core/api";

export class RecordService {
  constructor() {
    this.apiService = new ApiService();
    this.route = '/records';
  }

  async createRecord(data) {
    const response = await this.apiService.post(this.route, data);
    return response.data;
  }

  async getRecords(filters) {
    const response = await this.apiService.query(this.route, { params: filters });
    return response.data.data;
  }

  async deleteRecord(id) {
    const response = await this.apiService.delete(this.route, id);
    return response.data;
  }
}

export default RecordService;