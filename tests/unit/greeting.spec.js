import { shallowMount, mount } from '@vue/test-utils'
import Greeting from "@/components/Greeting.vue";

describe('Greeting.vue', () => {
    it('containts text "Vue and TDD"', () => {
        const msg = 'Vue and TDD'
        const wrapper = mount(Greeting)
        expect(wrapper.text()).toMatch(msg)
        // expect(wrapper.html().includes('Vue and TDD')).toBe(true);
        
    })
})