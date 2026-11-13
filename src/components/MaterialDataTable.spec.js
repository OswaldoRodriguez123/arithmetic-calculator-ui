import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from 'vitest'
import PrimeVue from 'primevue/config';
import MaterialDataTable from './MaterialDataTable.vue';

const mountTable = (props) =>
  mount(MaterialDataTable, {
    props: {
      items: [{ id: '1', name: 'Addition', operation_response: '5', date: '2026-11-13' }],
      filters: { page: 1, rowsPerPage: 10, search: '' },
      totalRecords: 1,
      isLoading: false,
      onClickAction: vi.fn(),
      onUpdateFilters: vi.fn(),
      headers: [{ field: 'id', header: 'ID' }],
      ...props,
    },
    global: {
      plugins: [PrimeVue],
    },
  });

describe('MaterialDataTable', () => {
  test('renders an accessible delete button for the actions column', () => {
    const wrapper = mountTable();
    const button = wrapper.find('button[aria-label="Delete record"]');
    expect(button.exists()).toBe(true);
    expect(button.find('i.fa.fa-trash').exists()).toBe(true);
  });

  test('clicking delete calls onClickAction with the row id', async () => {
    const onClickAction = vi.fn();
    const wrapper = mountTable({ onClickAction });
    await wrapper.find('button[aria-label="Delete record"]').trigger('click');
    expect(onClickAction).toHaveBeenCalledWith('1');
  });

  test('markup passed through the headers prop is never rendered as HTML', () => {
    const wrapper = mountTable({
      headers: [
        { field: 'id', header: 'ID' },
        // Historical abuse vector: an HTML string used to end up in v-html.
        { field: 'name', header: '<img src=x onerror="window.__pwned = true">' },
      ],
    });
    expect(wrapper.find('img[onerror]').exists()).toBe(false);
    expect(wrapper.vm.$attrs['data-pwned']).toBeUndefined();
  });
});
