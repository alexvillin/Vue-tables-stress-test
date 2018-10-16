import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import Table from '@/components/Table.vue'
import Data from './data/Table'

jest.mock('@/api')

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Table', () => {
    let mutations
    let store
    let state

    beforeEach(() => {
        mutations = {
            setSelected: jest.fn(),
            setColumnsSizes: jest.fn(),
        }
        state = {
            loadMode: 'all',
            tableData: Data
        }
        store = new Vuex.Store({
            modules: {
                Table: {
                    namespaced: true,
                    state,
                    mutations,
                }
            }
        })
    })

    it('is instance of Vue', () => {
        const wrapper = shallowMount(Table, { store, localVue })
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
    
    it('show pagination if attr "pagination" setted', () =>{
        const wrapper = shallowMount(Table, { store, localVue })
        expect(wrapper.find('#pagination').isVisible()).toBe(false)
        wrapper.setProps({ pagination: true })
        expect(wrapper.find('#pagination').isVisible()).toBe(true)
    })
     
    it('check rendered table rows amount', () =>{
        const wrapper = shallowMount(Table, { store, localVue })
        const rowsAmount = store.state.Table.tableData.length;
        expect(wrapper.findAll('tbody > tr')).toHaveLength(rowsAmount)
    })
    
    it('check "shownItems" length changing depends on "loadMode"', () =>{
        const wrapper = shallowMount(Table, { store, localVue })
        const items = wrapper.vm.shownItems;
        expect(items.exists()).toBeTruthy();
        
        wrapper.setProps({ loadMode: 'all' })
        expect(items.length).toEqual(7)
  
        wrapper.setProps({ loadMode: 'pagination', perPage: 3 })
        expect(items.length).toEqual(3)

        wrapper.setProps({ loadMode: 'lazyLoad', perPage: 2 })
        wrapper.setData({ loadMoreCounter: 2}) 
        expect(items.length).toEqual(4)
    })
    
    it('check handle loading', () => {
        const wrapper = shallowMount(Table, { store, localVue })
        const items = wrapper.vm.shownItems;
        wrapper.setProps({ loadMode: 'handle', perPage: 2 })
        wrapper.find("#load-more").trigger('click')
        expect(items.length).toEqual(4)
    })
    
    it('computed rows calculated correctly', () => {
        const wrapper = shallowMount(Table, { store, localVue })
        expect(wrapper.vm.rows.length).toEqual(7);
        wrapper.setProps({ tableData: [{}, {}]})
        expect(wrapper.vm.rows.length).toEqual(2);
    })
    
    it('show "No data found" if table empty', () =>{
        const wrapper = shallowMount(Table, { store, localVue })
        expect(wrapper.find('#no-data-found').isVisible()).toBe(false)
        store.state.Table.tableData = []
        expect(wrapper.find('#no-data-found').isVisible()).toBe(true)
    })
    
    it('check resizable component property', () => {
        const wrapper = shallowMount(Table, { store, localVue })
        expect(wrapper.find("table").classes()).not.toContain('resizable');
        wrapper.setProps({ resizable: true })
        expect(wrapper.find("table").classes()).toContain('resizable');
    })
    
    it('check table row checkbox clickable', () => {
        const wrapper = shallowMount(Table, { store, localVue })
        const tr = wrapper.find('table tbody tr')
        const option = tr.find('input[type="checkbox"]')
        
        expect(option.element.checked).toBe(false)
        option.setChecked()
        expect(option.element.checked).toBe(true)
        expect(tr.classes()).toContain('selected')
        expect(wrapper.vm.selectedRows).toHaveLength(1)
        expect(mutations.setSelected).toHaveBeenCalled()
    })

})

