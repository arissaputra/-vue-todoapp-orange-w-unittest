import { shallowMount } from '@vue/test-utils'
import CreateEdit from "@/components/CreateEdit.vue";
import registerFaIcons from '@/fa.js';

registerFaIcons();

describe('Insert', () => {
    it('Has description input', () => {
        const wrapper = shallowMount(CreateEdit)
        console.log(wrapper.html());
        
        expect(wrapper.html().includes("Description")).toBe(true)
    })
})