import { mount } from "@vue/test-utils";
import { describe, expect, test } from 'vitest'
import PrimeVue from 'primevue/config';
import Table from './Table.vue';

describe('Table', () => {
  test('renders the table', async () => {
    const wrapper = mount(Table, {
      global: {
        plugins: [PrimeVue],
      }
    });

    // Assert that the table is rendered
    const table = wrapper.find({ ref: 'table' });
    expect(table).toBeDefined();
  });
});