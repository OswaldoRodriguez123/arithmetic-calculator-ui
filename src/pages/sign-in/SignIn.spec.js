import { mount } from "@vue/test-utils";
import { describe, expect, test } from 'vitest'
import SignIn from './SignIn.vue';

describe('SignIn', () => {
  test('renders the form with input fields', async () => {
    const wrapper = mount(SignIn);

    // Assert that the form is rendered
    const form = wrapper.find({ ref: 'form' });
    expect(form).toBeDefined();

    // Assert that the input fields are rendered
    const usernameInput = wrapper.find({ ref: 'username' });
    const passwordInput = wrapper.find({ ref: 'password' });
    expect(usernameInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });
});