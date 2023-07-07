import { mount } from "@vue/test-utils";
import { describe, expect, test } from 'vitest'
import Form from './Form.vue';

describe('Form', () => {
  test('renders the form with input fields', async () => {
    const wrapper = mount(Form);

    // Assert that the form is rendered
    const form = wrapper.find({ ref: 'form' });
    expect(form).toBeDefined();
    form.trigger('submit');

    // Assert that the input fields are rendered
    const firstNumberInput = wrapper.find({ ref: 'firstNumber' });
    const lastNumberInput = wrapper.find({ ref: 'lastNumber' });
    expect(firstNumberInput).toBeDefined();
    expect(lastNumberInput).toBeDefined();
  });
});