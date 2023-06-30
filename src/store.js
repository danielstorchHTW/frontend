import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            darkMode: false,
        };
    },
    mutations: {
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
        },
    },
});

export default store;
