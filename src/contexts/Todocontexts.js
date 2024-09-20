import { createContext, useContext } from "react"

export const TodoContext = createContext({          
    todos : [{                                   //object  -->  object inside array.
        id: 1,
        title: "Todo message",             
        completed: false,
    }],
    addTodo: () => {},
    updateTodo : (id, todo) => {},
    deleteTodo : (id) => {},
    toggleComplete : (id) => {},                    
})


export const useTodo = () => {
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider 