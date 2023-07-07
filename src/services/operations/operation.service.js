import ApiService from "../core/api";

export class OperationService {
  constructor() {
    this.apiService = new ApiService();
    this.route = '/operations';
  }

  async createOperation(data) {
    const response = await this.apiService.post(this.route, { user: data });
    return response.data;
  }

  async getOperations() {
    const response = await this.apiService.get(this.route);
    return response.data.data;
  }
}

export default OperationService;