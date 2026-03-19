


import { createSlice, configureStore } from '@reduxjs/toolkit'

const todosSlice = createSlice({
    name: 'todos',
    initialState: [
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Learn Redux', completed: false },
        { id: 3, text: 'Build something fun!', completed: false }
    ],
    reducers: {
        todoAdded(state, action) {
            state.push({
                id: action.payload.id,
                text: action.payload.text,
                completed: false
            })
        },
        todoToggled(state, action) {
            const todo = state.find(todo => todo.id === action.payload)
            todo.completed = !todo.completed
        }
    }
})

const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
        incremented(state) {
            return state + 1
        },
        decremented(state) {
            return state - 1
        }
    }
})

export const { todoAdded, todoToggled } = todosSlice.actions
export const { incremented, decremented } = counterSlice.actions

export const store = configureStore({
    reducer: {
        todos: todosSlice.reducer,
        counter: counterSlice.reducer
    }
})